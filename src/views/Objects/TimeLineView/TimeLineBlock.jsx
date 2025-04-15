import React, {useEffect, useMemo, useRef, useState} from "react";
import TimeLineDatesRow from "./TimeLineDatesRow";
import TimeLineDayDataBlock from "./TimeLineDayDataBlocks";
import TimeLineRecursiveRow from "./TimeLineRecursiveRow";
import styles from "./styles.module.scss";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../store/alert/alert.thunk";
import {isSameDay, isWithinInterval} from "date-fns";
import { Sidebar } from "./components/Sidebar";
import { Button, Divider, Menu } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import { SidebarButton } from "./components/SidebarButton";

export default function TimeLineBlock({
  setDataFromQuery,
  dataFromQuery,
  data,
  fieldsMap,
  datesList,
  view,
  tabs,
  scrollToToday,
  setDateFilters,
  dateFilters,
  calendar_from_slug,
  calendar_to_slug,
  visible_field,
  computedColumnsFor,
  months,
  // setMonths,
}) {
  const scrollContainerRef = useRef(null);
  const [focusedDays, setFocusedDays] = useState([]);
  const [openedRows, setOpenedRows] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const calendarRef = useRef(null);
  const isLoading = useRef(null);

  const dispatch = useDispatch();
  const groupbyFields = useMemo(() => {
    return view?.group_fields?.map((field) => {
      return fieldsMap?.[field];
    });
  }, [view?.group_fields, fieldsMap]);

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

  const computedDataRef = useRef([]);
  const [computedData, setComputedData] = useState([]);

  // const computedData = useMemo(() => {
  //   let result = [];

  //   data?.forEach((record) => {
  //     let shouldDuplicate = false;

  //     if (!record?.data?.length) {
  //       result.push(record);
  //       return;
  //     }

  //     for (let i = 0; i < record.data.length; i++) {
  //       let { start_date, end_date } = record.data[i];
  //       let startDate = start_date ? new Date(start_date) : null;
  //       let endDate = end_date ? new Date(end_date) : null;

  //       if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate))
  //         continue;

  //       for (let j = i + 1; j < record.data.length; j++) {
  //         let { start_date: otherStartDate, end_date: otherEndDate } =
  //           record.data[j];
  //         let otherStart = otherStartDate ? new Date(otherStartDate) : null;
  //         let otherEnd = otherEndDate ? new Date(otherEndDate) : null;

  //         if (!otherStart || !otherEnd || isNaN(otherStart) || isNaN(otherEnd))
  //           continue;

  //         if (hasSameDay(startDate, endDate, otherStart, otherEnd)) {
  //           shouldDuplicate = true;
  //           break;
  //         }
  //       }

  //       if (shouldDuplicate) break;
  //     }

  //     if (shouldDuplicate) {
  //       result.push({ ...record, data: record.data.slice(1) });

  //       result.push({ ...record, data: [record.data[0]] });
  //     } else {
  //       result.push(record);
  //     }
  //   });

  //   return result;
  // }, [data]);

  useEffect(() => {
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

    if (computedDataRef.current.length > result.length) {
      result = computedDataRef.current;
    } else {
      computedDataRef.current = result;
      setComputedData(result);
    }
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

  // const generateMonth = (monthIndex, year) => {
  //   const date = new Date(year, monthIndex, 1);
  //   const days = [];
  //   const monthName = date.toLocaleDateString("en-US", {
  //     month: "long",
  //     year: "numeric",
  //   });

  //   while (date.getMonth() === monthIndex) {
  //     const day = new Date(date);
  //     const dayName = day.toLocaleDateString("en-US", { weekday: "long" });
  //     days.push(`${day.getDate()}/${dayName}`);
  //     date.setDate(date.getDate() + 1);
  //   }

  //   return { month: monthName, days };
  // };

  // const loadMoreMonths = (direction) => {
  //   if (isLoading.current) return;
  //   isLoading.current = true;

  //   requestAnimationFrame(() => {
  //     setMonths((prev) => {
  //       const newMonths = [...prev];
  //       const lastMonth = newMonths[newMonths.length - 1];
  //       const firstMonth = newMonths[0];

  //       if (direction === "right") {
  //         const [monthName, year] = lastMonth.month.split(" ");
  //         const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  //         for (let i = 0; i < 3; i++) {
  //           const newMonth = generateMonth(
  //             (monthIndex + 1 + i) % 12,
  //             parseInt(year) + (monthIndex + 1 + i > 11 ? 1 : 0)
  //           );
  //           if (!newMonths.some((m) => m.month === newMonth.month)) {
  //             newMonths.push(newMonth);
  //           }
  //         }
  //       } else if (direction === "left") {
  //         const [monthName, year] = firstMonth.month.split(" ");
  //         const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  //         for (let i = 0; i < 3; i++) {
  //           const newMonth = generateMonth(
  //             (monthIndex - 1 - i + 12) % 12,
  //             parseInt(year) - (monthIndex - 1 - i < 0 ? 1 : 0)
  //           );
  //           if (!newMonths.some((m) => m.month === newMonth.month)) {
  //             newMonths.unshift(newMonth);
  //           }
  //         }

  //         requestAnimationFrame(() => {
  //           if (calendarRef.current) {
  //             const scrollAmount =
  //               (calendarRef.current.scrollWidth / months.length) * 3;
  //             calendarRef.current.scrollLeft += scrollAmount;
  //           }
  //         });
  //       }

  //       isLoading.current = false;
  //       return newMonths;
  //     });
  //   });
  // };
  // const handleScroll = () => {
  //   if (!calendarRef.current || isLoading.current) return;

  //   const { scrollLeft, scrollWidth, clientWidth } = calendarRef.current;
  //   if (scrollLeft <= 100) {
  //     loadMoreMonths("left");
  //   }

  //   if (scrollLeft + clientWidth >= scrollWidth - 100) {
  //     loadMoreMonths("right");
  //   }
  // };

  const types = [
    {
      title: "Day",
      value: "day",
    },
    {
      title: "Week",
      value: "week",
    },
    {
      title: "Month",
      value: "month",
    },
  ];

  const [anchorElType, setAnchorElType] = useState(null);
  const [selectedType, setSelectedType] = useState("day");
  const [zoomPosition, setZoomPosition] = useState(2);

  const openType = Boolean(anchorElType);

  const handleClickType = (event) => {
    setAnchorElType(event.currentTarget);
  };

  const handleCloseType = () => {
    setAnchorElType(null);
  };

  useEffect(() => {
    if (selectedType === "month") {
      setZoomPosition(1);
    } else if (selectedType === "week") {
      setZoomPosition(2);
    } else if (selectedType === "day") {
      setZoomPosition(2);
    }
  }, [selectedType]);

  return (
    <div
      className={styles.main_container}
      style={{
        height: `${view?.group_fields?.length ? "100$" : "calc(100vh - 103px"}`,
        // overflow: "scroll",
      }}
      // onScroll={handleScroll}
      // ref={calendarRef}
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
          view={view}
          computedData={computedData}
          hasSameDay={hasSameDay}
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
      {/* {view?.attributes?.group_by_columns?.length !== 0 && !isSidebarOpen && (
        <div className={styles.timelineLeftAddon}>
          <SidebarButton onClick={handleOpenSidebar} />
        </div>
      )} */}
      {/* <MoveableGrid
        computedData={computedData}
        selectedType={selectedType}
        months={months}
        datesList={datesList}
        zoomPosition={zoomPosition}
        setMonths={setMonths}
      /> */}
      <div className={styles.gantt}>
        <TimeLineDatesRow
          focusedDays={focusedDays}
          datesList={datesList}
          zoomPosition={zoomPosition}
          selectedType={selectedType}
          months={months}
          scrollToToday={scrollToToday}
          sidebarIsOpen={
            view?.attributes?.group_by_columns?.length !== 0 && isSidebarOpen
          }
        />

        {calendar_from_slug !== calendar_to_slug && (
          <TimeLineDayDataBlock
            dateFilters={dateFilters}
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
      <div className={styles.timelineRightAddon}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleClickType}
            style={{
              color: "rgb(120, 119, 116)",
              fontSize: "14px",
              fontWeight: "400",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              padding: "0px",
            }}
          >
            <span>
              {types.find((item) => item.value === selectedType).title}
            </span>
            {openType ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>
          <Menu
            open={openType}
            onClose={handleCloseType}
            anchorEl={anchorElType}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  // width: 100,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  left: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              {types.map((el) => (
                <Button
                  onClick={() => setSelectedType(el.value)}
                  variant="text"
                  sx={{
                    margin: "0 5px",
                    color: "#888",
                    minWidth: "100px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {el.title}
                  {el.value === selectedType && <CheckIcon />}
                </Button>
              ))}
            </div>
          </Menu>
        </div>
        <Button
          variant="text"
          sx={{
            margin: "0 5px",
            padding: "0px",
            color: "rgb(50, 48, 44)",
            fontSize: "14px",
            fontWeight: "400",
          }}
          onClick={() => scrollToToday()}
        >
          Today
        </Button>
      </div>
    </div>
  );
}
