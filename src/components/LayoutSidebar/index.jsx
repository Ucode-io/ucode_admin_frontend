import "./style.scss";
import menuElements from "./elements";
import brandLogo from "../../../builder_config/assets/company-logo.svg";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useState, useEffect, useMemo } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NavLink } from "react-router-dom";
import ChildBlock from "./ChildBlock";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { mainActions } from "../../store/main/main.slice";
import constructorTableService from "../../services/constructorTableService";
import { useQuery } from "react-query";
import { tableFolderListToNested } from "../../utils/tableFolderListToNestedLIst";
import useSidebarElements from "../../hooks/useSidebarElements";
import RingLoader from "../Loaders/RingLoader";
import projectService from "../../services/projectService";
import { AiFillFolderAdd, AiOutlinePlus } from "react-icons/ai";
import FolderCreateModal from "../../layouts/MainLayout/FolderCreateModal";
import SidebarRecursiveBlock from "./SidebarRecursiveBlock";
import RecursiveBlock from "./SidebarRecursiveBlock/recursiveBlock";

const LayoutSidebar = ({ favicon, appId, environment }) => {
  const sidebarIsOpen = useSelector(
    (state) => state.main.settingsSidebarIsOpen
  );
  const projectId = useSelector((state) => state.auth.projectId);

  const permissions = useSelector((state) => state.auth.permissions);
  const { elements } = useSidebarElements();
  const dispatch = useDispatch();
  const [openedBlock, setOpenedBlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [childBlockVisible, setChildBlockVisible] = useState(false);

  const closeModal = () => {
    setModalType(null);
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
  const folders = tableFolder?.folders;

  const switchRightSideVisible = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };

  const parentClickHandler = (element) => {
    if (element.children) {
      switchChildBlockHandler(element.id);
      if (!sidebarIsOpen) setSidebarIsOpen(true);
      console.log("this is parent");
      setChildBlockVisible((prev) => !prev);
    } else {
      console.log("this is close");
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

  console.log("environment", environment);

  const hasNestedLevel = sidebarElements?.some((element) => element.children);

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
          {sidebarElements
            // ?.filter((el, idx) =>
            //   idx === 1 ? permissions?.[el.slug]?.["read"] !== false : true
            // )
            ?.map((element, index) => (
              // <div className="parent-block" key={element?.id}>
              //   <NavLink
              //     // to={element?.path}
              //     exact={0}
              //     className={({ isActive }) =>
              //       `nav-element ${
              //         isActive &&
              //         // (element?.children ? "active-with-child" : "active")
              //         "active-with-child"
              //       }`
              //     }
              //     onClick={(e) => {
              //       if (element?.children) e.preventDefault();
              //       parentClickHandler(element);
              //     }}
              //   >
              //     {/* <div className="icon">
              //             <element.icon />
              //           </div> */}

              //     <div className="label">{element.title}</div>
              //     {/* {element?.children && ( */}
              //     <div
              //       className={`arrow-icon ${
              //         openedBlock === element?.id ? "open" : ""
              //       }`}
              //     >
              //       <AiOutlinePlus
              //         onClick={(e) => {
              //           e.preventDefault();
              //           openFolderCreateModal("parent", element);
              //         }}
              //       />
              //       <ExpandMoreIcon />
              //     </div>
              //     {/* )} */}
              //   </NavLink>

              //   {element?.children && (
              //     <ChildBlock
              //       element={element}
              //       isVisible={openedBlock === element.id}
              //     />
              //   )}
              // </div>
              <RecursiveBlock
                key={index}
                element={element}
                parentClickHandler={parentClickHandler}
                openedBlock={openedBlock}
                openFolderCreateModal={openFolderCreateModal}
                // hasNestedLevel={hasNestedLevel}
                environment={environment}
                childBlockVisible={childBlockVisible}
              />
              // <SidebarRecursiveBlock
              //   key={index}
              //   element={element}
              //   parentClickHandler={parentClickHandler}
              //   openedBlock={openedBlock}
              //   openFolderCreateModal={openFolderCreateModal}
              //   hasNestedLevel={hasNestedLevel}
              // />
            ))}
        </div>

        <div className="sidebar-footer">
          {/* <div className="parent-block">
            <NavLink
              className="nav-element"
              to="/home/profile"
              style={{ padding: "10px 0px" }}
            >
              <div className="profile-avatar">{'K'}</div>
              <div className="label">Shaxsiy ma'lumotlar</div>
            </NavLink>
          </div> */}
          {/* <div className="parent-block">
            <div className="nav-element" onClick={logoutHandler}>
              <div className="icon">
                <ExitToAppIcon />
              </div>
              <div className="label" >Logout</div>
            </div>
          </div> */}
        </div>
      </div>
      {(modalType === "create" || modalType === "parent") && (
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
