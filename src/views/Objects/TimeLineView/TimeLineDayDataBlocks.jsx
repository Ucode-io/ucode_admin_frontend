import React, { useRef, useState } from "react";
import TimeLineDayDataBlockItem from "./TimeLineDayDataBlockItem";
import TimeLineDays from "./TimeLineDays";
import styles from "./styles.module.scss";
import TimeLineDataRecursiveRow from "./TimeLineDataRecursiveRow";
import DrawerDetailPage from "../DrawerDetailPage";
import { useProjectGetByIdQuery } from "../../../services/projectService";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import layoutService from "../../../services/layoutService";

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
}) {
  const projectId = useSelector((state) => state.company?.projectId);
  const [openDrawerModal, setOpenDrawerModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");

  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage") === "FullPage"
      ? "SidePeek"
      : localStorage?.getItem("detailPage")
  );

  const { tableSlug, appId } = useParams();

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

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
      return layoutService.getLayout(tableSlug, appId);
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
console.log({ data });
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
                  />
                </div>
              ))}
            </div>
          )}

        <DrawerDetailPage
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
        />
      </div>
    </>
  );
}
