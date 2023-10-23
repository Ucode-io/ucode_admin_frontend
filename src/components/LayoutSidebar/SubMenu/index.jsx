import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import {Box, Button, Tooltip} from "@mui/material";
import {BsThreeDots} from "react-icons/bs";
import SearchInput from "../../SearchInput";
import RecursiveBlock from "../SidebarRecursiveBlock/RecursiveBlockComponent";
import "./style.scss";
import RingLoaderWithWrapper from "../../Loaders/RingLoader/RingLoaderWithWrapper";
import PushPinIcon from "@mui/icons-material/PushPin";
import {useDispatch, useSelector} from "react-redux";
import {mainActions} from "../../../store/main/main.slice";
import {useTranslation} from "react-i18next";
import Permissions from "../Components/Permission";
import DocumentsSidebar from "../Components/Documents/DocumentsSidebar";
import Users from "../Components/Users";
import {Container, Draggable} from "react-smooth-dnd";
import Resources from "../Components/Resources";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const SubMenu = ({
  child,
  subMenuIsOpen,
  openFolderCreateModal,
  setFolderModalType,
  setTableModal,
  setSubMenuIsOpen,
  setSubSearchText,
  handleOpenNotify,
  setElement,
  selectedApp,
  isLoading,
  menuStyle,
  setSelectedApp,
  setLinkedTableModal,
  users,
}) => {
  const dispatch = useDispatch();
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const {i18n} = useTranslation();
  const defaultLanguage = i18n.language;
  const menuItem = useSelector((state) => state.menu.menuItem);

  const setPinIsEnabledFunc = (val) => {
    dispatch(mainActions.setPinIsEnabled(val));
  };

  const onDrop = (dropResult, index) => {};

  return (
    <div
      className={`SubMenu ${
        !subMenuIsOpen || !selectedApp?.id ? "right-side-closed" : ""
      }`}
      style={{
        background: menuStyle?.background || "#fff",
      }}
    >
      <div className="body">
        <div className="header" onClick={() => {}}>
          {subMenuIsOpen && (
            <h2
              style={{
                color: menuStyle?.text || "#000",
              }}
            >
              {selectedApp?.attributes?.[`label_${defaultLanguage}`] ??
                selectedApp?.label}
            </h2>
          )}
          <Box className="buttons">
            {/* {selectedApp?.id !== adminId && ( */}
            <div className="dots">
              <BsThreeDots
                size={13}
                onClick={(e) => {
                  handleOpenNotify(e, "FOLDER");
                  setElement(selectedApp);
                }}
                style={{
                  color: menuStyle?.text,
                }}
              />
              {selectedApp?.data?.permission?.write && (
                <AddIcon
                  size={13}
                  onClick={(e) => {
                    handleOpenNotify(e, "CREATE_TO_FOLDER");
                    setElement(selectedApp);
                  }}
                  style={{
                    color: menuStyle?.text,
                  }}
                />
              )}
              <PushPinIcon
                size={13}
                onClick={() => {
                  if (!pinIsEnabled) setPinIsEnabledFunc(true);
                  else setPinIsEnabledFunc(false);
                }}
                style={{
                  rotate: pinIsEnabled ? "" : "45deg",
                  color: menuStyle?.text,
                }}
              />
            </div>
            {/* )} */}
            <div
              className="close-btn"
              onClick={() => {
                setSelectedApp({});
                setSubMenuIsOpen(false);
              }}
            >
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
            {/* <Box className="search">
              <SearchInput
                style={{
                  borderRadius: "8px",
                  width: "100%",
                }}
                onChange={(e) => {
                  setSubSearchText(e);
                }}
              />
            </Box> */}
            {isLoading ? (
              <RingLoaderWithWrapper />
            ) : (
              <div className="nav-block">
                {selectedApp?.id === adminId && (
                  <Permissions
                    menuStyle={menuStyle}
                    menuItem={menuItem}
                    setElement={setElement}
                    level={2}
                  />
                )}
                <Resources
                  menuStyle={menuStyle}
                  setSubMenuIsOpen={setSubMenuIsOpen}
                  level={2}
                  menuItem={menuItem}
                />
                {selectedApp?.id === "9e988322-cffd-484c-9ed6-460d8701551b" && (
                  <Users
                    menuStyle={menuStyle}
                    setSubMenuIsOpen={setSubMenuIsOpen}
                    menuItem={menuItem}
                    level={2}
                    child={users}
                  />
                )}
                <div className="menu-element">
                  <Container
                    style={{
                      height: "calc(100vh - 170px)",
                      overflow: "auto",
                      borderRadius: "6px",
                    }}
                    groupName="subtask"
                    onDrop={onDrop}
                    dropPlaceholder={{className: "drag-row-drop-preview"}}
                  >
                    {selectedApp?.id !==
                      "9e988322-cffd-484c-9ed6-460d8701551b" &&
                      child?.map((element) => (
                        <Draggable key={element.id}>
                          <RecursiveBlock
                            key={element.id}
                            element={element}
                            openFolderCreateModal={openFolderCreateModal}
                            setFolderModalType={setFolderModalType}
                            sidebarIsOpen={subMenuIsOpen}
                            selectedApp={selectedApp}
                            setTableModal={setTableModal}
                            setLinkedTableModal={setLinkedTableModal}
                            handleOpenNotify={handleOpenNotify}
                            setElement={setElement}
                            setSubMenuIsOpen={setSubMenuIsOpen}
                            menuStyle={menuStyle}
                            menuItem={menuItem}
                          />
                        </Draggable>
                      ))}
                  </Container>
                  {selectedApp?.id ===
                    "31a91a86-7ad3-47a6-a172-d33ceaebb35f" && (
                    <DocumentsSidebar
                      menuStyle={menuStyle}
                      setSubMenuIsOpen={setSubMenuIsOpen}
                      menuItem={menuItem}
                      level={2}
                    />
                  )}
                </div>
              </div>
            )}

            {selectedApp?.data?.permission?.write && (
              <Button
                className="menu-button active-with-child"
                onClick={(e) => {
                  handleOpenNotify(e, "CREATE_TO_FOLDER");
                  setElement(selectedApp);
                }}
                openFolderCreateModal={openFolderCreateModal}
                style={{
                  background: menuStyle?.background || "#fff",
                  color: menuStyle?.text || "",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#A8A8A8",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "24px",
                    flex: 1,
                    whiteSpace: "nowrap",
                    columnGap: "8px",
                  }}
                >
                  <AddIcon
                    style={{
                      width: 15,
                      color: menuStyle?.text,
                    }}
                  />
                  Create
                </div>
              </Button>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
};

export default SubMenu;
