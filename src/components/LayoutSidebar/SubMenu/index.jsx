import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { Box } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import SearchInput from "../../SearchInput";
import RecursiveBlock from "../SidebarRecursiveBlock/RecursiveBlockComponent";
import "./style.scss";
import RingLoaderWithWrapper from "../../Loaders/RingLoader/RingLoaderWithWrapper";
import PushPinIcon from "@mui/icons-material/PushPin";
import { useDispatch, useSelector } from "react-redux";
import { mainActions } from "../../../store/main/main.slice";

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
  menuStyle,
}) => {
  const dispatch = useDispatch();
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);

  const setPinIsEnabledFunc = (val) => {
    dispatch(mainActions.setPinIsEnabled(val));
  };
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
              {selectedApp?.label}
            </h2>
          )}{" "}
          <Box className="buttons">
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
                      setSubMenuIsOpen={setSubMenuIsOpen}
                      menuStyle={menuStyle}
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
