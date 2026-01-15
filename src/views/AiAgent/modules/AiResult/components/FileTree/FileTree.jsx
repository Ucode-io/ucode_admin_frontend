import clsx from "clsx";
import cls from "./styles.module.scss";

export const FileTree = ({ files, onOpen, activeFile }) => {
  return (
    <div className={cls.fileTree}>
      {Object.keys(files).map((path) => (
        <div
          className={clsx(cls.file, { [cls.active]: activeFile === path })}
          key={path}
          onClick={() => onOpen(path)}
        >
          {path}
        </div>
      ))}
    </div>
  );
};
