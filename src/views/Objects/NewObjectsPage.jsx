import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {TabPanel, Tabs} from "react-tabs";
import FiltersBlock from "../../components/FiltersBlock";
import menuService from "../../services/menuService";
import {listToMap, listToMapWithoutRel} from "../../utils/listToMap";
import CalendarHourView from "./CalendarHourView";
import DocView from "./DocView";
import GanttView from "./GanttView";
import ViewsWithGroups from "./ViewsWithGroups";
import ViewTabSelector from "./components/ViewTypeSelector";
import {NewUiViewsWithGroups} from "@/views/table-redesign/views-with-groups";
import {Box, Skeleton} from "@mui/material";
import constructorViewService from "../../services/constructorViewService";
import {updateQueryWithoutRerender} from "../../utils/useSafeQueryUpdater";
import {DynamicTable} from "../table-redesign";
import {groupFieldActions} from "../../store/groupField/groupField.slice";
import {useDispatch, useSelector} from "react-redux";
import {detailDrawerActions} from "../../store/detailDrawer/detailDrawer.slice";

const NewObjectsPage = () => {
  const {state, pathname} = useLocation();
  const {menuId} = useParams();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {i18n} = useTranslation();
  const [selectedView, setSelectedView] = useState(null);
  const selectedTabIndex = useSelector((state) => state.drawer.mainTabIndex);

  const {data: views, refetch} = useQuery(
    ["GET_VIEWS_LIST", menuId],
    () => {
      return constructorViewService.getViewListMenuId(menuId);
    },
    {
      enabled: Boolean(menuId),
      select: (res) => {
        return (
          res?.views?.filter(
            (el) => el?.type !== "SECTION" && Boolean(!el?.is_relation_view)
          ) ?? []
        );
      },
      onSuccess: (data) => {
        setSelectedView(data?.[selectedTabIndex]);

        if (!pathname.includes("/login")) {
          updateQueryWithoutRerender("v", data?.[selectedTabIndex]?.id);
        }
        if (state?.toDocsTab)
          dispatch(detailDrawerActions.setDrawerTabIndex(data?.length));
      },
    }
  );

  const {
    data: {
      fieldsMap,
      fieldsMapRel,
      visibleColumns,
      visibleRelationColumns,
      tableInfo,
    } = {
      fieldsMap: {},
      fieldsMapRel: {},
      tableInfo: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isLoading,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", selectedView, i18n?.language, selectedTabIndex],
    () => {
      if (Boolean(!selectedView?.table_slug)) return [];
      return menuService.getFieldsListMenu(
        menuId,
        selectedView?.id,
        selectedView?.table_slug,
        {}
      );
    },
    {
      enabled: Boolean(
        selectedView?.table_slug && selectedView?.type !== "SECTION"
      ),
      select: ({data}) => {
        return {
          fieldsMap: listToMap(data?.fields),
          fieldsMapRel: listToMapWithoutRel(data?.fields ?? []),
          visibleColumns: data?.fields ?? [],
          tableInfo: data?.table_info || {},
          visibleRelationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
      onSuccess: (data) => {
        // dispatch(
        //   groupFieldActions.addView({
        //     id: data?.tableInfo.id,
        //     label: data?.tableInfo.label,
        //     table_slug: data?.tableInfo.slug,
        //     relation_table_slug: data?.tableInfo.relation_table_slug,
        //     is_relation_view: data?.tableInfo?.is_relation_view ?? false,
        //   })
        // );
        dispatch(
          groupFieldActions.addViewPath({
            id: data?.tableInfo.id,
            label: data?.tableInfo.label,
            table_slug: data?.tableInfo.slug,
            relation_table_slug: data?.tableInfo.relation_table_slug,
            is_relation_view: data?.tableInfo?.is_relation_view ?? false,
          })
        );
        dispatch(detailDrawerActions.setInitialTableInfo(data?.tableInfo));
      },
    }
  );

  useEffect(() => {
    if (pathname.includes("/login")) {
      navigate("/", {replace: false});
    }
  }, []);

  const setViews = () => {};

  const storageItem = localStorage.getItem("newUi");
  const newUi = JSON.parse(
    !storageItem || storageItem === "undefined" || storageItem === "false"
      ? "false"
      : "true"
  );
  const ViewsComponent = newUi ? NewUiViewsWithGroups : ViewsWithGroups;
  console.log("viewsssssssss", views);
  if (isLoading) {
    return (
      <Box bgcolor="#fff" height="100%">
        <Box paddingX={"16px"} borderBottom="1px solid #EAECF0">
          <Skeleton height="45px" width="100%" />
        </Box>
        <Box paddingX={"16px"} borderBottom="1px solid #EAECF0">
          <Skeleton height="40px" width="100%" />
        </Box>
        <DynamicTable loader={true} />
      </Box>
    );
  }

  const defaultProps = {
    setViews: setViews,
    selectedTabIndex: selectedTabIndex,
    setSelectedView: setSelectedView,
    selectedView: selectedView,
    views: views,
    fieldsMap: fieldsMap,
    fieldsMapRel,
  };

  const renderView = {
    "CALENDAR HOUR": (props) => (
      <CalendarHourView {...defaultProps} {...props} />
    ),
    GANTT: (props) => <GanttView {...defaultProps} {...props} />,
    DEFAULT: (props) => (
      <ViewsComponent
        selectedTabIndex={selectedTabIndex}
        tableInfo={tableInfo}
        visibleColumns={visibleColumns}
        visibleRelationColumns={visibleRelationColumns}
        refetchViews={refetch}
        setSelectedView={setSelectedView}
        {...defaultProps}
        {...props}
      />
    ),
  };

  const getViewComponent = (type) => renderView[type] || renderView["DEFAULT"];

  return (
    <>
      <Tabs direction={"ltr"} selectedIndex={selectedTabIndex}>
        <div>
          {views?.map((view) => {
            return (
              <TabPanel key={view.id}>
                {getViewComponent([view?.type])({view})}
              </TabPanel>
            );
          })}
          <TabPanel>
            <DocView
              views={views}
              fieldsMap={fieldsMap}
              selectedTabIndex={selectedTabIndex}
            />
          </TabPanel>
        </div>
      </Tabs>

      {!views?.length && (
        <FiltersBlock>
          <ViewTabSelector selectedTabIndex={selectedTabIndex} views={views} />
        </FiltersBlock>
      )}
    </>
  );
};

export default NewObjectsPage;
