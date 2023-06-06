import { Box } from "@mui/material";
import RecursiveBlock from "../SidebarRecursiveBlock/RecursiveBlockComponent";
import "./style.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ButtonsMenu from "../MenuButtons";
import { useParams } from "react-router-dom";
import menuSettingsService from "../../../services/menuSettingsService";
import { useQueryClient } from "react-query";

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
  setMicrofrontendModal,
}) => {
  const { appId } = useParams();
  const queryClient = useQueryClient();
  const [menu, setMenu] = useState();
  const [menuType, setMenuType] = useState();
  const handleOpenNotify = (event, type) => {
    setMenu(event?.currentTarget);
    setMenuType(type);
  };
  const openMenu = Boolean(menu);
  const handleCloseNotify = () => {
    setMenu(null);
  };
  const deleteFolder = (element) => {
    menuSettingsService
      .delete(element.id)
      .then(() => {
        // getListMenu(element.id);
        queryClient.refetchQueries(["MENU"], element?.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={`SubMenu ${!subMenuIsOpen ? "right-side-closed" : ""}`}>
      <div className="header" onClick={() => {}}>
        {subMenuIsOpen && <h2>{element?.label}</h2>}{" "}
        <Box className="buttons">
          <div className="dots" onClick={() => setSubMenuIsOpen(false)}>
            <BsThreeDots
              size={13}
              onClick={(e) => {
                handleOpenNotify(e, "FOLDER");
              }}
              style={{
                color: environment?.data?.color,
              }}
            />
            <AddIcon
              size={13}
              onClick={(e) => {
                handleOpenNotify(e, "CREATE_TO_FOLDER");
              }}
              style={{
                color: environment?.data?.color,
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
                  setMicrofrontendModal={setMicrofrontendModal}
                  selectedTable={selectedTable}
                />
              ))}
              {/* {folderModalType === "folder" && (
                <FolderModal
                  closeModal={closeFolderModal}
                  modalType={folderModalType}
                  selectedTable={selectedTable}
                  getAppById={getAppById}
                  computedFolderList={computedFolderList}
                />
              )} */}
              <ButtonsMenu
                element={element}
                menu={menu}
                openMenu={openMenu}
                handleCloseNotify={handleCloseNotify}
                openFolderCreateModal={openFolderCreateModal}
                deleteFolder={deleteFolder}
                menuType={menuType}
                setFolderModalType={setFolderModalType}
                setSelectedTable={setSelectedTable}
                appId={appId}
                setTableModal={setTableModal}
                setMicrofrontendModal={setMicrofrontendModal}
              />
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default SubMenu;
