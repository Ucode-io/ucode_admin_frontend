
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Menu, MenuItem, Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../../../store";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import {
  useResourceCreateFromClusterMutation,
  useResourceDeleteMutation,
  useResourceListQuery,
} from "../../../../services/resourceService";
import RecursiveBlock from "./RecursiveBlock";
import AddIcon from "@mui/icons-material/Add";
import StorageIcon from "@mui/icons-material/Storage";
import { TbDatabaseExport } from "react-icons/tb";
import { BiGitCompare } from "react-icons/bi";
import { IoEnter, IoExit } from "react-icons/io5";
// import { resourceTypes } from "utils/resourceConstants";
import { resourceTypes } from "../../../../utils/resourceConstants";
// import environmentStore from "../../../../store/environment";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const dataBases = [
  {
    label: "Resources",
    type: "USER_FOLDER",
    icon: "database.svg",
    parent_id: adminId,
    id: "15",
    data: {
      permission: {
        read: true,
        write: true,
        delete: true,
        update: true,
      },
    },
  },
  // {
  //   label: "Variable Resources",
  //   type: "USER_FOLDER",
  //   icon: "database.svg",
  //   parent_id: adminId,
  //   id: "10",
  //   data: {
  //     permission: {
  //       read: true,
  //       write: true,
  //       delete: true,
  //       update: true,
  //     },
  //   },
  // }
];

const Resources = ({ level = 1, menuStyle, setSubMenuIsOpen }) => {
  const navigate = useNavigate();
  const { projectId, resourceId , appId} = useParams();

  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [selected, setSelected] = useState({});
  const company = store.getState().company;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const authStore = store.getState().auth;


  const { data: { resources } = {} } = useResourceListQuery({
    params: {
      project_id: company?.projectId,
    },
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mutate: deleteResource, isLoading: deleteLoading } =
    useResourceDeleteMutation({
      onSuccess: () => {
        refetch();
        handleClose();
      },
    });

  const { mutate: addResourceFromCluster, isLoading: clusterLoading } =
    useResourceCreateFromClusterMutation({
      onSuccess: () => {
        refetch();
      },
    });

  const addResourceFromClusterClick = (resourceType) => {
    addResourceFromCluster({
      company_id: authStore.userInfo.company_id,
      project_id: authStore.projectId,
      environment_id: authStore.environmentId,
      resource: {
        resource_type: resourceType || 1,
        service_type: 1,
      },
      user_id: authStore.userId,
    });
  };

  const clickHandler = (e) => {
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
  };

  const rowClickHandler = (id, element) => {
    setSelected(element);
    element.type === "FOLDER" && navigate(`/main/${adminId}`);
    if (element.resource_type) setResourceId(element.id);
    if (element.type !== "FOLDER" || openedFolders.includes(id)) return;
    setOpenedFolders((prev) => [...prev, id]);
  };

  const navigateToCreateForm = () => {
    navigate(`/project/${projectId}/resources/create`);
  };

  const navigateToEditPage = (id) => {
    navigate(`/project/${projectId}/resources/${id}`);
  };

  const onSelect = (id, element) => {
    if (element.link) navigate(element.link);
    else if (element.type === "RESOURCE") navigateToEditPage(id);
  };

  return (
    <Box>
      {dataBases?.map((dataBase => (
        <div className="parent-block column-drag-handle">
            <Button
                  className={`nav-element`}
                  onClick={(e) => {
                    navigate(`${appId}/variable-resources`)
                  }}
                >
                  <div
                    className="label"
                    style={{
                      color:
                        selected?.id === dataBase?.id
                          ? menuStyle?.active_text
                          : menuStyle?.text,
                    }}
                  >
                    <IconGenerator icon={"database.svg"} size={18} />
                    {dataBase?.label}
                  </div>
        
                {dataBase?.id === '15' && (
                    <Box mt={1} sx={{ cursor: "pointer" }}>
                    <Tooltip title="Add resource" placement="top">
                      <Box className="">
                        <StorageIcon
                          size={13}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClick(e);
                            handleOpenNotify(e, "CREATE_FOLDER");
                          }}
                          style={{
                            color:
                              selected?.id === dataBase?.id
                                ? menuStyle?.active_text
                                : menuStyle?.text || "",
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                )}

                {dataBase?.id === '15' && (
                  <Box mt={1} sx={{ cursor: "pointer" }}>
                  <Tooltip title="Add resource" placement="top">
                    <Box className="">
                      <AddIcon
                        size={13}
                        onClick={(e) => {
                          navigate("/main/resources/create");
                          e.stopPropagation();
                          handleOpenNotify(e, "CREATE_FOLDER");
                        }}
                        style={{
                          color:
                            selected?.id === dataBase?.id
                              ? menuStyle?.active_text
                              : menuStyle?.text || "",
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Box>
                )}
        
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    {resourceTypes?.map((el) => (
                      <MenuItem
                        sx={{ width: "250px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addResourceFromClusterClick(el.value);
                        }}
                      >
                        {el?.label}
                      </MenuItem>
                    ))}
                  </Menu>
                  {childBlockVisible ? (
                    <KeyboardArrowDownIcon />
                  ) : (
                    <KeyboardArrowRightIcon />
                  )}
              </Button>
          </div>        
      )))}


      <Collapse in={childBlockVisible} unmountOnExit>
        {resources?.map((childElement) => (
          <RecursiveBlock
            key={childElement.id}
            level={level + 1}
            element={childElement}
            menuStyle={menuStyle}
            clickHandler={clickHandler}
            onSelect={onSelect}
            selected={selected}
            resourceId={resourceId}
            deleteResource={deleteResource}
            childBlockVisible={childBlockVisible}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default Resources;
