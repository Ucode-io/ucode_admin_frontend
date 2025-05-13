import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useSelector} from "react-redux";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
import {TabPanel, Tabs} from "react-tabs";
import FiltersBlock from "../../components/FiltersBlock";
import constructorTableService from "../../services/constructorTableService";
import menuService, {useMenuGetByIdQuery} from "../../services/menuService";
import {useMenuPermissionGetByIdQuery} from "../../services/rolePermissionService";
import {store} from "../../store";
import {listToMap, listToMapWithoutRel} from "../../utils/listToMap";
import CalendarHourView from "./CalendarHourView";
import DocView from "./DocView";
import GanttView from "./GanttView";
import ViewsWithGroups from "./ViewsWithGroups";
import ViewTabSelector from "./components/ViewTypeSelector";

import {NewUiViewsWithGroups} from "@/views/table-redesign/views-with-groups";
import {Box, Skeleton} from "@mui/material";
import {DynamicTable} from "../table-redesign";
import constructorViewService from "../../services/constructorViewService";
import {updateQueryWithoutRerender} from "../../utils/useSafeQueryUpdater";

const ObjectsPage = () => {
  const {state} = useLocation();
  const {menuId} = useParams();
  const {i18n} = useTranslation();
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get("view");
  const [selectedView, setSelectedView] = useState(null);
  const [menuItem, setMenuItem] = useState(null);
  const roleId = useSelector((state) => state.auth?.roleInfo?.id);
  const projectId = store.getState().company.projectId;
  const auth = useSelector((state) => state.auth);
  const companyDefaultLink = useSelector((state) => state.company?.defaultPage);
  const tableSlug = selectedView?.table_slug;

  const viewSelectedIndex = useSelector(
    (state) =>
      state?.viewSelectedTab?.viewTab?.find((el) => el?.tableSlug === tableSlug)
        ?.tabIndex
  );

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const parts = auth?.clientType?.default_page
    ? auth?.clientType?.default_page?.split("/")
    : companyDefaultLink.split("/");

  const {isLoading: permissionGetByIdLoading} = useMenuPermissionGetByIdQuery({
    projectId: projectId,
    roleId: roleId,
    parentId: menuId,
    queryParams: {
      enabled: Boolean(menuId),
      onSuccess: (res) => {
        if (
          !res?.menus
            ?.filter((item) => item?.permission?.read)
            ?.some((el) => el?.id === menuId)
        ) {
        }
      },
      cacheTime: false,
    },
  });

  const {data: views, refetch} = useQuery(
    ["GET_VIEWS_LIST", menuId],
    () => {
      return constructorViewService.getViewListMenuId(menuId);
    },
    {
      enabled: Boolean(menuId),
      select: (res) => {
        return res?.views ?? [];
      },
      onSuccess: (data) => {
        setSelectedView(data?.[selectedTabIndex]);
        updateQueryWithoutRerender("v", data?.[selectedTabIndex]?.id);
        if (state?.toDocsTab) setSelectedTabIndex(data?.length);
      },
    }
  );

  const {
    data: {fieldsMap, fieldsMapRel, visibleColumns, visibleRelationColumns} = {
      fieldsMap: {},
      fieldsMapRel: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isLoading,
  } = useQuery(
    [
      "GET_VIEWS_AND_FIELDS",
      selectedView?.table_slug,
      i18n?.language,
      selectedTabIndex,
    ],
    () => {
      if (Boolean(!selectedView?.table_slug)) return [];
      return menuService.getFieldsListMenu(
        menuId,
        selectedView?.id,
        selectedView?.table_slug
      );
    },
    {
      enabled: Boolean(selectedView?.table_slug),

      select: ({data}) => {
        return {
          fieldsMap: listToMap(data?.fields),
          fieldsMapRel: listToMapWithoutRel(data?.fields ?? []),
          visibleColumns: data?.fields ?? [],
          visibleRelationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  // useEffect(() => {
  //   queryTab
  //     ? setSelectedTabIndex(parseInt(queryTab - 1))
  //     : setSelectedTabIndex(viewSelectedIndex || 0);
  // }, [queryTab]);

  // const {loader: menuLoader} = useMenuGetByIdQuery({
  //   menuId: menuId,
  //   queryParams: {
  //     enabled: Boolean(menuId),
  //     onSuccess: (res) => {
  //       setMenuItem(res);
  //     },
  //   },
  // });

  const setViews = () => {};

  const storageItem = localStorage.getItem("newUi");
  const newUi = JSON.parse(
    !storageItem || storageItem === "undefined" || storageItem === "false"
      ? "false"
      : "true"
  );
  const ViewsComponent = newUi ? NewUiViewsWithGroups : ViewsWithGroups;

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
    setSelectedTabIndex: setSelectedTabIndex,
    setSelectedView: setSelectedView,
    selectedView: selectedView,
    views: views,
    fieldsMap: fieldsMap,
    menuItem,
    fieldsMapRel,
  };

  const renderView = {
    // BOARD: (props) => (
    //   <BoardView
    //     menuItem={menuItem}
    //     fieldsMapRel={fieldsMapRel}
    //     {...defaultProps}
    //     {...props}
    //   />
    // ),
    // CALENDAR: (props) => (
    //   <CalendarView menuItem={menuItem} {...defaultProps} {...props} />
    // ),
    "CALENDAR HOUR": (props) => (
      <CalendarHourView {...defaultProps} {...props} />
    ),
    GANTT: (props) => <GanttView {...defaultProps} {...props} />,
    DEFAULT: (props) => (
      <ViewsComponent
        visibleColumns={visibleColumns}
        visibleRelationColumns={visibleRelationColumns}
        menuItem={menuItem}
        refetchViews={refetch}
        {...defaultProps}
        {...props}
      />
    ),
    // TIMELINE: (props) => (
    //   <TimeLineView
    //     setViews={() => {}}
    //     isViewLoading={isLoading}
    //     {...defaultProps}
    //     {...props}
    //   />
    // ),
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
              setSelectedTabIndex={setSelectedTabIndex}
            />
          </TabPanel>
        </div>
      </Tabs>

      {!views?.length && (
        <FiltersBlock>
          <ViewTabSelector
            selectedTabIndex={selectedTabIndex}
            setSelectedTabIndex={setSelectedTabIndex}
            views={views}
            menuItem={menuItem}
          />
        </FiltersBlock>
      )}
    </>
  );
};

export default ObjectsPage;
