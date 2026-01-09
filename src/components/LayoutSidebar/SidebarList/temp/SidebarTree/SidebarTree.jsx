import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSidebarTreeProps } from './useSidebarTreeProps';
import { TreeNode } from '../TreeNode';

import cls from "./styles.module.scss";
import { useDroppable } from '@dnd-kit/core';

const ROOT_PARENT_ID = import.meta.env.VITE_MENU_ROOT_ID;

export const SidebarTree = ({
  menuList,
  setMenuList,
  getMenuList,
  rootDropId,
}) => {

  const {
    menuChilds,
    getMenuLabel,
    handleMenuItemClick,
    isLoadingMenuChild,
    selectedFolder,
  } = useSidebarTreeProps({
    getMenuList,
    menuList,
    setMenuList,
  })

  const { setNodeRef, isOver } = useDroppable({
    id: rootDropId,
  });

  return (
    <div
      ref={setNodeRef}
      className={cls.menuList}
      data-over={isOver}
    >
      <SortableContext
        id={ROOT_PARENT_ID}
        items={menuList?.map(n => n?.id)}
        strategy={verticalListSortingStrategy}
      >
        {menuList?.map(n => (
          <TreeNode
            key={n.id}
            node={n}
            parentId={ROOT_PARENT_ID}
            menuChilds={menuChilds}
            getMenuLabel={getMenuLabel}
            handleMenuItemClick={handleMenuItemClick}
            isLoadingMenuChild={isLoadingMenuChild}
            selectedFolder={selectedFolder}
          />
        ))}
      </SortableContext>
    </div>
  );
}
