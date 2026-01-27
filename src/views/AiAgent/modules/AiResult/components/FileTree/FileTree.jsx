import cls from "./styles.module.scss";
import { FileNode } from "../FileNode";
import { useMemo } from "react";
import { buildFileTree, sortTreeEntries } from "@/utils/buildFileTree";
import { useDispatch, useSelector } from "react-redux";
import { editorActions } from "@/store/codeEditor/codeEditor.slice";

export const FileTree = ({ files, onOpen, activeFile }) => {
  const dispatch = useDispatch();

  const tree = useMemo(() => buildFileTree(files), [files]);

  const toggleFolder = (path) => {
    dispatch(editorActions.toggleFolder(path));
  };

  const expandedFolders = useSelector(
    (state) => state.codeEditor.expandedFolders,
  );

  // const tabs = {
  //   files: {
  //     label: "files",
  //     component: (
  //       <div className={cls.fileTree}>
  //         {sortTreeEntries(Object.entries(tree)).map(([name, node]) => (
  //           <FileNode
  //             key={node.path}
  //             name={name}
  //             node={node}
  //             onOpen={onOpen}
  //             activeFile={activeFile}
  //             expandedFolders={expandedFolders}
  //             toggleFolder={toggleFolder}
  //           />
  //         ))}
  //       </div>
  //     ),
  //   },
  //   search: {
  //     label: "search",
  //     component: (
  //       <div className={cls.search}>
  //         <p>Search: </p>
  //       </div>
  //     ),
  //   },
  // };

  // const [activeTab, setActiveTab] = useState(tabs.files);

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
