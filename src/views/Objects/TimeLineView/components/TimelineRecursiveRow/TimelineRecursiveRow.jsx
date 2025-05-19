import cls from "./styles.module.scss";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
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
  childData,
}) => {
  const { handleClick, computedValue, open, hoveredRowId, searchText } =
    useTimelineRecursiveRowProps({
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

  const slug = view?.attributes?.visible_field?.split("/")[0];

  const label =
    level === 0 && !item?.data
      ? item?.[slug]
      : item?.group_by_type === "LOOKUP"
        ? computedValue
        : item?.label;

  const labelText = Array.isArray(label) ? label[0] : label;

  const searchedChars = labelText?.match(new RegExp(searchText, "gi")) || [];

  const withHighlight = labelText?.replace(
    searchedChars?.join(""),
    `<span class=${cls.highlighted}>${searchedChars?.join("")}</span>`
  );

  return (
    <div>
      <div className={cls.group_by_column}>
        <div
          onClick={item?.data?.[0]?.data ? handleClick : null}
          className={clsx(cls.group_by_column_header, {
            [cls.hovered]:
              hoveredRowId === childData?.guid || Array.isArray(item?.data)
                ? item?.data?.find((item) => item?.guid === hoveredRowId)
                : hoveredRowId === item?.guid,
          })}
        >
          <div
            className={cls.group_by_column_header_inner}
            style={{ paddingLeft: sub ? `${level * 30}px` : "" }}
          >
            {item?.data?.[0]?.data && (
              <button
                className={clsx(cls.group_by_column_header_btn, {
                  [cls.open]: open,
                })}
              >
                <span className={cls.group_by_column_header_btn_inner}>
                  <ExpandMoreRoundedIcon color="inherit" fontSize="medium" />
                </span>
              </button>
              // <>{open ? <ExpandLess /> : <ExpandMore />}</>
            )}
            <span className={cls.group_by_column_header_text}>
              {searchText && searchedChars?.length ? (
                <span dangerouslySetInnerHTML={{ __html: withHighlight }} />
              ) : (
                <span>{label}</span>
              )}
            </span>
            {/* <span className={cls.group_by_column_header_text}>
                {searchText ? withHighlight : label}
              </span> */}
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
                    childData={optionItem}
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
