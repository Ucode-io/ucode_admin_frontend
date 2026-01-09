import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Box,
    Flex,
    Tooltip,
    Collapse,
} from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BsThreeDots } from "react-icons/bs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useMenuListQuery } from "@/services/menuService";
import { menuActions } from "@/store/menuItem/menuItem.slice";
import { tableActions } from "@/store/table/table.slice";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { menuAccordionActions } from "@/store/menus/menus.slice";
import { MenuList } from "../MenuList";
import { NavigateByType } from "@/components/LayoutSidebar/Components/MenuSwitchCase";
import { NavigateByTypeOldRoute } from "@/components/LayoutSidebar/Components/OldMenuSwitchCase";
import IconGeneratorIconjs from "@/components/IconPicker/IconGeneratorIconjs";
import IconGenerator from "@/components/IconPicker/IconGenerator";

export const MenuItem = ({
    element,
    depth = 0,
    sidebarIsOpen,
    setSubMenuIsOpen,
    handleOpenNotify,
    selectedApp,
    setSelectedFolder,
    setSelectedApp,
    menuStyle
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { menuId } = useParams();
    const { i18n } = useTranslation();

    // Fetch children if folder
    const isFolder = element?.type === "FOLDER" || element?.type === "WIKI_FOLDER";

    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: element.id, data: element });

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: element.id,
        disabled: !isFolder,
        data: element
    });

    const setRef = (node) => {
        setSortableRef(node);
        setDroppableRef(node);
    };

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        paddingLeft: `${depth * 10 + 8}px`, // 8px base padding
        marginBottom: "4px"
    };

    // Redux State for children and open status
    const menuChilds = useSelector((state) => state?.menuAccordion?.menuChilds);
    const children = menuChilds?.[element.id]?.children || [];
    const isOpen = menuChilds?.[element.id]?.open || false;

    // Helper to toggle open state in Redux
    const toggleFolder = () => {
        const updated = { ...menuChilds };
        // If it was already in Redux state, toggle it
        const currentData = updated[element.id] || {};
        updated[element.id] = { ...currentData, open: !isOpen };
        if (!isOpen && !currentData.children) {
            // If opening and no children yet, ensure we keep structure so query updates it? 
            // Actually query updates it on successful fetch
            updated[element.id] = { ...updated[element.id], children: [] };
        }
        dispatch(menuAccordionActions.toggleMenuChilds(updated));
    };

    // Permissions logic
    const auth = useSelector((state) => state.auth);
    const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
    const readPermission = element?.data?.permission?.read;
    const adminId = import.meta.env.VITE_ADMIN_FOLDER_ID;
    const analyticsId = import.meta.env.VITE_ANALYTICS_FOLDER_ID;
    const withoutPermission = element?.id === adminId || element?.id === analyticsId;
    const hasPermission = defaultAdmin ? readPermission || withoutPermission : readPermission;

    // Active state
    const isActive = element?.type === "FOLDER"
        ? selectedApp?.id === element?.id
        : element?.id === menuId;

    const { isLoading } = useMenuListQuery({
        params: {
            parent_id: element.id,
        },
        queryParams: {
            enabled: Boolean(isOpen && isFolder),
            onSuccess: (res) => {
                const updated = { ...menuChilds };
                // Preserve open state, update children
                updated[element.id] = {
                    open: true,
                    children: res?.menus ?? []
                };
                dispatch(menuAccordionActions.toggleMenuChilds(updated));
            },
        },
    });

    const title =
        element?.attributes?.[`label_${i18n.language}`] ||
        element?.label ||
        element?.data?.microfrontend?.name ||
        element?.data?.webpage?.title;

    const icon =
        element?.icon ||
        element?.data?.microfrontend?.icon ||
        element?.data?.webpage?.icon;

    const handleItemClick = (e) => {
        e.stopPropagation();

        if (isFolder) {
            toggleFolder();
        }

        setSelectedFolder(element);
        setSelectedApp(element);

        dispatch(tableActions.setTable(element?.data?.table));
        dispatch(detailDrawerActions.setMainTabIndex(0));
        dispatch(detailDrawerActions.closeDrawer());
        dispatch(groupFieldActions.clearViews());

        const newRouter = localStorage.getItem("new_router");
        dispatch(menuActions.setMenuItem(element));

        if (!isFolder) {
            if (newRouter === "true") {
                NavigateByType({ element, menuId: element?.id, navigate });
            } else {
                NavigateByTypeOldRoute({ element, appId: element?.id, navigate });
            }
        }
    };

    if (!hasPermission) return null;

    return (
        <Box ref={setRef} style={style} {...attributes} {...listeners}>
            <Tooltip title={title?.length > 20 ? title : ""} placement="right" isDisabled={sidebarIsOpen}>
                <Flex
                    onClick={handleItemClick}
                    align="center"
                    h="30px"
                    borderRadius="6px"
                    cursor="pointer"
                    bg={isActive ? "#F0F0EF" : "transparent"}
                    _hover={{ bg: "#EAECF0" }}
                    color={isActive ? "#32302B" : "#5F5E5A"}
                    position="relative"
                    pr="8px"
                >
                    <Flex w="30px" h="30px" align="center" justify="center" flexShrink={0}>
                        {icon && icon.includes(":") ? (
                            <IconGeneratorIconjs icon={icon} size={15} />
                        ) : (
                            <IconGenerator icon={icon || "folder-new.svg"} size={15} />
                        )}
                    </Flex>

                    {sidebarIsOpen && (
                        <Box ml="8px" fontSize="14px" flex="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                            {title}
                        </Box>
                    )}

                    {sidebarIsOpen && isFolder && (
                        <KeyboardArrowDownIcon
                            style={{
                                transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                                transition: "transform 0.2s"
                            }}
                            sx={{ fontSize: 16, color: "#98A2B3" }}
                        />
                    )}

                    {sidebarIsOpen && isActive && (
                        <Box ml="auto">
                            <BsThreeDots size={14} onClick={(e) => {
                                e.stopPropagation();
                                handleOpenNotify(e, element.type === "FOLDER" ? "FOLDER" : "TABLE", true);
                            }} />
                        </Box>
                    )}
                </Flex>
            </Tooltip>

            {isFolder && (
                <Collapse in={isOpen && sidebarIsOpen} animateOpacity>
                    <Box mt="1">
                        <MenuList
                            items={children}
                            depth={depth + 1}
                            sidebarIsOpen={sidebarIsOpen}
                            setSubMenuIsOpen={setSubMenuIsOpen}
                            handleOpenNotify={handleOpenNotify}
                            selectedApp={selectedApp}
                            setSelectedFolder={setSelectedFolder}
                            setSelectedApp={setSelectedApp}
                            menuStyle={menuStyle}
                        />
                        {isOpen && isLoading && <Box pl={8} fontSize="sm" color="gray.500">Loading...</Box>}
                        {isOpen && !isLoading && children.length === 0 && (
                            <Box pl={8} fontSize="sm" color="gray.500">No items</Box>
                        )}
                    </Box>
                </Collapse>
            )}
        </Box>
    );
};
