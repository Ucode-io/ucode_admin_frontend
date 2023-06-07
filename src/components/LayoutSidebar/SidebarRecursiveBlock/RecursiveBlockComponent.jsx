import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Draggable } from "react-smooth-dnd";
import { useMenuListQuery } from "../../../services/menuService";
import menuSettingsService from "../../../services/menuSettingsService";
import IconGenerator from "../../IconPicker/IconGenerator";
import ButtonsMenu from "../MenuButtons";
import "../style.scss";
import MenuIcon from "../MenuIcon";
import { menuActions } from "../../../store/menuItem/menuItem.slice";
import { store } from "../../../store";

const RecursiveBlock = ({
  index,
  element,
  parentClickHandler,
  openFolderCreateModal,
  environment,
  setFolderModalType,
  setSelectedTable,
  level = 1,
  sidebarIsOpen,
  setTableModal,
  setMicrofrontendModal,
  selectedTable,
}) => {
  const { tableSlug } = useParams();
  const { appId } = useParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const navigate = useNavigate();
  const [menu, setMenu] = useState("");
  const [menuType, setMenuType] = useState("");
  const [child, setChild] = useState();
  const [check, setCheck] = useState(false);
  const [id, setId] = useState();
  const openMenu = Boolean(menu);
  const menuItem = store.getState().menu.menuItem;

  console.log("menuItem", menuItem);

  const handleOpenNotify = (event, type) => {
    setMenu(event?.currentTarget);
    setMenuType(type);
  };

  const { isLoading } = useMenuListQuery({
    params: {
      parent_id: id,
    },
    queryParams: {
      cacheTime: 10,
      enabled: Boolean(check),
      onSuccess: (res) => {
        setCheck(false);
        setChild(res.menus);
      },
    },
  });

  const activeStyle = {
    backgroundColor:
      selectedTable?.id === element?.id
        ? environment?.data?.active_background
        : "",
    color: selectedTable?.id === element?.id ? "#fff" : "",
    // paddingLeft: level === 1 || level === 2 ? level * 2 * 4 : level * 7,
    paddingLeft: level * 2 * 5,
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const clickHandler = () => {
    element.type === "TABLE" && parentClickHandler(element);
    setChildBlockVisible((prev) => !prev);
    // getListMenu(element.id);
    setCheck(true);
    setId(element?.id);
  };
  useEffect(() => {
    if (
      element.id === "0" ||
      element.id === "c57eedc3-a954-4262-a0af-376c65b5a284"
    ) {
      setChildBlockVisible(true);
    }
  }, []);

  const handleCloseNotify = () => {
    setMenu(null);
  };

  const deleteFolder = (element) => {
    menuSettingsService
      .delete(element.id)
      .then(() => {
        // getListMenu(element.id);
        setChildBlockVisible(false);
        queryClient.refetchQueries(["MENU"], element?.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Draggable key={index}>
      <div className="parent-block column-drag-handle" key={index}>
        <Button
          key={index}
          style={activeStyle}
          className={`nav-element ${
            element.isChild &&
            (tableSlug !== element.slug ? "active-with-child" : "active")
          }`}
          onClick={(e) => {
            e.stopPropagation();
            element.type === "TABLE" &&
              navigate(`/main/${appId}/object/${element?.table?.slug}`);
            element.type === "MICROFRONTEND" &&
              navigate(`/main/${appId}/page/${element?.microfrontend?.id}`);
            clickHandler();
            setSelectedTable(element);
            dispatch(menuActions.setMenuItem(element));
          }}
        >
          <div
            className="label"
            style={{
              color:
                selectedTable?.id === element?.id
                  ? environment?.data?.active_color
                  : environment?.data?.color,
              opacity: element?.isChild && 0.6,
            }}
          >
            <IconGenerator icon={element?.icon} size={18} />

            {(sidebarIsOpen && element?.label) || element?.microfrontend?.name}
          </div>
          {element?.type === "FOLDER" && sidebarIsOpen ? (
            <Box className="icon_group">
              <Tooltip title="Folder settings" placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleOpenNotify(e, "FOLDER");
                      setSelectedTable(element);
                    }}
                    style={{
                      color:
                        selectedTable?.id === element?.id
                          ? environment?.data?.active_color
                          : environment?.data?.color,
                    }}
                  />
                </Box>
              </Tooltip>
              <Tooltip title="Create folder" placement="top">
                <Box className="extra_icon">
                  <AddIcon
                    size={13}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNotify(e, "CREATE_TO_FOLDER");
                      setSelectedTable(element);
                    }}
                    style={{
                      color:
                        selectedTable?.id === element?.id
                          ? environment?.data?.active_color
                          : environment?.data?.color,
                    }}
                  />
                </Box>
              </Tooltip>
              {childBlockVisible ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowRightIcon />
              )}
            </Box>
          ) : (
            ""
          )}
          <ButtonsMenu
            element={element}
            menu={menu}
            openMenu={openMenu}
            handleCloseNotify={handleCloseNotify}
            sidebarIsOpen={sidebarIsOpen}
            openFolderCreateModal={openFolderCreateModal}
            deleteFolder={deleteFolder}
            menuType={menuType}
            setFolderModalType={setFolderModalType}
            setSelectedTable={setSelectedTable}
            appId={appId}
            setTableModal={setTableModal}
            setMicrofrontendModal={setMicrofrontendModal}
          />
          {element?.type === "TABLE" && (
            <MenuIcon
              title="Table settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "TABLE");
                setSelectedTable(element);
              }}
            />
          )}
          {element?.type === "MICROFRONTEND" && (
            <MenuIcon
              title="Microfrontend settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "MICROFRONTEND");
                setSelectedTable(element);
              }}
            />
          )}
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {child?.map((childElement, index) => (
          <RecursiveBlock
            key={index}
            level={level + 1}
            element={childElement}
            parentClickHandler={parentClickHandler}
            openFolderCreateModal={openFolderCreateModal}
            environment={environment}
            setFolderModalType={setFolderModalType}
            setSelectedTable={setSelectedTable}
            sidebarIsOpen={sidebarIsOpen}
            setTableModal={setTableModal}
            selectedTable={selectedTable}
          />
        ))}
      </Collapse>
    </Draggable>
  );
};

export default RecursiveBlock;
