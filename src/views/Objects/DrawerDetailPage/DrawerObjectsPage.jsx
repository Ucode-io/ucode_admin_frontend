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
import {groupFieldActions} from "../../../store/groupField/groupField.slice";

function DrawerObjectsPage({
  open,
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
  selectedView,
  setOpen = () => {},
  onSubmit = () => {},
  setSelectedView = () => {},
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
  const auth = useSelector((state) => state.auth);
  const companyDefaultLink = useSelector((state) => state.company?.defaultPage);
  const tableSlug = selectedView?.table_slug;
  const parentView = useSelector((state) => state?.groupField?.view);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

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
            (item) => item?.type === "SECTION" || item?.is_relation_view
          ) ?? []
        );
      },
      onSuccess: (data) => {
        setSelectedView(data?.[selectedTabIndex]);
        updateQueryWithoutRerender("v", data?.[selectedTabIndex]?.id);
        if (state?.toDocsTab) setSelectedTabIndex(data?.length);
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
        dispatch(groupFieldActions.addView(data?.table_info));
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
    ["GET_VIEWS_AND_FIELDS", parentView?.table_slug],
    () => {
      return constructorRelationService.getList(
        {
          table_slug: parentView?.table_slug,
          relation_table_slug: parentView?.table_slug,
        },
        parentView?.table_slug
      );
    },
    {
      enabled: Boolean(parentView?.table_slug),
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
                  open={open}
                  setOpen={setOpen}
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
                  setSelectedTabIndex={setSelectedTabIndex}
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
