import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../../../store";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import { useResourceCreateFromClusterMutation, useResourceDeleteMutation, useResourceListQuery } from "../../../../services/resourceService";
import RecursiveBlock from "./RecursiveBlock";
import AddIcon from "@mui/icons-material/Add";


const dataBase = {
    label: "Resources",
    type: "USER_FOLDER",
    icon: "database.svg",
    parent_id: "12",
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

const Resources = ({ level = 1, menuStyle, setSubMenuIsOpen }) => {
    const navigate = useNavigate();
    const { projectId, resourceId } = useParams();
    const [childBlockVisible, setChildBlockVisible] = useState(false);
    const [selected, setSelected] = useState({});
    const company = store.getState().company;


    const { data: { resources } = {} } = useResourceListQuery({
        params: {
            project_id: company?.projectId,
        },
    });


    const { mutate: deleteResource, isLoading: deleteLoading } =
        useResourceDeleteMutation({
            onSuccess: () => {
                refetch();
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
            company_id: authStore.currentCompanyID,
            project_id: projectId,
            environment_id: environmentStore.selectedEnvId,
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
        element.type === "FOLDER" && navigate("/main/12");
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
            <div className="parent-block column-drag-handle">
                <Button
                    className={`nav-element`}
                    onClick={(e) => {
                        clickHandler(e);
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
                        Resources
                    </div>

                    <Box mt={1} sx={{ cursor: 'pointer' }}>
                        <Tooltip title="Add resource" placement="top">
                            <Box className="">
                                <AddIcon
                                    size={13}
                                    onClick={(e) => {
                                        navigate('/main/resources/create')
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
                    {childBlockVisible ? (
                        <KeyboardArrowDownIcon />
                    ) : (
                        <KeyboardArrowRightIcon />
                    )}
                </Button>
            </div>

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
                        childBlockVisible={childBlockVisible}
                    />
                ))}
            </Collapse>
        </Box>
    );
};

export default Resources;
