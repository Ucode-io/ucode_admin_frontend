import React, { useMemo } from "react";
import TimeLineDayDataBlockItem from "./TimeLineDayDataBlockItem";
import TimeLineDays from "./TimeLineDays";
import styles from "./styles.module.scss";
import TimeLineDataRecursiveRow from "./TimeLineDataRecursiveRow";

export default function TimeLineDayDataBlock({
  data,
  fieldsMap,
  setFocusedDays,
  view,
  dateFilters,
  tabs,
  computedColumnsFor,
  datesList,
  zoomPosition,
  calendar_from_slug,
  calendar_to_slug,
  groupbyFields,
  visible_field,
  selectedType,
  groupByList,
  openedRows,
  setOpenedRows,
  menuItem,
  fieldsMapPopup,
  refetch,
  setLayoutType,
  navigateToDetailPage,
  noDates,
  calendarRef,
  setOpenDrawerModal,
  setSelectedRow,
  layoutType,
  selectedView,
  projectInfo,
  setSelectedView = () => {},
}) {
  const visibleFields = useMemo(() => {
    const cols =
      view?.columns
        ?.map((id) => fieldsMap[id])
        .filter((el) => {
          return el?.type === "LOOKUP" || el?.type === "LOOKUPS"
            ? el?.relation_id
            : el?.id;
        }) ?? [];

    return cols;
  }, [view?.columns, fieldsMap]);

  return (
    <>
      <div
        className={styles.container}
        style={{
          position: "relative",
        }}
      >
        <div className={styles.days} id="timelineDays">
          {datesList.map((date, index) => (
            <TimeLineDays
              date={date}
              zoomPosition={zoomPosition}
              selectedType={selectedType}
              index={index}
              data={data}
              noDates={noDates}
              view={view}
              calendarRef={calendarRef}
            />
          ))}
        </div>

        {view?.attributes?.group_by_columns?.length !== 0 && (
          <div className={styles.dataContainer}>
            {data?.map((item, index) => (
              <TimeLineDataRecursiveRow
                selectedView={selectedView}
                layoutType={layoutType}
                menuItem={menuItem}
                fieldsMapPopup={fieldsMapPopup}
                dateFilters={dateFilters}
                openedRows={openedRows}
                setOpenedRows={setOpenedRows}
                item={item}
                index={index}
                firstIndex={index}
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
                setLayoutType={setLayoutType}
                refetch={refetch}
                navigateToDetailPage={navigateToDetailPage}
                calendarRef={calendarRef}
                setOpenDrawerModal={setOpenDrawerModal}
                setSelectedRow={setSelectedRow}
                deepLength={view?.attributes?.group_by_columns?.length}
                setSelectedView={setSelectedView}
                visibleFields={visibleFields}
              />
            ))}
            {/* <div className={styles.addNewTask}></div> */}
          </div>
        )}

        {view?.attributes?.group_by_columns?.length === 0 &&
          calendar_from_slug &&
          calendar_to_slug && (
            <div className={styles.datas}>
              {data.map((item, index) => (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "32px",
                  }}
                  key={item?.label}
                >
                  <TimeLineDayDataBlockItem
                    projectInfo={projectInfo}
                    selectedView={selectedView}
                    layoutType={layoutType}
                    selectedType={selectedType}
                    computedColumnsFor={computedColumnsFor}
                    groupbyFields={groupbyFields}
                    data={item?.data ? item?.data : item}
                    levelIndex={index}
                    groupByList={groupByList}
                    setFocusedDays={setFocusedDays}
                    datesList={datesList}
                    view={view}
                    zoomPosition={zoomPosition}
                    calendar_from_slug={calendar_from_slug}
                    calendar_to_slug={calendar_to_slug}
                    visible_field={visible_field}
                    menuItem={menuItem}
                    fieldsMapPopup={fieldsMapPopup}
                    refetch={refetch}
                    setLayoutType={setLayoutType}
                    navigateToDetailPage={navigateToDetailPage}
                    setOpenDrawerModal={setOpenDrawerModal}
                    setSelectedRow={setSelectedRow}
                    setSelectedView={setSelectedView}
                    visibleFields={visibleFields}
                  />
                </div>
              ))}
            </div>
          )}
      </div>
    </>
  );
}
