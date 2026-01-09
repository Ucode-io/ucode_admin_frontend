import { useState } from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
} from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import { menuAccordionActions } from '@/store/menus/menus.slice';
import menuService, { useMenuListQuery } from '@/services/menuService';
import { useTranslation } from 'react-i18next';

const ROOT_PARENT_ID = import.meta.env.VITE_MENU_ROOT_ID;

export const useSidebarTreeProps = ({ menuList, setMenuList, getMenuList }) => {

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const { i18n } = useTranslation();

  const defaultLanguage = i18n?.language;

  const menuChilds = useSelector((state) => state?.menuAccordion?.menuChilds);

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const [activeId, setActiveId] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState({});

  const handleMenuItemClick = (item) => {
    if(item.type === "FOLDER") {
      setSelectedFolder(item);
      dispatch(menuAccordionActions.toggleMenuOpen({ id: item.id }));
    }
  }

  function getListByParentId(parentId, { menuList, menuChilds }) {
    if (!parentId || parentId === ROOT_PARENT_ID) return menuList || [];
    return menuChilds?.[parentId]?.children || [];
  }

  function setListByParentId(parentId, nextList, { menuChilds }) {
    if (!parentId || parentId === ROOT_PARENT_ID) {
      setMenuList(nextList);
      return;
    }

    const updated = { ...menuChilds };
    updated[parentId] = {
      ...(updated[parentId] || { open: true }),
      open: true,
      children: nextList,
    };

    dispatch(menuAccordionActions.toggleMenuChilds(updated));
  }

  function findItemEverywhere(id, { menuList, menuChilds }) {
    const inRoot = (menuList || []).find(x => x.id === id);
    if (inRoot) return inRoot;

    const childs = menuChilds || {};
    for (const pid of Object.keys(childs)) {
      const found = (childs[pid]?.children || []).find(x => x.id === id);
      if (found) return found;
    }

    return null;
  }

  async function handleDragEnd(evt) {
    const { active, over } = evt;
  
    if (!over || active.id === over.id) return;
  
    const activeItem = findItemEverywhere(active.id, { menuList, menuChilds });
    const overItem = findItemEverywhere(over.id, { menuList, menuChilds });
    
    if (!activeItem || !overItem) return;
    
    const sourceParentId = activeItem.parent_id || ROOT_PARENT_ID;
  
    // если навели на FOLDER — цель = этот folder
    // иначе цель = parent_id элемента, над которым отпустили
    const targetParentId =
      overItem.type === "FOLDER"
        ? overItem.id
        : (overItem.parent_id || ROOT_PARENT_ID);
  
    const sourceList = getListByParentId(sourceParentId, { menuList, menuChilds });
    const targetList = getListByParentId(targetParentId, { menuList, menuChilds });
  
    const sourceIndex = sourceList.findIndex(x => x.id === activeItem.id);
    if (sourceIndex < 0) return;
  
    // Куда вставлять:
    // - если over — folder: в конец
    // - иначе: в позицию overItem внутри его parent списка
    const targetIndex =
      overItem.type === "FOLDER"
        ? targetList.length
        : targetList.findIndex(x => x.id === overItem.id);
  
    // 1) REORDER внутри одного parent
    if (sourceParentId === targetParentId) {
      if (targetIndex < 0) return;
  
      const next = arrayMove(sourceList, sourceIndex, targetIndex);
  
      // optimistic UI
      setListByParentId(sourceParentId, next, {
        menuChilds,
      });
  
      // backend order update
      try {
        await menuService.updateOrder({ menus: next });
      } finally {
        queryClient.refetchQueries(["MENU"]);
        queryClient.refetchQueries(["MENU_CHILD"]);
      }
  
      return;
    }
  
    // 2) MOVE между разными parent
    const moved = { ...activeItem, parent_id: targetParentId };
  
    // remove from source
    const nextSource = sourceList.filter(x => x.id !== activeItem.id);
  
    // insert into target
    const nextTarget = [...targetList];
    const safeIndex = targetIndex < 0 ? nextTarget.length : targetIndex;
    nextTarget.splice(safeIndex, 0, moved);
  
    // optimistic UI
    setListByParentId(sourceParentId, nextSource, {
      menuChilds,

    });
  
    setListByParentId(targetParentId, nextTarget, {
      menuChilds
    });
  
    // backend updates (как у вас было: update + updateOrder)
    try {
      await menuService.update(moved);
  
      // порядок поменялся в двух списках: source и target
      await menuService.updateOrder({ menus: nextSource });
      await menuService.updateOrder({ menus: nextTarget });
    } finally {
      queryClient.refetchQueries(["MENU"]);
      queryClient.refetchQueries(["MENU_CHILD"]);
      getMenuList();
    }
  }

  function computeMenuChildren(id, children = []) {
    const updated = { ...menuChilds };

    updated[id] = { open: true, children }

    dispatch(menuAccordionActions.toggleMenuChilds(updated));
  }

  const { isLoading: isLoadingMenuChild, refetch: refetchMenuChild } = useMenuListQuery({
    params: {
      parent_id: selectedFolder?.id ?? ROOT_PARENT_ID,
    },
    queryParams: {
      enabled: Boolean(selectedFolder?.id && !menuChilds?.[selectedFolder?.id]),
      onSuccess: (res) => {
        computeMenuChildren(
          selectedFolder?.id ?? ROOT_PARENT_ID,
          res?.menus ?? [],
        );
      },
    },
  });

  const getMenuLabel = (item) => {
    const label =
      item?.attributes?.[`label_${defaultLanguage}`] ??
      item?.attributes?.[`title_${defaultLanguage}`] ??
      item?.label ??
      item?.name;

    return label?.length > 18 ? `${label?.slice(0, 18)}..` : label;
  };

  return {
    activeId,
    setActiveId,
    sensors,
    handleDragEnd,
    menuChilds,
    getMenuLabel,
    handleMenuItemClick,
    isLoadingMenuChild,
    selectedFolder,
  }
}