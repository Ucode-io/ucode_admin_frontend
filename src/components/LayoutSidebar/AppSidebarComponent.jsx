import { Box, ListItemButton, ListItemText, Tooltip } from "@mui/material";
import { useEffect, useMemo } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Draggable } from "react-smooth-dnd";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import "./style.scss";
import IconGenerator from "../IconPicker/IconGenerator";
import { useDispatch } from "react-redux";
import { menuActions } from "../../store/menuItem/menuItem.slice";
import MenuIcon from "./MenuIcon";
import { useTranslation } from "react-i18next";
import { store } from "../../store";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;
export const analyticsId = `${import.meta.env.VITE_ANALYTICS_FOLDER_ID}`;

const AppSidebar = ({
  index,
  element,
  sidebarIsOpen,
  setElement,
  setSubMenuIsOpen,
  handleOpenNotify,
  setSelectedApp,
  selectedApp,
  menuTemplate,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const auth = store.getState().auth;
  const defaultAdmin = auth.roleInfo.name === "DEFAULT ADMIN";
  const readPermission = element?.data?.permission?.read;
  const withoutPermission =
    element?.id === adminId || element?.id === analyticsId ? true : false;
  const permission = defaultAdmin
    ? readPermission || withoutPermission
    : readPermission;
  const clickHandler = () => {
    dispatch(menuActions.setMenuItem(element));
    setSelectedApp(element);
    if (element.type === "FOLDER") {
      setElement(element);
      setSubMenuIsOpen(true);
      navigate(`/main/${element.id}`);
    } else if (element.type === "TABLE") {
      setSubMenuIsOpen(false);
      navigate(`/main/${element?.id}/object/${element?.data?.table?.slug}`);
    } else if (element.type === "MICROFRONTEND") {
      setSubMenuIsOpen(false);
      let obj = {};
      element?.attributes?.params.forEach((el) => {
        obj[el.key] = el.value;
      });
      const searchParams = new URLSearchParams(obj || {});
      return navigate({
        pathname: `/main/${element.id}/page/${element?.data?.microfrontend?.id}`,
        search: `?${searchParams.toString()}`,
      });
    } else if (element.type === "WEBPAGE") {
      navigate(`/main/${element?.id}/web-page/${element?.data?.webpage?.id}`);
      setSubMenuIsOpen(false);
    }
  };
  const favourite = element?.id === "c57eedc3-a954-4262-a0af-376c65b5a282";
  const menuStyle = menuTemplate?.menu_template;

  const generatorLanguageKey = useMemo(() => {
    if (i18n.language === "uz") {
      return "_uz";
    } else if (i18n.language === "en") {
      return "_en";
    } else {
      return "";
    }
  }, [i18n.language]);

  useEffect(() => {
    setElement(element);
  }, [element]);

  const defaultLanguage = i18n.language;

  console.log("element", element);

  return (
    <Draggable key={index}>
      {permission ? (
        <ListItemButton
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            clickHandler();
          }}
          className="parent-folder column-drag-handle"
          style={{
            background:
              selectedApp?.id === element?.id
                ? menuStyle?.active_background || "#007AFF"
                : menuStyle?.background,
            color: selectedApp?.id === element.id ? "#fff" : "#A8A8A8",
            borderTop: favourite && "1px solid #F0F0F0",
            borderBottom: favourite && "1px solid #F0F0F0",
            padding: favourite && "18px 12px",
          }}
        >
          <IconGenerator
            icon={
              element?.icon ||
              element?.data?.microfrontend?.icon ||
              element?.data?.webpage?.icon ||
              "folder.svg"
            }
            size={
              menuTemplate?.icon_size === "SMALL"
                ? 10
                : menuTemplate?.icon_size === "MEDIUM"
                ? 15
                : 18 || 18
            }
            className="folder-icon"
            style={{
              color:
                selectedApp?.id === element.id
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
            }}
          />
          {sidebarIsOpen && (
            <ListItemText
              primary={
                element?.attributes?.[`label_${defaultLanguage}`] ||
                element?.label ||
                element?.data?.microfrontend?.name ||
                element?.data?.webpage?.title
              }
              style={{
                color:
                  selectedApp?.id === element.id
                    ? menuStyle?.active_text
                    : menuStyle?.text || "",
              }}
            />
          )}
          {element?.type === "FOLDER" && sidebarIsOpen ? (
            <>
              <Tooltip title="Folder settings" placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      handleOpenNotify(e, "FOLDER");
                    }}
                    style={{
                      color:
                        selectedApp?.id === element.id
                          ? menuStyle?.active_text
                          : menuStyle?.text || "",
                    }}
                  />
                </Box>
              </Tooltip>
              {element?.data?.permission?.create && (
                <Tooltip title="Create folder" placement="top">
                  <Box
                    className="extra_icon"
                    onClick={(e) => {
                      handleOpenNotify(e, "CREATE_TO_FOLDER");
                    }}
                  >
                    <AddIcon
                      size={13}
                      style={{
                        color:
                          selectedApp?.id === element.id
                            ? menuStyle?.active_text
                            : menuStyle?.text || "",
                      }}
                    />
                  </Box>
                </Tooltip>
              )}
            </>
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
                  selectedApp?.id === element.id
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
                  selectedApp?.id === element.id
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
                  selectedApp?.id === element.id
                    ? menuStyle?.active_text
                    : menuStyle?.text || "",
              }}
            />
          )}
          {sidebarIsOpen && element?.type === "FOLDER" ? (
            <KeyboardArrowRightIcon
              style={{
                color:
                  selectedApp?.id === element.id
                    ? menuStyle?.active_text
                    : menuStyle?.text || "",
                transform: selectedApp?.id === element.id && "rotate(90deg)",
                transition: "0.3s",
              }}
            />
          ) : (
            ""
          )}
        </ListItemButton>
      ) : null}
    </Draggable>
  );
};

export default AppSidebar;
