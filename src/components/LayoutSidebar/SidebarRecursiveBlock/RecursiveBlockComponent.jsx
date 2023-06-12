import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Draggable } from "react-smooth-dnd";
import { useMenuListQuery } from "../../../services/menuService";
import IconGenerator from "../../IconPicker/IconGenerator";
import "../style.scss";
import MenuIcon from "../MenuIcon";
import { menuActions } from "../../../store/menuItem/menuItem.slice";

const RecursiveBlock = ({
  index,
  element,
  openFolderCreateModal,
  environment,
  setFolderModalType,
  setSelectedTable,
  level = 1,
  sidebarIsOpen,
  setTableModal,
  selectedTable,
  handleOpenNotify,
  setElement,
}) => {
  const { tableSlug } = useParams();
  const { appId } = useParams();
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const navigate = useNavigate();
  const [child, setChild] = useState();
  const [check, setCheck] = useState(false);
  const [id, setId] = useState();

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
    paddingLeft: level * 2 * 5,
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const clickHandler = () => {
    setChildBlockVisible((prev) => !prev);
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
              navigate(`/main/${appId}/object/${element?.data?.table?.slug}`);
            element.type === "MICROFRONTEND" &&
              navigate(
                `/main/${appId}/page/${element?.data?.microfrontend?.id}`
              );
            element.type === "WEBPAGE" &&
              navigate(`/main/${appId}/web-page/${element?.data?.webpage?.id}`);
            clickHandler();
            setSelectedTable(element);
            setElement(element);
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
            <IconGenerator
              icon={
                element?.icon ||
                element?.data?.microfrontend?.icon ||
                element?.data?.webpage?.icon
              }
              size={18}
            />

            {(sidebarIsOpen && element?.label) ||
              element?.data?.microfrontend?.name ||
              element?.data?.webpage?.title}
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
                      setElement(element);
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
                      setElement(element);
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
          {element?.type === "TABLE" && (
            <MenuIcon
              title="Table settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "TABLE");
                setSelectedTable(element);
                setElement(element);
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
                setElement(element);
              }}
            />
          )}
          {element?.type === "WEBPAGE" && (
            <MenuIcon
              title="Webpage settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "WEBPAGE");
                setSelectedTable(element);
                setElement(element);
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
            openFolderCreateModal={openFolderCreateModal}
            environment={environment}
            setFolderModalType={setFolderModalType}
            setSelectedTable={setSelectedTable}
            sidebarIsOpen={sidebarIsOpen}
            setTableModal={setTableModal}
            selectedTable={selectedTable}
            handleOpenNotify={handleOpenNotify}
            setElement={setElement}
          />
        ))}
      </Collapse>
    </Draggable>
  );
};

export default RecursiveBlock;
