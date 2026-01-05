import cls from "./styles.module.scss";

export const FileTree = ({ files, onOpen }) => {
  return <div className={cls.fileTree}>
    {Object.keys(files).map((path) => (
      <div className={cls.file} key={path} onClick={() => onOpen(path)}>
        {path}
      </div>
    ))}
  </div>
}
