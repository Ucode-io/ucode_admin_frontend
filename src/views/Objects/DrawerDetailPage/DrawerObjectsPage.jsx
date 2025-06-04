import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
import {useMenuPermissionGetByIdQuery} from "../../../services/rolePermissionService";
import constructorViewService from "../../../services/constructorViewService";
import {updateQueryWithoutRerender} from "../../../utils/useSafeQueryUpdater";
import menuService from "../../../services/menuService";
import {store} from "../../../store";
import {useQuery} from "react-query";
import {NewUiViewsWithGroups} from "../../table-redesign/views-with-groups";
import {listToMap, listToMapWithoutRel} from "../../../utils/listToMap";
import {TabPanel, Tabs} from "react-tabs";

function DrawerObjectsPage({setViews}) {
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

  return (
    <>
      <Tabs direction={"ltr"} selectedIndex={selectedTabIndex}>
        <div>
          {views?.map((view) => {
            return (
              <TabPanel key={view.id}>
                <NewUiViewsWithGroups
                  relationView={true}
                  views={views}
                  view={view}
                  selectedTabIndex={selectedTabIndex}
                  setSelectedTabIndex={setSelectedTabIndex}
                  fieldsMap={fieldsMap}
                  menuItem={menuItem}
                  visibleRelationColumns={visibleRelationColumns}
                  visibleColumns={visibleColumns}
                  refetchViews={refetch}
                  fieldsMapRel={fieldsMapRel}
                  setViews={setViews}
                  setSelectedView={setSelectedView}
                  selectedView={selectedView}
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
