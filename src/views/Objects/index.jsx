import { Fragment, useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { TabPanel, Tabs } from "react-tabs";
import ViewsWithGroups from "./ViewsWithGroups";
import BoardView from "./BoardView";
import CalendarView from "./CalendarView";
import { useQuery } from "react-query";
import PageFallback from "../../components/PageFallback";
import constructorObjectService from "../../services/constructorObjectService";
import { listToMap } from "../../utils/listToMap";
import FiltersBlock from "../../components/FiltersBlock";
import CalendarHourView from "./CalendarHourView";
import ViewTabSelector from "./components/ViewTypeSelector";
import styles from "./style.module.scss";
import DocView from "./DocView";
import GanttView from "./GanttView";
import { store } from "../../store";
import { useTranslation } from "react-i18next";
import constructorTableService from "../../services/constructorTableService";
import TimeLineView from "./TimeLineView";

const ObjectsPage = () => {
  const { tableSlug, appId } = useParams();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get("view");
  const { i18n } = useTranslation();

  const [selectedTabIndex, setSelectedTabIndex] = useState(1);

  const params = {
    language_setting: i18n?.language,
  };

  const {
    data: { views, fieldsMap } = {
      views: [],
      fieldsMap: {},
    },
    isLoading,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", tableSlug, i18n?.language],
    () => {
      return constructorTableService.getTableInfo(
        tableSlug,
        {
          data: {},
        },
        params
      );
    },
    {
      select: ({ data }) => {
        return {
          views: data?.views?.filter((view) => view?.attributes?.view_permission?.view === true) ?? [],
          fieldsMap: listToMap(data?.fields),
        };
      },
      onSuccess: ({ views }) => {
        if (state?.toDocsTab) setSelectedTabIndex(views?.length);
      },
    }
  );
  useEffect(() => {
    queryTab ? setSelectedTabIndex(parseInt(queryTab - 1)) : setSelectedTabIndex(0);
  }, [queryTab]);

  const menuItem = store.getState().menu.menuItem;

  const setViews = () => {};
  if (isLoading) return <PageFallback />;
  return (
    <>
      <Tabs direction={"ltr"} selectedIndex={selectedTabIndex}>
        <div>
          {views.map((view) => {
            return (
              <TabPanel key={view.id}>
                {view.type === "BOARD" ? (
                  <>
                    <BoardView view={view} setViews={setViews} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} views={views} fieldsMap={fieldsMap} />
                  </>
                ) : view.type === "CALENDAR" ? (
                  <>
                    <CalendarView
                      view={view}
                      setViews={setViews}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={views}
                      fieldsMap={fieldsMap}
                      menuItem={menuItem}
                    />
                  </>
                ) : view.type === "CALENDAR HOUR" ? (
                  <>
                    <CalendarHourView
                      view={view}
                      setViews={setViews}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={views}
                      fieldsMap={fieldsMap}
                    />
                  </>
                ) : view.type === "GANTT" ? (
                  <>
                    <GanttView view={view} setViews={setViews} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} views={views} fieldsMap={fieldsMap} />
                  </>
                ) : view.type === "TIMELINE" ? (
                  <>
                    <TimeLineView
                      view={view}
                      setViews={setViews}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={views}
                      fieldsMap={fieldsMap}
                    />
                  </>
                ) : (
                  <>
                    <ViewsWithGroups
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={views}
                      view={view}
                      fieldsMap={fieldsMap}
                      menuItem={menuItem}
                    />
                  </>
                )}
              </TabPanel>
            );
          })}
          <TabPanel>
            <DocView views={views} fieldsMap={fieldsMap} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
          </TabPanel>
        </div>
      </Tabs>

      {!views?.length && (
        <FiltersBlock>
          <ViewTabSelector selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} views={views} />
        </FiltersBlock>
      )}
    </>
  );
};

export default ObjectsPage;
