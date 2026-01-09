import menuService from "@/services/menuService";
import { menuAccordionActions } from "@/store/menus/menus.slice";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";

export const useSidebarListProps = ({ menuList, setMenuList, getMenuList }) => {

  const ROOT_PARENT_ID = "c57eedc3-a954-4262-a0af-376c65b5a284";

  const rootDropId = "ROOT_DROP_ZONE"

  const menuChilds = useSelector((state) => state?.menuAccordion?.menuChilds);

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const [activeId, setActiveId] = useState(null);

  const { i18n } = useTranslation();

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
    // const targetParentId =
    //   overItem.type === "FOLDER"
    //     ? overItem.id
    //     : (overItem.parent_id || ROOT_PARENT_ID);

    const targetParentId =
      over.id === rootDropId
        ? ROOT_PARENT_ID
        : overItem.type === 'FOLDER'
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
        menuList,
        menuChilds,
        setMenuList,
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
      menuList,
      menuChilds,
      dispatch,
      setMenuList,
      menuAccordionActions,
    });
  
    setListByParentId(targetParentId, nextTarget, {
      menuList,
      menuChilds,
      dispatch,
      menuAccordionActions,
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
  
  const getMenuLabel = (item) => {
    const label =
      item?.attributes?.[`label_${i18n.language}`] ??
      item?.attributes?.[`title_${i18n.language}`] ??
      item?.label ??
      item?.name;

    return label?.length > 18 ? `${label?.slice(0, 18)}..` : label;
  };

  return {
    handleDragEnd,
    activeId,
    setActiveId,
    getMenuLabel,
    findItemEverywhere,
    menuChilds,
    rootDropId,
  }
}