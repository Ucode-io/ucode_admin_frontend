import clsx from "clsx";
import cls from "./styles.module.scss";
import { TimelineRecursiveRow } from "../TimelineRecursiveRow";
import { useState } from "react";
import KeyboardDoubleArrowDownOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowDownOutlined";

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
}) => {
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

  return (
    <div className={cls.group_by}>
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
        </div>
        {/* <SidebarButton
        className={cls.sidebarBtn}
        onClick={handleCloseSidebar}
      /> */}
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
      {/* <button className={cls.newBtn}>
        <span>
          <AddRoundedIcon /> New
        </span>
      </button> */}
    </div>
  );
};