import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useEffect, useMemo, useState } from "react";
import { AiFillFolderAdd } from "react-icons/ai";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import brandLogo from "../../../builder_config/assets/company-logo.svg";
import FolderCreateModal from "../../layouts/MainLayout/FolderCreateModal";
import constructorTableService from "../../services/constructorTableService";
import projectService from "../../services/projectService";
import { mainActions } from "../../store/main/main.slice";
import { applyDrag } from "../../utils/applyDrag";
import { tableFolderListToNested } from "../../utils/tableFolderListToNestedLIst";
import RecursiveBlock from "./SidebarRecursiveBlock/recursiveBlock";
import FolderModal from "./folderModal";
import "./style.scss";

const LayoutSidebar = ({
  elements,
  favicon,
  appId,
  environment,
  getAppById,
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
  const [selectedTable, setSelectedTable] = useState(null);

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

  const computedTableList = useMemo(() => {
    return tableFolderListToNested(
      [...(tableFolder?.folders ?? []), ...elements],
      {
        undefinedChildren: true,
      }
    );
  }, [tableFolder?.folders, elements]);

  const sidebarElements = useMemo(() => computedTableList, [computedTableList]);

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

  const onDrop = (dropResult) => {
    const result = applyDrag(sidebarElements, dropResult);
    const computedTables = [
      ...result.map((el) => ({
        table_id: el.id,
        is_visible: Boolean(el.is_visible),
        is_own_table: Boolean(el.is_own_table),
      })),
    ];
    console.log("result", result);
    // if (result) {
    //   applicationService
    //     .update({
    //       ...applicationElements,
    //       tables: computedTables,
    //     })
    //     .then(() => {
    //       dispatch(fetchConstructorTableListAction(appId));
    //     });
    // }
  };

  return (
    <div
      className={`LayoutSidebar ${!sidebarIsOpen ? "right-side-closed" : ""}`}
    >
      <div
        className="header"
        onClick={() => {
          // setRightBlockVisible((prev) => !prev);
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
          <AiFillFolderAdd
            size={19}
            onClick={(e) => {
              e.stopPropagation();
              openFolderCreateModal("create");
            }}
          />
          <MenuOpenIcon />
        </div>
      </div>

      <div
        className="nav-block"
        style={{
          height: `calc(100vh - ${57}px)`,
          background: environment?.data?.background,
        }}
      >
        <div className="menu-element">
          {sidebarElements?.map((element, index) => (
            <RecursiveBlock
              key={index}
              element={element}
              parentClickHandler={parentClickHandler}
              openedBlock={openedBlock}
              openFolderCreateModal={openFolderCreateModal}
              environment={environment}
              childBlockVisible={childBlockVisible}
              onDrop={onDrop}
              tableFolder={tableFolder?.folders}
              setFolderModalType={setFolderModalType}
              setSelectedTable={setSelectedTable}
              sidebarIsOpen={sidebarIsOpen}
            />
          ))}
          {folderModalType === "folder" && (
            <FolderModal
              closeModal={closeFolderModal}
              tableFolder={tableFolder?.folders}
              modalType={folderModalType}
              selectedTable={selectedTable}
              getAppById={getAppById}
            />
          )}
        </div>

        <div className="sidebar-footer"></div>
      </div>
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
