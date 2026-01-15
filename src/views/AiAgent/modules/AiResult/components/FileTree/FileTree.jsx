import cls from "./styles.module.scss";
import { FileNode } from "../FileNode";
import { useMemo, useState } from "react";
import { buildFileTree, sortTreeEntries } from "@/utils/buildFileTree";

export const FileTree = ({ files, onOpen, activeFile }) => {
  const tree = useMemo(() => buildFileTree(files), [files]);

  const [expandedFolders, setExpandedFolders] = useState(() => new Set());

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div className={cls.fileTree}>
      {sortTreeEntries(Object.entries(tree)).map(([name, node]) => (
        <FileNode
          key={node.path}
          name={name}
          node={node}
          onOpen={onOpen}
          activeFile={activeFile}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
        />
      ))}
    </div>
  );
};
