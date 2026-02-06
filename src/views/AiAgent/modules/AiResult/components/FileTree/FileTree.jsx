import cls from "./styles.module.scss";
import { FileNode } from "../FileNode";
import { useMemo } from "react";
import { buildFileTree, sortTreeEntries } from "@/utils/buildFileTree";
import { useDispatch, useSelector } from "react-redux";
import { editorActions } from "@/store/codeEditor/codeEditor.slice";
import { GlobalSearch } from "../GlobalSearch";
import clsx from "clsx";
import { FilesIcon, SearchIcon } from "@/utils/constants/icons";

export const FileTree = ({
  files,
  onOpen,
  activeFile,
  isSearchOpen,
  searchQuery,
  setIsSearchOpen,
  searchResults,
  handleGlobalSearch,
  jumpToCode,
  expandedFiles,
  toggleFile,
}) => {
  const dispatch = useDispatch();

  const tree = useMemo(() => buildFileTree(files), [files]);

  const toggleFolder = (path) => {
    dispatch(editorActions.toggleFolder(path));
  };

  const expandedFolders = useSelector(
    (state) => state.codeEditor.expandedFolders,
  );

  return (
    <div className={cls.fileTree}>
      <div className={cls.header}>
        <div className={cls.tabs}>
          <button
            className={clsx(cls.tabButton, { [cls.active]: !isSearchOpen })}
            onClick={() => setIsSearchOpen(false)}
          >
            <FilesIcon color="currentColor" />
          </button>
          <button
            className={clsx(cls.tabButton, { [cls.active]: isSearchOpen })}
            onClick={() => setIsSearchOpen(true)}
          >
            <SearchIcon color="currentColor" />
          </button>
        </div>
      </div>
      {isSearchOpen && (
        <GlobalSearch
          searchQuery={searchQuery}
          expandedFiles={expandedFiles}
          searchResults={searchResults}
          handleGlobalSearch={handleGlobalSearch}
          jumpToCode={jumpToCode}
          toggleFile={toggleFile}
        />
      )}
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
