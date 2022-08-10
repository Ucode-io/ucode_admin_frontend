import { Fragment, useState } from "react"
import { useParams } from "react-router-dom"
import { TabPanel, Tabs } from "react-tabs"
import ViewsWithGroups from "./ViewsWithGroups"
import BoardView from "./BoardView"
import CalendarView from "./CalendarView"
import { useQuery } from "react-query"
import PageFallback from "../../components/PageFallback"
import constructorObjectService from "../../services/constructorObjectService"
import { listToMap } from "../../utils/listToMap"
import FiltersBlock from "../../components/FiltersBlock"
import SettingsButton from "./components/ViewSettings/SettingsButton"

const ObjectsPage = () => {
  const { tableSlug } = useParams()

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  

  const { data: { views, fieldsMap } = { views: [], fieldsMap: {} }, isLoading } = useQuery(
    ["GET_VIEWS_AND_FIELDS", tableSlug],
    () => {
      return constructorObjectService.getList(tableSlug, { data: { limit: 0, offset: 0 } })
    },
    {
      select: ({data}) => {
        return {
          views: data?.views ?? [],
          fieldsMap: listToMap(data?.fields),
        }
      },
    }
  )

  const setViews = () => {}

  if (isLoading) return <PageFallback />

  return (
    <>
      <Tabs direction={"ltr"} selectedIndex={selectedTabIndex}>
        <div>
          {views.map((view) => {
            return (
              <TabPanel key={view.id}>
                {view.type === "BOARD" ? (
                  <BoardView
                    view={view}
                    setViews={setViews}
                    selectedTabIndex={selectedTabIndex}
                    setSelectedTabIndex={setSelectedTabIndex}
                    views={views}
                    fieldsMap={fieldsMap}
                  />
                ) : view.type === "CALENDAR" ? (
                  <CalendarView
                    view={view}
                    setViews={setViews}
                    selectedTabIndex={selectedTabIndex}
                    setSelectedTabIndex={setSelectedTabIndex}
                    views={views}
                    fieldsMap={fieldsMap}
                  />
                ) : (
                  <ViewsWithGroups
                    selectedTabIndex={selectedTabIndex}
                    setSelectedTabIndex={setSelectedTabIndex}
                    views={views}
                    view={view}
                    fieldsMap={fieldsMap}
                  />
                )}
              </TabPanel>
            )
          })}
        </div>
      </Tabs>

      {!views?.length && <FiltersBlock extra={<SettingsButton />} />}

    </>
  )
}

export default ObjectsPage
