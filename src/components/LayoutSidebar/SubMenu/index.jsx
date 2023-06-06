import { Box } from "@mui/material";
import RecursiveBlock from "../SidebarRecursiveBlock/recursiveBlock";
import FolderModal from "../folderModal";
import "./style.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";

const SubMenu = ({
  child,
  environment,
  setSelectedTable,
  selectedTable,
  getAppById,
  computedFolderList,
  element,
  subMenuIsOpen,
  parentClickHandler,
  openFolderCreateModal,
  childBlockVisible,
  setFolderModalType,
  setTableModal,
  selectedFolder,
  folderModalType,
  closeFolderModal,
  setSubMenuIsOpen,
}) => {
  const [menu, setMenu] = useState();
  const [menuType, setMenuType] = useState();
  const handleOpenNotify = (event, type) => {
    setMenu(event?.currentTarget);
    setMenuType(type);
  };
  return (
    <div className={`SubMenu ${!subMenuIsOpen ? "right-side-closed" : ""}`}>
      <div className="header" onClick={() => {}}>
        <div className="brand">
          {subMenuIsOpen && (
            <h2
              style={{
                marginLeft: "8px",
              }}
            >
              {element?.label}
            </h2>
          )}{" "}
        </div>
        <Box className="buttons">
          <div className="dots" onClick={() => setSubMenuIsOpen(false)}>
            <BsThreeDots
              size={13}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "folder");
              }}
              style={{
                color: environment?.data?.color,
              }}
            />
            <AddIcon
              size={13}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNotify(e, "tableMenu");
              }}
            />
          </div>
          <div className="close-btn" onClick={() => setSubMenuIsOpen(false)}>
            <ClearIcon />
          </div>
        </Box>
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
          <div
            className="nav-block"
            style={{
              // height: `calc(100vh - ${57}px)`,
              background: environment?.data?.background,
            }}
          >
            <div className="menu-element">
              {child?.map((element, index) => (
                <RecursiveBlock
                  key={index}
                  element={element}
                  parentClickHandler={parentClickHandler}
                  openFolderCreateModal={openFolderCreateModal}
                  environment={environment}
                  childBlockVisible={childBlockVisible}
                  setFolderModalType={setFolderModalType}
                  setSelectedTable={setSelectedTable}
                  sidebarIsOpen={subMenuIsOpen}
                  setTableModal={setTableModal}
                  selectedFolder={selectedFolder}
                  menu={menu}
                  setMenu={setMenu}
                  menuType={menuType}
                  handleOpenNotify={handleOpenNotify}
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
          </div>
        </div>
      </Box>
    </div>
  );
};

export default SubMenu;
