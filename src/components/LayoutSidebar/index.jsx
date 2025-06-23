import "./style.scss";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {Container} from "react-smooth-dnd";
import FolderCreateModal from "../../layouts/MainLayout/FolderCreateModal";
import LinkTableModal from "../../layouts/MainLayout/LinkTableModal";
import MenuSettingModal from "../../layouts/MainLayout/MenuSettingModal";
import MicrofrontendLinkModal from "../../layouts/MainLayout/MicrofrontendLinkModal";
import TableLinkModal from "../../layouts/MainLayout/TableLinkModal";
import TemplateModal from "../../layouts/MainLayout/TemplateModal";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import menuService, {
  useMenuGetByIdQuery,
  useMenuListQuery,
} from "../../services/menuService";
import {useMenuSettingGetByIdQuery} from "../../services/menuSettingService";
import menuSettingsService from "../../services/menuSettingsService";
import {
  useProjectGetByIdQuery,
  useProjectListQuery,
} from "../../services/projectService";
import {store} from "../../store";
import {mainActions} from "../../store/main/main.slice";
import {applyDrag} from "../../utils/applyDrag";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import AppSidebar from "./AppSidebarComponent";
import FolderModal from "./FolderModalComponent";
import ButtonsMenu from "./MenuButtons";
import SubMenu from "./SubMenu";
import WikiFolderCreateModal from "../../layouts/MainLayout/WikiFolderCreateModal";
import { useNavigate, useParams } from "react-router-dom";
import { AIMenu, useAIChat } from "../ProfilePanel/AIChat";
import { useChatwoot } from "../ProfilePanel/Chatwoot";
import WebsiteModal from "../../layouts/MainLayout/WebsiteModal";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ChakraBaseProvider,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  theme,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import {
  SidebarActionTooltip,
  SidebarAppTooltip,
} from "@/components/LayoutSidebar/sidebar-app-tooltip";
import InviteModal from "@/components/InviteModal/InviteModal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useCompanyListQuery } from "@/services/companyService";
import {
  AccordionButton,
  AccordionIcon,
  SearchIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { useEnvironmentListQuery } from "@/services/environmentService";
import { companyActions } from "@/store/company/company.slice";
import authService from "@/services/auth/authService";
import { authActions } from "@/store/auth/auth.slice";
import InlineSVG from "react-inlinesvg";
import { Logout } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { languagesActions } from "../../store/globalLanguages/globalLanguages.slice";
import { Modal, Skeleton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { clearDB, getAllFromDB } from "../../utils/languageDB";
import { generateLangaugeText } from "../../utils/generateLanguageText";
import { GreyLoader } from "../Loaders/GreyLoader";
import { differenceInCalendarDays, parseISO } from "date-fns";
import DocsChatwootModal from "./DocsChatwootModal";
import { menuAccordionActions } from "../../store/menus/menus.slice";
import UserIcon from "@/assets/icons/profile.svg";
import { useRoleListQuery } from "../../services/roleServiceV2";
import { useClientTypesQuery } from "../../views/client-types/utils";
import useSearchParams from "../../hooks/useSearchParams";

const LayoutSidebar = ({
  toggleDarkMode = () => {},
  darkMode,
  handleOpenProfileModal = () => {},
  handleOpenUserInvite = () => {},
}) => {
  const DEFAULT_ADMIN = "DEFAULT ADMIN";

  const [searchParams, setSearchParams, updateSearchParam] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);
  const { appId } = useParams();

  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const subMenuIsOpen = useSelector((state) => state.main.subMenuIsOpen);
  const projectId = store.getState().company.projectId;

  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState(null);
  const [folderModalType, setFolderModalType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [menuList, setMenuList] = useState();
  const [menuDraggable, setMenuDraggable] = useState(false);
  const [isMenuListLoading, setIsMenuListLoading] = useState(false);
  const [tableModal, setTableModalOpen] = useState(false);
  const [linkTableModal, setLinkTableModal] = useState(false);
  const [microfrontendModal, setMicrofrontendModalOpen] = useState(false);
  const [websiteModal, setWebsiteModal] = useState(false);
  const [menuSettingModal, setMenuSettingModalOpen] = useState(false);
  const [templateModal, setTemplateModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState();
  const [child, setChild] = useState();
  const [element, setElement] = useState();
  const [subSearchText, setSubSearchText] = useState();
  const [menu, setMenu] = useState({ event: "", type: "", root: false });
  const openSidebarMenu = Boolean(menu?.event);
  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });
  const [menuLanguages, setMenuLanguages] = useState(null);
  const [profileSettingLan, setProfileSettingLan] = useState(null);
  const [languageData, setLanguageData] = useState(null);

  const sidebarIsOpen = useSelector(
    (state) => state.main.settingsSidebarIsOpen
  );

  const setSubMenuIsOpen = (val) => {
    dispatch(mainActions.setSubMenuIsOpen(val));
  };

  const { data: menuById } = useMenuGetByIdQuery({
    menuId: "c57eedc3-a954-4262-a0af-376c65b5a284",
  });

  const { data: menuTemplate } = useMenuSettingGetByIdQuery({
    params: {
      template_id:
        menuById?.attributes?.menu_settings_id ||
        "f922bb4c-3c4e-40d4-95d5-c30b7d8280e3",
    },
    menuId: "adea69cd-9968-4ad0-8e43-327f6600abfd",
  });

  const menuStyle = menuTemplate?.menu_template;
  const permissions = useSelector((state) => state.auth.globalPermissions);
  const userRoleName = useSelector((state) => state.auth.roleInfo?.name);

  const handleOpenNotify = (event, type, root) => {
    setMenu({ event: event?.currentTarget, type: type, root: root });
  };
  const handleCloseNotify = () => {
    setMenu(null);
  };

  const closeWebsiteModal = () => {
    setWebsiteModal(null);
  };

  const setWebsiteModalLink = (element) => {
    setWebsiteModal(true);
    setSelectedFolder(element);
  };

  const setTableModal = (element) => {
    setTableModalOpen(true);
    setSelectedFolder(element);
  };
  const closeTableModal = () => {
    setTableModalOpen(null);
  };
  const setLinkedTableModal = (element) => {
    setLinkTableModal(true);
    setSelectedFolder(element);
  };
  const closeLinkedTableModal = () => {
    setLinkTableModal(null);
  };
  const setMicrofrontendModal = (element) => {
    setMicrofrontendModalOpen(true);
    setSelectedFolder(element);
  };
  const closeMicrofrontendModal = () => {
    setMicrofrontendModalOpen(null);
  };

  const closeMenuSettingModal = () => {
    setMenuSettingModalOpen(null);
  };

  const closeTemplateModal = () => {
    setTemplateModalOpen(null);
  };
  const closeModal = () => {
    setModalType(null);
  };
  const closeFolderModal = () => {
    setFolderModalType(null);
  };
  const openFolderCreateModal = (type, element) => {
    setModalType(type);
    setSelectedFolder(element);
  };

  const deleteFolder = (element) => {
    menuSettingsService
      .delete(element.id)
      .then(() => {
        queryClient.refetchQueries(["MENU"], element?.id);
        getMenuList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMenuList = () => {
    setIsMenuListLoading(true);

    menuSettingsService
      .getList({
        parent_id: "c57eedc3-a954-4262-a0af-376c65b5a284",
      })
      .then((res) => {
        const computedMenus = res?.menus?.filter((el) => {
          const id = el?.id;
          const permission = el?.data?.permission?.read;

          if (id === "c57eedc3-a954-4262-a0af-376c65b5a280") {
            return true;
          }

          const excludedIds = [
            "8a6f913a-e3d4-4b73-9fc0-c942f343d0b9",
            "9e988322-cffd-484c-9ed6-460d8701551b",
          ];

          return !excludedIds.includes(id) && permission;
        });
        setMenuList(computedMenus);
        setIsMenuListLoading(false);
      })
      .catch((error) => {
        setIsMenuListLoading(false);
        console.log("error", error);
      })
      .finally(() => {
        setIsMenuListLoading(false);
      });
  };

  const { isLoadingUser } = useQuery(
    ["GET_CLIENT_TYPE_LIST", appId],
    () => {
      return clientTypeServiceV2.getList();
    },
    {
      enabled: Boolean(appId === "9e988322-cffd-484c-9ed6-460d8701551b"),
      onSuccess: (res) => {
        setChild(
          res.data.response?.map((row) => ({
            ...row,
            type: "USER",
            id: row.guid,
            parent_id: "13",
            data: {
              permission: {
                read: true,
              },
            },
          }))
        );
      },
    }
  );

  const onDrop = (dropResult) => {
    setMenuDraggable(true);
    const result = applyDrag(menuList, dropResult);
    setMenuList(result);
    if (result) {
      menuService.updateOrder({
        menus: result,
      });
    }
  };

  const setSidebarIsOpen = (val) => {
    dispatch(mainActions.setSettingsSidebarIsOpen(val));
  };
  useEffect(() => {
    if (menuTemplate?.icon_style === "MODERN") {
      setSidebarIsOpen(false);
    } else {
      setSidebarIsOpen(true);
    }
  }, [menuTemplate]);

  useEffect(() => {
    getMenuList();
  }, []);

  useEffect(() => {
    setSelectedApp(menuList?.find((item) => item?.id === appId));
  }, [menuList]);

  useEffect(() => {
    setSelectedApp(menuList?.find((item) => item?.id === appId));
  }, [appId]);

  useEffect(() => {
    if (
      selectedApp?.type === "FOLDER" ||
      (selectedApp?.type === "USER_FOLDER" && pinIsEnabled)
    )
      setSubMenuIsOpen(true);
  }, [selectedApp]);

  const { loader: menuLoader } = useMenuGetByIdQuery({
    menuId: searchParams.get("menuId"),
    queryParams: {
      enabled: Boolean(searchParams.get("menuId")),
      onSuccess: (res) => {
        // setMenuItem(res);
      },
    },
  });

  const itemConditionalProps = {};
  if (!sidebarIsOpen) {
    itemConditionalProps.onMouseEnter = () =>
      dispatch(mainActions.setSidebarHighlightedMenu("create"));
  }

  const getActionProps = (id) =>
    sidebarIsOpen
      ? {}
      : {
          onMouseEnter: () =>
            dispatch(mainActions.setSidebarHighlightedAction(id)),
          onMouseLeave: () =>
            dispatch(mainActions.setSidebarHighlightedAction(null)),
        };

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        setProfileSettingLan(
          formattedData?.find((item) => item?.key === "Profile Setting")
        );
        setMenuLanguages(formattedData?.find((item) => item?.key === "Menu"));
        setLanguageData(formattedData);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const isWarning =
    differenceInCalendarDays(parseISO(projectInfo?.expire_date), new Date()) +
    1;

  const isWarningActive =
    projectInfo?.subscription_type === "free_trial"
      ? isWarning <= 16
      : isWarning <= 7;

  const [isOpenInviteModal, setIsOpenInviteModal] = useState(false);

  const onOpenInviteModal = () => {
    setIsOpenInviteModal(true);
    updateSearchParam("invite", true);
  };

  const onCloseInviteModal = () => {
    setIsOpenInviteModal(false);
  };

  // const {
  // isOpen: isOpenInviteModal,
  // onOpen: onOpenInviteModal,
  // onClose: onCloseInviteModal,
  // } = useDisclosure();

  return (
    <>
      <Flex
        id="layoutSidebar"
        position="relative"
        w={sidebarIsOpen ? 240 : 52}
        flexDirection="column"
        transition="width 200ms ease-out"
        borderRight="1px solid #EAECF0"
        bg={menuStyle?.background ?? "#fff"}
        h={`calc(100vh - ${isWarningActive || projectInfo?.status === "inactive" ? 32 : 0}px )`}
      >
        <Flex
          position="absolute"
          zIndex={999}
          w={25}
          h={25}
          alignItems="center"
          justifyContent="center"
          border="1px solid #e5e5e5"
          borderRadius="50%"
          top={27}
          right={0}
          transform={sidebarIsOpen ? "translateX(50%)" : "translateX(60%)"}
          bg="#fff"
          cursor="pointer"
          onClick={() =>
            dispatch(mainActions.setSettingsSidebarIsOpen(!sidebarIsOpen))
          }
        >
          {sidebarIsOpen ? (
            <KeyboardDoubleArrowLeftIcon style={{ color: "#007aff" }} />
          ) : (
            <KeyboardDoubleArrowRightIcon style={{ color: "#007aff" }} />
          )}
        </Flex>

        <Flex pl={8} py={4} h={42} alignItems="center">
          <Header
            sidebarIsOpen={sidebarIsOpen}
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            projectInfo={projectInfo}
            menuLanguages={menuLanguages}
            profileSettingLan={profileSettingLan}
            handleOpenProfileModal={handleOpenProfileModal}
          />
        </Flex>

        <Box
          className="scrollbarNone"
          maxH={`calc(100vh - ${sidebarIsOpen ? 85 : 240}px)`}
          overflowY="auto"
          overflowX="hidden"
        >
          {Array.isArray(menuList) && (
            <div
              className="menu-element"
              onMouseLeave={() =>
                dispatch(mainActions.setSidebarHighlightedMenu(null))
              }
            >
              <Container
                dragHandleSelector=".column-drag-handle"
                onDrop={onDrop}
              >
                {menuList.map((element, index) => (
                  <AppSidebar
                    index={index}
                    child={child}
                    key={index}
                    element={element}
                    sidebarIsOpen={sidebarIsOpen}
                    setElement={setElement}
                    setSubMenuIsOpen={setSubMenuIsOpen}
                    subMenuIsOpen={subMenuIsOpen}
                    handleOpenNotify={handleOpenNotify}
                    setSelectedApp={setSelectedApp}
                    selectedApp={selectedApp}
                    menuTemplate={menuTemplate}
                    menuLanguages={menuLanguages}
                    setMenuItem={setMenuItem}
                    menuItem={menuItem}
                    openFolderCreateModal={openFolderCreateModal}
                    setFolderModalType={setFolderModalType}
                    setTableModal={setTableModal}
                    setLinkedTableModal={setLinkedTableModal}
                    setSubSearchText={setSubSearchText}
                    menuStyle={menuStyle}
                    languageData={languageData}
                    subSearchText={subSearchText}
                    menuDraggable={menuDraggable}
                    setMenuDraggable={setMenuDraggable}
                  />
                ))}
              </Container>

              {Boolean(permissions?.menu_button) && (
                <SidebarAppTooltip id="create" title="Create">
                  <Flex
                    position="relative"
                    h={30}
                    alignItems="center"
                    borderRadius={6}
                    _hover={{ bg: "#EAECF0" }}
                    cursor="pointer"
                    mx={8}
                    marginTop={"5px"}
                    onClick={(e) => {
                      handleOpenNotify(e, "CREATE", true);
                      dispatch(mainActions.setSidebarHighlightedMenu(null));
                    }}
                    {...itemConditionalProps}
                  >
                    <Flex
                      position="absolute"
                      w={32}
                      h={32}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <InlineSVG src="/img/plus-icon.svg" color="#475467" />
                    </Flex>

                    <Box
                      whiteSpace="nowrap"
                      color={
                        (menuStyle?.text === "#A8A8A8" ? null : "#475467") ??
                        "#475467"
                      }
                      pl={35}
                      fontSize={14}
                    >
                      {generateLangaugeText(
                        menuLanguages,
                        i18n?.language,
                        "Create"
                      ) || "Create"}
                    </Box>
                  </Flex>
                </SidebarAppTooltip>
              )}

              <Box mt={46}>
                {Boolean(
                  permissions?.chat && userRoleName === DEFAULT_ADMIN
                ) && (
                  <Flex
                    position="relative"
                    h={30}
                    mx={8}
                    mb={4}
                    alignItems="center"
                    whiteSpace="nowrap"
                    borderRadius={6}
                    color="#475467"
                    fontSize={14}
                    overflow="hidden"
                    textOverflow="ellipsis"
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
                    onMouseLeave={
                      sidebarIsOpen
                        ? undefined
                        : () =>
                            dispatch(
                              mainActions.setSidebarHighlightedAction(null)
                            )
                    }
                  >
                    <SidebarActionTooltip id="ai-chat" title="AI Chat">
                      <AIChat
                        sidebarOpen={sidebarIsOpen}
                        {...getActionProps("ai-chat")}
                      >
                        <Flex w="100%" alignItems="center" gap={8}>
                          <Box pl="6px">
                            <SearchIcon color="#475467" fontSize={20} />
                          </Box>
                          <span>Search</span>
                        </Flex>
                      </AIChat>
                    </SidebarActionTooltip>
                  </Flex>
                )}
                {userRoleName === DEFAULT_ADMIN && (
                  <Flex
                    position="relative"
                    h={30}
                    mx={8}
                    mb={4}
                    alignItems="center"
                    whiteSpace="nowrap"
                    borderRadius={6}
                    color="#475467"
                    fontSize={14}
                    overflow="hidden"
                    textOverflow="ellipsis"
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
                    onMouseLeave={
                      sidebarIsOpen
                        ? undefined
                        : () =>
                            dispatch(
                              mainActions.setSidebarHighlightedAction(null)
                            )
                    }
                  >
                    <SidebarActionTooltip id="settings" title="Settings">
                      <Flex
                        w={sidebarIsOpen ? "100%" : 36}
                        alignItems="center"
                        justifyContent={sidebarIsOpen ? "flex-start" : "center"}
                        gap={8}
                        onClick={handleOpenProfileModal}
                        {...getActionProps("settings")}
                      >
                        <Box
                          pl={sidebarIsOpen ? "5px" : 0}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {/* <SettingsIcon color="#475467" fontSize={16} /> */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="20"
                            height="20"
                            viewBox="0,0,256,256"
                          >
                            <g
                              fill="rgba(55, 53, 47, 0.85)"
                              fillRule="nonzero"
                              stroke="none"
                              strokeWidth="1"
                              strokeLinecap="butt"
                              strokeLinejoin="miter"
                              strokeMiterlimit="10"
                              strokeDasharray=""
                              strokeDashoffset="0"
                              fontFamily="none"
                              fontWeight="none"
                              fontSize="none"
                              textAnchor="none"
                              style={{ mixBlendMode: "normal" }}
                            >
                              <g transform="scale(10.66667,10.66667)">
                                <path d="M10.49023,2c-0.479,0 -0.88847,0.33859 -0.98047,0.80859l-0.33398,1.71484c-0.82076,0.31036 -1.57968,0.74397 -2.24609,1.29102l-1.64453,-0.56641c-0.453,-0.156 -0.95141,0.03131 -1.19141,0.44531l-1.50781,2.61328c-0.239,0.415 -0.15202,0.94186 0.20898,1.25586l1.31836,1.14648c-0.06856,0.42135 -0.11328,0.8503 -0.11328,1.29102c0,0.44072 0.04472,0.86966 0.11328,1.29102l-1.31836,1.14648c-0.361,0.314 -0.44798,0.84086 -0.20898,1.25586l1.50781,2.61328c0.239,0.415 0.73841,0.60227 1.19141,0.44727l1.64453,-0.56641c0.6662,0.54671 1.42571,0.97884 2.24609,1.28906l0.33398,1.71484c0.092,0.47 0.50147,0.80859 0.98047,0.80859h3.01953c0.479,0 0.88847,-0.33859 0.98047,-0.80859l0.33399,-1.71484c0.82076,-0.31036 1.57968,-0.74397 2.24609,-1.29102l1.64453,0.56641c0.453,0.156 0.95141,-0.03031 1.19141,-0.44531l1.50781,-2.61523c0.239,-0.415 0.15202,-0.93991 -0.20898,-1.25391l-1.31836,-1.14648c0.06856,-0.42135 0.11328,-0.8503 0.11328,-1.29102c0,-0.44072 -0.04472,-0.86966 -0.11328,-1.29102l1.31836,-1.14648c0.361,-0.314 0.44798,-0.84086 0.20898,-1.25586l-1.50781,-2.61328c-0.239,-0.415 -0.73841,-0.60227 -1.19141,-0.44727l-1.64453,0.56641c-0.6662,-0.54671 -1.42571,-0.97884 -2.24609,-1.28906l-0.33399,-1.71484c-0.092,-0.47 -0.50147,-0.80859 -0.98047,-0.80859zM12,8c2.209,0 4,1.791 4,4c0,2.209 -1.791,4 -4,4c-2.209,0 -4,-1.791 -4,-4c0,-2.209 1.791,-4 4,-4z"></path>
                              </g>
                            </g>
                          </svg>
                        </Box>
                        {sidebarIsOpen ? <span>Settings</span> : null}
                      </Flex>
                    </SidebarActionTooltip>
                  </Flex>
                )}
              </Box>
            </div>
          )}
        </Box>

        {userRoleName === DEFAULT_ADMIN && (
          <Flex
            display={sidebarIsOpen ? "flex" : "block"}
            mt="auto"
            py={8}
            alignItems="center"
            justifyContent={"space-between"}
            columnGap={16}
            px={8}
            borderTop={sidebarIsOpen ? "1px solid #EAECF0" : "none"}
            onMouseLeave={
              sidebarIsOpen
                ? undefined
                : () => dispatch(mainActions.setSidebarHighlightedAction(null))
            }
            onClick={
              sidebarIsOpen
                ? undefined
                : () => dispatch(mainActions.setSidebarHighlightedAction(null))
            }
          >
            {/* {Boolean(permissions?.settings) && ( */}
            <>
              <SidebarActionTooltip id="user-invite" title="User Invite">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0 8px",
                    height: "28px",
                    background: "#fff",
                    borderRadius: "6px",
                    cursor: "pointer",
                    "&:hover": {
                      background: "#F3F3F3",
                    },
                  }}
                  // onClick={handleOpenUserInvite}
                  onClick={onOpenInviteModal}
                >
                  {/* color: rgb(161, 160, 156) */}
                  {/* <img src={UserIcon} alt="user" /> */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.63314 9.68341C7.60814 9.68341 7.59147 9.68341 7.56647 9.68341C7.5248 9.67508 7.46647 9.67508 7.41647 9.68341C4.9998 9.60841 3.1748 7.70841 3.1748 5.36675C3.1748 2.98341 5.11647 1.04175 7.4998 1.04175C9.88314 1.04175 11.8248 2.98341 11.8248 5.36675C11.8165 7.70841 9.98314 9.60841 7.65814 9.68341C7.6498 9.68341 7.64147 9.68341 7.63314 9.68341ZM7.4998 2.29175C5.80814 2.29175 4.4248 3.67508 4.4248 5.36675C4.4248 7.03341 5.7248 8.37508 7.38314 8.43341C7.43314 8.42508 7.54147 8.42508 7.64981 8.43341C9.28314 8.35841 10.5665 7.01675 10.5748 5.36675C10.5748 3.67508 9.19147 2.29175 7.4998 2.29175Z"
                      fill="rgb(161, 160, 156)"
                    />
                    <path
                      d="M13.783 9.79159C13.758 9.79159 13.733 9.79159 13.708 9.78325C13.3663 9.81659 13.0163 9.57492 12.983 9.23325C12.9496 8.89159 13.158 8.58325 13.4996 8.54159C13.5996 8.53325 13.708 8.53325 13.7996 8.53325C15.0163 8.46659 15.9663 7.46659 15.9663 6.24159C15.9663 4.97492 14.9413 3.94992 13.6746 3.94992C13.333 3.95825 13.0496 3.67492 13.0496 3.33325C13.0496 2.99159 13.333 2.70825 13.6746 2.70825C15.6246 2.70825 17.2163 4.29992 17.2163 6.24992C17.2163 8.16659 15.7163 9.71659 13.808 9.79159C13.7996 9.79159 13.7913 9.79159 13.783 9.79159Z"
                      fill="rgb(161, 160, 156)"
                    />
                    <path
                      d="M7.64134 18.7916C6.00801 18.7916 4.36634 18.3749 3.12467 17.5416C1.96634 16.7749 1.33301 15.7249 1.33301 14.5833C1.33301 13.4416 1.96634 12.3833 3.12467 11.6083C5.62467 9.94992 9.67467 9.94992 12.158 11.6083C13.308 12.3749 13.9497 13.4249 13.9497 14.5666C13.9497 15.7083 13.3163 16.7666 12.158 17.5416C10.908 18.3749 9.27467 18.7916 7.64134 18.7916ZM3.81634 12.6583C3.01634 13.1916 2.58301 13.8749 2.58301 14.5916C2.58301 15.2999 3.02467 15.9833 3.81634 16.5083C5.89134 17.8999 9.39134 17.8999 11.4663 16.5083C12.2663 15.9749 12.6997 15.2916 12.6997 14.5749C12.6997 13.8666 12.258 13.1833 11.4663 12.6583C9.39134 11.2749 5.89134 11.2749 3.81634 12.6583Z"
                      fill="rgb(161, 160, 156)"
                    />
                    <path
                      d="M15.283 17.2917C14.9913 17.2917 14.733 17.0917 14.6746 16.7917C14.608 16.45 14.8246 16.125 15.158 16.05C15.683 15.9417 16.1663 15.7333 16.5413 15.4417C17.0163 15.0833 17.2746 14.6333 17.2746 14.1583C17.2746 13.6833 17.0163 13.2333 16.5496 12.8833C16.183 12.6 15.7246 12.4 15.183 12.275C14.8496 12.2 14.633 11.8667 14.708 11.525C14.783 11.1917 15.1163 10.975 15.458 11.05C16.1746 11.2083 16.7996 11.4917 17.308 11.8833C18.083 12.4667 18.5246 13.2917 18.5246 14.1583C18.5246 15.025 18.0746 15.85 17.2996 16.4417C16.783 16.8417 16.133 17.1333 15.4163 17.275C15.3663 17.2917 15.3246 17.2917 15.283 17.2917Z"
                      fill="rgb(161, 160, 156)"
                    />
                  </svg>
                  {sidebarIsOpen ? (
                    <span style={{ color: "rgb(161, 160, 156)" }}>
                      User Invite
                    </span>
                  ) : null}
                </Box>

                {/* <AIChat
                  sidebarOpen={sidebarIsOpen}
                  {...getActionProps("ai-chat")}
                /> */}
              </SidebarActionTooltip>
            </>
            {/* )} */}

            <DocsChatwootModal
              sidebarIsOpen={sidebarIsOpen}
              getActionProps={getActionProps}
              permissions={permissions}
            />
          </Flex>
        )}

        {(modalType === "create" ||
          modalType === "parent" ||
          modalType === "update") && (
          <FolderCreateModal
            closeModal={closeModal}
            selectedFolder={selectedFolder}
            modalType={modalType}
            appId={appId}
            getMenuList={getMenuList}
          />
        )}
        {modalType === "WIKI_UPDATE" || modalType === "WIKI_FOLDER_UPDATE" ? (
          <WikiFolderCreateModal
            closeModal={closeModal}
            selectedFolder={selectedFolder}
            modalType={modalType}
            appId={appId}
            getMenuList={getMenuList}
          />
        ) : null}
        {tableModal && (
          <TableLinkModal
            closeModal={closeTableModal}
            selectedFolder={selectedFolder}
            getMenuList={getMenuList}
          />
        )}
        {linkTableModal && (
          <LinkTableModal
            closeModal={closeLinkedTableModal}
            selectedFolder={selectedFolder}
            getMenuList={getMenuList}
          />
        )}
        {microfrontendModal && (
          <MicrofrontendLinkModal
            closeModal={closeMicrofrontendModal}
            selectedFolder={selectedFolder}
            getMenuList={getMenuList}
          />
        )}

        {websiteModal && (
          <WebsiteModal
            closeModal={closeWebsiteModal}
            selectedFolder={selectedFolder}
            getMenuList={getMenuList}
          />
        )}
        {folderModalType === "folder" && (
          <FolderModal
            closeModal={closeFolderModal}
            modalType={folderModalType}
            menuList={menuList}
            element={element}
            getMenuList={getMenuList}
          />
        )}
      </Flex>

      {/* <SubMenu
        menuLanguages={menuLanguages}
        child={child}
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
        isLoading={isLoading}
        menuStyle={menuStyle}
        setSelectedApp={setSelectedApp}
        menuItem={menuItem}
        languageData={languageData}
      /> */}

      {menu?.type?.length ? (
        <ButtonsMenu
          menuLanguages={menuLanguages}
          element={element}
          menu={menu?.event}
          openMenu={openSidebarMenu}
          handleCloseNotify={handleCloseNotify}
          openFolderCreateModal={openFolderCreateModal}
          menuType={menu?.type}
          setFolderModalType={setFolderModalType}
          appId={menu?.root ? "c57eedc3-a954-4262-a0af-376c65b5a284" : appId}
          setTableModal={setTableModal}
          setLinkedTableModal={setLinkedTableModal}
          setMicrofrontendModal={setMicrofrontendModal}
          deleteFolder={deleteFolder}
          getMenuList={getMenuList}
          setWebsiteModalLink={setWebsiteModalLink}
        />
      ) : null}
      {templateModal && <TemplateModal closeModal={closeTemplateModal} />}
      {menuSettingModal && (
        <MenuSettingModal closeModal={closeMenuSettingModal} />
      )}

      <ChakraBaseProvider theme={theme}>
        <InviteModal
          isOpen={isOpenInviteModal}
          onClose={onCloseInviteModal}
          onOpen={onOpenInviteModal}
        />
      </ChakraBaseProvider>
    </>
  );
};

const Chatwoot = forwardRef(({ open, ...props }, ref) => {
  const { originalButtonFunction } = useChatwoot();

  return (
    <Flex
      ref={ref}
      w={open ? "100%" : 36}
      h={36}
      alignItems="center"
      justifyContent="center"
      borderRadius={6}
      _hover={{ bg: "#EAECF0" }}
      cursor="pointer"
      mb={open ? 0 : 4}
      {...props}
      onClick={originalButtonFunction}
    >
      <img src="/img/message-text-square.svg" alt="chat" />
    </Flex>
  );
});

const AIChat = forwardRef(({ sidebarOpen, children, ...props }, ref) => {
  const {
    open,
    anchorEl,
    loader,
    setLoader,
    inputValue,
    setInputValue,
    messages,
    messagesEndRef,
    handleClick,
    handleClose,
    handleKeyDown,
    handleSendClick,
    showInput,
    handleSuccess,
    handleError,
    onExited,
    appendMessage,
  } = useAIChat();

  return (
    <>
      <Flex
        w={sidebarOpen ? "100%" : 36}
        borderRadius={6}
        // _hover={{
        //   background: "#37352F0F",
        // }}
        h={"25px"}
        // pl={sidebarOpen ? "35px" : 0}
        cursor="pointer"
        mb={sidebarOpen ? 0 : 4}
        ref={ref}
        {...props}
        onClick={handleClick}
        justifyContent="center"
        alignItems="center"
      >
        {sidebarOpen ? children : <SearchIcon color="#475467" fontSize={16} />}
        {/* <img src="/img/magic-wand.svg" alt="magic" /> */}
      </Flex>

      <AIMenu
        open={open}
        anchorEl={anchorEl}
        loader={loader}
        setLoader={setLoader}
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        messagesEndRef={messagesEndRef}
        handleClose={handleClose}
        handleKeyDown={handleKeyDown}
        handleSendClick={handleSendClick}
        showInput={showInput}
        handleSuccess={handleSuccess}
        handleError={handleError}
        onExited={onExited}
        appendMessage={appendMessage}
      />
    </>
  );
});

const Header = ({
  sidebarIsOpen,
  projectInfo,
  menuLanguages,
  profileSettingLan,
  handleOpenProfileModal,
}) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClose = () => {
    onClose();
  };

  const onSelectEnvironment = (environment) => {
    const params = {
      refresh_token: auth?.refreshToken,
      env_id: environment.id,
      project_id: environment.project_id,
      for_env: true,
    };

    dispatch(companyActions.setEnvironmentItem(environment));
    dispatch(companyActions.setEnvironmentId(environment.id));
    authService
      .updateToken({ ...params, env_id: environment.id }, { ...params })
      .then((res) => {
        store.dispatch(authActions.setTokens(res));
        window.location.reload();
        dispatch(companyActions.setEnvironmentId(environment.id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Popover
      offset={[sidebarIsOpen ? 50 : 95, 5]}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <PopoverTrigger>
        <Flex
          w="calc(100% - 0px)"
          maxWidth={sidebarIsOpen ? "220px" : "36px"}
          position="relative"
          overflow="hidden"
          alignItems="center"
          p={5}
          borderRadius={8}
          bg="#fff"
          _hover={{ bg: "#EAECF0" }}
          cursor="pointer"
          onClick={() => (!isOpen ? onOpen() : null)}
          onMouseEnter={() => (!sidebarIsOpen ? onOpen() : null)}
        >
          <Flex
            w={36}
            h={36}
            position="absolute"
            left={0}
            alignItems="center"
            justifyContent="center"
          >
            {Boolean(projectInfo?.logo) && (
              <img src={projectInfo?.logo} alt="" width={20} height={20} />
            )}

            {!projectInfo?.logo && (
              <Flex
                w={20}
                h={20}
                borderRadius={4}
                bg="#06AED4"
                color="#fff"
                alignItems="center"
                justifyContent="center"
                fontSize={14}
                fontWeight={500}
              >
                {projectInfo?.title?.[0]?.toUpperCase()}
              </Flex>
            )}
          </Flex>

          <Box
            pl={30}
            whiteSpace="nowrap"
            color="#344054"
            fontSize={13}
            fontWeight={500}
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {projectInfo?.title}
          </Box>
          <KeyboardArrowDownIcon style={{ marginLeft: "10px", fontSize: 20 }} />
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        w="300px"
        bg="#fff"
        borderRadius={8}
        border="1px solid #EAECF0"
        outline="none"
        boxShadow="0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814"
        zIndex={999}
        onMouseEnter={() => (!sidebarIsOpen ? onOpen() : null)}
        onMouseLeave={() => (!sidebarIsOpen ? onClose() : null)}
      >
        <>
          <ProfilePanel
            menuLanguages={menuLanguages}
            handleOpenProfileModal={handleOpenProfileModal}
            onClose={onClose}
          />
          <Companies onSelectEnvironment={onSelectEnvironment} />
          <ProfileBottom
            projectInfo={projectInfo}
            menuLanguages={profileSettingLan}
          />
        </>
      </PopoverContent>
    </Popover>
  );
};

const ProfilePanel = ({
  onClose = () => {},
  menuLanguages,
  handleOpenProfileModal,
}) => {
  const navigate = useNavigate();
  const state = useSelector((state) => state.auth);
  const { i18n } = useTranslation();
  return (
    <Box p={"12px"} borderBottom={"1px solid #eee"}>
      <Flex gap={10} alignItems={"center"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          w={36}
          h={36}
          style={{ border: "1px solid #eee", fontSize: "24px" }}
          borderRadius={"5px"}
          bg={"#04ADD4"}
          color={"white"}
        >
          {state?.userInfo?.login?.slice(0, 1)}
        </Box>
        <Box>
          <Box fontSize={"14px"} fontWeight={"bold"} color={"#475467"}>
            {state?.userInfo?.login ?? ""}
          </Box>
          <Box fontSize={"12px"} color={"#475467"}>
            {state?.clientType?.name ?? ""}
          </Box>
        </Box>
      </Flex>

      <Flex
        _hover={{ background: "#eeee" }}
        alignItems={"center"}
        h={25}
        minW={86}
        maxW={130}
        border={"1px solid #eee"}
        borderRadius={"5px"}
        justifyContent={"center"}
        gap={5}
        mt={10}
        cursor={"pointer"}
        onClick={handleOpenProfileModal}
        // onClick={() => {
        //   navigate(`/settings/auth/matrix/profile/crossed`);
        //   onClose();
        // }}
      >
        <SettingsIcon style={{ color: "#475467" }} />
        <Box color={"#475467"}>
          {generateLangaugeText(menuLanguages, i18n?.language, "Settings")}
        </Box>
      </Flex>
    </Box>
  );
};

const ProfileBottom = ({projectInfo, menuLanguages}) => {
  const dispatch = useDispatch();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const projectId = useSelector((state) => state.company.projectId);
  const accessToken = useSelector((state) => state.auth?.token);

  const popoverRef = useRef();
  const {i18n} = useTranslation();
  const defaultLanguage = useSelector(
    (state) => state.languages.defaultLanguage
  );

  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCloseModal = () => setIsOpenModal(false);
  const onOpenModal = () => setIsOpenModal(true);

  useOutsideClick({
    ref: popoverRef,
    handler: () => onClose(),
  });

  const languages = useMemo(() => {
    return projectInfo?.language?.map((lang) => ({
      title: lang?.name,
      slug: lang?.short_name,
    }));
  }, [projectInfo]);

  const getDefaultLanguage = () => {
    const isLanguageExist = languages?.some(
      (item) => defaultLanguage === item?.slug
    );

    if (languages?.length) {
      if (languages?.length === 1) {
        dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
        localStorage.setItem("defaultLanguage", languages?.[0]?.slug);
        i18n.changeLanguage(languages?.[0]?.slug);
      } else if (languages?.length > 1) {
        if (!defaultLanguage) {
          dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
          localStorage.setItem("defaultLanguage", languages?.[0]?.slug);
          i18n.changeLanguage(languages?.[0]?.slug);
        } else if (defaultLanguage && isLanguageExist) {
          dispatch(languagesActions.setDefaultLanguage(defaultLanguage));
          localStorage.setItem("defaultLanguage", defaultLanguage);
          i18n.changeLanguage(defaultLanguage);
        } else {
          dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
          localStorage.setItem("defaultLanguage", languages?.[0]?.slug);
          i18n.changeLanguage(languages?.[0]?.slug);
        }
      }
    }
  };

  useEffect(() => {
    getDefaultLanguage();
  }, [languages?.length]);

  const logoutClickHandler = () => {
    authService.sendAccessToken({access_token: accessToken}).then((res) => {
      indexedDB.deleteDatabase("SearchTextDB");
      indexedDB.deleteDatabase("ChartDB");
      dispatch(menuAccordionActions.toggleMenuChilds({}));
      store.dispatch(authActions.logout());
      dispatch(companyActions.logout());
    });
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(languagesActions.setDefaultLanguage(lang));
    localStorage.setItem("defaultLanguage", lang);
    onClose();
  };

  useEffect(() => {
    if (projectInfo?.project_id) {
      dispatch(languagesActions.setLanguagesItems(languages));
    }
  }, [languages, projectInfo?.project_id, dispatch]);

  return (
    <Box p={8} ref={popoverRef}>
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        placement="right-start"
        closeOnBlur={false}>
        <PopoverTrigger>
          <Box
            sx={{
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingLeft: "8px",
              height: "32px",
              cursor: "pointer",
              color: "#475467",
            }}
            _hover={{background: "#eeee"}}
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}>
            <GTranslateIcon style={{color: "#475467"}} />
            <span>
              {" "}
              {generateLangaugeText(
                menuLanguages,
                i18n?.language,
                "Languages"
              ) || "Languages"}
            </span>
          </Box>
        </PopoverTrigger>

        <PopoverContent w="250px">
          <Box
            minH={50}
            maxH={250}
            bg={"white"}
            p={4}
            borderRadius={5}
            boxShadow="0 0 5px rgba(145, 158, 171, 0.3)">
            <PopoverBody>
              {languages?.map((item) => (
                <Box
                  key={item.slug}
                  p={4}
                  borderRadius="6px"
                  cursor="pointer"
                  color={item.slug === defaultLanguage ? "#000" : "#333"}
                  bg={item.slug === defaultLanguage ? "#E5E5E5" : "white"}
                  _hover={{bg: "#F0F0F0"}}
                  onClick={() => changeLanguage(item.slug)}>
                  {item.title}
                </Box>
              ))}
            </PopoverBody>
          </Box>
        </PopoverContent>
      </Popover>

      <Box
        sx={{
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingLeft: "8px",
          height: "32px",
          cursor: "pointer",
          color: "#475467",
        }}
        _hover={{background: "#eeee"}}
        onClick={onOpenModal}>
        <Logout style={{color: "#475467"}} />
        <span>
          {generateLangaugeText(menuLanguages, i18n?.language, "Log out") ||
            "Log out"}
        </span>
      </Box>

      <Modal open={isOpenModal} onClose={onCloseModal}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: "12px",
            outline: "none",
            width: 400,
            padding: "20px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <LogoutIcon style={{width: "48", height: "28px"}} />
          </Box>

          <Box fontWeight={700} fontSize={"18px"}>
            {generateLangaugeText(
              menuLanguages,
              i18n?.language,
              "Log out of your account"
            ) || "Log out of your account"}
          </Box>

          <Box mt={5} fontWeight={400} fontSize={"12px"}>
            {generateLangaugeText(
              menuLanguages,
              i18n?.language,
              "You will need to log back in to access your workspace."
            )}
          </Box>

          <Box mt={20} display="flex" flexDirection="column" gap={1}>
            <Button
              cursor={"pointer"}
              borderRadius={8}
              border="none"
              fontSize={14}
              fullWidth
              bg={"#a63431"}
              color="#fff"
              _hover={{bg: "#a63400"}}
              style={{height: "40px"}}
              onClick={logoutClickHandler}>
              {generateLangaugeText(menuLanguages, i18n?.language, "Logout") ||
                "Logout"}
            </Button>
            <Button
              mt={5}
              cursor={"pointer"}
              borderRadius={8}
              fontSize={14}
              fullWidth
              bg={"#fff"}
              _hover={{bg: "#eee"}}
              border="2px solid #eee"
              style={{height: "40px"}}
              onClick={onCloseModal}>
              {generateLangaugeText(menuLanguages, i18n?.language, "Cancel") ||
                "Cancel"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const Companies = ({onSelectEnvironment}) => {
  const userId = useSelector((state) => state.auth?.userId);
  const companiesQuery = useCompanyListQuery({
    params: {owner_id: userId},
    queryParams: {enabled: Boolean(userId)},
  });
  const companies = companiesQuery.data?.companies ?? [];

  return (
    <Box p={8} borderBottom={"1px solid #eee"}>
      <Accordion allowToggle>
        {companies?.map((company) => (
          <AccordionItem key={company?.id}>
            <AccordionButton
              columnGap={8}
              p={5}
              justifyContent="space-between"
              alignItems="center"
              cursor="pointer"
              borderRadius={6}
              background={"none"}
              border={"none"}
              _hover={{bg: "#EAECF0"}}>
              <Flex
                w={20}
                h={20}
                alignItems="center"
                justifyContent="center"
                borderRadius={4}
                bg="#15B79E"
                fontSize={18}
                fontWeight={500}
                color="#fff">
                {company?.name?.[0]?.toUpperCase()}
              </Flex>
              <Box fontSize={12} fontWeight={500} color="#101828">
                {company?.name}
              </Box>
              <AccordionIcon ml="auto" fontSize="20px" />
            </AccordionButton>
            <Projects
              company={company}
              onSelectEnvironment={onSelectEnvironment}
            />
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

const Projects = ({company, onSelectEnvironment}) => {
  const projectsQuery = useProjectListQuery({
    params: {company_id: company?.id},
    queryParams: {enabled: Boolean(company?.id)},
  });
  const projects = projectsQuery.data?.projects ?? [];

  return (
    <AccordionPanel pl="12px" mt="4px">
      <Accordion allowToggle>
        {projects.map((project) => (
          <AccordionItem key={project.project_id}>
            <AccordionButton
              columnGap={8}
              p={5}
              justifyContent="space-between"
              alignItems="center"
              cursor="pointer"
              borderRadius={6}
              background={"none"}
              border={"none"}
              _hover={{bg: "#EAECF0"}}>
              <Flex
                w={20}
                h={20}
                alignItems="center"
                justifyContent="center"
                borderRadius={4}
                bg="#15B79E"
                fontSize={18}
                fontWeight={500}
                color="#fff">
                {project.title?.[0]?.toUpperCase()}
              </Flex>
              <Box fontSize={12} fontWeight={500} color="#101828">
                {project.title}
              </Box>
              <AccordionIcon ml="auto" fontSize="20px" />
            </AccordionButton>

            <Environments
              project={project}
              onSelectEnvironment={onSelectEnvironment}
            />
          </AccordionItem>
        ))}
      </Accordion>
    </AccordionPanel>
  );
};

const Environments = ({project, onSelectEnvironment}) => {
  const environmentsQuery = useEnvironmentListQuery({
    params: {project_id: project?.project_id},
    queryParams: {enabled: Boolean(project?.project_id)},
  });
  const environments = environmentsQuery.data?.environments ?? [];

  return (
    <AccordionPanel pl="12px" mt="4px">
      <Box>
        {environments.map((environment) => (
          <Flex
            key={environment.id}
            p={5}
            justifyContent="space-between"
            alignItems="center"
            cursor="pointer"
            borderRadius={6}
            _hover={{bg: "#EAECF0"}}
            onClick={() => onSelectEnvironment(environment)}>
            <Flex columnGap={8} alignItems="center">
              <Flex
                w={20}
                h={20}
                alignItems="center"
                justifyContent="center"
                borderRadius={4}
                bg="#15B79E"
                fontSize={18}
                fontWeight={500}
                color="#fff">
                {environment.name?.[0]?.toUpperCase()}
              </Flex>
              <Box mr={36}>
                <Box fontSize={12} fontWeight={500} color="#101828">
                  {environment.name}
                </Box>
              </Box>
            </Flex>
            <KeyboardArrowDownIcon
              style={{
                alignSelf: "center",
                transform: "rotate(-90deg)",
                fontSize: 20,
              }}
            />
          </Flex>
        ))}
      </Box>
    </AccordionPanel>
  );
};

export default LayoutSidebar;
