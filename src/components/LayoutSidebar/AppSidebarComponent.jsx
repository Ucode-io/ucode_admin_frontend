import "./style.scss";
import {Tooltip} from "@mui/material";
import {Box, Flex} from "@chakra-ui/react";
import {useEffect} from "react";
import {BsThreeDots} from "react-icons/bs";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Draggable} from "react-smooth-dnd";
import AddIcon from "@mui/icons-material/Add";
import IconGenerator from "../IconPicker/IconGenerator";
import {useDispatch} from "react-redux";
import {menuActions} from "../../store/menuItem/menuItem.slice";
import MenuIcon from "./MenuIcon";
import {useTranslation} from "react-i18next";
import {store} from "../../store";
import {relationTabActions} from "../../store/relationTab/relationTab.slice";
import {SidebarTooltip} from "@/components/LayoutSidebar/sidebar-tooltip";
import {mainActions} from "@/store/main/main.slice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const adminId = import.meta.env.VITE_ADMIN_FOLDER_ID;
export const analyticsId = import.meta.env.VITE_ANALYTICS_FOLDER_ID;

const USERS_MENU_ITEM_ID = "9e988322-cffd-484c-9ed6-460d8701551b";

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
  const {i18n} = useTranslation();
  const auth = store.getState().auth;
  const {appId} = useParams();

  const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
  const readPermission = element?.data?.permission?.read;
  const withoutPermission =
    element?.id === adminId || element?.id === analyticsId ? true : false;
  const permission = defaultAdmin
    ? readPermission || withoutPermission
    : readPermission;

  const clickHandler = () => {
    if (element?.id === USERS_MENU_ITEM_ID) {
      return navigate('/client-types');
    }

    dispatch(menuActions.setMenuItem(element));
    dispatch(relationTabActions.clear());
    setSelectedApp(element);
    if (element.type === "FOLDER") {
      setElement(element);
      setSubMenuIsOpen(true);
      navigate(`/main/${element.id}`);
    } else if (element.type === "TABLE") {
      setSubMenuIsOpen(false);
      navigate(
        `/main/${element?.parent_id}/object/${element?.data?.table?.slug}?menuId=${element?.id}`
      );
    } else if (element.type === "LINK") {
      const website_link = element?.attributes?.website_link;
      if (element?.attributes?.website_link) {
        navigate(`/main/${element?.id}/website`, {
          state: {
            url: website_link,
          },
        });
      } else if (element?.id === "3b74ee68-26e3-48c8-bc95-257ca7d6aa5c") {
        navigate(
          replaceValues(
            element?.attributes?.link,
            auth?.loginTableSlug,
            auth?.userId
          )
        );
      } else {
        navigate(element?.attributes?.link);
      }
      setSubMenuIsOpen(false);
    } else if (element.type === "MICROFRONTEND") {
      setSubMenuIsOpen(false);
      let obj = {};
      element?.attributes?.params.forEach((el) => {
        obj[el.key] = el.value;
      });
      const searchParams = new URLSearchParams(obj || {});
      return navigate({
        pathname: `/main/${element.id}/page/${element?.data?.microfrontend?.id}`,
        search: `?menuId=${element?.id}&${searchParams.toString()}`,
      });
    } else if (element.type === "WEBPAGE") {
      navigate(
        `/main/${element?.id}/web-page/${element?.data?.webpage?.id}?menuId=${element?.id}`
      );
      setSubMenuIsOpen(false);
    }
  };
  const menuStyle = menuTemplate?.menu_template;

  const [searchParams] = useSearchParams();

  const menuItem = searchParams.get("menuId");

  function replaceValues(inputString, loginTableSlug, userId) {
    return inputString
      .replace("{login_table_slug}", loginTableSlug)
      .replace("{user_id}", userId);
  }

  useEffect(() => {
    setElement(element);
  }, [element]);

  const activeMenu =
    element?.type === "FOLDER"
      ? Boolean(selectedApp?.id === element?.id)
      : element?.id === menuItem;

  if (!permission) {
    return;
  }

  const title = element?.attributes?.[`label_${i18n.language}`] ||
    element?.label ||
    element?.data?.microfrontend?.name ||
    element?.data?.webpage?.title;
  const icon = element?.icon || element?.data?.microfrontend?.icon || element?.data?.webpage?.icon
  const iconSize = menuStyle?.icon_size === "SMALL"
    ? 10 : menuStyle?.icon_size === "MEDIUM"
      ? 15 : 20

  const conditionalProps = {};
  if (!sidebarIsOpen) {
    conditionalProps.onMouseEnter = () => dispatch(mainActions.setSidebarHighlightedMenu(element?.id));
  }

  return (
    <Draggable key={index}>
      <SidebarTooltip id={element?.id} title={title}>
        <Flex
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            clickHandler();
            dispatch(mainActions.setSidebarHighlightedMenu(null));
          }}
          position="relative"
          h={36}
          mx={8}
          mb={4}
          alignItems='center'
          whiteSpace="nowrap"
          borderRadius={6}
          _hover={{bg: "#EAECF0"}}
          cursor='pointer'
          className="parent-folder column-drag-handle"
          bg={activeMenu
            ? (menuStyle?.active_background ?? "#EAECF0")
            : menuStyle?.background}
          color={Boolean(
            appId !== "c57eedc3-a954-4262-a0af-376c65b5a284" &&
            appId === element?.id
          ) || menuItem === element?.id
            ? "#fff"
            : "#A8A8A8"}
          {...conditionalProps}
        >
          <Flex
            position="absolute"
            w={36}
            h={36}
            alignItems='center'
            justifyContent='center'
          >
            <IconGenerator
              icon={icon ?? "folder-new.svg"}
              size={iconSize}
              style={{color: icon ? (menuStyle?.text ?? "") : "#fff"}}
            />
          </Flex>

          <Box color={activeMenu ? menuStyle?.active_text : menuStyle?.text || "#475467"} pl={48} fontSize={14}
               mr='auto' overflow='hidden' textOverflow='ellipsis'>
            {title}
          </Box>

          {element?.type === "FOLDER" &&
          sidebarIsOpen &&
          !element?.is_static ? (
            <>
              {(element?.data?.permission?.delete ||
                element?.data?.permission?.update ||
                element?.data?.permission?.write) && (
                <Tooltip title="Folder settings" placement="top">
                  <div className="extra_icon">
                    <BsThreeDots
                      id={"three_dots"}
                      size={13}
                      onClick={(e) => {
                        handleOpenNotify(e, "FOLDER");
                      }}
                      style={{
                        color: activeMenu
                          ? menuStyle?.active_text
                          : (menuStyle?.text ?? "#fff"),
                      }}
                    />
                  </div>
                </Tooltip>
              )}

              {element?.data?.permission?.create && (
                <Tooltip title="Create folder" placement="top">
                  <div
                    id={"create_folder"}
                    className="extra_icon"
                    onClick={(e) => {
                      handleOpenNotify(e, "CREATE_TO_FOLDER");
                    }}>
                    <AddIcon
                      size={13}
                      style={{
                        color: activeMenu
                          ? menuStyle?.active_text
                          : menuStyle?.text || "",
                      }}
                    />
                  </div>
                </Tooltip>
              )}
            </>
          ) : (
            ""
          )}
          {element?.type === "TABLE" && (
            <MenuIcon
              id={"menu_icon"}
              title="Table settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "TABLE");
                setElement(element);
              }}
              style={{
                color: activeMenu
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
              }}
              element={element}
            />
          )}
          {element?.type === "LINK" && (
            <MenuIcon
              id={"menu_icon"}
              title="Table settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "LINK");
                setElement(element);
              }}
              style={{
                color: activeMenu
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
              }}
              element={element}
            />
          )}
          {element?.type === "MICROFRONTEND" && (
            <MenuIcon
              id={"menu_icon"}
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
              element={element}
            />
          )}
          {element?.type === "WEBPAGE" && (
            <MenuIcon
              id={"menu_icon"}
              title="Webpage settings"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "WEBPAGE");
                setElement(element);
              }}
              style={{
                color: activeMenu
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
              }}
            />
          )}
          {sidebarIsOpen && element?.type === "FOLDER" ? (
            <KeyboardArrowDownIcon
              style={{
                color: activeMenu
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
                transform: selectedApp?.id === element.id && "rotate(-180deg)",
                transition: "transform 250ms ease-out",
                marginRight: 4
              }}
            />
          ) : (
            ""
          )}
        </Flex>
      </SidebarTooltip>
    </Draggable>
  );
};

export default AppSidebar;
