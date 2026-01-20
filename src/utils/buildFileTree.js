export function buildFileTree(files) {
  const root = {};

  files.forEach(({path}) => {
    const parts = path.split("/");
    let current = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath += (currentPath ? "/" : "") + part;
      const isFile = index === parts.length - 1;

      if (!current[part]) {
        current[part] = isFile
          ? { type: "file", path }
          : {
              type: "folder",
              path: currentPath,
              children: {},
            };
      }

      if (!isFile) {
        current = current[part].children;
      }
    });
  });

  return root;
}

export function sortTreeEntries(entries) {
  return entries.sort(([nameA, nodeA], [nameB, nodeB]) => {
    // folders first
    if (nodeA.type !== nodeB.type) {
      return nodeA.type === "folder" ? -1 : 1;
    }

    // same type → alphabetically
    return nameA.localeCompare(nameB);
  });
}
