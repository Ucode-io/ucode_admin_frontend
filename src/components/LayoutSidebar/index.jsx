import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import brandLogo from "../../../builder_config/assets/company-logo.svg";
import FolderCreateModal from "../../layouts/MainLayout/FolderCreateModal";
import constructorTableService from "../../services/constructorTableService";
import projectService from "../../services/projectService";
import { mainActions } from "../../store/main/main.slice";
import { tableFolderListToNested } from "../../utils/tableFolderListToNestedLIst";
import RecursiveBlock from "./SidebarRecursiveBlock/recursiveBlock";
import FolderModal from "./folderModal";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./style.scss";
import { Box, Collapse, ListItemButton, ListItemText } from "@mui/material";
import SearchInput from "../SearchInput";
import MenuButton from "./menuButton";

const LayoutSidebar = ({
  elements,
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
  const [openedBlock, setOpenedBlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [folderModalType, setFolderModalType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  console.log('sssssssss', selectedTable)

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

  const computedTableList = useMemo(() => {
    return tableFolderListToNested([...(files ?? []), ...elements], {
      undefinedChildren: true,
    });
  }, [tableFolder?.folders, elements, files]);

  const computedFolderList = useMemo(() => {
    return tableFolderListToNested([...(files ?? [])], {
      undefinedChildren: true,
    });
  }, [files]);

  useEffect(() => {
    if (!computedTableList) setLoading(true);
    else setLoading(false);
  }, [computedTableList]);

  useEffect(() => {
    if (!sidebarIsOpen) setOpenedBlock(null);
  }, [sidebarIsOpen]);

  const { data: projectInfo } = useQuery(
    ["GET_PROJECT_BY_ID", projectId],
    () => {
      return projectService.getById(projectId);
    }
  );

  return (
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

      <Box className="search">
        <SearchInput
          style={{
            borderRadius: "8px",
            width: "100%",
          }}
        />
      </Box>

      <ListItemButton
        onClick={handleClick}
        style={{
          borderBottom: !open && "1px solid #F0F0F0",
        }}
      >
        <ListItemText primary="Admin" />
        {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
      </ListItemButton>
      <Collapse
        in={open}
        unmountOnExit
        timeout={{
          enter: 300,
          exit: 200,
        }}
        className="sidebar-collapse"
      >
        <div
          className="nav-block"
          style={{
            // height: `calc(100vh - ${57}px)`,
            background: environment?.data?.background,
          }}
        >
          <div className="menu-element">
            {computedTableList?.map((element, index) => (
              <RecursiveBlock
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
              />
            ))}
            {folderModalType === "folder" && (
              <FolderModal
                closeModal={closeFolderModal}
                modalType={folderModalType}
                selectedTable={selectedTable}
                getAppById={getAppById}
                computedFolderList={computedFolderList}
              />
            )}
          </div>
          <MenuButton openFolderCreateModal={openFolderCreateModal} />
          {/* <div className="sidebar-footer"></div> */}
        </div>
      </Collapse>

      {(modalType === "create" ||
        modalType === "parent" ||
        modalType === "update") && (
        <FolderCreateModal
          modalType={modalType}
          closeModal={closeModal}
          appId={appId}
          selectedFolder={selectedFolder}
        />
      )}
    </div>
  );
};

export default LayoutSidebar;
