import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Box } from "@mui/material";
import RecursiveBlock from "../SidebarRecursiveBlock/recursiveBlock";
import FolderModal from "../folderModal";
import "./style.scss";

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
}) => {
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
        <div className="cloes-btn">
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
