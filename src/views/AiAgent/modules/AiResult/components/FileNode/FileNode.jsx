
import clsx from "clsx";
import cls from "./styles.module.scss";
import { getFileIcon, getFolderIcon } from "@/utils/getFileIcon";
import { sortTreeEntries } from "@/utils/buildFileTree";

export const FileNode = ({
  name,
  node,
  onOpen,
  activeFile,
  expandedFolders,
  toggleFolder,
  deep = 0,
}) => {
  if (node.type === "folder") {
    const isExpanded = expandedFolders.has(node.path);

    return (
      <div className={cls.folderWrapper}>
        <div
          className={cls.folder}
          style={{ paddingLeft: `${deep * 12 + 12}px` }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFolder(node.path);
          }}
        >
          <span className={cls.folderIcon}>{getFolderIcon(isExpanded)}</span>
          <span>{name}</span>
        </div>

        {isExpanded &&
          sortTreeEntries(Object.entries(node.children)).map(([childName, childNode]) => (
            <FileNode
              key={childNode.path}
              name={childName}
              node={childNode}
              onOpen={onOpen}
              activeFile={activeFile}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              deep={deep + 1}
            />
          ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(cls.file, {
        [cls.active]: activeFile === node.path,
      })}
      style={{ paddingLeft: `${deep * 12 + 12}px` }}
      onClick={() => onOpen(node.path)}
    >
      <span className={cls.fileIcon}>{getFileIcon(name)}</span>
      <span>{name}</span>
    </div>
  );
};
