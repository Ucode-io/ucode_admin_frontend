import { Fragment, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { TabPanel, Tabs } from "react-tabs"
import { generateGUID } from "../../utils/generateID"
import ViewsWithGroups from "./ViewsWithGroups"
import BoardView from "./BoardView"
import CalendarView from "./CalendarView"

const staticViews = [
  {
    id: generateGUID,
    type: "TABLE",
  },
];

const ObjectsPage = ({ isRelation, tableSlug }) => {
  const params = useParams();

  const [views, setViews] = useState([])
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const computedTableSlug = isRelation ? tableSlug : params.tableSlug
  const columns = useSelector(
    (state) => state.tableColumn.list[computedTableSlug] ?? []
  )
  const groupColumnId = useSelector(
    (state) => state.tableColumn.groupColumnIds[computedTableSlug]
  )

  const computedColumns = useMemo(() => {
    return columns?.filter((column) => column.isVisible) ?? []
  }, [columns])

  const groupField = useMemo(() => {
    return columns.find((column) => column.id === groupColumnId)
  }, [groupColumnId])

  const computedViews = useMemo(() => {
    return [...staticViews, ...views];
  }, [views]);

  return (
    <>
      <Tabs direction={"ltr"} selectedIndex={selectedTabIndex}>
        <div>
          {computedViews.map((view) => {
            return (
              <TabPanel key={view.id}>
                {view.type === "BOARD" ? (
                  <BoardView
                    view={view}
                    tableSlug={computedTableSlug}
                    tableColumns={computedColumns}
                    setViews={setViews}
                    selectedTabIndex={selectedTabIndex}
                    setSelectedTabIndex={setSelectedTabIndex}
                    groupField={groupField}
                    views={computedViews}
                  />
                ) : view.type === "CALENDAR" ? (
                  <CalendarView
                    view={view}
                    tableSlug={computedTableSlug}
                    tableColumns={computedColumns}
                    setViews={setViews}
                    selectedTabIndex={selectedTabIndex}
                    setSelectedTabIndex={setSelectedTabIndex}
                    groupField={groupField}
                    views={computedViews}
                  />
                ) : (
                  <ViewsWithGroups
                    tableSlug={computedTableSlug}
                    computedColumns={computedColumns}
                    selectedTabIndex={selectedTabIndex}
                    setSelectedTabIndex={setSelectedTabIndex}
                    views={computedViews}
                    setViews={setViews}
                    groupField={groupField}
                    view={view}
                  />
                )}
              </TabPanel>
            )
          })}
        </div>
      </Tabs>
    </>
  );
};

export default ObjectsPage;
