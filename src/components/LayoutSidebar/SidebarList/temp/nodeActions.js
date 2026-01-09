export function findNode(tree, id) {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const f = findNode(n.children, id);
      if (f) return f;
    }
  }
  return null;
}

export function findParent(tree, id, parent = null) {
  for (const n of tree) {
    if (n.id === id) return parent;
    if (n.children) {
      const p = findParent(n.children, id, n);
      if (p) return p;
    }
  }
  return null;
}

export function updateNode(tree, id, updater) {
  return tree.map(n => {
    if (n.id === id) return updater(n);
    if (n.children) return { ...n, children: updateNode(n.children, id, updater) };
    return n;
  });
}

export function removeNode(tree, id) {
  return tree
    .map(n => {
      if (n.id === id) return null;
      if (n.children) return { ...n, children: removeNode(n.children, id) };
      return n;
    })
    .filter(Boolean);
}

export function insertNode(tree, parentId, node, index = null) {
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