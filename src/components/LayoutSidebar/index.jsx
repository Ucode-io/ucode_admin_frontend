import "./style.scss";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {forwardRef, useEffect, useState} from "react";
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
import menuService, {useMenuGetByIdQuery, useMenuListQuery,} from "../../services/menuService";
import {useMenuSettingGetByIdQuery} from "../../services/menuSettingService";
import menuSettingsService from "../../services/menuSettingsService";
import {useProjectGetByIdQuery, useProjectListQuery} from "../../services/projectService";
import {store} from "../../store";
import {mainActions} from "../../store/main/main.slice";
import {applyDrag} from "../../utils/applyDrag";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import AppSidebar from "./AppSidebarComponent";
import FolderModal from "./FolderModalComponent";
import ButtonsMenu from "./MenuButtons";
import SubMenu from "./SubMenu";
import WikiFolderCreateModal from "../../layouts/MainLayout/WikiFolderCreateModal";
import {useSearchParams} from "react-router-dom";
import {AIMenu, useAIChat} from "../ProfilePanel/AIChat";
import {useChatwoot} from "../ProfilePanel/Chatwoot";
import WebsiteModal from "../../layouts/MainLayout/WebsiteModal";
import {Box, Button, Flex, Popover, PopoverContent, PopoverTrigger, useDisclosure} from "@chakra-ui/react";
import {SidebarActionTooltip, SidebarAppTooltip} from "@/components/LayoutSidebar/sidebar-app-tooltip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NewProfilePanel from "@/components/ProfilePanel/NewProfileMenu";
import {useCompanyListQuery} from "@/services/companyService";
import {ChevronLeftIcon} from "@chakra-ui/icons";
import {useEnvironmentListQuery} from "@/services/environmentService";
import {companyActions} from "@/store/company/company.slice";
import authService from "@/services/auth/authService";
import {authActions} from "@/store/auth/auth.slice";
import InlineSVG from "react-inlinesvg";

