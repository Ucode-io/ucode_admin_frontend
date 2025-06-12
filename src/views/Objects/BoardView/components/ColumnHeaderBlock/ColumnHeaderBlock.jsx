import cls from "./styles.module.scss";
import { IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useRef } from "react";

export const ColumnHeaderBlock = ({
  group,
  navigateToCreatePage,
  groupField,
  boardTab,
  counts,
  field,
}) => {
  const fixedElement = useRef(null);

  const color = groupField?.attributes?.options?.find(
    (item) => item?.label === group?.name || item?.value === group?.name
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
            <span className={cls.label}>{field}</span>
          </span>
        </div>
        <div className={cls.counter}>
          {(counts?.[group?.name] || group?.count) ?? 0}
        </div>
      </div>
      <div className={cls.rightSide}>
        <IconButton
          className={cls.addButton}
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();
            navigateToCreatePage({ group });
          }}
        >
          <Add />
        </IconButton>
      </div>
    </div>
  );
};
