import AddIcon from "@mui/icons-material/Add";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import brandLogo from "../../../builder_config/assets/company-logo.svg";
import FolderCreateModal from "../../layouts/MainLayout/FolderCreateModal";
import constructorTableService from "../../services/constructorTableService";
import menuService, { useMenuListQuery } from "../../services/menuService";
import projectService from "../../services/projectService";
import { mainActions } from "../../store/main/main.slice";
import { tableFolderListToNested } from "../../utils/tableFolderListToNestedLIst";
import ProfilePanel from "../ProfilePanel";
import SearchInput from "../SearchInput";
import FolderModal from "./FolderModal";
import "./style.scss";
import menuSettingsService from "../../services/menuSettingsService";
import TableLinkModal from "../../layouts/MainLayout/TableLinkModal";
import SubMenu from "./SubMenu";
import MicrofrontendLinkModal from "../../layouts/MainLayout/MicrofrontendLinkModal";
import MenuButtonComponent from "./MenuButtonComponent";
import AppSidebar from "./AppSidebarComponent";
import { applyDrag } from "../../utils/applyDrag";
import { Container } from "react-smooth-dnd";

const LayoutSidebar = ({
  favicon,
  appId,
  environment,
  getAppById,
  setSelectedTable,
  selectedTable,
}) => {
  const sidebarIsOpen = useSelector(
    (state) => state.main.settingsSidebarIsOpen
  );
  const projectId = useSelector((state) => state.auth.projectId);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openedBlock, setOpenedBlock] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [folderModalType, setFolderModalType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [menuList, setMenuList] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tableModal, setTableModalOpen] = useState(false);
  const [microfrontendModal, setMicrofrontendModalOpen] = useState(false);
  const [child, setChild] = useState();
  const [element, setElement] = useState();
  const [subMenuIsOpen, setSubMenuIsOpen] = useState(false);

  const { isLoading } = useMenuListQuery({
    params: {
      parent_id: appId,
    },
    queryParams: {
      cacheTime: 10,
      enabled: Boolean(appId),
      onSuccess: (res) => {
        setChild(res.menus);
        setSubMenuIsOpen(true);
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

  const { data: tableFolder } = useQuery(["GET_TABLE_FOLDER"], () => {
    return constructorTableService.getFolderList();
  });

  const getMenuList = () => {
    menuSettingsService.getList().then((res) => {
      setMenuList(res);
    });
  };

  const setSidebarIsOpen = (val) => {
    dispatch(mainActions.setSettingsSidebarIsOpen(val));
  };

  const switchRightSideVisible = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };

  const parentClickHandler = (element) => {
    if (element.children) {
      switchChildBlockHandler(element.id);
      if (!sidebarIsOpen) setSidebarIsOpen(true);
      setChildBlockVisible((prev) => !prev);
    } else {
      setOpenedBlock(null);
    }
  };

  const switchChildBlockHandler = (id) => {
    setOpenedBlock((prev) => (prev === id ? null : id));
  };

  const files = useMemo(() => {
    return [
      ...(tableFolder?.folders?.map((item) => ({
        ...item,
        parent_id: item?.parent_id ? item?.parent_id : "0",
      })) ?? []),
      {
        id: "0",
        title: "Root",
      },
    ];
  }, [tableFolder?.folders]);

  const computedFolderList = useMemo(() => {
    return tableFolderListToNested([...(files ?? [])], {
      undefinedChildren: true,
    });
  }, [files]);

  useEffect(() => {
    if (!sidebarIsOpen) setOpenedBlock(null);
  }, [sidebarIsOpen]);

  useEffect(() => {
    getMenuList();
  }, []);

  const { data: projectInfo } = useQuery(
    ["GET_PROJECT_BY_ID", projectId],
    () => {
      return projectService.getById(projectId);
    }
  );

  const onDrop = (dropResult) => {
    const result = applyDrag(menuList?.menus[0]?.child_menus, dropResult);
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
              <img src={favicon ?? brandLogo} alt="logo" />
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
            <MenuOpenIcon />
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
              />
            </Box>

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
                // height: `calc(100vh - ${57}px)`,
                background: environment?.data?.background,
              }}
            >
              <div className="menu-element">
                <Container
                  dragHandleSelector=".column-drag-handle"
                  onDrop={onDrop}
                >
                  {menuList?.menus[0]?.child_menus?.map((element, index) => (
                    <AppSidebar
                      key={index}
                      element={element}
                      parentClickHandler={parentClickHandler}
                      openedBlock={openedBlock}
                      openFolderCreateModal={openFolderCreateModal}
                      environment={environment}
                      childBlockVisible={childBlockVisible}
                      tableFolder={tableFolder?.folders}
                      setFolderModalType={setFolderModalType}
                      setSelectedTable={setSelectedTable}
                      sidebarIsOpen={sidebarIsOpen}
                      getMenuList={getMenuList}
                      setTableModal={setTableModal}
                      selectedFolder={selectedFolder}
                      setElement={setElement}
                      setSubMenuIsOpen={setSubMenuIsOpen}
                      subMenuIsOpen={subMenuIsOpen}
                      setMicrofrontendModal={setMicrofrontendModal}
                    />
                  ))}
                  {folderModalType === "folder" && (
                    <FolderModal
                      closeModal={closeFolderModal}
                      modalType={folderModalType}
                      selectedTable={selectedTable}
                      getAppById={getAppById}
                      computedFolderList={computedFolderList}
                      menuList={menuList}
                      element={element}
                    />
                  )}
                </Container>
              </div>
              {/* <div className="sidebar-footer"></div> */}
            </div>
            <MenuButtonComponent
              title={"Create folder"}
              icon={<AddIcon />}
              openFolderCreateModal={openFolderCreateModal}
              onClick={(e) => {
                openFolderCreateModal("create");
              }}
              sidebarIsOpen={sidebarIsOpen}
            />
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
          />
        )}
        {microfrontendModal && (
          <MicrofrontendLinkModal
            closeModal={closeMicrofrontendModal}
            selectedFolder={selectedFolder}
          />
        )}
      </div>
      <SubMenu
        child={child}
        appId={appId}
        environment={environment}
        setSelectedTable={setSelectedTable}
        selectedTable={selectedTable}
        getAppById={getAppById}
        computedFolderList={computedFolderList}
        element={element}
        subMenuIsOpen={subMenuIsOpen}
        setSubMenuIsOpen={setSubMenuIsOpen}
        parentClickHandler={parentClickHandler}
        openFolderCreateModal={openFolderCreateModal}
        childBlockVisible={childBlockVisible}
        setFolderModalType={setFolderModalType}
        setTableModal={setTableModal}
        selectedFolder={selectedFolder}
        folderModalType={folderModalType}
        closeFolderModal={closeFolderModal}
        setMicrofrontendModal={setMicrofrontendModal}
        menuList={menuList}
      />
    </>
  );
};

export default LayoutSidebar;
