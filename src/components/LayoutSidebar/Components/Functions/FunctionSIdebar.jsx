import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useMemo, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { HiOutlineCodeBracket } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFunctionFoldersListQuery } from "../../../../services/functionFolderService";
import { useFunctionsListQuery } from "../../../../services/functionService";
import { store } from "../../../../store";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import FunctionRecursive from "./RecursiveBlock";
import AddIcon from "@mui/icons-material/Add";
import FunctionButtonMenu from "./Components/FunctionButtonMenu";

const functionFolder = {
  label: "Functions",
  type: "USER_FOLDER",
  icon: "documents.svg",
  parent_id: "12",
  id: "25",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const FunctionSidebar = ({
  level = 1,
  menuStyle,
  setSubMenuIsOpen,
  menuItem,
}) => {
  const dispatch = useDispatch();
  const company = store.getState().company;
  const navigate = useNavigate();
  const { functionId } = useParams();
  const [selected, setSelected] = useState({});
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const [menu, setMenu] = useState({ event: "", type: "" });
  const location = useLocation();
  const openMenu = Boolean(menu?.event);

  const handleOpenNotify = (event, type, element) => {
    setMenu({ event: event?.currentTarget, type: type, element });
  };

  const handleCloseNotify = () => {
    setMenu(null);
  };

  const [folderModalIsOpen, setFolderModalIsOpen] = useState(false);
  const [functionModalIsOpen, setFunctionModalIsOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState();
  const [selectedFolder, setSelectedFolder] = useState(null);

  const openFolderModal = (folder) => {
    setSelectedFolder(folder);
    setFolderModalIsOpen(true);
  };

  const closeFolderModal = () => {
    setFolderModalIsOpen(false);
  };

  const openFunctionModal = (folder, func) => {
    setSelectedFolder(folder);
    setSelectedFunction(func);
    setFunctionModalIsOpen(true);
  };

  const closeFunctionModal = () => {
    setFunctionModalIsOpen(false);
  };

  const { data: functionFolders, isLoading: folderLoading } =
    useFunctionFoldersListQuery({
      params: {
        "project-id": company.projectId,
      },
      queryParams: {
        select: (res) => res.function_folders,
      },
    });

  const { data: functions, isLoading: functionLoading } = useFunctionsListQuery(
    {
      params: {
        "project-id": company.projectId,
      },
      queryParams: {
        select: (res) => res.functions,
      },
    }
  );

  const sidebarElements = useMemo(() => {
    return functionFolders?.map((folder) => ({
      ...folder,
      icon: FaFolder,
      type: "FOLDER",
      name: folder.title,
      //   buttons: (
      //     <FunctionFolderButtons
      //       openFunctionModal={openFunctionModal}
      //       openFolderModal={openFolderModal}
      //       folder={folder}
      //       projectId={projectId}
      //     />
      //   ),
      children: functions
        ?.filter((func) => func.function_folder_id === folder.id)
        .map((func) => ({
          ...func,
          name: func.name,
          icon: HiOutlineCodeBracket,
          //   buttons: (
          //     <FunctionButtons
          //       openFunctionModal={openFunctionModal}
          //       func={func}
          //       projectId={projectId}
          //     />
          //   ),
        })),
    }));
  }, [functionFolders, functions]);

  const selectHandler = (id, element) => {
    if (element.type === "FOLDER") return;
    // setValue("request_info.url", element.path);
    // setValue("request_info.title", element.title);
  };

  const clickHandler = (e) => {
    e.stopPropagation();
    dispatch(menuActions.setMenuItem(functionFolder));
    setSelected(functionFolder);
    if (!pinIsEnabled && functionFolder.type !== "USER_FOLDER") {
      setSubMenuIsOpen(false);
    }
    setChildBlockVisible((prev) => !prev);
    navigate(`/main/12`);
  };

  // --CREATE FOLDERS--

  const onSelect = (id, element) => {
    setSelected(element);
    navigate(`${location.pathname}/function/${id}`);
  };
  const rowClickHandler = (id, element) => {
    dispatch(menuActions.setMenuItem(element));
  };

  const activeStyle = {
    backgroundColor:
      functionFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      functionFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 * 5,
  };
  const iconStyle = {
    color:
      functionFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text || "",
  };

  const labelStyle = {
    color:
      functionFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className="nav-element"
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          <div className="label" style={labelStyle}>
            <IconGenerator icon={"key.svg"} size={18} />
            Functions
          </div>
          <Box className="icon_group">
            <Tooltip title="Create folder" placement="top">
              <Box className="extra_icon">
                <AddIcon
                  size={13}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenNotify(e, "CREATE_FOLDER");
                  }}
                  style={iconStyle}
                />
              </Box>
            </Tooltip>
          </Box>
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {sidebarElements?.map((element) => (
          <FunctionRecursive
            key={element.id}
            level={level + 1}
            element={element}
            menuStyle={menuStyle}
            onRowClick={rowClickHandler}
            selected={selected}
            handleOpenNotify={handleOpenNotify}
            onSelect={onSelect}
            setSelected={setSelected}
            menuItem={menuItem}
          />
        ))}
      </Collapse>

      <FunctionButtonMenu
        selected={selected}
        openMenu={openMenu}
        menu={menu?.event}
        menuType={menu?.type}
        element={menu?.element}
        handleCloseNotify={handleCloseNotify}
      />
    </Box>
  );
};

export default FunctionSidebar;
