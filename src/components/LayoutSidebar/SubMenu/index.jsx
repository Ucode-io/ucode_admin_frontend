import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { Box } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import SearchInput from "../../SearchInput";
import RecursiveBlock from "../SidebarRecursiveBlock/RecursiveBlockComponent";
import "./style.scss";

const SubMenu = ({
  child,
  environment,
  setSelectedTable,
  selectedTable,
  element,
  subMenuIsOpen,
  openFolderCreateModal,
  setFolderModalType,
  setTableModal,
  selectedFolder,
  setSubMenuIsOpen,
  setSubSearchText,
  handleOpenNotify,
  setElement,
  selectedApp,
}) => {
  return (
    <div className={`SubMenu ${!subMenuIsOpen ? "right-side-closed" : ""}`}>
      <div className="header" onClick={() => {}}>
        {subMenuIsOpen && <h2>{selectedApp?.label}</h2>}{" "}
        <Box className="buttons">
          <div className="dots">
            <BsThreeDots
              size={13}
              onClick={(e) => {
                handleOpenNotify(e, "FOLDER");
                setSelectedTable(element);
                setElement(element);
              }}
              style={{
                color: environment?.data?.color,
              }}
            />
            <AddIcon
              size={13}
              onClick={(e) => {
                handleOpenNotify(e, "CREATE_TO_FOLDER");
                setSelectedTable(element);
                setElement(element);
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
                  setSelectedTable={setSelectedTable}
                  sidebarIsOpen={subMenuIsOpen}
                  setTableModal={setTableModal}
                  selectedFolder={selectedFolder}
                  selectedTable={selectedTable}
                  handleOpenNotify={handleOpenNotify}
                  setElement={setElement}
                />
              ))}
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default SubMenu;
