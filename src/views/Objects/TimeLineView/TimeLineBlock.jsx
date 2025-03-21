import React, {useEffect, useMemo, useRef, useState} from "react";
import TimeLineDatesRow from "./TimeLineDatesRow";
import TimeLineDayDataBlock from "./TimeLineDayDataBlocks";
import TimeLineRecursiveRow from "./TimeLineRecursiveRow";
import styles from "./styles.module.scss";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../store/alert/alert.thunk";
import {isSameDay, isWithinInterval} from "date-fns";
import { Sidebar } from "./components/Sidebar";
import { TimelineRecursiveRow } from "./components/TimelineRecursiveRow";

export default function TimeLineBlock({
  setDataFromQuery,
  dataFromQuery,
  data,
  fieldsMap,
  datesList,
  view,
  tabs,
  handleScrollClick,
  zoomPosition,
  setDateFilters,
  dateFilters,
  selectedType,
  calendar_from_slug,
  calendar_to_slug,
  visible_field,
  computedColumnsFor,
  isLoading,
}) {
  const scrollContainerRef = useRef(null);
  const [focusedDays, setFocusedDays] = useState([]);
  const [openedRows, setOpenedRows] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const dispatch = useDispatch();
  const groupbyFields = useMemo(() => {
    return view?.group_fields?.map((field) => {
      return fieldsMap?.[field];
    });
  }, [view?.group_fields, fieldsMap]);

  useEffect(() => {
    handleScrollClick();
  }, []);

  useEffect(() => {
    if (Boolean(calendar_from_slug) && Boolean(calendar_to_slug)) {
      if (calendar_from_slug === calendar_to_slug)
        dispatch(
          showAlert(
            "Date from and date to are same. Please select different dates!",
            "error"
          )
        );
    }
  }, [calendar_from_slug, calendar_to_slug]);

  const computedData = useMemo(() => {
    let result = [];

    data?.forEach((record) => {
      let shouldDuplicate = false;

      if (!record?.data?.length) {
        result.push(record);
        return;
      }

      for (let i = 0; i < record.data.length; i++) {
        let { start_date, end_date } = record.data[i];
        let startDate = start_date ? new Date(start_date) : null;
        let endDate = end_date ? new Date(end_date) : null;

        if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate))
          continue;

        for (let j = i + 1; j < record.data.length; j++) {
          let { start_date: otherStartDate, end_date: otherEndDate } =
            record.data[j];
          let otherStart = otherStartDate ? new Date(otherStartDate) : null;
          let otherEnd = otherEndDate ? new Date(otherEndDate) : null;

          if (!otherStart || !otherEnd || isNaN(otherStart) || isNaN(otherEnd))
            continue;

          if (hasSameDay(startDate, endDate, otherStart, otherEnd)) {
            shouldDuplicate = true;
            break;
          }
        }

        if (shouldDuplicate) break;
      }

      if (shouldDuplicate) {
        result.push({ ...record, data: record.data.slice(1) });

        result.push({ ...record, data: [record.data[0]] });
      } else {
        result.push(record);
      }
    });

    return result;
  }, [data]);

  function hasSameDay(startDate1, endDate1, startDate2, endDate2) {
    return (
      isSameDay(startDate1, startDate2) ||
      isSameDay(startDate1, endDate2) ||
      isSameDay(endDate1, startDate2) ||
      isSameDay(endDate1, endDate2) ||
      isWithinInterval(startDate2, { start: startDate1, end: endDate1 }) ||
      isWithinInterval(endDate2, { start: startDate1, end: endDate1 }) ||
      isWithinInterval(startDate1, { start: startDate2, end: endDate2 }) ||
      isWithinInterval(endDate1, { start: startDate2, end: endDate2 })
    );
  }

  return (
    <div
      className={styles.main_container}
      style={{
        height: `${view?.group_fields?.length ? "100$" : "calc(100vh - 103px"}`,
      }}
    >
      {/* {view?.attributes?.group_by_columns?.length !== 0 && (
        <div className={styles.group_by}>
          <div
            className={`${styles.fakeDiv} ${
              selectedType === "month" ? styles.month : ""
            }`}
          >
            Columns
          </div>

          {calendar_from_slug !== calendar_to_slug && (
            <div className={styles.group_by_columns}>
              {computedData?.map((item, index) => (
                <TimeLineRecursiveRow
                  openedRows={openedRows}
                  setOpenedRows={setOpenedRows}
                  level={0}
                  groupItem={item}
                  fieldsMap={fieldsMap}
                  view={view}
                  groupbyFields={groupbyFields}
                  selectedType={selectedType}
                  computedColumnsFor={computedColumnsFor}
                  setFocusedDays={setFocusedDays}
                  datesList={datesList}
                  zoomPosition={zoomPosition}
                  calendar_from_slug={calendar_from_slug}
                  calendar_to_slug={calendar_to_slug}
                  visible_field={visible_field}
                />
              ))}
            </div>
          )}
        </div>
      )} */}

      {view?.attributes?.group_by_columns?.length !== 0 && isSidebarOpen && (
        <Sidebar
          handleCloseSidebar={handleCloseSidebar}
          view={view}
          computedData={computedData}
          openedRows={openedRows}
          setOpenedRows={setOpenedRows}
          fieldsMap={fieldsMap}
          groupByFields={groupbyFields}
          computedColumnsFor={computedColumnsFor}
          setFocusedDays={setFocusedDays}
          datesList={datesList}
          zoomPosition={zoomPosition}
        />
      )}
      <div
        className={styles.gantt}
        ref={scrollContainerRef}
        // onScroll={handleScroll}
      >
        <TimeLineDatesRow
          focusedDays={focusedDays}
          datesList={datesList}
          zoomPosition={zoomPosition}
          selectedType={selectedType}
        />

        {calendar_from_slug !== calendar_to_slug && (
          <TimeLineDayDataBlock
            openedRows={openedRows}
            setOpenedRows={setOpenedRows}
            computedColumnsFor={computedColumnsFor}
            groupbyFields={groupbyFields}
            setFocusedDays={setFocusedDays}
            selectedType={selectedType}
            zoomPosition={zoomPosition}
            data={computedData}
            fieldsMap={fieldsMap}
            view={view}
            tabs={tabs}
            datesList={datesList}
            calendar_from_slug={calendar_from_slug}
            calendar_to_slug={calendar_to_slug}
            visible_field={visible_field}
          />
        )}
      </div>
    </div>
  );
}
