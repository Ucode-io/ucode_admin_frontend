import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { CSS } from '@dnd-kit/utilities';

import cls from "./styles.module.scss";
import clsx from "clsx";

export const TreeNode = ({ 
  node, 
  depth = 0, 
  menuChilds, 
  getMenuLabel, 
  handleMenuItemClick, 
  isLoadingMenuChild,
  selectedFolder
}) => {

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const currentNode = menuChilds[node.id];

  const isFolder = node?.type === 'FOLDER';

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: node.id,
    disabled: !isFolder,
  });

  const setRef = el => {
    setSortableRef(el);
    setDroppableRef(el);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 180ms cubic-bezier(0.2, 0, 0, 1)',
    borderRadius: 6,
    marginLeft: depth * 12,
    background: isDragging
      ? '#e8f0ff'
      : isOver
      ? '#f0f0ef'
      : '#fff',
    boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
    cursor: isDragging ?  'grab' : 'pointer',
    userSelect: 'none',
    position: 'relative',
  };

  const children = Array.isArray(currentNode?.children)
  ? currentNode.children
  : [];

  return (
    <>
      <div 
        ref={setRef} 
        style={style}
        {...attributes}
      >
        <div className={cls.treeNodeDragger} {...listeners}>
          ⠿
        </div>
        <div
          className={cls.treeNode}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={e => {
            e.stopPropagation();
            handleMenuItemClick(node);
          }}
        >
          {isFolder && (
            <span
              className={clsx(cls.arrowDownIcon, { [cls.isOpened]: currentNode.open })}
            >
              <KeyboardArrowDownIcon />
            </span>
          )}
          {getMenuLabel(node)}
        </div>
      </div>
      {isFolder && menuChilds[node.id]?.open && (
        <SortableContext
          items={children?.map(c => c?.id)}
          strategy={verticalListSortingStrategy}
          id={node.id}
        >
          {
            (isLoadingMenuChild && node.id === selectedFolder?.id) ? (
              <div className={cls.loader}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : <div className={cls.menuList}>
              {
                children?.map(child => (
                  <TreeNode
                    key={child.id}
                    node={child}
                    parentId={node.id}
                    menuChilds={menuChilds}
                    getMenuLabel={getMenuLabel}
                    handleMenuItemClick={handleMenuItemClick}
                    depth={depth + 1}
                  />
                ))
              }
            </div>
          }
        </SortableContext>
      )}
    </>
  );
}
