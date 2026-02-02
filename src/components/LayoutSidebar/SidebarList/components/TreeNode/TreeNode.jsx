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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"; // ThreeDots
import AddIcon from "@mui/icons-material/Add"; // Plus
import { NodeActionsMenu } from "../NodeActionsMenu";
import { useState } from "react";
import IconGeneratorIconjs from "@/components/IconPicker/IconGeneratorIconjs";
import IconGenerator from "@/components/IconPicker/IconGenerator";
import { useTranslation } from "react-i18next";
import { iconsList } from "@/utils/constants/iconsList";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const CustomTooltip = ({ title, children }) => (
  <Tooltip
    title={title}
    placement="top"
    arrow
    componentsProps={{
      tooltip: {
        sx: {
          bgcolor: "#222",
          "& .MuiTooltip-arrow": { color: "#222" },
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
  sidebarIsOpen,
  menuTemplate,
  handlers, // Передаем все функции (deleteFolder, и т.д.) из родителя
}) => {
  const { i18n } = useTranslation();

  const [isHovered, setIsHovered] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

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
        : isHovered
          ? "#f5f5f5"
          : "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    userSelect: "none",
  };

  const getMenuColor = (element) => {
    if (element?.label === "Settings") {
      return "#fff";
    } else return false ? "#5F5E5A" : menuStyle?.text || "#475467";
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

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const newIcons = iconsList.slice(0, 17);

  return (
    <>
      <div
        ref={setRef}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleToggleClick} // Теперь вся строка работает как Toggle
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
            {isFolder && isHovered ? (
              <span
                style={{
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
        {isHovered && sidebarIsOpen && (
          <div
            style={{ display: "flex", alignItems: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Plus Button */}
            {node?.data?.permission?.write && (
              <CustomTooltip title="Add New">
                <IconButton
                  size="small"
                  onClick={() => {
                    /* Логика добавления */
                  }}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </CustomTooltip>
            )}

            {/* Three Dots Button */}
            {isFolder && !node?.is_static && (
              <CustomTooltip title="Options">
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreHorizIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </CustomTooltip>
            )}
          </div>
        )}
      </div>

      {/* Рекурсивные дети */}
      {isFolder && isOpen && (
        <div style={{ marginTop: 2 }}>
          <SortableContext
            id={node.id}
            items={children.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                onToggle={onToggle}
                menuChilds={menuChilds}
                getMenuLabel={getMenuLabel}
                sidebarIsOpen={sidebarIsOpen}
                handlers={handlers}
              />
            ))}
          </SortableContext>
        </div>
      )}

      {/* Попап меню */}
      <NodeActionsMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        node={node}
        handlers={handlers}
      />
    </>
  );
};

// export const TreeNode = ({ node, depth = 0, onToggle, menuChilds, getMenuLabel }) => {
//   const { attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging } = useSortable({ id: node.id });

//   const currentNode = menuChilds?.[node.id];
//   const children = Array.isArray(currentNode?.children)
//     ? currentNode.children
//     : [];

//   const isFolder = node.type === "FOLDER";

//   const { setNodeRef: setDroppableRef, isOver } = useDroppable({
//     id: node.id,
//   });

//   const setRef = (el) => {
//     setSortableRef(el);
//     setDroppableRef(el);
//   };

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition: transition || "transform 180ms cubic-bezier(0.2, 0, 0, 1)",
//     padding: "8px 10px",
//     borderRadius: 6,
//     marginBottom: 4,
//     marginLeft: depth * 12,
//     background: isDragging ? "#e8f0ff" : isOver ? "#f1f5ff" : "#fff",
//     boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.12)" : "none",
//     cursor: "grab",
//     userSelect: "none",
//   };

//   console.log({
//     node
//   })

//   return (
//     <div ref={setRef} style={style} {...attributes}>
//       <div
//         {...listeners}
//         style={{ display: "flex", alignItems: "center", gap: 6 }}
//       >
//         {isFolder && (
//           <span
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggle(node.id);
//             }}
//           >
//             {currentNode?.open ? "▾" : "▸"}
//           </span>
//         )}
//         <span>{getMenuLabel(node)}</span>
//       </div>

//       {isFolder && currentNode?.open && (
//         <div style={{ marginTop: 6 }}>
//           <SortableContext
//             id={node.id}
//             items={children.map((c) => c.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {children.map((child) => (
//               <TreeNode
//                 key={child.id}
//                 node={child}
//                 depth={depth + 1}
//                 onToggle={onToggle}
//                 menuChilds={menuChilds}
//                 getMenuLabel={getMenuLabel}
//               />
//             ))}
//           </SortableContext>
//         </div>
//       )}
//     </div>
//   );
// }