import { useState } from "react";
import WebPagesIcon from "assets/icons/WebPagesIcon.jsx";
import {
  SidebarBody,
  SidebarHeader,
  SidebarNestedElements,
  SidebarTitle,
} from "components/Sidebar-old";
import DatabasesConnectIcon from "assets/icons/DatabasesConnectIcon.jsx";
import StorageIcon from "assets/icons/StorageIcon.jsx";
import {
  useResourceListQuery,
  useResourceDeleteMutation,
  useResourceCreateFromClusterMutation,
} from "../../../services/resource.service";
import { useNavigate, useParams } from "react-router-dom";
import authStore from "../../../store/auth.store";
import { FiDatabase } from "react-icons/fi";
import {
  Flex,
  IconButton,
  Icon,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { TbDatabaseExport } from "react-icons/tb";
import { BiGitCompare } from "react-icons/bi";
import { IoEnter, IoExit } from "react-icons/io5";
import environmentStore from "../store/environment.store";
import { resourceTypes } from "utils/resourceConstants";

const ResourcesSidebar = () => {
  const navigate = useNavigate();
  const { projectId, resourceId } = useParams();

  const { data: resources, refetch } = useResourceListQuery({
    params: {
      project_id: projectId,
    },
    queryParams: {
      select: (res) =>
        res.resources?.map((resource) => ({
          ...resource,
          icon: FiDatabase,
          type: "RESOURCE",
          buttons: (
            <Flex>
              <IconButton
                colorScheme="whiteAlpha"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToCreateForm();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Flex>
          ),
        })),
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

  const sidebarElements = [
    {
      title: "Resourcess",
      icon: StorageIcon,
      id: 1,
      children: resources,
      buttons: (
        <Flex>
          <Menu>
            <MenuButton
              onClick={(e) => e.stopPropagation()}
              as={IconButton}
              aria-label="Options"
              icon={<Icon as={TbDatabaseExport} w={4} h={4} />}
              variant="ghost"
              colorScheme="whiteAlpha"
            />
            <MenuList>
              {resourceTypes.map((item) => (
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    addResourceFromClusterClick(item.value);
                  }}
                  color={"#000"}
                >
                  {item?.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Tooltip label="Add resource">
            <IconButton
              colorScheme="whiteAlpha"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                navigateToCreateForm();
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip label="Add resource">
            <IconButton
              colorScheme="whiteAlpha"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                navigateToCreateForm();
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Flex>
      ),
    },
    {
      title: "ELT",
      icon: DatabasesConnectIcon,
      id: 4,
      children: [
        {
          id: 1,
          title: "Connections",
          icon: BiGitCompare,
          link: `/project/${projectId}/resources/elt/connections`,
        },
        {
          id: 2,
          title: "Sources",
          icon: IoExit,
          link: `/project/${projectId}/resources/elt/sources`,
        },
        {
          id: 3,
          title: "Destinations",
          icon: IoEnter,
          link: `/project/${projectId}/resources/elt/destinations`,
        },
      ],
    },
  ];

  return (
    <>
      <SidebarHeader>
        <SidebarTitle>Resources</SidebarTitle>
      </SidebarHeader>

      <SidebarBody h="calc(100vh - 90px)">
        <SidebarNestedElements
          elements={sidebarElements}
          selectedElement={resourceId}
          onSelect={onSelect}
        />
      </SidebarBody>
    </>
  );
};

export default ResourcesSidebar;
