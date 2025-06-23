import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
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
  setSelectedViewType = () => {},
}) {
  const {state} = useLocation();
  const dispatch = useDispatch();
  const {menuId} = useParams();
  const {i18n} = useTranslation();
  const [selectedView, setSelectedView] = useState(null);
  const viewsPath = useSelector((state) => state.groupField.viewsList);
  const selectedTabIndex = useSelector(
    (state) => state?.drawer?.drawerTabIndex
  );

  const selectedV = viewsPath?.[viewsPath?.length - 1];

  const {data: views, refetch} = useQuery(
    ["GET_VIEWS_LIST", menuId, selectedV?.relation_table_slug],
    () => {
      return constructorViewService.getViewListMenuId(
        selectedV?.relation_table_slug || menuId
      );
    },
    {
      enabled: Boolean(menuId),
      select: (res) => {
        return (
          res?.views?.filter(
            (item) => item?.type === "SECTION" || item?.is_relation_view
          ) ?? []
        );
      },
      onSuccess: (data) => {
        setSelectedView(data?.[selectedTabIndex]);
        updateQueryWithoutRerender("v", data?.[selectedTabIndex]?.id);
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
    ["GET_VIEWS_AND_FIELDS", i18n?.language, selectedTabIndex],
    () => {
      if (Boolean(!selectedV?.relation_table_slug)) return [];
      return menuService.getFieldsListMenu(
        menuId,
        selectedV?.id,
        selectedV?.relation_table_slug,
        {
          main_table: viewsPath?.length < 2 ? true : undefined,
        }
      );
    },
    {
      enabled: Boolean(selectedV?.table_slug),
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
    }
  );

  const {data: {relations} = {relations: []}} = useQuery(
    ["GET_VIEWS_AND_FIELDS", viewsPath],
    () => {
      return constructorRelationService.getList(
        {
          table_slug: viewsPath?.[0]?.table_slug,
          relation_table_slug: viewsPath?.[0]?.relation_table_slug,
        },
        viewsPath?.[0]?.table_slug
      );
    },
    {
      enabled: Boolean(viewsPath?.[0]?.table_slug),
      onSuccess: (res) => res?.relations ?? [],
    }
  );

  return (
    <>
      <Tabs direction={"ltr"} selectedIndex={selectedTabIndex}>
        <div>
          {views?.map((view) => {
            return (
              <TabPanel key={view.id}>
                <NewUiViewsWithGroups
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
            );
          })}
        </div>
      </Tabs>
    </>
  );
}

export default DrawerObjectsPage;