const LayoutSidebar = ({appId}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

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
  const [sidebarAnchorEl, setSidebarAnchor] = useState(null);
  const {data: projectInfo} = useProjectGetByIdQuery({projectId});

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
      enabled: Boolean(appId),
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
  const handleMenuSettingModalOpen = () => {
    setMenuSettingModalOpen(true);
  };
  const closeMenuSettingModal = () => {
    setMenuSettingModalOpen(null);
  };
  const handleTemplateModalOpen = () => {
    setTemplateModalOpen(true);
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

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
        .getByID({
          menuId: searchParams.get("menuId"),
        })
        .then((res) => {
          setMenuItem(res);
        });
    }
  }, []);

  const itemConditionalProps = {};
  if (!sidebarIsOpen) {
    itemConditionalProps.onMouseEnter = () => dispatch(mainActions.setSidebarHighlightedMenu('create'))
  }

  const getActionProps = (id) => sidebarIsOpen ? {} : {
    onMouseEnter: () => dispatch(mainActions.setSidebarHighlightedAction(id))
  }

  return (
    <>
      <Flex
        position="relative"
        w={sidebarIsOpen ? 240 : 52}
        flexDirection='column'
        transition='width 200ms ease-out'
        borderRight="1px solid #EAECF0"
        bg={menuStyle?.background ?? "#fff"}
      >
        <Flex
          position="absolute"
          zIndex={999}
          w={25}
          h={25}
          alignItems='center'
          justifyContent='center'
          border="1px solid #e5e5e5"
          borderRadius='50%'
          top={18}
          right={0}
          transform={sidebarIsOpen ? "translateX(50%)" : "translateX(60%)"}
          bg='#fff'
          cursor="pointer"
          onClick={() => dispatch(mainActions.setSettingsSidebarIsOpen(!sidebarIsOpen))}
        >
          {sidebarIsOpen
            ? <KeyboardDoubleArrowLeftIcon style={{color: "#007aff"}}/>
            : <KeyboardDoubleArrowRightIcon style={{color: "#007aff"}}/>
          }
        </Flex>

        <Flex pl={8} py={10} h={56} borderBottom="1px solid #EAECF0"
              alignItems='center'>
          <Header sidebarIsOpen={sidebarIsOpen} projectInfo={projectInfo}/>
        </Flex>

        <Box pt={20} maxH={`calc(100vh - ${sidebarIsOpen ? 140 : 240}px)`} overflowY='auto' overflowX='hidden'>
          {!menuList && <RingLoaderWithWrapper style={{height: "100%"}}/>}

          {Array.isArray(menuList) &&
            <div className="menu-element" onMouseLeave={() => dispatch(mainActions.setSidebarHighlightedMenu(null))}>
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
                  />
                ))}
              </Container>

              {Boolean(permissions?.menu_button) &&
                <SidebarAppTooltip id='create' title='Create'>
                  <Flex
                    position="relative"
                    h={36}
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor='pointer'
                    mx={8}
                    onClick={(e) => {
                      handleOpenNotify(e, "CREATE", true);
                      dispatch(mainActions.setSidebarHighlightedMenu(null));
                    }}
                    {...itemConditionalProps}
                  >
                    <Flex
                      position="absolute"
                      w={36}
                      h={36}
                      alignItems='center'
                      justifyContent='center'
                    >
                      <InlineSVG src="/img/plus-icon.svg" color="#475467" />
                    </Flex>

                    <Box whiteSpace='nowrap' color={menuStyle?.text ?? "#475467"} pl={48} fontSize={14}>
                      Create
                    </Box>
                  </Flex>
                </SidebarAppTooltip>
              }
            </div>
          }
        </Box>

        <Flex display={sidebarIsOpen ? "flex" : "block"} mt='auto' py={16} alignItems='center'
              columnGap={16} px={8} borderTop={sidebarIsOpen ? "1px solid #EAECF0" : "none"}
              onMouseLeave={sidebarIsOpen ? undefined : () => dispatch(mainActions.setSidebarHighlightedAction(null))}
        >
          <SidebarActionTooltip id="documentation" title="Documentation">
            <Flex
              as='a'
              href='https://ucode.gitbook.io/ucode-docs'
              target='_blank'
              w={sidebarIsOpen ? "100%" : 36}
              h={36}
              alignItems='center'
              justifyContent='center'
              borderRadius={6}
              _hover={{bg: "#EAECF0"}}
              cursor='pointer'
              mb={sidebarIsOpen ? 0 : 4}
              {...getActionProps('documentation')}
            >
              <img src="/img/documentation.svg" alt="merge"/>
            </Flex>
          </SidebarActionTooltip>

          <Box display={sidebarIsOpen ? "block" : "none"} w='1px' h={20} bg='#D0D5DD'/>
          <SidebarActionTooltip id="chat" title="Chat">
            <Chatwoot open={sidebarIsOpen} {...getActionProps('chat')} />
          </SidebarActionTooltip>
          <Box display={sidebarIsOpen ? "block" : "none"} w='1px' h={20} bg='#D0D5DD'/>
          <SidebarActionTooltip id="ai-chat" title="AI Chat">
            <AIChat sidebarOpen={sidebarIsOpen} {...getActionProps('ai-chat')} />
          </SidebarActionTooltip>
          <Box display={sidebarIsOpen ? "block" : "none"} w='1px' h={20} bg='#D0D5DD'/>
          <NewProfilePanel
            sidebarAnchorEl={sidebarAnchorEl}
            setSidebarAnchor={setSidebarAnchor}
            handleMenuSettingModalOpen={handleMenuSettingModalOpen}
            handleTemplateModalOpen={handleTemplateModalOpen}
          />
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
      />

      {menu?.type?.length ? (
        <ButtonsMenu
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
      {templateModal && <TemplateModal closeModal={closeTemplateModal}/>}
      {menuSettingModal && (
        <MenuSettingModal closeModal={closeMenuSettingModal}/>
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
      alignItems='center'
      justifyContent='center'
      borderRadius={6}
      _hover={{bg: "#EAECF0"}}
      cursor='pointer'
      mb={open ? 0 : 4}
      onClick={originalButtonFunction}
      {...props}
    >
      <img src="/img/message-text-square.svg" alt="chat"/>
    </Flex>
  )
})

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
    handleSendClick
  } = useAIChat()

  return (
    <>
      <Flex
        w={sidebarOpen ? "100%" : 36}
        h={36}
        alignItems='center'
        justifyContent='center'
        borderRadius={6}
        _hover={{bg: "#EAECF0"}}
        cursor='pointer'
        onClick={handleClick}
        mb={sidebarOpen ? 0 : 4}
        ref={ref}
        {...props}
      >
        <img src="/img/magic-wand.svg" alt="magic"/>
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
  )
})

