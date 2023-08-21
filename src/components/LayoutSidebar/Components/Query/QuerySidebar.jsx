import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useMemo, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaDatabase, FaFolder } from "react-icons/fa";
import { TbApi } from "react-icons/tb";
import { useQueries, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import queryService, {
  useQueryFolderDeleteMutation,
  useQueryFoldersListQuery,
} from "../../../../services/query.service";
import { store } from "../../../../store";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import { listToNested } from "../../../../utils/listToNestedList";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import QueryFolderCreateModal from "./Modal/QueryFolderCreateModal";
import QueryButtonMenu from "./QueryButtonMenu";
import QueryRecursive from "./RecursiveBlock";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const queryFolder = {
  label: "Queries",
  type: "USER_FOLDER",
  icon: "documents.svg",
  parent_id: adminId,
  id: "90",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const QuerySidebar = ({ level = 1, menuStyle, setSubMenuIsOpen, menuItem }) => {
  const dispatch = useDispatch();
  const company = store.getState().company;
  const navigate = useNavigate();
  const [selected, setSelected] = useState({});
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const [menu, setMenu] = useState({ event: "", type: "" });
  const openMenu = Boolean(menu?.event);
  const queryClient = useQueryClient();
  const handleOpenNotify = (event, type, element) => {
    setMenu({ event: event?.currentTarget, type: type, element });
  };
  const handleCloseNotify = () => {
    setMenu(null);
  };

  const [openedFolders, setOpenedFolders] = useState([]);
  const [folderModalType, setFolderModalType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const openFolderModal = (folder, type) => {
    setSelectedFolder(folder);
    setFolderModalType(type);
  };
  const closeFolderModal = () => {
    setSelectedFolder(null);
    setFolderModalType(null);
  };

  // FOLDERS QUERY

  const { data: folders, isLoading: foldersLoading } =
    useQueryFoldersListQuery();
  const computedFolders = useMemo(() => {
    const list = [];
    folders?.folders?.forEach((folder) => {
      list.push({
        ...folder,
        icon: FaFolder,
        type: "FOLDER",
        hasChild: true,
        name: folder.title,
        buttons: (
          <BsThreeDots
            size={13}
            onClick={(e) => {
              e?.stopPropagation();
              handleOpenNotify(e, "FOLDER", folder);
            }}
            style={{
              color:
                menuItem?.id === selected?.id
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
            }}
          />
        ),
      });
    });
    return list;
  }, [folders?.folders]);

  // QUERY QUERIES

  const queryQueries = useMemo(() => {
    return openedFolders.map((folderId) => ({
      queryKey: [
        "QUERIES",
        {
          "folder-id": folderId,
        },
      ],
      queryFn: () => queryService.getListQuery({ "folder-id": folderId }),
    }));
  }, [openedFolders]);

  const queryResults = useQueries(queryQueries);

  const queries = useMemo(() => {
    const list = [];
    queryResults.forEach((query) => {
      query.data?.queries?.forEach((query) => {
        list.push({
          ...query,
          parent_id: query.folder_id,
          name: query.title,
          icon: query.query_type === "REST" ? TbApi : FaDatabase,
          //   buttons: <QueryButtons queryId={query.id} />,
        });
      });
    });
    return list;
  }, [queryResults]);

  const computedQueryList = useMemo(() => {
    return listToNested([...(computedFolders ?? []), ...queries], {
      undefinedChildren: true,
    });
  }, [computedFolders, queries]);

  const sidebarElements = useMemo(() => computedQueryList, [computedQueryList]);

  const { mutate: deleteFolder, isLoading: deleteLoading } =
    useQueryFolderDeleteMutation({
      onSuccess: () => {
        dispatch(showAlert("Success deleted", "success"));
        queryClient.refetchQueries("QUERY_FOLDERS");
      },
    });

  // --ROW CLICK HANDLER--

  const rowClickHandler = (id, element) => {
    if (element.type !== "FOLDER" || openedFolders.includes(id)) return;
    setOpenedFolders((prev) => [...prev, id]);
  };

  // --RENDER--

  const clickHandler = (e) => {
    e.stopPropagation();
    dispatch(menuActions.setMenuItem(queryFolder));
    setSelected(queryFolder);
    if (!pinIsEnabled && queryFolder.type !== "USER_FOLDER") {
      setSubMenuIsOpen(false);
    }
    setChildBlockVisible((prev) => !prev);
    navigate(`/main/${adminId}`);
  };

  // --CREATE FOLDERS--

  const onSelect = (id, element) => {
    setSelected(element);
    dispatch(menuActions.setMenuItem(element));
    if (element.type === "FOLDER") return;
    // navigate(`/project/${projectId}/queries/${id}`);
  };

  const activeStyle = {
    backgroundColor:
      queryFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      queryFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 + 10,
  };
  const iconStyle = {
    color:
      queryFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text || "",
  };

  const labelStyle = {
    color:
      queryFolder?.id === menuItem?.id
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
            <IconGenerator icon={"code.svg"} size={18} />
            {queryFolder.label}
          </div>
          <Box className="icon_group">
            <Tooltip title="Create folder" placement="top">
              <Box className="extra_icon">
                <AddIcon
                  size={13}
                  onClick={(e) => {
                    e.stopPropagation();
                    openFolderModal({}, "CREATE");
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
          <QueryRecursive
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

      <QueryButtonMenu
        openMenu={openMenu}
        menu={menu?.event}
        menuType={menu?.type}
        element={menu?.element}
        handleCloseNotify={handleCloseNotify}
        openFolderModal={openFolderModal}
        deleteFolder={deleteFolder}
      />
      {selectedFolder && (
        <QueryFolderCreateModal
          folder={selectedFolder}
          closeModal={closeFolderModal}
          formType={folderModalType}
        />
      )}
    </Box>
  );
};

export default QuerySidebar;
