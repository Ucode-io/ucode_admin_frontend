import clsx from "clsx";
import cls from "./styles.module.scss";
import { SidebarButton } from "../SidebarButton";
import { TimelineRecursiveRow } from "../TimelineRecursiveRow";

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
}) => {

  return (
    <div className={cls.group_by}>
      <div className={clsx(cls.fakeDiv)}>
        <span>Columns</span>
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
              openedRows={openedRows}
              setOpenedRows={setOpenedRows}
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
    </div>
  );
}