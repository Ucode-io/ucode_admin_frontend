import React, { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useDispatch } from "react-redux";
import { menuAccordionActions } from "@/store/menus/menus.slice";
import menuService, { useMenuListQuery } from "@/services/menuService";
import { useQueryClient } from "react-query";
import { TreeNode } from "../TreeNode";
import { useNavigate } from "react-router-dom";

const ROOT_PARENT_ID = "c57eedc3-a954-4262-a0af-376c65b5a284";
const ROOT_DROP_ID = "ROOT_DROP_ZONE";

function findItemEverywhere(id, { menuList, menuChilds }) {
  const inRoot = (menuList || []).find((x) => x.id === id);
  if (inRoot) return inRoot;

  const childs = menuChilds || {};
  for (const pid of Object.keys(childs)) {
    const found = (childs[pid]?.children || []).find((x) => x.id === id);
    if (found) return found;
  }

  return null;
}

export const SortableSidebarTree = ({
  menuList,
  menuChilds,
  getMenuLabel,
  setMenuList,
}) => {
  const dispatch = useDispatch();

  const [activeId, setActiveId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(ROOT_PARENT_ID);

  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const navigate = useNavigate();

  function onToggle(node) {
    const id = node.id;

    const isOpening = !menuChilds?.[id]?.open;

    if (isOpening) {
      setSelectedFolderId(id);
    }

    if (node?.type !== "FOLDER") navigate(`/${id}`);

    dispatch(menuAccordionActions.toggleMenuOpen({ id }));
  }

  function getListByParentId(parentId, { menuList, menuChilds }) {
    if (!parentId || parentId === ROOT_PARENT_ID) return menuList || [];
    return menuChilds?.[parentId]?.children || [];
  }

  async function onDragEnd(evt) {
    const { active, over } = evt;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // 1. Ищем объекты
    const dragged = findItemEverywhere(active.id, { menuList, menuChilds });
    const overItem = findItemEverywhere(over.id, { menuList, menuChilds });

    // Если бросили в пустую область корня, overItem может быть null, но over.id будет ROOT_DROP_ID
    if (!dragged) return;

    // 2. Определяем ID старого и нового родителя
    const fromParentId = dragged.parent_id || ROOT_PARENT_ID;
    const toParentId =
      over.id === ROOT_DROP_ID
        ? ROOT_PARENT_ID
        : overItem?.type === "FOLDER"
          ? overItem.id
          : overItem?.parent_id || ROOT_PARENT_ID;

    // 3. Подготавливаем новые структуры данных (копии) для атомарного обновления
    let nextMenuList = [...menuList];
    let nextMenuChilds = { ...menuChilds };

    // Вспомогательная функция для записи изменений в наши копии
    const updateLocalState = (parentId, newList) => {
      if (parentId === ROOT_PARENT_ID) {
        nextMenuList = newList;
      } else {
        nextMenuChilds[parentId] = {
          ...(nextMenuChilds[parentId] || { open: true }),
          children: newList,
          open: true,
        };
      }
    };

    const fromList = getListByParentId(fromParentId, { menuList, menuChilds });

    // СЦЕНАРИЙ А: Перемещение внутри одного списка (Reorder)
    if (fromParentId === toParentId) {
      const oldIndex = fromList.findIndex((n) => n.id === active.id);
      const newIndex = fromList.findIndex((n) => n.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(fromList, oldIndex, newIndex);
        updateLocalState(fromParentId, reordered);

        // Один dispatch для всех изменений
        setMenuList(nextMenuList);
        dispatch(menuAccordionActions.toggleMenuChilds(nextMenuChilds));

        try {
          await menuService.updateOrder({ menus: reordered });
        } catch (e) {
          console.error("Order update failed", e);
        }
      }
      return;
    }

    // СЦЕНАРИЙ Б: Перемещение между разными уровнями (Move)
    const toList = getListByParentId(toParentId, { menuList, menuChilds });

    const updatedItem = {
      ...dragged,
      parent_id: toParentId === ROOT_PARENT_ID ? null : toParentId,
    };

    // 1. Удаляем из старого (фильтруем, чтобы наверняка не осталось дублей)
    const nextFromList = fromList.filter((n) => n.id !== active.id);

    // 2. Вставляем в новый
    const nextToList = [...toList].filter((n) => n.id !== active.id); // защита от дублей
    const overIndex = nextToList.findIndex((n) => n.id === over.id);

    // Если бросили на папку — в начало/конец папки, если на элемент — в его позицию
    const insertIndex =
      overItem?.type === "FOLDER"
        ? 0 // или nextToList.length, если хотите в конец
        : overIndex >= 0
          ? overIndex
          : nextToList.length;

    nextToList.splice(insertIndex, 0, updatedItem);

    // 3. Применяем оба изменения к нашим копиям состояния
    updateLocalState(fromParentId, nextFromList);
    updateLocalState(toParentId, nextToList);

    // 4. АТОМАРНЫЙ DISPATCH (UI обновится один раз со всеми изменениями)
    setMenuList(nextMenuList);
    dispatch(menuAccordionActions.toggleMenuChilds(nextMenuChilds));

    // 5. Запросы к API
    try {
      // Сначала меняем родителя
      await menuService.update(updatedItem);
      // Затем обновляем порядок в обоих списках
      await Promise.all([
        menuService.updateOrder({ menus: nextFromList }),
        menuService.updateOrder({ menus: nextToList }),
      ]);
    } catch (error) {
      console.error("Move failed", error);
      // При критической ошибке можно вызвать getMenuList() для синхронизации с базой
    } finally {
      queryClient.invalidateQueries(["MENU"]);
      queryClient.invalidateQueries(["MENU_CHILD"]);
    }
  }

  const activeItem = activeId
    ? findItemEverywhere(activeId, { menuList, menuChilds })
    : null;

  function computeMenuChildren(id, children = []) {
    const updated = { ...menuChilds };

    updated[id] = { open: true, children };

    dispatch(menuAccordionActions.toggleMenuChilds(updated));
  }

  const { refetch: refetchMenuChild } = useMenuListQuery({
    params: {
      parent_id: selectedFolderId ?? ROOT_PARENT_ID,
    },
    queryParams: {
      enabled: Boolean(selectedFolderId),
      onSuccess: (res) => {
        computeMenuChildren(
          selectedFolderId ?? ROOT_PARENT_ID,
          res?.menus ?? [],
        );
      },
    },
  });

  useEffect(() => {
    refetchMenuChild();
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        id={ROOT_DROP_ID}
        items={menuList.map((n) => n.id)}
        strategy={verticalListSortingStrategy}
      >
        {menuList.map((n) => (
          <TreeNode
            key={n.id}
            node={n}
            depth={0}
            onToggle={onToggle}
            menuChilds={menuChilds}
            getMenuLabel={getMenuLabel}
            // handlers={handlers}
          />
        ))}
      </SortableContext>

      <DragOverlay
        dropAnimation={{ duration: 180, easing: "cubic-bezier(0.2,0,0,1)" }}
      >
        {activeId && (
          <div
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              background: "#e8f0ff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }}
          >
            {getMenuLabel(activeItem)}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
