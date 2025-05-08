import "./style.scss";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
} from "@chakra-ui/react";
import {useEffect, useMemo, useState} from "react";
import {BsThreeDots} from "react-icons/bs";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Draggable} from "react-smooth-dnd";
import AddIcon from "@mui/icons-material/Add";
import IconGenerator from "../IconPicker/IconGenerator";
import {useDispatch, useSelector} from "react-redux";
import {menuActions} from "../../store/menuItem/menuItem.slice";
import MenuIcon from "./MenuIcon";
import {useTranslation} from "react-i18next";
import {store} from "../../store";
import {relationTabActions} from "../../store/relationTab/relationTab.slice";
import {SidebarAppTooltip} from "@/components/LayoutSidebar/sidebar-app-tooltip";
import {mainActions} from "@/store/main/main.slice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NewSubMenu from "./NewSubMenu";
import {useMenuListQuery} from "../../services/menuService";
import {Skeleton, Tooltip} from "@mui/material";
import {menuAccordionActions} from "../../store/menus/menus.slice";

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
  setMenuItem,
  menuItem,
  menuLanguages,
  openFolderCreateModal,
  setFolderModalType,
  setTableModal,
  setLinkedTableModal,
  setSubSearchText,
  languageData,
  subMenuIsOpen,
  subSearchText,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const auth = store.getState().auth;
  const {appId: menuId} = useParams();
  const test = useParams();
  const [loading, setLoading] = useState(false);
  const [activeAccordionId, setActiveAccordionId] = useState(null);
  console.log("menuIdmenuIdmenuId", test);
  const menuChilds = useSelector((state) => state?.menuAccordion?.menuChilds);

  const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
  const readPermission = element?.data?.permission?.read;
  const withoutPermission =
    element?.id === adminId || element?.id === analyticsId ? true : false;
  const permission = defaultAdmin
    ? readPermission || withoutPermission
    : readPermission;

  const clickHandler = (el) => {
    if (element?.id === USERS_MENU_ITEM_ID) {
      return navigate("/client-types");
    }
    // setMenuItem(element);
    dispatch(menuActions.setMenuItem(element));
    dispatch(relationTabActions.clear());

    setSelectedApp(element);
    if (element.type === "FOLDER") {
      const isOpen = menuChilds[element.id]?.open;
      if (isOpen) {
        closeMenu(element.id);
        return;
      } else {
        coontrolAccordionAction(element);
        setElement(element);
        setSubMenuIsOpen(true);
        navigate(`/${element.id}`);
      }

      return;
    } else if (element.type === "TABLE") {
      setSubMenuIsOpen(false);
      navigate(`/${element?.id}/${element?.data?.table?.slug}`);
    } else if (element.type === "LINK") {
      const website_link = element?.attributes?.website_link;
      if (element?.attributes?.website_link) {
        navigate(`/${element?.id}/website`, {
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
        pathname: `/${element.id}/page/${element?.data?.microfrontend?.id}`,
        search: `?menuId=${element?.id}&${searchParams.toString()}`,
      });
    } else if (element.type === "WEBPAGE") {
      navigate(
        `/${element?.id}/web-page/${element?.data?.webpage?.id}?menuId=${element?.id}`
      );
      setSubMenuIsOpen(false);
    }
  };
  const menuStyle = {
    ...menuTemplate?.menu_template,
    text:
      menuTemplate?.menu_template?.text === "#A8A8A8"
        ? ""
        : menuTemplate?.menu_template?.text,
  };

  function replaceValues(inputString, loginTableSlug, userId) {
    return inputString
      .replace("{login_table_slug}", loginTableSlug)
      .replace("{user_id}", userId);
  }

  const {isLoading} = useMenuListQuery({
    params: {
      parent_id: menuId,
      search: subSearchText,
    },
    queryParams: {
      enabled:
        Boolean(menuId) &&
        !Boolean(menuChilds?.[element?.id]?.children?.length),
      onSuccess: (res) => {
        computeMenuChilds(menuId, res?.menus ?? []);
        setLoading(false);
      },
    },
  });

  const activeMenu =
    element?.type === "FOLDER"
      ? Boolean(selectedApp?.id === element?.id)
      : element?.id === menuId;

  if (!permission) {
    return;
  }

  const title =
    element?.attributes?.[`label_${i18n.language}`] ||
    element?.label ||
    element?.data?.microfrontend?.name ||
    element?.data?.webpage?.title;
  const icon =
    element?.icon ||
    element?.data?.microfrontend?.icon ||
    element?.data?.webpage?.icon;
  const iconSize =
    menuStyle?.icon_size === "SMALL"
      ? 10
      : menuStyle?.icon_size === "MEDIUM"
        ? 15
        : 20;

  const conditionalProps = {};
  if (!sidebarIsOpen) {
    conditionalProps.onMouseEnter = () =>
      dispatch(mainActions.setSidebarHighlightedMenu(element?.id));
  }

  const getMenuColor = (element) => {
    if (element?.label === "Settings") {
      return "#fff";
    } else return activeMenu ? "#5F5E5A" : menuStyle?.text || "#475467";
  };

  function computeMenuChilds(id, children = []) {
    const updated = {...menuChilds};
    updated[id] = {open: true, children};

    dispatch(menuAccordionActions.toggleMenuChilds(updated));
  }

  function clickElement(item) {
    const updated = {...menuChilds};
    updated[item?.id] = {...updated[item?.id], open: true};

    dispatch(menuAccordionActions.toggleMenuChilds(updated));
  }

  const closeMenu = (id) => {
    const updated = {...menuChilds};
    updated[id] = {...updated[id], open: false};

    dispatch(menuAccordionActions.toggleMenuChilds(updated));
  };

  const coontrolAccordionAction = (el) => {
    const isOpen = menuChilds?.[el?.id]?.open;

    if (isOpen) {
      closeMenu(el?.id);
      setActiveAccordionId(null);
    } else {
      setActiveAccordionId(el?.id);
      clickElement(el);
    }
  };

  return (
    <Draggable key={index}>
      {element?.type !== "FOLDER" && (
        <SidebarAppTooltip id={element?.id} title={title}>
          <Flex
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              clickHandler();
              dispatch(mainActions.setSidebarHighlightedMenu(null));
            }}
            position="relative"
            h={30}
            mx={8}
            mb={4}
            alignItems="center"
            whiteSpace="nowrap"
            borderRadius={6}
            _hover={{bg: "#EAECF0"}}
            cursor="pointer"
            className="parent-folder column-drag-handle"
            bg={activeMenu ? `${"#F0F0EF"} !important` : menuStyle?.background}
            color={
              Boolean(
                menuId !== "c57eedc3-a954-4262-a0af-376c65b5a284" &&
                  menuId === element?.id
              ) || menuId === element?.id
                ? "#5F5E5A"
                : "#A8A8A8"
            }
            {...conditionalProps}>
            <Flex
              position="absolute"
              w={36}
              h={36}
              alignItems="center"
              justifyContent="center">
              <IconGenerator
                icon={!icon || icon === "folder.svg" ? "folder-new.svg" : icon}
                size={iconSize}
                style={{
                  color:
                    icon && icon !== "folder.svg"
                      ? menuStyle?.text || "#475467"
                      : "#fff",
                }}
              />
            </Flex>

            <Box
              color={activeMenu ? "#32302B" : menuStyle?.text || "#475467"}
              pl={35}
              fontSize={14}
              mr="auto"
              overflow="hidden"
              textOverflow="ellipsis">
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
                            ? "#32302B"
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
                          color: activeMenu ? "#32302B" : menuStyle?.text || "",
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
                  color: activeMenu ? "#32302B" : menuStyle?.text || "",
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
                  transform: selectedApp?.id === element.id && "rotate(-90deg)",
                  transition: "transform 250ms ease-out",
                  marginRight: 4,
                }}
              />
            ) : (
              ""
            )}
          </Flex>
        </SidebarAppTooltip>
      )}

      {element?.type === "FOLDER" && (
        <Accordion
          allowMultiple
          index={menuChilds[element.id]?.open && sidebarIsOpen ? [0] : []}
          border="none">
          <SidebarAppTooltip title={title}>
            <AccordionItem>
              <AccordionButton
                pt={"4px"}
                border={"none"}
                w={"100%"}
                bg={menuStyle?.background}
                height={"32px"}
                onClick={(e) => {
                  e.stopPropagation();
                  clickHandler(element);
                  dispatch(mainActions.setSidebarHighlightedMenu(null));
                  setLoading(!loading);
                }}>
                <Flex
                  width={sidebarIsOpen ? "100%" : "36px"}
                  key={index}
                  position="relative"
                  h={30}
                  mx={8}
                  mb={4}
                  alignItems="center"
                  whiteSpace="nowrap"
                  borderRadius={6}
                  _hover={{
                    bg: "#EAECF0",
                    ".accordionFolderIcon": {
                      display: "none",
                    },
                    ".accordionIcon": {
                      display: "block",
                    },
                  }}
                  cursor="pointer"
                  className="parent-folder column-drag-handle"
                  bg={
                    activeMenu
                      ? `${"#F0F0EF"} !important`
                      : menuStyle?.background
                  }
                  color={
                    Boolean(
                      menuId !== "c57eedc3-a954-4262-a0af-376c65b5a284" &&
                        menuId === element?.id
                    ) || menuId === element?.id
                      ? "#5F5E5A"
                      : "#A8A8A8"
                  }
                  {...conditionalProps}>
                  <Flex
                    position="absolute"
                    w={36}
                    h={36}
                    alignItems="center"
                    justifyContent="center">
                    <Box display={"none"} className="accordionIcon">
                      {sidebarIsOpen && element?.type === "FOLDER" && (
                        <AccordionIcon
                          w={"20px"}
                          h={"20px"}
                          style={{
                            color: activeMenu ? "#8E8D8C" : "#A7A7A5",
                          }}
                        />
                      )}
                    </Box>
                    <Box
                      sx={{width: "20px", height: "20px"}}
                      className={sidebarIsOpen ? "accordionFolderIcon" : ""}>
                      <IconGenerator
                        icon={
                          !icon || icon === "folder.svg"
                            ? "folder-new.svg"
                            : icon
                        }
                        size={iconSize}
                        style={{
                          color: getMenuColor(element, icon),
                        }}
                      />
                    </Box>
                  </Flex>

                  <Tooltip
                    title={title?.length > 14 ? title : ""}
                    placement="top">
                    <Box
                      color={activeMenu ? "#32302B" : "#5F5E5A"}
                      pl={35}
                      fontSize={14}
                      mr="auto"
                      overflow="hidden"
                      textOverflow="ellipsis">
                      {title?.length > 14 ? `${title?.slice(0, 14)}...` : title}
                    </Box>
                  </Tooltip>

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
                                e.stopPropagation();
                                handleOpenNotify(e, "FOLDER");
                              }}
                              style={{
                                color: activeMenu
                                  ? "#32302B"
                                  : (menuStyle?.text ?? "#fff"),
                              }}
                            />
                          </div>
                        </Tooltip>
                      )}

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
                                ? "#32302B"
                                : menuStyle?.text || "",
                            }}
                          />
                        </div>
                      </Tooltip>
                    </>
                  ) : (
                    ""
                  )}
                </Flex>
              </AccordionButton>

              {element?.type === "FOLDER" && (
                <AccordionPanel>
                  {loading ? (
                    <Skeleton
                      animation="wave"
                      variant="text"
                      style={{
                        width: "94%",
                        margin: "-5px auto 0px",
                        height: "42px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <NewSubMenu
                      menuLanguages={menuLanguages}
                      element={element}
                      menuChilds={menuChilds}
                      subMenuIsOpen={subMenuIsOpen}
                      setSubMenuIsOpen={setSubMenuIsOpen}
                      openFolderCreateModal={openFolderCreateModal}
                      setFolderModalType={setFolderModalType}
                      setTableModal={setTableModal}
                      setLinkedTableModal={setLinkedTableModal}
                      setSubSearchText={setSubSearchText}
                      handleOpenNotify={handleOpenNotify}
                      setElement={setElement}
                      selectedApp={selectedApp}
                      subSearchText={subSearchText}
                      menuStyle={menuStyle}
                      setSelectedApp={setSelectedApp}
                      menuItem={menuItem}
                      languageData={languageData}
                    />
                  )}
                </AccordionPanel>
              )}
            </AccordionItem>
          </SidebarAppTooltip>
        </Accordion>
      )}
    </Draggable>
  );
};

export default AppSidebar;
