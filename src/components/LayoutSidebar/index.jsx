import AddIcon from "@mui/icons-material/Add";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import brandLogo from "../../../builder_config/assets/Udevs.svg";
import FolderCreateModal from "../../layouts/MainLayout/FolderCreateModal";
import menuService, { useMenuListQuery } from "../../services/menuService";
import projectService from "../../services/projectService";
import { mainActions } from "../../store/main/main.slice";
import ProfilePanel from "../ProfilePanel";
import SearchInput from "../SearchInput";
import FolderModal from "./FolderModalComponent";
import "./style.scss";
import menuSettingsService from "../../services/menuSettingsService";
import TableLinkModal from "../../layouts/MainLayout/TableLinkModal";
import SubMenu from "./SubMenu";
import MicrofrontendLinkModal from "../../layouts/MainLayout/MicrofrontendLinkModal";
import MenuButtonComponent from "./MenuButtonComponent";
import AppSidebar from "./AppSidebarComponent";
import { applyDrag } from "../../utils/applyDrag";
import { Container } from "react-smooth-dnd";
import ButtonsMenu from "./MenuButtons";
import WebPageLinkModal from "../../layouts/MainLayout/WebPageLinkModal";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import { OpenCloseSvg } from "../../assets/icons/icon";

const LayoutSidebar = ({ favicon, appId, environment }) => {
  const sidebarIsOpen = useSelector(
    (state) => state.main.settingsSidebarIsOpen
  );
  const projectId = useSelector((state) => state.auth.projectId);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState(null);
  const [folderModalType, setFolderModalType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [menuList, setMenuList] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tableModal, setTableModalOpen] = useState(false);
  const [microfrontendModal, setMicrofrontendModalOpen] = useState(false);
  const [webPageModal, setWebPageModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState();
  const [child, setChild] = useState();
  const [element, setElement] = useState();
  const [searchText, setSearchText] = useState();
  const [subSearchText, setSubSearchText] = useState();
  const [subMenuIsOpen, setSubMenuIsOpen] = useState(false);
  const [menu, setMenu] = useState({ event: "", type: "" });
  const openSidebarMenu = Boolean(menu?.event);

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
      // cacheTime: 10,
      enabled: Boolean(appId),
      onSuccess: (res) => {
        setChild(res.menus);
      },
    },
  });

  const handleRouter = () => {
    navigate(`/main/${appId}/chat`);
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
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
        setMenuList(res);
      })
      .finally((error) => {
        console.log("error", error);
      });
  };

  const setSidebarIsOpen = (val) => {
    dispatch(mainActions.setSettingsSidebarIsOpen(val));
  };

  const switchRightSideVisible = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };

  useEffect(() => {
    getMenuList();
  }, [searchText]);

  useEffect(() => {
    setSelectedApp(menuList?.menus?.find((item) => item?.id === appId));
  }, [menuList]);

  useEffect(() => {
    if (selectedApp?.type === "FOLDER" && pinIsEnabled) setSubMenuIsOpen(true);
  }, [selectedApp]);

  const { data: projectInfo } = useQuery(
    ["GET_PROJECT_BY_ID", projectId],
    () => {
      return projectService.getById(projectId);
    }
  );

  const onDrop = (dropResult) => {
    const result = applyDrag(menuList?.menus, dropResult);
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
      >
        <div
          className="header"
          onClick={() => {
            switchRightSideVisible();
          }}
        >
          <div className="brand">
            <div className="brand-logo" onClick={switchRightSideVisible}>
              <img
                src={favicon ?? brandLogo}
                alt="logo"
                width={"40px"}
                height={"40px"}
              />
            </div>
            {sidebarIsOpen && (
              <h2
                style={{
                  marginLeft: "8px",
                }}
              >
                {projectInfo?.title}
              </h2>
            )}{" "}
          </div>
          <div className="cloes-btn" onClick={switchRightSideVisible}>
            <OpenCloseSvg />
          </div>
        </div>

        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(100% - 56px)",
          }}
        >
          <div>
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

            {!menuList?.menus ? (
              <RingLoaderWithWrapper />
            ) : (
              <>
                <MenuButtonComponent
                  title={"Chat"}
                  icon={<ChatBubbleIcon />}
                  openFolderCreateModal={openFolderCreateModal}
                  onClick={(e) => {
                    handleRouter();
                  }}
                  sidebarIsOpen={sidebarIsOpen}
                />
                <div
                  className="nav-block"
                  style={{
                    background: environment?.data?.background,
                  }}
                >
                  <div className="menu-element">
                    <Container
                      dragHandleSelector=".column-drag-handle"
                      onDrop={onDrop}
                    >
                      {menuList?.menus &&
                        menuList?.menus?.map((element, index) => (
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
                          />
                        ))}
                    </Container>
                  </div>
                </div>
                <MenuButtonComponent
                  title={"Create"}
                  icon={<AddIcon />}
                  openFolderCreateModal={openFolderCreateModal}
                  onClick={(e) => {
                    handleOpenNotify(e, "ROOT");
                  }}
                  sidebarIsOpen={sidebarIsOpen}
                />
                <Divider />
              </>
            )}
          </div>

          <MenuButtonComponent
            title={"Profile"}
            openFolderCreateModal={openFolderCreateModal}
            onClick={(e) => {
              anchorEl ? setAnchorEl(null) : openMenu(e);
            }}
            children={<ProfilePanel anchorEl={anchorEl} />}
            sidebarIsOpen={sidebarIsOpen}
          />
        </Box>

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
        environment={environment}
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
    </>
  );
};

export default LayoutSidebar;