const Header = ({sidebarIsOpen, projectInfo}) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const userId = useSelector((state) => state.auth?.userId);
  const companiesQuery = useCompanyListQuery({
    params: {owner_id: userId}, queryParams: {enabled: Boolean(userId)}
  });
  const projectsQuery = useProjectListQuery({
    params: {company_id: selectedCompanyId},
    queryParams: {enabled: Boolean(selectedCompanyId)}
  });
  const environmentsQuery = useEnvironmentListQuery({
    params: {project_id: selectedProjectId},
    queryParams: {enabled: Boolean(selectedProjectId)}
  });

  const companies = companiesQuery.data?.companies ?? [];
  const projects = projectsQuery.data?.projects ?? [];
  const environments = environmentsQuery.data?.environments ?? [];

  const handleClose = () => {
    onClose();
    setSelectedCompanyId(null);
  }

  const onSelectEnvironment = (environment) => {
    const params = {
      refresh_token: auth?.refreshToken,
      env_id: companies.find((company) => company.id === selectedCompanyId).environmentId,
      project_id: projects.find((project) => project.project_id === selectedProjectId).projectId,
      for_env: true,
    }

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
  }

  return (
    <Popover offset={[sidebarIsOpen ? 15 : 95, 5]} isOpen={isOpen} onClose={handleClose}>
      <PopoverTrigger>
        <Flex w='calc(100% - 8px)' maxWidth='200px' position='relative' overflow='hidden' alignItems='center'
              p={8} borderRadius={8} bg={isOpen ? "#EAECF0" : "#fff"} _hover={{bg: "#EAECF0"}} cursor="pointer"
              onClick={() => !isOpen ? onOpen() : null}>
          <Flex w={36} h={36} position="absolute" left={0} alignItems='center' justifyContent='center'>
            {Boolean(projectInfo?.logo) &&
              <img src={projectInfo?.logo} alt="" width={20} height={20}/>
            }

            {!projectInfo?.logo &&
              <Flex w={20} h={20} borderRadius={4} bg='#06AED4' color='#fff' alignItems='center'
                    justifyContent='center'
                    fontSize={14} fontWeight={500}>
                {projectInfo?.title?.[0]?.toUpperCase()}
              </Flex>
            }
          </Flex>

          <Box pl={36} whiteSpace='nowrap' color='#344054' fontSize={15} fontWeight={500} overflow='hidden'
               textOverflow='ellipsis'>
            {projectInfo?.title}
          </Box>
          <KeyboardArrowDownIcon style={{marginLeft: 'auto', fontSize: 22,}}/>
        </Flex>
      </PopoverTrigger>
      <PopoverContent w='211px' bg='#fff' padding={6} borderRadius={8} border='1px solid #EAECF0' outline='none'
                      boxShadow='0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814' zIndex={999}>
        {!selectedCompanyId &&
          <Companies companies={companies} onSelectCompany={(company) => setSelectedCompanyId(company.id)}/>
        }
        {Boolean(selectedCompanyId) && !selectedProjectId &&
          <Projects
            company={companies.find((company) => company.id === selectedCompanyId)}
            projects={projects}
            onSelectProject={(project) => setSelectedProjectId(project.project_id)}
            onBackClick={() => setSelectedCompanyId(null)}
          />
        }
        {Boolean(selectedCompanyId) && Boolean(selectedProjectId) &&
          <Environments
            project={projects.find((project) => project.project_id === selectedProjectId)}
            environments={environments}
            onBackClick={() => setSelectedProjectId(null)}
            onSelectEnvironment={onSelectEnvironment}
          />
        }
      </PopoverContent>
    </Popover>
  )
}

