import cls from "./styles.module.scss";
import { FileNode } from "../FileNode";
import { useMemo, useState } from "react";
import { buildFileTree, sortTreeEntries } from "@/utils/buildFileTree";
import { useDispatch, useSelector } from "react-redux";
import { editorActions } from "@/store/codeEditor/codeEditor.slice";

export const FileTree = ({ files, onOpen, activeFile }) => {

  const dispatch = useDispatch();

  const tree = useMemo(() => buildFileTree(files), [files]);

  // const [expandedFolders, setExpandedFolders] = useState(() => new Set());

  const expandedFolders = useSelector(
    (state) => state.codeEditor.expandedFolders
  );

  const toggleFolder = (path) => {
    dispatch(editorActions.toggleFolder(path))
    // setExpandedFolders((prev) => {
    //   const next = new Set(prev);
    //   if (next.has(path)) next.delete(path);
    //   else next.add(path);
    //   return next;
    // });
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
