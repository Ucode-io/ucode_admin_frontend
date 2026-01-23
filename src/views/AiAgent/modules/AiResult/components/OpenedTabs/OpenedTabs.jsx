import { getFileIcon } from "@/utils/getFileIcon";
import cls from "./styles.module.scss";
import clsx from "clsx";
import { useEffect, useRef } from "react";

export const OpenedTabs = ({ openedFiles, activeFile, openFile, closeFile, changedFiles }) => {

  const containerRef = useRef(null);
  const itemRefs = useRef({});

  function scrollToActiveItem(id) {
    const container = containerRef.current;
    const item = itemRefs.current[id];
  
    if (!container || !item) return;
  
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
  
    const isLast =
      itemRect.right >= containerRect.right - 1;
  
    if (!isLast) {
      item.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    } else {
      item.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    }
  }

  useEffect(() => {
    scrollToActiveItem(activeFile);
  }, [activeFile]);

  return <div className={cls.tabs} ref={containerRef}>
    {openedFiles.map((path, index) => (
      <div
        key={path}
        className={clsx(cls.tab, { [cls.active]: activeFile === path })}
        onClick={() => openFile(path)}
        ref={el => (itemRefs.current[path] = el)}
      >
        <span className={cls.tabIcon}>{getFileIcon(path)}</span>
        {path.split("/").pop()}
        {
          changedFiles.includes(path) && <span className={cls.changed} />
        }
        <button
          className={cls.close}
          onClick={(e) => {
            e.stopPropagation();
            closeFile(path, index);
          }}
        >
          ✕
        </button>
      </div>
    ))}
</div>
}