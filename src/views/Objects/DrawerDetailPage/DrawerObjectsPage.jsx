import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useParams} from "react-router-dom";
import {TabPanel, Tabs} from "react-tabs";
import constructorRelationService from "../../../services/constructorRelationService";
import constructorViewService from "../../../services/constructorViewService";
import menuService from "../../../services/menuService";
import {listToMap, listToMapWithoutRel} from "../../../utils/listToMap";
import {updateQueryWithoutRerender} from "../../../utils/useSafeQueryUpdater";
import {NewUiViewsWithGroups} from "../../table-redesign/views-with-groups";
import {detailDrawerActions} from "../../../store/detailDrawer/detailDrawer.slice";

function DrawerObjectsPage({
  projectInfo,
  layout,
  selectedTab,
  menuItem,
  data,
  dateInfo,
  selectedRow,
  handleClose,
  fullScreen,
  rootForm,
  onSubmit = () => {},
  setViews = () => {},
  setFullScreen = () => {},
  handleMouseDown = () => {},
  setFormValue = () => {},
  selectedViewType,
  selectedView,
  setSelectedView = () => {},
  setSelectedViewType = () => {},
}) {
  const {state} = useLocation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {menuId} = useParams();
  const {i18n} = useTranslation();
  const viewsPath = useSelector((state) => state.groupField.viewsList);
  const viewsList = useSelector((state) => state.groupField.viewsPath);

  const selectedTabIndex = useSelector(
    (state) => state?.drawer?.drawerTabIndex
  );
  const selectedV = viewsPath?.[viewsPath?.length - 1];

  const isRelationView = Boolean(selectedV?.relation_table_slug);

  const {data: menuViews} = useQuery(
    ["GET_TABLE_VIEWS_LIST", menuId],
    () => constructorViewService.getViewListMenuId(menuId),
    {
      enabled: !isRelationView && Boolean(menuId),
      select: (res) =>
        res?.views?.filter(
          (item) => item?.type === "SECTION" || item?.is_relation_view
        ) ?? [],
      onSuccess: (data) => {
        if (selectedTabIndex >= data.length) {
          dispatch(detailDrawerActions.setDrawerTabIndex(0));
        }
        setSelectedView(data?.[0]);
        updateQueryWithoutRerender("v", data?.[0]?.id);
        if (state?.toDocsTab) {
          dispatch(detailDrawerActions.setDrawerTabIndex(data?.length));
        }
      },
    }
  );

  const {data: relationViews, refetch: refetchRelationViews} = useQuery(
    ["GET_TABLE_VIEWS_LIST_RELATION", selectedView?.relation_table_slug],
    () =>
      constructorViewService.getViewListMenuId(
        selectedView?.relation_table_slug
      ),
    {
      enabled: false,
      select: (res) =>
        res?.views?.filter(
          (item) => item?.type === "SECTION" || item?.is_relation_view
        ) ?? [],
      onSuccess: (data) => {
        if (selectedTabIndex >= data.length) {
          dispatch(detailDrawerActions.setDrawerTabIndex(0));
        }
        setSelectedView(data?.[0]);
        updateQueryWithoutRerender("v", data?.[0]?.id);
        if (state?.toDocsTab) {
          dispatch(detailDrawerActions.setDrawerTabIndex(data?.length));
        }
      },
    }
  );

  const lastPath = viewsPath?.[viewsPath.length - 1];
  const views =
    !isRelationView && !lastPath?.relation_table_slug
      ? menuViews
      : relationViews;

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
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", i18n?.language, selectedTabIndex],
    () => {
      return menuService.getFieldsListMenu(
        menuId,
        selectedV?.id,
        viewsList?.[viewsList?.length - 1]?.relation_table_slug,
        {
          main_table: viewsList?.length < 2 ? true : undefined,
        }
      );
    },
    {
      enabled: Boolean(viewsList?.[viewsList?.length - 1]?.relation_table_slug),
      select: ({data}) => ({
        fieldsMap: listToMap(data?.fields),
        fieldsMapRel: listToMapWithoutRel(data?.fields ?? []),
        visibleColumns: data?.fields ?? [],
        tableInfo: data?.table_info || {},
        visibleRelationColumns:
          data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [],
      }),
    }
  );

  const {data: {relations} = {relations: []}} = useQuery(
    ["GET_VIEWS_AND_FIELDS", viewsPath?.length],
    () =>
      constructorRelationService.getList(
        {
          table_slug: viewsPath?.[0]?.table_slug,
          relation_table_slug: viewsPath?.[0]?.relation_table_slug,
        },
        viewsPath?.[viewsPath?.length - 1 || 0]?.relation_table_slug ||
          viewsPath?.[viewsPath?.length - 1 || 0]?.table_slug
      ),
    {
      enabled: Boolean(viewsPath?.[0]?.table_slug),
    }
  );

  return (
    <Tabs direction="ltr" selectedIndex={selectedTabIndex}>
      <div>
        {views?.map((view) => (
          <TabPanel key={view.id}>
            <NewUiViewsWithGroups
              refetchMenuViews={refetchRelationViews}
              relationFields={relations}
              selectedViewType={selectedViewType}
              setSelectedViewType={setSelectedViewType}
              tableInfo={tableInfo}
              onSubmit={onSubmit}
              rootForm={rootForm}
              relationView={true}
              views={views}
              view={view}
              selectedTabIndex={selectedTabIndex}
              fieldsMap={fieldsMap}
              menuItem={menuItem}
              visibleRelationColumns={visibleRelationColumns}
              visibleColumns={visibleColumns}
              fieldsMapRel={fieldsMapRel}
              setViews={setViews}
              setSelectedView={setSelectedView}
              selectedView={selectedView}
              projectInfo={projectInfo}
              handleMouseDown={handleMouseDown}
              layout={layout}
              selectedTab={layout?.tabs?.[0]}
              data={data}
              selectedRow={selectedRow}
              handleClose={handleClose}
              modal={true}
              dateInfo={dateInfo}
              setFullScreen={setFullScreen}
              fullScreen={fullScreen}
            />
          </TabPanel>
        ))}
      </div>
    </Tabs>
  );
}

export default DrawerObjectsPage;
