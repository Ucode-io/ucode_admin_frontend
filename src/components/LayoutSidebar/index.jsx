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
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {AIMenu, useAIChat} from "../ProfilePanel/AIChat";
import {useChatwoot} from "../ProfilePanel/Chatwoot";
import WebsiteModal from "../../layouts/MainLayout/WebsiteModal";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import {
  SidebarActionTooltip,
  SidebarAppTooltip,
} from "@/components/LayoutSidebar/sidebar-app-tooltip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useCompanyListQuery} from "@/services/companyService";
import {AccordionButton, AccordionIcon, SettingsIcon} from "@chakra-ui/icons";
import {useEnvironmentListQuery} from "@/services/environmentService";
import {companyActions} from "@/store/company/company.slice";
import authService from "@/services/auth/authService";
import {authActions} from "@/store/auth/auth.slice";
import InlineSVG from "react-inlinesvg";
import {Logout} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {languagesActions} from "../../store/globalLanguages/globalLanguages.slice";
import {Modal} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import {clearDB, getAllFromDB} from "../../utils/languageDB";
import {generateLangaugeText} from "../../utils/generateLanguageText";

const LayoutSidebar = ({toggleDarkMode = () => {}, darkMode}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);
  const {appId} = useParams();
  console.log("appIdappId", appId);
  const sidebarIsOpen = useSelector(
    (state) => state.main.settingsSidebarIsOpen
  );
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const subMenuIsOpen = useSelector((state) => state.main.subMenuIsOpen);

  const projectId = store.getState().company.projectId;

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState(null);
  const [folderModalType, setFolderModalType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [menuList, setMenuList] = useState();
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
  const [menu, setMenu] = useState({event: "", type: "", root: false});
  const openSidebarMenu = Boolean(menu?.event);
  const {data: projectInfo} = useProjectGetByIdQuery({projectId});
  const [menuLanguages, setMenuLanguages] = useState(null);
  const [profileSettingLan, setProfileSettingLan] = useState(null);
  const [languageData, setLanguageData] = useState(null);
  const {i18n} = useTranslation();

  const setSubMenuIsOpen = (val) => {
    dispatch(mainActions.setSubMenuIsOpen(val));
  };

  const {data: menuById} = useMenuGetByIdQuery({
    menuId: "c57eedc3-a954-4262-a0af-376c65b5a284",
  });

  const {data: menuTemplate} = useMenuSettingGetByIdQuery({
    params: {
      template_id:
        menuById?.attributes?.menu_settings_id ||
        "f922bb4c-3c4e-40d4-95d5-c30b7d8280e3",
    },
    menuId: "adea69cd-9968-4ad0-8e43-327f6600abfd",
  });

  const menuStyle = menuTemplate?.menu_template;
  const permissions = useSelector((state) => state.auth.globalPermissions);

  const handleOpenNotify = (event, type, root) => {
    setMenu({event: event?.currentTarget, type: type, root: root});
  };
  const handleCloseNotify = () => {
    setMenu(null);
  };

  const {isLoading} = useMenuListQuery({
    params: {
      parent_id: appId || menuItem?.id,
      search: subSearchText,
    },
    queryParams: {
      enabled: Boolean(appId) || Boolean(menuItem?.id),
      onSuccess: (res) => {
        setChild(res.menus ?? []);
      },
    },
  });

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
    menuSettingsService
      .getList({
        parent_id: "c57eedc3-a954-4262-a0af-376c65b5a284",
      })
      .then((res) => {
        setMenuList(res.menus);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const {isLoadingUser} = useQuery(
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
    const result = applyDrag(menuList, dropResult);
    if (result) {
      menuService
        .updateOrder({
          menus: result,
        })
        .then(() => {
          getMenuList();
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

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: searchParams.get("menuId"),
    queryParams: {
      enabled: Boolean(searchParams.get("menuId")),
      onSuccess: (res) => {
        setMenuItem(res);
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

  return (
    <>
      <Flex
        id="layoutSidebar"
        position="relative"
        w={sidebarIsOpen ? 240 : 52}
        flexDirection="column"
        transition="width 200ms ease-out"
        borderRight="1px solid #EAECF0"
        bg={menuStyle?.background ?? "#fff"}>
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
          }>
          {sidebarIsOpen ? (
            <KeyboardDoubleArrowLeftIcon style={{color: "#007aff"}} />
          ) : (
            <KeyboardDoubleArrowRightIcon style={{color: "#007aff"}} />
          )}
        </Flex>

        <Flex
          pl={8}
          py={10}
          h={45}
          borderBottom="1px solid #EAECF0"
          alignItems="center">
          <Header
            sidebarIsOpen={sidebarIsOpen}
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            projectInfo={projectInfo}
            menuLanguages={menuLanguages}
            profileSettingLan={profileSettingLan}
          />
        </Flex>

        <Box
          pt={8}
          maxH={`calc(100vh - ${sidebarIsOpen ? 140 : 240}px)`}
          overflowY="auto"
          overflowX="hidden">
          {!menuList && <RingLoaderWithWrapper style={{height: "100%"}} />}

          {Array.isArray(menuList) && (
            <div
              className="menu-element"
              onMouseLeave={() =>
                dispatch(mainActions.setSidebarHighlightedMenu(null))
              }>
              <Container
                dragHandleSelector=".column-drag-handle"
                onDrop={onDrop}>
                {menuList.map((element, index) => (
                  <AppSidebar
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
                  />
                ))}
              </Container>

              {Boolean(permissions?.menu_button) && (
                <SidebarAppTooltip id="create" title="Create">
                  <Flex
                    position="relative"
                    h={36}
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer"
                    mx={8}
                    onClick={(e) => {
                      handleOpenNotify(e, "CREATE", true);
                      dispatch(mainActions.setSidebarHighlightedMenu(null));
                    }}
                    {...itemConditionalProps}>
                    <Flex
                      position="absolute"
                      w={36}
                      h={36}
                      alignItems="center"
                      justifyContent="center">
                      <InlineSVG src="/img/plus-icon.svg" color="#475467" />
                    </Flex>

                    <Box
                      whiteSpace="nowrap"
                      color={
                        (menuStyle?.text === "#A8A8A8" ? null : "#475467") ??
                        "#475467"
                      }
                      pl={48}
                      fontSize={14}>
                      {generateLangaugeText(
                        menuLanguages,
                        i18n?.language,
                        "Create"
                      ) || "Create"}
                    </Box>
                  </Flex>
                </SidebarAppTooltip>
              )}
            </div>
          )}
        </Box>

        <Flex
          display={sidebarIsOpen ? "flex" : "block"}
          mt="auto"
          py={4}
          alignItems="center"
          columnGap={16}
          px={8}
          borderTop={sidebarIsOpen ? "1px solid #EAECF0" : "none"}
          onMouseLeave={
            sidebarIsOpen
              ? undefined
              : () => dispatch(mainActions.setSidebarHighlightedAction(null))
          }>
          <SidebarActionTooltip id="documentation" title="Documentation">
            <Flex
              as="a"
              href="https://ucode.gitbook.io/ucode-docs"
              target="_blank"
              w={sidebarIsOpen ? "100%" : 36}
              h={36}
              alignItems="center"
              justifyContent="center"
              borderRadius={6}
              _hover={{bg: "#EAECF0"}}
              cursor="pointer"
              mb={sidebarIsOpen ? 0 : 4}
              {...getActionProps("documentation")}>
              <img src="/img/documentation.svg" alt="merge" />
            </Flex>
          </SidebarActionTooltip>

          <Box
            display={sidebarIsOpen ? "block" : "none"}
            w="1px"
            h={20}
            bg="#D0D5DD"
          />
          <SidebarActionTooltip id="chat" title="Chat">
            <Chatwoot open={sidebarIsOpen} {...getActionProps("chat")} />
          </SidebarActionTooltip>
          <Box
            display={sidebarIsOpen ? "block" : "none"}
            w="1px"
            h={20}
            bg="#D0D5DD"
          />
          <SidebarActionTooltip id="ai-chat" title="AI Chat">
            <AIChat
              sidebarOpen={sidebarIsOpen}
              {...getActionProps("ai-chat")}
            />
          </SidebarActionTooltip>
        </Flex>

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

      <SubMenu
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
        setChild={setChild}
        setSelectedApp={setSelectedApp}
        menuItem={menuItem}
        languageData={languageData}
      />

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
    </>
  );
};

const Chatwoot = forwardRef(({open, ...props}, ref) => {
  const {originalButtonFunction} = useChatwoot();

  return (
    <Flex
      ref={ref}
      w={open ? "100%" : 36}
      h={36}
      alignItems="center"
      justifyContent="center"
      borderRadius={6}
      _hover={{bg: "#EAECF0"}}
      cursor="pointer"
      mb={open ? 0 : 4}
      {...props}
      onClick={originalButtonFunction}>
      <img src="/img/message-text-square.svg" alt="chat" />
    </Flex>
  );
});

const AIChat = forwardRef(({sidebarOpen, ...props}, ref) => {
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
  } = useAIChat();

  return (
    <>
      <Flex
        w={sidebarOpen ? "100%" : 36}
        h={36}
        alignItems="center"
        justifyContent="center"
        borderRadius={6}
        _hover={{bg: "#EAECF0"}}
        cursor="pointer"
        mb={sidebarOpen ? 0 : 4}
        ref={ref}
        {...props}
        onClick={handleClick}>
        <img src="/img/magic-wand.svg" alt="magic" />
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
      />
    </>
  );
});

const Header = ({
  sidebarIsOpen,
  projectInfo,
  menuLanguages,
  profileSettingLan,
}) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const {isOpen, onOpen, onClose} = useDisclosure();

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
      .updateToken({...params, env_id: environment.id}, {...params})
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
      onClose={handleClose}>
      <PopoverTrigger>
        <Flex
          w="calc(100% - 8px)"
          maxWidth="200px"
          position="relative"
          overflow="hidden"
          alignItems="center"
          p={5}
          borderRadius={8}
          bg="#fff"
          _hover={{bg: "#EAECF0"}}
          cursor="pointer"
          onClick={() => (!isOpen ? onOpen() : null)}>
          <Flex
            w={36}
            h={36}
            position="absolute"
            left={0}
            alignItems="center"
            justifyContent="center">
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
                fontWeight={500}>
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
            textOverflow="ellipsis">
            {projectInfo?.title}
          </Box>
          <KeyboardArrowDownIcon style={{marginLeft: "auto", fontSize: 20}} />
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        w="300px"
        bg="#fff"
        borderRadius={8}
        border="1px solid #EAECF0"
        outline="none"
        boxShadow="0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814"
        zIndex={999}>
        <>
          <ProfilePanel menuLanguages={menuLanguages} onClose={onClose} />
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

const ProfilePanel = ({onClose = () => {}, menuLanguages}) => {
  const navigate = useNavigate();
  const state = useSelector((state) => state.auth);
  const {i18n} = useTranslation();

  return (
    <Box p={"12px"} borderBottom={"1px solid #eee"}>
      <Flex gap={10} alignItems={"center"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          w={36}
          h={36}
          style={{border: "1px solid #eee", fontSize: "24px"}}
          borderRadius={"5px"}
          bg={"#04ADD4"}
          color={"white"}>
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
        _hover={{background: "#eeee"}}
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
        onClick={() => {
          navigate(`/settings/auth/matrix/profile/crossed`);
          onClose();
        }}>
        <SettingsIcon style={{color: "#475467"}} />
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
        i18n.changeLanguage(languages?.[0]?.slug);
      } else if (languages?.length > 1) {
        if (!defaultLanguage) {
          dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
          i18n.changeLanguage(languages?.[0]?.slug);
        } else if (defaultLanguage && isLanguageExist) {
          dispatch(languagesActions.setDefaultLanguage(defaultLanguage));
          i18n.changeLanguage(defaultLanguage);
        } else {
          dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
          i18n.changeLanguage(languages?.[0]?.slug);
        }
      }
    }
  };

  useEffect(() => {
    getDefaultLanguage();
  }, [languages?.length]);

  const logoutClickHandler = () => {
    clearDB();
    store.dispatch(authActions.logout());
    dispatch(companyActions.setCompanies([]));
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(languagesActions.setDefaultLanguage(lang));
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
        {companies.map((company) => (
          <AccordionItem key={company.id}>
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
                {company.name?.[0]?.toUpperCase()}
              </Flex>
              <Box fontSize={12} fontWeight={500} color="#101828">
                {company.name}
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
