import cls from "./styles.module.scss";
import { IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useRef } from "react";
import { FIELD_TYPES } from "../../../../../utils/constants/fieldTypes";

export const ColumnHeaderBlock = ({
  group,
  navigateToCreatePage,
  groupField,
  boardTab,
  counts,
  field,
  computedColumnsFor,
  groupSlug,
}) => {
  const fixedElement = useRef(null);

  const item = computedColumnsFor?.find((field) => field?.slug === groupSlug);

  const color =
    item?.type === FIELD_TYPES.STATUS
      ? item?.attributes?.todo?.options?.find(
          (item) => item?.label === group?.name
        )?.color ||
        item?.attributes?.complete?.options?.find(
          (item) => item?.label === group?.name
        )?.color ||
        item?.attributes?.progress?.options?.find(
          (item) => item?.label === group?.name
        )?.color
      : item?.attributes?.options?.find((item) => item?.label === group?.name)
          ?.color;

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
