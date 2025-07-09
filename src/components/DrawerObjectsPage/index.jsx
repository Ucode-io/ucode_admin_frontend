import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
import {useQuery} from "react-query";
import {TabPanel, Tabs} from "react-tabs";
import {groupFieldActions} from "../../store/groupField/groupField.slice";
import { NewUiViewsWithGroups } from "../../views/table-redesign/views-with-groups";

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
  selectedView,
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
  const {menuId} = useParams();
  const {i18n} = useTranslation();
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get("view");
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

  // const {isLoading: permissionGetByIdLoading} = useMenuPermissionGetByIdQuery({
  //   projectId: projectId,
  //   roleId: roleId,
  //   parentId: menuId,
  //   queryParams: {
  //     enabled: Boolean(menuId),
  //     onSuccess: (res) => {
  //       if (
  //         !res?.menus
  //           ?.filter((item) => item?.permission?.read)
  //           ?.some((el) => el?.id === menuId)
  //       ) {
  //       }
  //     },
  //     cacheTime: false,
  //   },
  // });

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
  console.log("selectedViewwww======> DrawerObjectPage", selectedView);
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
        // if (selectedView?.type !== "SECTION") {
        //   dispatch(groupFieldActions.addView(data?.tableInfo));
        // }
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
