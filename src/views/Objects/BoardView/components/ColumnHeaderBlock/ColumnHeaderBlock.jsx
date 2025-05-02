import cls from "./styles.module.scss";
import { IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useRef } from "react";

export const ColumnHeaderBlock = ({
  tab,
  computedData,
  navigateToCreatePage,
  boardRef,
  fixed,
  field,
}) => {

  const fixedElement = useRef(null);

  const hasColor = tab?.color || field?.attributes?.has_color;

  const color =
    tab?.color ||
    field?.attributes?.options?.find((item) => item?.value === tab?.value)
      ?.color;
  
  useEffect(() => {
    if(fixed) {
      const board = boardRef.current;
      const el = fixedElement.current;
      if (!board || !el) return;

      const onScroll = () => {
        el.style.top = `${board.scrollTop}px`;
      };

      board.addEventListener("scroll", onScroll);

      return () => {
        board.removeEventListener("scroll", onScroll);
      };
    }
  }, []);

  return <div
      ref={fixedElement}
      className={`${cls.columnHeaderBlock} column-header`}
    >
      <div className={cls.leftSide}>
        <div className={cls.title}>
          <span
            style={{
              background: hasColor ? color + 33 : "rgb(139, 150, 160)",
              color: hasColor ? color - 50 : "#fff",
            }}
            className={cls.tabBlockStatus}
          >
            <span
              className={cls.dot}
              style={{ background: color ? color : "rgb(78, 84, 90)" }}
            />
            {tab.label}
          </span>
        </div>
        <div className={cls.counter}>{computedData?.length ?? 0}</div>
      </div>
      <div className={cls.rightSide}>
        <IconButton
          className={cls.addButton}
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();
            navigateToCreatePage();
          }}
        >
          <Add />
        </IconButton>
      </div>
  </div>
}