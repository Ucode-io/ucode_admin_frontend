import clsx from "clsx";
import cls from "./styles.module.scss";
import { TimelineRecursiveRow } from "../TimelineRecursiveRow";
import { useRef, useState } from "react";
import KeyboardDoubleArrowDownOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowDownOutlined";
import { SidebarButton } from "../SidebarButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTimelineBlockContext } from "../../providers/TimelineBlockProvider";
import { useDispatch, useSelector } from "react-redux";
import { mainActions } from "../../../../../store/main/main.slice";

export const Sidebar = ({
  handleCloseSidebar,
  view,
  computedData,
  openedRows,
  setOpenedRows,
  fieldsMap,
  groupByFields,
  computedColumnsFor,
  setFocusedDays,
  datesList,
  zoomPosition,
  hasSameDay,
  isSidebarOpen,
}) => {
  const { setOpenDrawerModal } = useTimelineBlockContext();

  const timelineSidebarWidth = useSelector(
    (state) => state.main.timelineSidebarWidth
  );

  const dispatch = useDispatch();

  const [isAllOpen, setIsAllOpen] = useState(false);

  const handleAllOpen = () => {
    setIsAllOpen(true);
    setOpenedRows(computedData?.map((item) => item?.label));
  };

  const handleAllClose = () => {
    setOpenedRows([]);
    setIsAllOpen(false);
  };

  const isAssignee = view?.attributes?.group_by_columns?.length >= 2;

  const boxRef = useRef(null);
  const [width, setWidth] = useState(timelineSidebarWidth || 200); // начальная ширина
  const isResizing = useRef(false);

  const MIN_WIDTH = 100;
  const MAX_WIDTH = window.innerWidth - 440; // 100vh - 440px

  const handleMouseDown = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX - boxRef.current.getBoundingClientRect().left;
    const clampedWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));
    setWidth(clampedWidth);
    dispatch(mainActions.setTimelineSidebarWidth(clampedWidth));
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={clsx(cls.group_by, { [cls.isHidden]: !isSidebarOpen })}
      style={{ width }}
      ref={boxRef}
    >
      <div className={clsx(cls.fakeDiv)}>
        <div className={cls.header}>
          <span
            className={cls.title}
            style={{ marginTop: isAssignee ? "6px" : "16px" }}
          >
            Columns
          </span>
          {isAssignee && (
            <button
              className={cls.expendCollapseBtn}
              onClick={isAllOpen ? handleAllClose : handleAllOpen}
            >
              <span className={cls.expendCollapseBtnInner}>
                <span>{isAllOpen ? "Collapse all" : "Expend all"}</span>
                <KeyboardDoubleArrowDownOutlinedIcon
                  sx={{
                    transform: isAllOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </span>
            </button>
          )}
          <div
            onMouseDown={handleMouseDown}
            className={cls.sidebarResizeHandle}
          />
        </div>
        <SidebarButton
          className={cls.sidebarBtn}
          onClick={handleCloseSidebar}
        />
      </div>

      {view?.attributes?.calendar_from_slug !==
        view?.attributes?.calendar_to_slug && (
        <div className={cls.sidebar_columns}>
          {computedData?.map((item, index) => (
            <TimelineRecursiveRow
              computedData={computedData}
              openedRows={openedRows}
              setOpenedRows={setOpenedRows}
              handleAllOpen={handleAllOpen}
              handleAllClose={handleAllClose}
              setIsAllOpen={setIsAllOpen}
              level={0}
              groupItem={item}
              fieldsMap={fieldsMap}
              view={view}
              groupByFields={groupByFields}
              computedColumnsFor={computedColumnsFor}
              setFocusedDays={setFocusedDays}
              datesList={datesList}
              zoomPosition={zoomPosition}
              calendar_from_slug={view?.attributes?.calendar_from_slug}
              calendar_to_slug={view?.attributes?.calendar_to_slug}
              visible_field={view?.attributes?.visible_field}
            />
          ))}
        </div>
      )}
      <button className={cls.newBtn} onClick={() => setOpenDrawerModal(true)}>
        <span>
          <AddRoundedIcon /> New
        </span>
      </button>
    </div>
  );
};