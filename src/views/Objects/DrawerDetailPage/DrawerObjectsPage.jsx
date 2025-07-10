import React, {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useParams} from "react-router-dom";
import {TabPanel, Tabs} from "react-tabs";
import constructorRelationService from "../../../services/constructorRelationService";
import constructorViewService from "../../../services/constructorViewService";
import menuService from "../../../services/menuService";
import {detailDrawerActions} from "../../../store/detailDrawer/detailDrawer.slice";
import {listToMap, listToMapWithoutRel} from "../../../utils/listToMap";
import {updateQueryWithoutRerender} from "../../../utils/useSafeQueryUpdater";
import {NewUiViewsWithGroups} from "../../table-redesign/views-with-groups";
import {Box, Flex, Spinner} from "@chakra-ui/react";

const sortViews = (views = []) => {
  const firstSection = views.find((v) => v.type === "SECTION");
  const others = views.filter((v) => v.type !== "SECTION");
  return firstSection ? [firstSection, ...others] : others;
};

function DrawerObjectsPage({
  projectInfo,
  layout,
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
  selectedViewType,
  selectedView,
  setSelectedView = () => {},
  setSelectedViewType = () => {},
}) {
  const {state} = useLocation();
  const dispatch = useDispatch();
  const {menuId} = useParams();
  const {i18n} = useTranslation();
  const [loading, setLoading] = useState(false);

  const viewsPath = useSelector((state) => state.groupField.viewsPath);
  const viewsList = useSelector((state) => state.groupField.viewsList);

  const selectedTabIndex = useSelector(
    (state) => state?.drawer?.drawerTabIndex
  );

  const selectedV = viewsList?.[viewsList.length - 1];
  const lastPath = viewsPath?.[viewsPath.length - 1];
  const isRelationView = Boolean(selectedV?.relation_table_slug);

  const {data: menuViews} = useQuery(
    ["GET_TABLE_VIEWS_LIST", menuId],
    () => constructorViewService.getViewListMenuId(menuId),
    {
      enabled: !isRelationView && Boolean(menuId),
      select: (res) =>
        sortViews(
          res?.views?.filter(
            (item) => item?.type === "SECTION" || item?.is_relation_view
          ) ?? []
        ),
      onSuccess: (data) => {
        if (selectedTabIndex >= data.length) {
          dispatch(detailDrawerActions.setDrawerTabIndex(0));
        }
        setSelectedView(data?.[0]);
        updateQueryWithoutRerender("v", data?.[0]?.id);
        if (state?.toDocsTab) {
          dispatch(detailDrawerActions.setDrawerTabIndex(data?.length));
        }
        setTimeout(() => {
          setLoading(false);
        }, 500);
      },
    }
  );

  const {data: relationViews} = useQuery(
    ["GET_TABLE_VIEWS_LIST_RELATION", selectedV?.relation_table_slug],
    () =>
      constructorViewService.getViewListMenuId(selectedV?.relation_table_slug),
    {
      enabled: Boolean(viewsList?.[viewsList?.length - 1]?.relation_table_slug),

      select: (res) =>
        sortViews(
          res?.views?.filter(
            (item) => item?.type === "SECTION" || item?.is_relation_view
          ) ?? []
        ),

      onSuccess: (data) => {
        if (selectedTabIndex >= data.length) {
        }
        setSelectedView(data?.[0]);
        updateQueryWithoutRerender("v", data?.[0]?.id);

        if (state?.toDocsTab) {
          dispatch(detailDrawerActions.setDrawerTabIndex(data?.length));
        }
        setTimeout(() => {
          setLoading(false);
        }, 500);
      },
    }
  );

  const views = useMemo(() => {
    return !isRelationView ? menuViews : relationViews;
  }, [menuViews, relationViews, isRelationView, viewsList?.length]);

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
    [
      "GET_VIEWS_AND_FIELDS",
      i18n?.language,
      selectedTabIndex,
      lastPath?.length,
    ],
    () =>
      menuService.getFieldsListMenu(
        menuId,
        selectedV?.id,
        lastPath?.relation_table_slug || lastPath?.table_slug,
        {}
      ),
    {
      enabled:
        Boolean(lastPath?.relation_table_slug) || Boolean(lastPath?.table_slug),
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
    ["GET_VIEWS_AND_FIELDS", viewsList?.length],
    () =>
      constructorRelationService.getList(
        {
          table_slug: viewsList?.[viewsList?.length - 1]?.table_slug,
          relation_table_slug:
            viewsList?.[viewsList?.length - 1]?.relation_table_slug,
          disable_table_to: true,
        },
        {},
        viewsList?.[viewsList?.length - 1]?.relation_table_slug ||
          viewsList?.[viewsList?.length - 1]?.table_slug
      ),
    {
      enabled: Boolean(viewsList?.[0]?.table_slug),
    }
  );

  return (
    <Tabs direction="ltr" selectedIndex={selectedTabIndex}>
      <div>
        {views?.map((view) => (
          <TabPanel key={view.id}>
            {loading ? (
              <Flex alignItems={"center"} justifyContent={"center"} h={"100vh"}>
                <Spinner
                  style={{width: "50px", height: "50px", color: "#007aff"}}
                  size={"lg"}
                />
              </Flex>
            ) : (
              <NewUiViewsWithGroups
                setLoading={setLoading}
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
            )}
          </TabPanel>
        ))}
      </div>
    </Tabs>
  );
}

export default DrawerObjectsPage;
