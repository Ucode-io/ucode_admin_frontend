import {
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const TreeNode = ({ node, depth = 0, onToggle, menuChilds, getMenuLabel }) => {
  const { attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging } = useSortable({ id: node.id });

  const currentNode = menuChilds?.[node.id];
  const children = Array.isArray(currentNode?.children)
    ? currentNode.children
    : [];

  const isFolder = node.type === "FOLDER";

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: node.id,
  });

  const setRef = (el) => {
    setSortableRef(el);
    setDroppableRef(el);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 180ms cubic-bezier(0.2, 0, 0, 1)",
    padding: "8px 10px",
    borderRadius: 6,
    marginBottom: 4,
    marginLeft: depth * 12,
    background: isDragging ? "#e8f0ff" : isOver ? "#f1f5ff" : "#fff",
    boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.12)" : "none",
    cursor: "grab",
    userSelect: "none",
  };

  console.log({
    node
  })

  return (
    <div ref={setRef} style={style} {...attributes}>
      <div
        {...listeners}
        style={{ display: "flex", alignItems: "center", gap: 6 }}
      >
        {isFolder && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            {currentNode?.open ? "▾" : "▸"}
          </span>
        )}
        <span>{getMenuLabel(node)}</span>
      </div>

      {isFolder && currentNode?.open && (
        <div style={{ marginTop: 6 }}>
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
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}