import cls from "./styles.module.scss";
import { IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useRef } from "react";

export const ColumnHeaderBlock = ({
  tab,
  navigateToCreatePage,
  groupField,
  boardTab,
  counts,
}) => {
  const fixedElement = useRef(null);

  const color = groupField?.attributes?.options?.find(
    (item) => item?.label === tab?.name || item?.value === tab?.name
  )?.color;

  return (
    <div
      ref={fixedElement}
      className={`${cls.columnHeaderBlock} column-header`}
    >
      <div className={cls.leftSide}>
        <div className={cls.title}>
          <span
            style={{
              background: color ? color + 33 : "rgb(139, 150, 160)",
              color: color ? color : "#fff",
            }}
            className={cls.tabBlockStatus}
          >
            <span
              className={cls.dot}
              style={{ background: color ? color : "rgb(78, 84, 90)" }}
            />
            <span className={cls.label}>{tab.name}</span>
          </span>
        </div>
        <div className={cls.counter}>
          {(counts?.[tab?.name] || tab?.count) ?? 0}
        </div>
      </div>
      <div className={cls.rightSide}>
        <IconButton
          className={cls.addButton}
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();
            navigateToCreatePage({ tab: tab?.name });
          }}
        >
          <Add />
        </IconButton>
      </div>
    </div>
  );
};
