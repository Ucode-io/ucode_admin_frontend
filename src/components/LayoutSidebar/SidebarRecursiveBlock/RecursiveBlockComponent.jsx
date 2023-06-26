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
import { menuActions } from "../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../IconPicker/IconGenerator";
import MenuIcon from "../MenuIcon";
import "../style.scss";

const RecursiveBlock = ({
  index,
  element,
  openFolderCreateModal,
  environment,
  setFolderModalType,
  level = 1,
  sidebarIsOpen,
  setTableModal,
  handleOpenNotify,
  setElement,
}) => {
  const { appId, tableSlug, menuId } = useParams();
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
      menuId === element?.id
        ? environment?.data?.active_background || "#007AFF"
        : "#fff",
    color: menuId === element?.id ? "#fff" : "#007AFF",
    paddingLeft: level * 2 * 5,
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const clickHandler = () => {
    setChildBlockVisible((prev) => !prev);
    setCheck(true);
    setId(element?.id);
    element.type === "FOLDER" &&
      navigate(
        `/main/${appId}/page/c57eedc3-a954-4262-a0af-376c65b5a284/${element?.id}`
      );
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
              navigate(
                `/main/${appId}/object/${element?.data?.table?.slug}/${element.id}`
              );
            element.type === "MICROFRONTEND" &&
              navigate(
                `/main/${appId}/page/${element?.data?.microfrontend?.id}/${element.id}`
              );
            element.type === "WEBPAGE" &&
              navigate(
                `/main/${appId}/web-page/${element?.data?.webpage?.id}/${element.id}`
              );
            clickHandler();
            setElement(element);
            dispatch(menuActions.setMenuItem(element));
          }}
        >
          <div
            className="label"
            style={{
              color:
                menuId === element?.id
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
                      setElement(element);
                    }}
                    style={{
                      color:
                        menuId === element?.id
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
                      setElement(element);
                    }}
                    style={{
                      color:
                        menuId === element?.id
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
                setElement(element);
              }}
              style={{
                color:
                  menuId === element?.id
                    ? environment?.data?.active_color
                    : environment?.data?.color,
              }}
            />
          )}
          {element?.type === "MICROFRONTEND" && (
            <MenuIcon
              title="Microfrontend settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "MICROFRONTEND");
                setElement(element);
              }}
              style={{
                color:
                  menuId === element?.id
                    ? environment?.data?.active_color
                    : environment?.data?.color,
              }}
            />
          )}
          {element?.type === "WEBPAGE" && (
            <MenuIcon
              title="Webpage settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "WEBPAGE");
                setElement(element);
              }}
              style={{
                color:
                  menuId === element?.id
                    ? environment?.data?.active_color
                    : environment?.data?.color,
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
            sidebarIsOpen={sidebarIsOpen}
            setTableModal={setTableModal}
            handleOpenNotify={handleOpenNotify}
            setElement={setElement}
          />
        ))}
      </Collapse>
    </Draggable>
  );
};

export default RecursiveBlock;
