import cls from "./styles.module.scss";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Collapse } from "@mui/material";
import { useTimelineRecursiveRowProps } from "./useTimelineRecursiveRowProps";
import clsx from "clsx";

export const TimelineRecursiveRow = ({
  groupItem: item,
  fieldsMap,
  view,
  groupByFields,
  level,
  selectedType,
  computedColumnsFor,
  setFocusedDays,
  datesList,
  zoomPosition,
  calendar_from_slug,
  calendar_to_slug,
  visible_field,
  openedRows,
  setOpenedRows,
  sub = false,
  lastLabels = "",
  isFirst = true,
  handleAllOpen = () => {},
  handleAllClose = () => {},
  computedData,
  setIsAllOpen,
}) => {
  const { handleClick, computedValue, open } = useTimelineRecursiveRowProps({
    item,
    fieldsMap,
    openedRows,
    setOpenedRows,
    lastLabels,
    handleAllOpen,
    handleAllClose,
    computedData,
    setIsAllOpen,
  });

  return (
    <div>
      <div className={cls.group_by_column}>
        <div
          onClick={item?.data?.[0]?.data ? handleClick : null}
          className={cls.group_by_column_header}
        >
          <div
            className={cls.group_by_column_header_inner}
            style={{ paddingLeft: sub ? `${level * 27}px` : "" }}
          >
            {item?.data?.[0]?.data && (
              <button
                className={clsx(cls.group_by_column_header_btn, {
                  [cls.open]: open,
                })}
              >
                <span className={cls.group_by_column_header_btn_inner}>
                  <PlayArrowRoundedIcon color="inherit" fontSize="medium" />
                </span>
              </button>
              // <>{open ? <ExpandLess /> : <ExpandMore />}</>
            )}
            <span className={cls.group_by_column_header_text}>
              {item?.group_by_type === "LOOKUP" ? computedValue : item?.label}
            </span>
          </div>
        </div>
        {item?.data &&
          item?.data?.map(
            (option, index) =>
              option?.data &&
              option?.data?.map((optionItem, optionIndex) => (
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <TimelineRecursiveRow
                    isFirst={false}
                    openedRows={openedRows}
                    setOpenedRows={setOpenedRows}
                    sub={true}
                    level={
                      option?.data?.length ? level + 1 : index + 1 + (level + 1)
                    }
                    groupItem={option}
                    fieldsMap={fieldsMap}
                    view={view}
                    groupByFields={groupByFields}
                    selectedType={selectedType}
                    computedColumnsFor={computedColumnsFor}
                    setFocusedDays={setFocusedDays}
                    datesList={datesList}
                    zoomPosition={zoomPosition}
                    calendar_from_slug={calendar_from_slug}
                    calendar_to_slug={calendar_to_slug}
                    visible_field={visible_field}
                    lastLabels={
                      lastLabels?.length
                        ? lastLabels + "." + item?.label
                        : item?.label
                    }
                  />
                </Collapse>
              ))
          )}
      </div>
    </div>
  );
};
