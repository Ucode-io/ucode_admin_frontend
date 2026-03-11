import {
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Tooltip, IconButton, Box } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import IconGeneratorIconjs from "@/components/IconPicker/IconGeneratorIconjs";
import IconGenerator from "@/components/IconPicker/IconGenerator";
import { useTranslation } from "react-i18next";
import { iconsList } from "@/utils/constants/iconsList";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "@/store/menuItem/menuItem.slice";
import { useParams } from "react-router-dom";

export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const CustomTooltip = ({ title, children }) => (
  <Tooltip
    title={title}
    placement="top"
    arrow
    componentsProps={{
      tooltip: {
        sx: {
          bgcolor: "#4d4d4d",
          "& .MuiTooltip-arrow": { color: "#4d4d4d" },
          padding: "4px 8px",
        },
      },
    }}
  >
    {children}
  </Tooltip>
);

export const TreeNode = ({
  node,
  depth = 0,
  onToggle,
  menuChilds,
  getMenuLabel,
  menuTemplate,
  handlers,
  setSelectedFolder,
  selectedApp,
  menu,
  setMenu,
}) => {
  const { i18n } = useTranslation();

  const params = useParams();

  const isActiveMenu = (params.menuId || params.appId) === node.id;

  const dispatch = useDispatch();
  const sidebarIsOpen = useSelector(
    (state) => state.main.settingsSidebarIsOpen,
  );

  const { handleOpenNotify } = handlers;

  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const showActions = isHovered || menuOpen;

  const menuStyle = {
    ...menuTemplate?.menu_template,
    text:
      menuTemplate?.menu_template?.text === "#A8A8A8"
        ? ""
        : menuTemplate?.menu_template?.text,
  };

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: node.id });

  const setRef = (el) => {
    setSortableRef(el);
    setDroppableRef(el);
  };

  const isFolder = node.type === "FOLDER";
  const isOpen = menuChilds?.[node.id]?.open;
  const children = menuChilds?.[node.id]?.children || [];
  const filteredChildren = children.filter(
    (child) => child.data?.permission?.read,
  );

  const iconSize =
    menuStyle?.icon_size === "SMALL"
      ? 10
      : menuStyle?.icon_size === "MEDIUM"
        ? 15
        : 20;

  const title =
    node?.attributes?.[`label_${i18n.language}`] ||
    node?.label ||
    node?.data?.microfrontend?.name ||
    node?.data?.webpage?.title;
  const displayTitle = title?.length > 14 ? `${title?.slice(0, 14)}...` : title;

  const icon =
    node?.icon || node?.data?.microfrontend?.icon || node?.data?.webpage?.icon;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    padding: "6px 10px",
    borderRadius: 6,
    height: 30,
    marginBottom: 2,
    marginLeft: depth * 12,
    background: isDragging
      ? "#e8f0ff"
      : isOver
        ? "#f1f5ff"
        : showActions // Подсветка остается, пока открыто меню
          ? "#f5f5f5"
          : isActiveMenu
            ? "#f5f5f5"
            : "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    userSelect: "none",
  };

  const type = node.type;

  const folderSettings = (e) => {
    e.stopPropagation();
    setMenuOpen(true);
    setIsHovered(false);
    setSelectedFolder(node);
    dispatch(menuActions.setMenuItem(node));
    if (selectedApp?.id !== adminId) {
      if (
        type === "FOLDER" ||
        (type === "WIKI_FOLDER" &&
          node?.id !== "cd5f1ab0-432c-459d-824a-e64c139038ea")
      ) {
        handleOpenNotify(e, "FOLDER");
      } else if (type === "TABLE") {
        handleOpenNotify(e, "TABLE");
      } else if (type === "WIKI") {
        handleOpenNotify(e, "WIKI");
      } else if (type === "MICROFRONTEND") {
        handleOpenNotify(e, "MICROFRONTEND");
      } else if (type === "MINIO_FOLDER") {
        handleOpenNotify(e, "MINIO_FOLDER");
      } else if (type === "LINK") {
        handleOpenNotify(e, "LINK");
      }
    }
  };

  const getMenuColor = (element) => {
    if (element?.label === "Settings") {
      return "#fff";
    } else return menuStyle?.text || "#475467";
    // } else return activeMenu ? "#5F5E5A" : menuStyle?.text || "#475467";
  };

  function isValidUrl(str) {
    try {
      const url = new URL(str);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  const handleToggleClick = (e) => {
    e.stopPropagation();
    onToggle(node);
  };

  const newIcons = iconsList.slice(0, 17);

  useEffect(() => {
    const onWindowClick = (e) => {
      if (!e.target.closest(`[data-id="${node.id}"]`)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("click", onWindowClick);

    return () => {
      window.removeEventListener("click", onWindowClick);
    };
  });

  return (
    <>
      <div
        ref={setRef}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleToggleClick} // Теперь вся строка работает как Toggle
        data-id={node.id}
        {...attributes}
        {...listeners} // Слушатели DnD на всей строке
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            overflow: "hidden",
          }}
        >
          {/* Слева: Иконка или Стрелка при ховере */}
          <div style={{ width: 20, display: "flex", justifyContent: "center" }}>
            {isFolder && showActions ? (
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 18,
                  color: "#666",
                }}
              >
                <ArrowForwardIosRoundedIcon
                  fontSize="small"
                  htmlColor="#666"
                  style={{
                    transform: isOpen ? "rotate(90deg)" : "",
                    transition: "transform 120ms ease-out",
                  }}
                />
              </span>
            ) : // Ваш рендер иконки
            icon?.includes(":") ? (
              <IconGeneratorIconjs
                icon={!icon || icon === "folder.svg" ? "folder-new.svg" : icon}
                size={iconSize}
                style={{
                  color: getMenuColor(node, icon),
                }}
              />
            ) : isValidUrl(icon) ? (
              <img width={"24px"} height={"24px"} src={icon} />
            ) : isFolder || depth === 0 ? (
              <IconGenerator
                icon={!icon || icon === "folder.svg" ? "folder-new.svg" : icon}
                size={iconSize}
                style={{
                  color: newIcons?.includes(icon)
                    ? "transparent"
                    : getMenuColor(node, icon),
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "12px",
                  height: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "5px",
                    height: "5px",
                    background: "#787774",
                    borderRadius: "50%",
                  }}
                ></Box>
              </Box>
            )}
          </div>

          <span style={{ fontSize: "14px", whiteSpace: "nowrap" }}>
            {displayTitle}
          </span>
        </div>

        {/* Справа: Кнопки действий при ховере */}
        {showActions && sidebarIsOpen && (
          <div
            style={{ display: "flex", alignItems: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Plus Button */}
            {node?.data?.permission?.write && isFolder && (
              <CustomTooltip node={node} title="Create folder">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setSelectedFolder(node);
                    handleOpenNotify(e, "CREATE_TO_FOLDER");
                  }}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </CustomTooltip>
            )}

            {/* Three Dots Button */}
            {!node?.is_static &&
              (node?.data?.permission?.delete ||
                node?.data?.permission?.update ||
                node?.data?.permission?.write) && (
                <CustomTooltip
                  title={isFolder ? "Folder settings" : "Table settings"}
                >
                  <IconButton size="small" onClick={folderSettings}>
                    <MoreHorizIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </CustomTooltip>
              )}
          </div>
        )}
      </div>

      {/* Рекурсивные дети с анимацией открытия/закрытия */}
      {isFolder && (
        <div
          style={{
            marginTop: 2,
            maxHeight: isOpen ? 800 : 0,
            overflow: "hidden",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(-4px)",
            transition:
              "max-height 160ms ease-out, opacity 160ms ease-out, transform 160ms ease-out",
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          <SortableContext
            id={node.id}
            items={filteredChildren.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredChildren.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                onToggle={onToggle}
                menuChilds={menuChilds}
                getMenuLabel={getMenuLabel}
                sidebarIsOpen={sidebarIsOpen}
                handlers={handlers}
                setSelectedFolder={setSelectedFolder}
                selectedApp={selectedApp}
                menu={menu}
                setMenu={setMenu}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </>
  );
};
