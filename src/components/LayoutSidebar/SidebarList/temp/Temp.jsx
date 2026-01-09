import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const initialTree = [
  {
    id: '1',
    title: 'Folder 1',
    folder: true,
    children: [
      {
        id: '1.2',
        title: 'Folder 1.1',
        folder: true,
        children: [
          { id: '1.3', title: 'Item 1.1.1', folder: false },
          { id: '1.4', title: 'Item 1.1.2', folder: true, children: [
            { id: '1.5', title: 'Item 1.1.2.1', folder: false },
          ] },
        ],
      },
    ],
  },
  { id: '2', title: 'Item 1', folder: true, children: [
    
  ]},
  { id: '3', title: 'Item 2', folder: false },
];

function findNode(tree, id) {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const f = findNode(n.children, id);
      if (f) return f;
    }
  }
  return null;
}

function findParent(tree, id, parent = null) {
  for (const n of tree) {
    if (n.id === id) return parent;
    if (n.children) {
      const p = findParent(n.children, id, n);
      if (p) return p;
    }
  }
  return null;
}

function updateNode(tree, id, updater) {
  return tree.map(n => {
    if (n.id === id) return updater(n);
    if (n.children) return { ...n, children: updateNode(n.children, id, updater) };
    return n;
  });
}

function removeNode(tree, id) {
  return tree
    .map(n => {
      if (n.id === id) return null;
      if (n.children) return { ...n, children: removeNode(n.children, id) };
      return n;
    })
    .filter(Boolean);
}

function insertNode(tree, parentId, node, index = null) {
  if (!parentId) {
    const next = [...tree];
    if (index === null) next.push(node);
    else next.splice(index, 0, node);
    return next;
  }

  return tree.map(n => {
    if (n.id === parentId && n.folder) {
      const children = n.children || [];
      const next = [...children];
      if (index === null) next.push(node);
      else next.splice(index, 0, node);
      return { ...n, children: next, open: true };
    }
    if (n.children) return { ...n, children: insertNode(n.children, parentId, node, index) };
    return n;
  });
}

function TreeNode({ node, depth = 0, onToggle }) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: node.id,
    disabled: !node.folder,
  });

  const setRef = el => {
    setSortableRef(el);
    setDroppableRef(el);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 180ms cubic-bezier(0.2, 0, 0, 1)',
    padding: '8px 10px',
    borderRadius: 6,
    marginBottom: 4,
    marginLeft: depth * 12,
    background: isDragging
      ? '#e8f0ff'
      : isOver
      ? '#f1f5ff'
      : '#fff',
    boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
    cursor: 'grab',
    userSelect: 'none',
  };

  return (
    <div ref={setRef} style={style} {...attributes}>
      <div {...listeners} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {node.folder && (
          <span
            onClick={e => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            style={{ cursor: 'pointer', width: 14 }}
          >
            {node.open ? '▾' : '▸'}
          </span>
        )}
        <span>{node.folder ? '📁' : '📄'} {node.title}</span>
      </div>

      {node.folder && node.open && node.children && (
        <div style={{ marginTop: 6 }}>
          <SortableContext
            items={node.children.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {node.children.map(child => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                onToggle={onToggle}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

export default function SortableSidebarTree() {
  const [tree, setTree] = useState(initialTree);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  function onToggle(id) {
    setTree(t => updateNode(t, id, n => ({ ...n, open: !n.open })));
  }

  function onDragEnd({ active, over }) {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const dragged = findNode(tree, active.id);
    if (!dragged) return;

    const fromParent = findParent(tree, active.id);
    const toParent = findNode(tree, over.id)?.folder ? over.id : findParent(tree, over.id)?.id || null;

    if (fromParent?.id === toParent) {
      const siblings = fromParent ? fromParent.children : tree;
      const oldIndex = siblings.findIndex(n => n.id === active.id);
      const newIndex = siblings.findIndex(n => n.id === over.id);

      const reordered = arrayMove(siblings, oldIndex, newIndex);

      setTree(t =>
        fromParent
          ? updateNode(t, fromParent.id, n => ({ ...n, children: reordered }))
          : reordered
      );
      return;
    }

    const cleaned = removeNode(tree, active.id);
    const next = insertNode(cleaned, toParent, dragged);
    setTree(next);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={tree.map(n => n.id)}
        strategy={verticalListSortingStrategy}
      >
        {tree.map(n => (
          <TreeNode key={n.id} node={n} depth={0} onToggle={onToggle} />
        ))}
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2,0,0,1)' }}>
        {activeId && (
          <div
            style={{
              padding: '8px 10px',
              borderRadius: 6,
              background: '#e8f0ff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            }}
          >
            {findNode(tree, activeId)?.title}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
