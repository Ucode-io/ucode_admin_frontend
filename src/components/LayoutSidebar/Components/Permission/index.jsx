import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import clientTypeServiceV2 from "../../../../services/auth/clientTypeServiceV2";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import RecursiveBlock from "../../SidebarRecursiveBlock/RecursiveBlockComponent";
import "../../style.scss";
import AddIcon from "@mui/icons-material/Add";
import FolderCreateModal from "./Modal/FolderCreateModal";
import { updateLevel } from "../../../../utils/level";
import PermissionRecursive from "./PermissionRecursiveBlock";
import { BsThreeDots } from "react-icons/bs";
import PermissionButtonMenu from "./PermissionButtonMenu";
import { useClientTypeDeleteMutation } from "../../../../services/clientTypeService";
import { useNavigate } from "react-router-dom";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const permissionFolder = {
  label: "Permissions",
  type: "USER_FOLDER",
  icon: "lock.svg",
  parent_id: adminId,
  id: "14",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const Permissions = ({ level = 1, menuStyle, menuItem, setElement }) => {
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [child, setChild] = useState();
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();
  const [selectedUserFolder, setSelectedUserFolder] = useState(null);
  const [userFolderModalType, setUserFolderModalType] = useState(null);
  const closeUserFolderModal = () => setSelectedUserFolder(null);
  const [menu, setMenu] = useState({ event: "", type: "" });
  const openMenu = Boolean(menu?.event);
  const handleOpenNotify = (event, element) => {
    setMenu({ event: event?.currentTarget, element });
  };
  const handleCloseNotify = () => {
    setMenu(null);
  };
  const navigate = useNavigate();

  const openUserFolderModal = (folder, type) => {
    setSelectedUserFolder(folder);
    setUserFolderModalType(type);
  };

  const activeStyle = {
    borderRadius: '10px',
    backgroundColor:
      permissionFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      permissionFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    // paddingLeft: updateLevel(level),
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };
  const iconStyle = {
    color:
      permissionFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text || "",
  };

  const labelStyle = {
    color:
      permissionFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };
  const { isLoading, refetch } = useQuery(
    ["GET_CLIENT_TYPE_LIST"],
    () => {
      return clientTypeServiceV2.getList();
    },
    {
      cacheTime: 10,
      enabled: false,
      onSuccess: (res) => {
        setChild(
          res.data.response?.map((row) => ({
            ...row,
            type: "PERMISSION",
            id: row.guid,
            parent_id: "13",
            data: {
              permission: {
                read: true,
              },
            },
            buttons: (
              <BsThreeDots
                size={13}
                onClick={(e) => {
                  e?.stopPropagation();
                  handleOpenNotify(e, row);
                }}
                style={{
                  color:
                    row?.guid === menuItem?.guid
                      ? menuStyle?.active_text
                      : menuStyle?.text || "",
                }}
              />
            ),
          }))
        );
      },
    }
  );
  const { mutate: deleteClientType, isLoading: deleteLoading } =
    useClientTypeDeleteMutation({
      onSuccess: refetch,
    });

  const clickHandler = (e) => {
    e.stopPropagation();
    setSelected(permissionFolder);
    queryClient.refetchQueries("GET_CLIENT_TYPE_LIST");
    setChildBlockVisible((prev) => !prev);
    dispatch(menuActions.setMenuItem(permissionFolder));
  };

  const onSelect = (id, element) => {
    setSelected(element);
    dispatch(menuActions.setMenuItem(element));
    if (element.type === "FOLDER") return;
    navigate(`/main/${adminId}/permission/${element?.guid}`);
  };

  return (
    <Box sx={{margin: '0 5px'}}>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className="nav-element"
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
          <div className="label" style={labelStyle}>
            <IconGenerator icon={"lock.svg"} size={18} />
            Permissions
          </div>
          <Box className="icon_group">
            <Tooltip title="Create folder" placement="top">
              <Box className="extra_icon">
                <AddIcon
                  size={13}
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleOpenNotify(e, "CREATE_FOLDER");
                    openUserFolderModal({}, "CREATE");
                  }}
                  style={iconStyle}
                />
              </Box>
            </Tooltip>
          </Box>
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {child?.map((childElement) => (
          <PermissionRecursive
            key={childElement.id}
            element={childElement}
            menuStyle={menuStyle}
            menuItem={menuItem}
            setElement={setElement}
            setSelected={setSelected}
            onSelect={onSelect}
            selected={selected}
          />
        ))}
      </Collapse>

      <PermissionButtonMenu
        openMenu={openMenu}
        menu={menu?.event}
        element={menu?.element}
        handleCloseNotify={handleCloseNotify}
        deleteClientType={deleteClientType}
        openUserFolderModal={openUserFolderModal}
      />

      {selectedUserFolder && (
        <FolderCreateModal
          clientType={selectedUserFolder}
          closeModal={closeUserFolderModal}
          modalType={userFolderModalType}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

export default Permissions;
