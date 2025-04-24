import React, { useEffect, useRef, useState } from "react";
import TimeLineDayDataBlockItem from "./TimeLineDayDataBlockItem";
import { Collapse } from "@mui/material";
import cls from "./styles.module.scss";
import { addDays, format } from "date-fns";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";
import DrawerDetailPage from "../DrawerDetailPage";

export default function TimeLineDataRecursiveRow({
  item,
  index,
  groupbyFields,
  selectedType,
  computedColumnsFor,
  setFocusedDays,
  datesList,
  view,
  dateFilters,
  zoomPosition,
  calendar_from_slug,
  calendar_to_slug,
  visible_field,
  groupByList,
  openedRows,
  setOpenedRows,
  lastLabels = "",
  menuItem,
  fieldsMapPopup,
  refetch,
  setLayoutType,
  navigateToDetailPage,
  calendarRef,
  setOpenDrawerModal,
  setSelectedRow,
  deepLength,
}) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [cursorPosX, setCursorPosX] = useState(0);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isHintTaskShow, setIsHintTaskShow] = useState(false);

  const timelineRecursiveRowRef = useRef(null);

  const hintWidth = (selectedType === "month" ? 20 : 60) * 5;

  const handleOpenModal = () => {
    setOpenDrawerModal(true);
    const data = {
      ...item,
      [calendar_from_slug]: hoveredDate,
      [calendar_to_slug]: addDays(hoveredDate, 5),
      IS_NO_DATE: true,
      FROM_DATE_SLUG: calendar_from_slug,
      TO_DATE_SLUG: calendar_to_slug,
    };
    setSelectedRow(data);
  };

  useEffect(() => {
    if (
      openedRows.includes(
        lastLabels?.length ? lastLabels + "." + item?.label : item?.label
      )
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [item, openedRows, lastLabels]);

  const isTaskWithoutDate =
    !item?.data && !item?.[calendar_from_slug] && !item?.[calendar_to_slug];

  const handleMouseMove = (e) => {
    const scrollContainer = calendarRef.current;
    if (!scrollContainer) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const scrollLeft = scrollContainer.scrollLeft;

    const mouseXInContainer = e.clientX - containerRect.left + scrollLeft;

    const columnWidth = selectedType === "month" ? 20 : 60;
    const offsetLeft = 3 * columnWidth;
    const columnIndex = Math.floor(
      (mouseXInContainer - offsetLeft) / columnWidth
    );

    const hoveredColumnData = datesList[columnIndex];

    setHoveredDate(hoveredColumnData);

    // for hint task

    const container = timelineRecursiveRowRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrollLeftRow = container.scrollLeft;

    const mouseX = Math.floor(e.clientX) - rect.left + scrollLeftRow;

    const snappedX = Math.floor(mouseX / columnWidth) * columnWidth;

    setCursorPosX(snappedX);

    setFocusedDays([hoveredColumnData, addDays(hoveredColumnData, 5)]);
  };

  const isSingleGroup = deepLength === 1;

  return (
    <>
      <div
        className={cls.timelineRecursiveRow}
        onMouseMove={(e) => {
          if (isTaskWithoutDate) {
            handleMouseMove(e);
          }
        }}
        onMouseEnter={() => {
          if (isTaskWithoutDate) {
            setIsHintTaskShow(true);
          }
        }}
        onMouseLeave={() => {
          if (isTaskWithoutDate) {
            setIsHintTaskShow(false);
          }
        }}
        ref={timelineRecursiveRowRef}
      >
        {isHintTaskShow && (
          <span
            className={cls.timelineRecursiveRowLine}
            style={{ left: cursorPosX, width: `${hintWidth}px` }}
            onClick={handleOpenModal}
          >
            {hoveredDate && (
              <span className={cls.timelineRecursiveRowHint}>
                {format(new Date(hoveredDate), "LLLL-dd")}
                <ArrowRightAltRoundedIcon />
                {format(addDays(new Date(hoveredDate), 5), "LLLL-dd")}
              </span>
            )}
            {item?.[visible_field?.split("/")?.[0]]}
          </span>
        )}
        {(!item?.data || isSingleGroup) && (
          <TimeLineDayDataBlockItem
            menuItem={menuItem}
            key={isSingleGroup ? item?.data?.[0]?.guid : item?.guid}
            dateFilters={dateFilters}
            selectedType={selectedType}
            computedColumnsFor={computedColumnsFor}
            groupbyFields={groupbyFields}
            data={isSingleGroup ? item?.data?.[0] : item}
            levelIndex={index}
            groupByList={groupByList}
            setFocusedDays={setFocusedDays}
            datesList={datesList}
            view={view}
            zoomPosition={zoomPosition}
            calendar_from_slug={calendar_from_slug}
            calendar_to_slug={calendar_to_slug}
            visible_field={visible_field}
            fieldsMapPopup={fieldsMapPopup}
            refetch={refetch}
            setLayoutType={setLayoutType}
            navigateToDetailPage={navigateToDetailPage}
            setOpenDrawerModal={setOpenDrawerModal}
            setSelectedRow={setSelectedRow}
          />
        )}
      </div>

      {item?.data?.map(
        (option, subIndex) =>
          option?.data &&
          option?.data?.map((optionItem, optionIdex) => {
            return (
              <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                key={optionItem?.title}
              >
                <TimeLineDataRecursiveRow
                  lastLabels={
                    lastLabels?.length
                      ? lastLabels + "." + item?.label
                      : item?.label
                  }
                  openedRows={openedRows}
                  setOpenedRows={setOpenedRows}
                  key={optionItem?.title}
                  item={optionItem}
                  index={subIndex + index}
                  groupbyFields={groupbyFields}
                  selectedType={selectedType}
                  computedColumnsFor={computedColumnsFor}
                  setFocusedDays={setFocusedDays}
                  datesList={datesList}
                  view={view}
                  zoomPosition={zoomPosition}
                  calendar_from_slug={calendar_from_slug}
                  calendar_to_slug={calendar_to_slug}
                  visible_field={visible_field}
                  groupByList={groupByList}
                  fieldsMapPopup={fieldsMapPopup}
                  refetch={refetch}
                  setLayoutType={setLayoutType}
                  navigateToDetailPage={navigateToDetailPage}
                  calendarRef={calendarRef}
                  setOpenDrawerModal={setOpenDrawerModal}
                  setSelectedRow={setSelectedRow}
                />
              </Collapse>
            );
          })
      )}
      {openModal && (
        <ModalDetailPage
          open={openModal}
          setOpen={setOpenModal}
          selectedRow={{
            ...item,
            [calendar_from_slug]: hoveredDate,
            [calendar_to_slug]: addDays(new Date(hoveredDate), 5),
          }}
        />
      )}
    </>
  );
}
