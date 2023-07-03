import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { Box } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import SearchInput from "../../SearchInput";
import RecursiveBlock from "../SidebarRecursiveBlock/RecursiveBlockComponent";
import "./style.scss";
import RingLoaderWithWrapper from "../../Loaders/RingLoader/RingLoaderWithWrapper";
import PushPinIcon from "@mui/icons-material/PushPin";
const SubMenu = ({
  child,
  environment,
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
  setPin,
  pin,
}) => {
  return (
    <div
      className={`SubMenu ${
        !subMenuIsOpen || !selectedApp?.id ? "right-side-closed" : ""
      }`}
    >
      <div className="body">
        <div className="header" onClick={() => {}}>
          {subMenuIsOpen && <h2>{selectedApp?.label}</h2>}{" "}
          <Box className="buttons">
            <div className="dots">
              <BsThreeDots
                size={13}
                onClick={(e) => {
                  handleOpenNotify(e, "FOLDER");
                  setElement(selectedApp);
                }}
                style={{
                  color: environment?.data?.color,
                }}
              />
              <AddIcon
                size={13}
                onClick={(e) => {
                  handleOpenNotify(e, "CREATE_TO_FOLDER");
                  setElement(selectedApp);
                }}
                style={{
                  color: environment?.data?.color,
                }}
              />
              <PushPinIcon
                size={13}
                onClick={() => {
                  setPin((prev) => !prev);
                }}
                style={{
                  rotate: pin ? "" : "45deg",
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
            <Box className="search">
              <SearchInput
                style={{
                  borderRadius: "8px",
                  width: "100%",
                }}
                onChange={(e) => {
                  setSubSearchText(e);
                }}
              />
            </Box>
            {isLoading ? (
              <RingLoaderWithWrapper />
            ) : (
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
                      openFolderCreateModal={openFolderCreateModal}
                      environment={environment}
                      setFolderModalType={setFolderModalType}
                      sidebarIsOpen={subMenuIsOpen}
                      setTableModal={setTableModal}
                      handleOpenNotify={handleOpenNotify}
                      setElement={setElement}
                      pin={pin}
                      setSubMenuIsOpen={setSubMenuIsOpen}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
};

export default SubMenu;
