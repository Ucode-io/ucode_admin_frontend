import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Draggable } from "react-smooth-dnd";
import { useMenuListQuery } from "../../../services/menuService";
import { menuActions } from "../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../IconPicker/IconGenerator";
import MenuIcon from "../MenuIcon";
import "../style.scss";
import { store } from "../../../store";

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
  setSubMenuIsOpen,
  menuStyle,
}) => {
  const { appId, tableSlug } = useParams();
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const navigate = useNavigate();
  const [child, setChild] = useState();
  const [check, setCheck] = useState(false);
  const [id, setId] = useState();
  const menuItem = store.getState().menu.menuItem;
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);

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
      menuItem?.id === element?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      menuItem?.id === element?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 * 5,
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const clickHandler = () => {
    if (!pinIsEnabled && element.type !== "FOLDER") {
      setSubMenuIsOpen(false);
    }
    setChildBlockVisible((prev) => !prev);
    setCheck(true);
    setId(element?.id);
    element.type === "FOLDER" && navigate(`/main/${appId}`);
  };
  useEffect(() => {
    if (
      element.id === "0" ||
      element.id === "c57eedc3-a954-4262-a0af-376c65b5a284"
    ) {
      setChildBlockVisible(true);
    }
  }, []);
  console.log("elemeent", element);
  return (
    <Draggable key={index}>
      <div className="parent-block column-drag-handle" key={index}>
        {element?.data?.permission?.read && (
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
              if (element.type === "WEBPAGE") {
                navigate(
                  `/main/${appId}/web-page/${element?.data?.webpage?.id}`
                );
                window.location.reload();
              }
              clickHandler();
              setElement(element);
              dispatch(menuActions.setMenuItem(element));
            }}
          >
            <div
              className="label"
              style={{
                color:
                  menuItem?.id === element?.id
                    ? menuStyle?.active_text
                    : menuStyle?.text,
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
                          menuItem?.id === element?.id
                            ? menuStyle?.active_text
                            : menuStyle?.text || "",
                      }}
                    />
                  </Box>
                </Tooltip>
                <Tooltip title="Create folder" placement="top">
                  <Box className="extra_icon">
                    {element?.data?.permission?.write && (
                      <AddIcon
                        size={13}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenNotify(e, "CREATE_TO_FOLDER");
                          setElement(element);
                        }}
                        style={{
                          color:
                            menuItem?.id === element?.id
                              ? menuStyle?.active_text
                              : menuStyle?.text || "",
                        }}
                      />
                    )}
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
                    menuItem?.id === element?.id
                      ? menuStyle?.active_text
                      : menuStyle?.text || "",
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
                    menuItem?.id === element?.id
                      ? menuStyle?.active_text
                      : menuStyle?.text || "",
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
                    menuItem?.id === element?.id
                      ? menuStyle?.active_text
                      : menuStyle?.text || "",
                }}
              />
            )}
          </Button>
        )}
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
            setSubMenuIsOpen={setSubMenuIsOpen}
            menuStyle={menuStyle}
          />
        ))}
      </Collapse>
    </Draggable>
  );
};

export default RecursiveBlock;
