import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Menu, MenuItem, Tooltip } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../../../store";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import {
  useResourceCreateFromClusterMutation,
  useResourceDeleteMutation,
  useResourceDeleteMutationV2,
  useResourceListQuery,
  useResourceListQueryV2,
} from "../../../../services/resourceService";
import RecursiveBlock from "./RecursiveBlock";
import AddIcon from "@mui/icons-material/Add";
import StorageIcon from "@mui/icons-material/Storage";
import { resourceTypes } from "../../../../utils/resourceConstants";
import { useQueryClient } from "react-query";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import { useDispatch } from "react-redux";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const dataBases = {
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
};

const Resources = ({
  level = 1,
  menuStyle,
  setSubMenuIsOpen,
  menuItem,
  handleOpenNotify,
}) => {
  const navigate = useNavigate();
  const { projectId, resourceId } = useParams();

  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const company = store.getState().company;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const authStore = store.getState().auth;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const activeStyle = {
    borderRadius: "10px",
    backgroundColor:
      dataBases?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      dataBases?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const { data: { resources } = {} } = useResourceListQuery({
    params: {
      project_id: company?.projectId,
    },
  });

  const { data = {}, refetch } = useResourceListQueryV2({
    params: {
      project_id: company?.projectId,
    },
  });

  const computedResources = useMemo(() => {
    return [...(data?.resources || []), ...(resources || [])];
  }, [data, resources]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mutate: deleteResource, isLoading: deleteLoading } =
    useResourceDeleteMutation({
      onSuccess: () => {
        // refetch();
        handleClose();
      },
    });

  const { mutate: deleteResourceV2, isLoading: deleteLoadingV2 } =
    useResourceDeleteMutationV2({
      onSuccess: () => {
        queryClient.refetchQueries(["RESOURCESV2"]);
        handleClose();
      },
    });

  const { mutate: addResourceFromCluster, isLoading: clusterLoading } =
    useResourceCreateFromClusterMutation({
      onSuccess: () => {
        // refetch();
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
    dispatch(menuActions.setMenuItem(dataBases));
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
  };

  const navigateToCreateForm = () => {
    navigate(`/project/${projectId}/resources/create`);
  };

  const navigateToEditPage = (id, type) => {
    navigate(`/project/${projectId}/resources/${id}/${type}`);
  };

  const onSelect = (id, element) => {
    if (element.link) navigate(element.link);
    else if (element.type) navigateToEditPage(id, element.type);
  };

  return (
    <Box sx={{ margin: "0 5px" }}>
      <div className="parent-block column-drag-handle">
        <Button
          className={`nav-element`}
          style={activeStyle}
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          <div className="label">
            {childBlockVisible ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
            <IconGenerator icon={"database.svg"} size={18} />
            {dataBases?.label}
          </div>

          {dataBases?.id === "15" && (
            <Box mt={1} sx={{ cursor: "pointer" }}>
              <Tooltip title="Add resource" placement="top">
                <Box className="">
                  <StorageIcon
                    size={13}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(e);
                      // handleOpenNotify(e, "CREATE_FOLDER");
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          )}

          {dataBases?.id === "15" && (
            <Box mt={1} sx={{ cursor: "pointer" }}>
              <Tooltip title="Add resource" placement="top">
                <Box className="">
                  <AddIcon
                    size={13}
                    onClick={(e) => {
                      navigateToCreateForm();
                      navigate("/main/resources/create");
                      e.stopPropagation();
                      // handleOpenNotify(e, "CREATE_FOLDER");
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
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {computedResources?.map((childElement) => (
          <RecursiveBlock
            key={childElement.id}
            level={level + 1}
            element={childElement}
            clickHandler={clickHandler}
            onSelect={onSelect}
            resourceId={resourceId}
            deleteResource={deleteResource}
            deleteResourceV2={deleteResourceV2}
            childBlockVisible={childBlockVisible}
            setSubMenuIsOpen={setSubMenuIsOpen}
            handleOpenNotify={handleOpenNotify}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default Resources;
