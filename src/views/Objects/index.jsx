import {useEffect, useMemo, useState} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {TabPanel, Tabs} from "react-tabs";
import ViewsWithGroups from "./ViewsWithGroups";
import BoardView from "./BoardView";
import CalendarView from "./CalendarView";
import {useQuery} from "react-query";
import PageFallback from "../../components/PageFallback";
import {listToMap, listToMapWithoutRel} from "../../utils/listToMap";
import FiltersBlock from "../../components/FiltersBlock";
import CalendarHourView from "./CalendarHourView";
import ViewTabSelector from "./components/ViewTypeSelector";
import DocView from "./DocView";
import GanttView from "./GanttView";
import {store} from "../../store";
import {useTranslation} from "react-i18next";
import constructorTableService from "../../services/constructorTableService";
import TimeLineView from "./TimeLineView";
import menuService, {useMenuGetByIdQuery} from "../../services/menuService";
import {useSelector} from "react-redux";
import {useMenuPermissionGetByIdQuery} from "../../services/rolePermissionService";

import {NewUiViewsWithGroups} from "@/views/table-redesign/views-with-groups";
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {TableDataSkeleton} from "../../components/TableDataSkeleton";
import {DynamicTable} from "../table-redesign";

const ObjectsPage = () => {
  const {tableSlug} = useParams();
  const {state} = useLocation();
  const navigate = useNavigate();
  const {appId} = useParams();
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get("view");
  const menuId = searchParams.get("menuId");

  const {i18n} = useTranslation();
  const viewSelectedIndex = useSelector(
    (state) =>
      state?.viewSelectedTab?.viewTab?.find((el) => el?.tableSlug === tableSlug)
        ?.tabIndex
  );

  const [selectedTabIndex, setSelectedTabIndex] = useState(
    viewSelectedIndex?.tabIndex || 1
  );
  const [menuItem, setMenuItem] = useState(null);
  const roleId = useSelector((state) => state.auth?.roleInfo?.id);
  const projectId = store.getState().company.projectId;
  const auth = useSelector((state) => state.auth);
  const companyDefaultLink = useSelector((state) => state.company?.defaultPage);

  const parts = auth?.clientType?.default_page
    ? auth?.clientType?.default_page?.split("/")
    : companyDefaultLink.split("/");

  const resultDefaultLink =
    parts?.length && `/${parts[3]}/${parts[4]}/${parts[5]}/${parts[6]}`;

  const {isLoading: permissionGetByIdLoading} = useMenuPermissionGetByIdQuery({
    projectId: projectId,
    roleId: roleId,
    parentId: appId,
    queryParams: {
      enabled: Boolean(menuId),
      onSuccess: (res) => {
        if (
          !res?.menus
            ?.filter((item) => item?.permission?.read)
            ?.some((el) => el?.id === menuId)
        ) {
          console.log("object");
          navigate(resultDefaultLink);
        }
      },
      cacheTime: false,
    },
  });

  const params = {
    language_setting: i18n?.language,
  };

  const {
    data: {
      views,
      fieldsMap,
      fieldsMapRel,
      visibleColumns,
      visibleRelationColumns,
    } = {
      views: [],
      fieldsMap: {},
      fieldsMapRel: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isLoading,
    refetch,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", tableSlug, i18n?.language, selectedTabIndex],
    () => {
      if (Boolean(!tableSlug)) return [];
      return constructorTableService.getTableInfo(
        tableSlug,
        {
          data: {},
        },
        params
      );
    },
    {
      enabled: Boolean(tableSlug),

      select: ({data}) => {
        return {
          views:
            data?.views?.filter(
              (view) => view?.attributes?.view_permission?.view === true
            ) ?? [],
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
      onSuccess: ({views}) => {
        if (state?.toDocsTab) setSelectedTabIndex(views?.length);
      },
    }
  );

  useEffect(() => {
    queryTab
      ? setSelectedTabIndex(parseInt(queryTab - 1))
      : setSelectedTabIndex(viewSelectedIndex || 0);
  }, [queryTab]);

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: searchParams.get("menuId"),
    queryParams: {
      enabled: Boolean(searchParams.get("menuId")),
      onSuccess: (res) => {
        setMenuItem(res);
      },
    },
  });

  const setViews = () => {};

  const storageItem = localStorage.getItem("newUi");
  const newUi = JSON.parse(
    !storageItem || storageItem === "undefined" || storageItem === "false"
      ? "false"
      : "true"
  );
  const ViewsComponent = newUi ? NewUiViewsWithGroups : ViewsWithGroups;

  // if (isLoading) return <PageFallback />;
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
        {/* <Table>
          <TableHead>
            <TableRow>
              <Box display="flex" paddingX="16px">
                <Skeleton width="80px" height="50px" />
                <Skeleton width="100%" height="50px" />
                <Skeleton width="100%" height="50px" />
                <Skeleton width="100%" height="50px" />
              </Box>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <Box display="flex" paddingX="16px">
                <Skeleton width="80px" height="50px" />
                <Skeleton width="100%" height="50px" />
                <Skeleton width="100%" height="50px" />
                <Skeleton width="100%" height="50px" />
              </Box>
              <Box display="flex" paddingX="16px">
                <Skeleton width="80px" height="50px" />
                <Skeleton width="100%" height="50px" />
                <Skeleton width="100%" height="50px" />
                <Skeleton width="100%" height="50px" />
              </Box>
              <Box display="flex" paddingX="16px">
                <Skeleton width="80px" height="50px" />
                <Skeleton width="100%" height="50px" />
                <Skeleton width="100%" height="50px" />
                <Skeleton width="100%" height="50px" />
              </Box>
            </TableRow>
          </TableBody>
        </Table> */}
      </Box>
    );
  }

  const defaultProps = {
    setViews: setViews,
    selectedTabIndex: selectedTabIndex,
    setSelectedTabIndex: setSelectedTabIndex,
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
    CALENDAR: (props) => (
      <CalendarView menuItem={menuItem} {...defaultProps} {...props} />
    ),
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
                {getViewComponent([view?.type])({ view })}
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
