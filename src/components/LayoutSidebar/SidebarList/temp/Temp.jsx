import React, { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  closestCenter,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import { menuAccordionActions } from "@/store/menus/menus.slice";
import menuService, { useMenuListQuery } from "@/services/menuService";

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

function updateNode(tree, id, updater) {
  return tree.map((n) => {
    if (n.id === id) return updater(n);
    if (n.children)
      return { ...n, children: updateNode(n.children, id, updater) };
    return n;
  });
}

function removeNode(menuList, id) {
  return menuList
    .map((n) => {
      if (n.id === id) return null;
      if (n.children) return { ...n, children: removeNode(n.children, id) };
      return n;
    })
    .filter(Boolean);
}

function insertNode(menuList, parentId, node, index = null) {
  if (!parentId) {
    const next = [...menuList];
    if (index === null) next.push(node);
    else next.splice(index, 0, node);
    return next;
  }

  return menuList.map((n) => {
    if (n.id === parentId && n.folder) {
      const children = n.children || [];
      const next = [...children];
      if (index === null) next.push(node);
      else next.splice(index, 0, node);
      return { ...n, children: next };
    }
    if (n.children)
      return { ...n, children: insertNode(n.children, parentId, node, index) };
    return n;
  });
}

function TreeNode({ node, depth = 0, onToggle, menuChilds, getMenuLabel }) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const isFolder = node.type === "FOLDER";

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: node.id,
    // disabled: !isFolder,
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

  const currentNode = menuChilds?.[node.id];

  const children = Array.isArray(currentNode?.children)
    ? currentNode?.children
    : [];

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
            style={{ cursor: "pointer", width: 14 }}
          >
            {currentNode?.open ? "▾" : "▸"}
          </span>
        )}
        <span>
          {isFolder ? "📁" : "📄"} {getMenuLabel(node)}
        </span>
      </div>

      {isFolder && currentNode?.open && children && (
        <div style={{ marginTop: 6 }}>
          <SortableContext
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

export default function SortableSidebarTree({
  menuList,
  menuChilds,
  getMenuLabel,
  setMenuList,
}) {
  const dispatch = useDispatch();

  const [activeId, setActiveId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(ROOT_PARENT_ID);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function onToggle(id) {
    setSelectedFolderId(id);
    dispatch(menuAccordionActions.toggleMenuOpen({ id }));
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

  function getListByParentId(parentId, { menuList, menuChilds }) {
    if (!parentId || parentId === ROOT_PARENT_ID) return menuList || [];
    return menuChilds?.[parentId]?.children || [];
  }

  async function onDragEnd(evt) {
    const { active, over } = evt;

    if (!over || active.id === over.id) return;

    const activeItem = findItemEverywhere(active.id, { menuList, menuChilds });
    const overItem = findItemEverywhere(over.id, { menuList, menuChilds });

    if (!activeItem || !overItem) return;

    setActiveId(null);
    if (!over || active.id === over.id) return;

    const dragged = findItemEverywhere(active.id, { menuList, menuChilds });

    if (!dragged) return;

    const fromParentId =
      findItemEverywhere(activeItem.parent_id, {
        menuList,
        menuChilds,
      })?.id || ROOT_PARENT_ID;

    const toParentId =
      over.id === ROOT_DROP_ID
        ? ROOT_PARENT_ID
        : overItem?.type === "FOLDER"
          ? overItem.id
          : overItem?.parent_id || ROOT_PARENT_ID;

    if (fromParentId === toParentId) {
      const siblings = fromParentId
        ? menuChilds[fromParentId].children
        : menuList;

      const oldIndex = siblings.findIndex((n) => n.id === active.id);
      const newIndex = siblings.findIndex((n) => n.id === over.id);

      const reordered = arrayMove(siblings, oldIndex, newIndex);

      setListByParentId(fromParentId, reordered, { menuChilds });

      try {
        await menuService.updateOrder({ menus: reordered });
      } catch (error) {
        // queryClient.refetchQueries(["MENU"]);
        // queryClient.refetchQueries(["MENU_CHILD"]);
      }
      return;
    } else {
      const fromList = getListByParentId(fromParentId, {
        menuList,
        menuChilds,
      });
      const toList = getListByParentId(toParentId, { menuList, menuChilds });

      console.log({ toList, fromList });

      // const oldIndex = fromList.findIndex((n) => n.id === active.id);
      const newIndex = toList.findIndex((n) => n.id === over.id);

      // const reordered = arrayMove(fromList, oldIndex, newIndex);

      const updatedItem = { ...dragged, parent_id: toParentId };

      const removedList = removeNode(fromList, active.id);

      await menuService.updateOrder({ menus: removedList });
      await menuService.update(updatedItem);

      // const next = insertNode(removedList, toParentId, dragged, newIndex);

      // console.log(next);

      setListByParentId(fromParentId, fromList, { menuChilds });
      setListByParentId(toParentId, toList, { menuChilds });
    }

    // const cleaned = removeNode(tree, active.id);
    // const next = insertNode(cleaned, toParentId, dragged);
    // setTree(next);
  }

  const activeItem = activeId
    ? findItemEverywhere(activeId, { menuList, menuChilds })
    : null;

  function computeMenuChildren(id, children = []) {
    const updated = { ...menuChilds };

    updated[id] = { open: true, children };

    dispatch(menuAccordionActions.toggleMenuChilds(updated));
  }

  const { isLoading: isLoadingMenuChild, refetch: refetchMenuChild } =
    useMenuListQuery({
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
}
