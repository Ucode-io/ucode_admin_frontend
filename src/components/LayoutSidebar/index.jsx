import AddIcon from "@mui/icons-material/Add";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Box, Button, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "react-smooth-dnd";
import { UdevsLogo } from "../../assets/icons/icon";
import FolderCreateModal from "../../layouts/MainLayout/FolderCreateModal";
import MenuSettingModal from "../../layouts/MainLayout/MenuSettingModal";
import MicrofrontendLinkModal from "../../layouts/MainLayout/MicrofrontendLinkModal";
import TableLinkModal from "../../layouts/MainLayout/TableLinkModal";
import WebPageLinkModal from "../../layouts/MainLayout/WebPageLinkModal";
import menuService, { useMenuListQuery } from "../../services/menuService";
import { useMenuSettingGetByIdQuery } from "../../services/menuSettingService";
import menuSettingsService from "../../services/menuSettingsService";
import { store } from "../../store";
import { mainActions } from "../../store/main/main.slice";
import { applyDrag } from "../../utils/applyDrag";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import NewProfilePanel from "../ProfilePanel/NewProfileMenu";
import SearchInput from "../SearchInput";
import AppSidebar from "./AppSidebarComponent";
import FolderModal from "./FolderModalComponent";
import MenuButtonComponent from "./MenuButtonComponent";
import ButtonsMenu from "./MenuButtons";
import SubMenu from "./SubMenu";
import "./style.scss";
import { useProjectGetByIdQuery } from "../../services/projectService";
import MenuBox from "./Components/MenuBox";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const LayoutSidebar = ({ appId }) => {
  const sidebarIsOpen = useSelector(
    (state) => state.main.settingsSidebarIsOpen
  );
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const selectedMenuTemplate = store.getState().menu.menuTemplate;
  const projectId = store.getState().company.projectId;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState(null);
  const [folderModalType, setFolderModalType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [menuList, setMenuList] = useState();
  const [tableModal, setTableModalOpen] = useState(false);
  const [microfrontendModal, setMicrofrontendModalOpen] = useState(false);
  const [webPageModal, setWebPageModalOpen] = useState(false);
  const [menuSettingModal, setMenuSettingModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState();
  const [child, setChild] = useState();
  const [element, setElement] = useState();
  const [searchText, setSearchText] = useState();
  const [subSearchText, setSubSearchText] = useState();
  const [subMenuIsOpen, setSubMenuIsOpen] = useState(false);
  const [menu, setMenu] = useState({ event: "", type: "" });
  const openSidebarMenu = Boolean(menu?.event);
  const [sidebarAnchorEl, setSidebarAnchor] = useState(null);

  const handleOpenNotify = (event, type) => {
    setMenu({ event: event?.currentTarget, type: type });
  };

  const handleCloseNotify = () => {
    setMenu(null);
  };

  const { isLoading } = useMenuListQuery({
    params: {
      parent_id: appId,
      search: subSearchText,
    },
    queryParams: {
      enabled: Boolean(appId),
      onSuccess: (res) => {
        setChild(res.menus);
      },
    },
  });
  const { data: menuTemplate } = useMenuSettingGetByIdQuery({
    params: {
      template_id:
        selectedMenuTemplate?.id || "f922bb4c-3c4e-40d4-95d5-c30b7d8280e3",
    },
    menuId: "adea69cd-9968-4ad0-8e43-327f6600abfd",
  });
  const menuStyle = menuTemplate?.menu_template;
  const permissions = useSelector((state) => state.auth.globalPermissions);
  const handleRouter = () => {
    navigate(`/main/${appId}/chat`);
  };

  const setTableModal = (element) => {
    setTableModalOpen(true);
    setSelectedFolder(element);
  };
  const closeTableModal = () => {
    setTableModalOpen(null);
  };
  const setMicrofrontendModal = (element) => {
    setMicrofrontendModalOpen(true);
    setSelectedFolder(element);
  };
  const closeMicrofrontendModal = () => {
    setMicrofrontendModalOpen(null);
  };
  const setWebPageModal = (element) => {
    setWebPageModalOpen(true);
    setSelectedFolder(element);
  };
  const closeWebPageModal = () => {
    setWebPageModalOpen(null);
  };
  const handleMenuSettingModalOpen = (element) => {
    setMenuSettingModalOpen(true);
  };
  const closeMenuSettingModal = () => {
    setMenuSettingModalOpen(null);
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
        search: searchText,
        parent_id: "c57eedc3-a954-4262-a0af-376c65b5a284",
      })
      .then((res) => {
        // setMenuList([admin, ...res.menus]);
        setMenuList(res.menus);
      })
      .catch((error) => {
        console.log("error", error);
      });
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
  }, [searchText]);

  useEffect(() => {
    setSelectedApp(menuList?.find((item) => item?.id === appId));
  }, [menuList]);

  useEffect(() => {
    if (
      selectedApp?.type === "FOLDER" ||
      (selectedApp?.type === "USER_FOLDER" && pinIsEnabled)
    )
      setSubMenuIsOpen(true);
  }, [selectedApp]);

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

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

  return (
    <>
      <div
        className={`LayoutSidebar ${!sidebarIsOpen ? "right-side-closed" : ""}`}
        style={{
          background: menuStyle?.background || "#fff",
        }}
      >
        <div className="header">
          <div
            className="brand"
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          >
            {projectInfo?.logo ? (
              <img src={projectInfo?.logo} alt="" width={40} height={40} />
            ) : (
              <UdevsLogo fill={"#007AFF"} />
            )}

            {!sidebarIsOpen && (
              <Button
                style={{
                  position: "absolute",
                  zIndex: "9",
                  left: "58px",
                  width: "20px",
                  height: "20px",
                  minWidth: "20px",
                  borderRadius: "50%",
                  border: "1px solid #e5e5e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                }}
              >
                <KeyboardDoubleArrowRightIcon />
              </Button>
            )}

            {sidebarIsOpen && (
              <h2
                style={{
                  marginLeft: "8px",
                  color: menuStyle?.text || "#000",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {projectInfo?.title}
              </h2>
            )}
          </div>

          {sidebarIsOpen && (
            <Button onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
              <KeyboardDoubleArrowLeftIcon />
            </Button>
          )}
        </div>

        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            height: "85vh",
            overflow: "hidden",
          }}
        >
          <Box className="search">
            <SearchInput
              style={{
                borderRadius: "8px",
                width: "100%",
              }}
              onChange={(e) => {
                setSearchText(e);
              }}
            />
          </Box>
          <div
            style={{
              overflow: "auto",
            }}
          >
            {!menuList ? (
              <RingLoaderWithWrapper />
            ) : (
              <Box>
                {permissions?.chat && (
                  <MenuButtonComponent
                    title={"Chat"}
                    arrow
                    icon={
                      <ChatBubbleIcon
                        style={{
                          width:
                            menuTemplate?.icon_size === "SMALL"
                              ? 10
                              : menuTemplate?.icon_size === "MEDIUM"
                              ? 15
                              : 18 || 18,
                          color: menuStyle?.text || "",
                        }}
                      />
                    }
                    openFolderCreateModal={openFolderCreateModal}
                    onClick={(e) => {
                      handleRouter();
                    }}
                    sidebarIsOpen={sidebarIsOpen}
                    style={{
                      background: menuStyle?.background || "#fff",
                      color: menuStyle?.text || "",
                    }}
                  />
                )}
                <div
                  className="nav-block"
                  style={{
                    background: menuStyle?.background || "#fff",
                    color: menuStyle?.text || "#000",
                  }}
                >
                  <div className="menu-element">
                    <Container
                      dragHandleSelector=".column-drag-handle"
                      onDrop={onDrop}
                    >
                      {menuList &&
                        menuList?.map((element, index) => (
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
                  </div>
                </div>
                {permissions?.menu_button && (
                  <MenuButtonComponent
                    title={"Create"}
                    icon={
                      <AddIcon
                        style={{
                          width:
                            menuTemplate?.icon_size === "SMALL"
                              ? 10
                              : menuTemplate?.icon_size === "MEDIUM"
                              ? 15
                              : 18 || 18,
                          color: menuStyle?.text,
                        }}
                      />
                    }
                    openFolderCreateModal={openFolderCreateModal}
                    onClick={(e) => {
                      handleOpenNotify(e, "ROOT");
                    }}
                    sidebarIsOpen={sidebarIsOpen}
                    style={{
                      background: menuStyle?.background || "#fff",
                      color: menuStyle?.text || "",
                    }}
                  />
                )}
                <Divider />
              </Box>
            )}
          </div>
        </Box>
        <MenuBox
          title={"Profile"}
          openFolderCreateModal={openFolderCreateModal}
          children={
            <NewProfilePanel
              sidebarAnchorEl={sidebarAnchorEl}
              setSidebarAnchor={setSidebarAnchor}
              handleMenuSettingModalOpen={handleMenuSettingModalOpen}
            />
          }
          onClick={(e) => {
            e.stopPropagation();
            setSidebarAnchor(true);
          }}
          style={{
            background: menuStyle?.background || "#fff",
            color: menuStyle?.text || "#000",
            height: "40px",
            cursor: "pointer",
          }}
          sidebarIsOpen={sidebarIsOpen}
        />

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
        {tableModal && (
          <TableLinkModal
            closeModal={closeTableModal}
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
        {webPageModal && (
          <WebPageLinkModal
            closeModal={closeWebPageModal}
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
      </div>
      <SubMenu
        child={child}
        subMenuIsOpen={subMenuIsOpen}
        setSubMenuIsOpen={setSubMenuIsOpen}
        openFolderCreateModal={openFolderCreateModal}
        setFolderModalType={setFolderModalType}
        setTableModal={setTableModal}
        setSubSearchText={setSubSearchText}
        handleOpenNotify={handleOpenNotify}
        setElement={setElement}
        selectedApp={selectedApp}
        isLoading={isLoading}
        menuStyle={menuStyle}
        setChild={setChild}
        setSelectedApp={setSelectedApp}
      />
      <ButtonsMenu
        element={element}
        menu={menu?.event}
        openMenu={openSidebarMenu}
        handleCloseNotify={handleCloseNotify}
        openFolderCreateModal={openFolderCreateModal}
        menuType={menu?.type}
        setFolderModalType={setFolderModalType}
        appId={appId}
        setTableModal={setTableModal}
        setMicrofrontendModal={setMicrofrontendModal}
        setWebPageModal={setWebPageModal}
        deleteFolder={deleteFolder}
      />
      {menuSettingModal && (
        <MenuSettingModal closeModal={closeMenuSettingModal} />
      )}
    </>
  );
};

export default LayoutSidebar;
