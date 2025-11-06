import React, {useEffect, useMemo, useRef, useState} from "react";
import TimeLineDatesRow from "./TimeLineDatesRow";
import TimeLineDayDataBlock from "./TimeLineDayDataBlocks";
import styles from "./styles.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {showAlert} from "../../../store/alert/alert.thunk";
import {isSameDay, isValid, isWithinInterval} from "date-fns";
import {Sidebar} from "./components/Sidebar";
import {Button, Menu} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import {TimelineBlockProvider} from "./providers/TimelineBlockProvider";
import {SidebarButton} from "./components/SidebarButton";
import DrawerDetailPage from "../DrawerDetailPage";
import {useProjectGetByIdQuery} from "../../../services/projectService";
import layoutService from "../../../services/layoutService";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import OldDrawerDetailPage from "../DrawerDetailPage/OldDrawerDetailPage";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";

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
  setSelectedType,
  selectedType,
  menuItem,
  fieldsMapPopup,
  refetch,
  setLayoutType,
  navigateToDetailPage,
  setNoDates,
  noDates,
  calendarRef,
  tableSlug,
  layoutType,
  selectedView,
  projectInfo,
  setFormValue = () => {},
  relationView = false,
  setSelectedView,
  // setMonths,
}) {
  const scrollContainerRef = useRef(null);
  const [focusedDays, setFocusedDays] = useState([]);
  const [openedRows, setOpenedRows] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const new_router = localStorage.getItem("new_router") === "true";

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

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

  const computedDataRef = useRef({
    refData: [],
    refGroupByFields: [],
  });
  const [computedData, setComputedData] = useState([]);

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

    const { refData, refGroupByFields } = computedDataRef.current;

    if (
      refData.length > result.length &&
      refGroupByFields.length === view?.attributes?.group_by_columns?.length
    ) {
      result = refData;
    } else {
      computedDataRef.current.refData = result;
      computedDataRef.current.refGroupByFields =
        view?.attributes?.group_by_columns;
      setComputedData(result);
    }
  }, [data, view?.attributes?.group_by_columns]);

  function findEmptyDates(data) {
    const result = [];

    function traverse(items) {
      for (const item of items) {
        if (Array.isArray(item.data)) {
          traverse(item.data);
        } else {
          const from = item?.[calendar_from_slug];
          const to = item?.[calendar_to_slug];
          if (!from && !to) {
            result.push(item);
          }
        }
      }
    }

    traverse(data);
    return result;
  }

  useEffect(() => {
    if (computedData?.length) {
      const result = findEmptyDates(computedData);
      setNoDates(result);
    }
  }, [computedData]);

  function safeIsWithinInterval(date, interval) {
    const { start, end } = interval || {};
    const isValidDate = (d) => d instanceof Date && !isNaN(d);

    if (!isValidDate(date) || !isValidDate(start) || !isValidDate(end)) {
      return false;
    }

    if (start > end) {
      return false;
    }

    try {
      return isWithinInterval(date, { start, end });
    } catch (err) {
      console.error("safeIsWithinInterval error:", err);
      return false;
    }
  }

  function hasSameDay(startDate1, endDate1, startDate2, endDate2) {
    if (
      isValid(startDate1) &&
      isValid(endDate1) &&
      isValid(startDate2) &&
      isValid(endDate2)
    ) {
      return (
        isSameDay(startDate1, startDate2) ||
        isSameDay(startDate1, endDate2) ||
        isSameDay(endDate1, startDate2) ||
        isSameDay(endDate1, endDate2) ||
        safeIsWithinInterval(startDate2, {
          start: startDate1,
          end: endDate1,
        }) ||
        safeIsWithinInterval(endDate2, { start: startDate1, end: endDate1 }) ||
        safeIsWithinInterval(startDate1, {
          start: startDate2,
          end: endDate2,
        }) ||
        safeIsWithinInterval(endDate1, { start: startDate2, end: endDate2 })
      );
    }

    return false;
  }

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

  const [zoomPosition, setZoomPosition] = useState(2);

  const openType = Boolean(anchorElType);

  const { appId, menuId } = useParams();

  const [hoveredRowId, setHoveredRowId] = useState(null);

  // const projectId = useSelector((state) => state.company?.projectId);
  const [openDrawerModal, setOpenDrawerModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");

  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage"),
  );

  // const {data: projectInfo} = useProjectGetByIdQuery({projectId});

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

  const {
    data: { layout } = {
      layout: [],
    },
  } = useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return layoutService.getLayout(tableSlug, appId ?? menuId);
    },
    select: (data) => {
      return {
        layout: data ?? {},
      };
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  return (
    <TimelineBlockProvider
      state={{
        isSidebarOpen,
        setIsSidebarOpen,
        hoveredRowId,
        setHoveredRowId,
        setFocusedDays,
        setSelectedRow,
        setOpenDrawerModal,
        calendar_from_slug,
        calendar_to_slug,
      }}
    >
      <div className={styles.main_container}>
        {view?.attributes?.group_by_columns?.length !== 0 && (
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
            handleCloseSidebar={handleCloseSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        )}
        {view?.attributes?.group_by_columns?.length !== 0 && !isSidebarOpen && (
          <div className={styles.timelineLeftAddon}>
            <SidebarButton variant="opener" onClick={handleOpenSidebar} />
          </div>
        )}
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
              projectInfo={projectInfo}
              selectedView={selectedView}
              layoutType={layoutType}
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
              menuItem={menuItem}
              fieldsMapPopup={fieldsMapPopup}
              refetch={refetch}
              setLayoutType={setLayoutType}
              navigateToDetailPage={navigateToDetailPage}
              noDates={noDates}
              calendarRef={calendarRef}
              setOpenDrawerModal={setOpenDrawerModal}
              setSelectedRow={setSelectedRow}
              setSelectedView={setSelectedView}
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

      {Boolean(open && projectInfo?.new_layout && !relationView) &&
      (selectedViewType === "SidePeek" || selectedViewType === "FullPage") ? (
        new_router ? (
          <DrawerDetailPage
            view={view}
            projectInfo={projectInfo}
            open={open}
            setFormValue={setFormValue}
            selectedRow={selectedRow}
            menuItem={menuItem}
            layout={layout}
            fieldsMap={fieldsMap}
            refetch={refetch}
            layoutType={layoutType}
            setLayoutType={setLayoutType}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
            navigateToEditPage={navigateToDetailPage}
          />
        ) : (
          <OldDrawerDetailPage
            view={view}
            projectInfo={projectInfo}
            open={open}
            setFormValue={setFormValue}
            selectedRow={selectedRow}
            menuItem={menuItem}
            layout={layout}
            fieldsMap={fieldsMap}
            refetch={refetch}
            layoutType={layoutType}
            setLayoutType={setLayoutType}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
            navigateToEditPage={navigateToDetailPage}
          />
        )
      ) : selectedViewType === "CenterPeek" ? (
        <ModalDetailPage
          view={view}
          projectInfo={projectInfo}
          open={open}
          setFormValue={setFormValue}
          selectedRow={selectedRow}
          menuItem={menuItem}
          layout={layout}
          fieldsMap={fieldsMap}
          refetch={refetch}
          layoutType={layoutType}
          setLayoutType={setLayoutType}
          selectedViewType={selectedViewType}
          setSelectedViewType={setSelectedViewType}
          navigateToEditPage={navigateToDetailPage}
        />
      ) : null}

      {Boolean(open && !projectInfo?.new_layout) && (
        <ModalDetailPage
          open={open}
          selectedRow={selectedRow}
          menuItem={menuItem}
          layout={layout}
          fieldsMap={fieldsMap}
          refetch={refetch}
          setLayoutType={setLayoutType}
          selectedViewType={selectedViewType}
          setSelectedViewType={setSelectedViewType}
          navigateToEditPage={navigateToDetailPage}
        />
      )}
      {/* <DrawerDetailPage
        view={view}
        projectInfo={projectInfo}
        open={openDrawerModal}
        setOpen={setOpenDrawerModal}
        selectedRow={selectedRow}
        menuItem={menuItem}
        layout={layout}
        fieldsMap={fieldsMap}
        refetch={refetch}
        setLayoutType={setLayoutType}
        selectedViewType={selectedViewType}
        setSelectedViewType={setSelectedViewType}
        navigateToEditPage={navigateToDetailPage}
      /> */}
    </TimelineBlockProvider>
  );
}