const Companies = ({companies, onSelectCompany}) => (
  <Box>
    <Box>
      {companies.map((company) =>
        <Flex key={company.id} p={8} justifyContent='space-between' alignItems='center' cursor="pointer"
              borderRadius={6} _hover={{bg: "#EAECF0"}} onClick={() => onSelectCompany(company)}>
          <Flex columnGap={8} alignItems='center'>
            <Flex w={36} h={36} alignItems='center' justifyContent='center' borderRadius={6} bg='#15B79E'
                  fontSize={18} fontWeight={500} color='#fff'>
              {company.name?.[0]}
            </Flex>
            <Box mr={36}>
              <Box fontSize={12} fontWeight={500} color='#101828'>
                {company.name}
              </Box>
            </Box>
          </Flex>
          <KeyboardArrowDownIcon style={{alignSelf: "center", transform: "rotate(-90deg)", fontSize: 20}}/>
        </Flex>
      )}
    </Box>

    <Button w='100%' mt='8px' borderRadius={8} border='1px solid #D0D5DD' p={8} bg='#fff' color='#344054'
            fontSize={14} fontWeight={600} boxShadow='0px 1px 2px 0px #1018280D'>
      Create Team
    </Button>
  </Box>
);

const Projects = ({company, projects, onSelectProject, onBackClick}) => (
  <Box>
    <Flex columnGap='4px' alignItems='center' color='#475467' fontWeight={600} fontSize={14} onClick={onBackClick}
          cursor='pointer'>
      <ChevronLeftIcon fontSize={24}/> {company?.name}
    </Flex>
    <Box mt='8px'>
      {projects.map((project) =>
        <Flex key={project.project_id} p={8} justifyContent='space-between' alignItems='center' cursor="pointer"
              borderRadius={6} _hover={{bg: "#EAECF0"}} onClick={() => onSelectProject(project)}>
          <Flex columnGap={8} alignItems='center'>
            <Flex w={36} h={36} alignItems='center' justifyContent='center' borderRadius={6} bg='#15B79E'
                  fontSize={18} fontWeight={500} color='#fff'>
              {project.title?.[0]}
            </Flex>
            <Box mr={36}>
              <Box fontSize={12} fontWeight={500} color='#101828'>
                {project.title}
              </Box>
            </Box>
          </Flex>
          <KeyboardArrowDownIcon style={{alignSelf: "center", transform: "rotate(-90deg)", fontSize: 20}}/>
        </Flex>
      )}
    </Box>

    <Button w='100%' mt='8px' borderRadius={8} border='1px solid #D0D5DD' p={8} bg='#fff' color='#344054'
            fontSize={14} fontWeight={600} boxShadow='0px 1px 2px 0px #1018280D'>
      Create Project
    </Button>
  </Box>
);

const Environments = ({project, environments, onBackClick, onSelectEnvironment}) => (
  <Box>
    <Flex columnGap='4px' alignItems='center' color='#475467' fontWeight={600} fontSize={14} onClick={onBackClick}
          cursor='pointer'>
      <ChevronLeftIcon fontSize={24}/> {project?.title}
    </Flex>
    <Box mt='8px'>
      {environments.map((environment) =>
        <Flex key={environment.id} p={8} justifyContent='space-between' alignItems='center' cursor="pointer"
              borderRadius={6} _hover={{bg: "#EAECF0"}} onClick={() => onSelectEnvironment(environment)}>
          <Flex columnGap={8} alignItems='center'>
            <Flex w={36} h={36} alignItems='center' justifyContent='center' borderRadius={6} bg='#15B79E'
                  fontSize={18} fontWeight={500} color='#fff'>
              {environment.name?.[0]}
            </Flex>
            <Box mr={36}>
              <Box fontSize={12} fontWeight={500} color='#101828'>
                {environment.name}
              </Box>
            </Box>
          </Flex>
          <KeyboardArrowDownIcon style={{alignSelf: "center", transform: "rotate(-90deg)", fontSize: 20}}/>
        </Flex>
      )}
    </Box>

    <Button w='100%' mt='8px' borderRadius={8} border='1px solid #D0D5DD' p={8} bg='#fff' color='#344054'
            fontSize={14} fontWeight={600} boxShadow='0px 1px 2px 0px #1018280D'>
      Create Environment
    </Button>
  </Box>
);

export default LayoutSidebar;
