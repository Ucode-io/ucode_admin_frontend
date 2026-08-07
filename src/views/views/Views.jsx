import { useViewsProps } from "./useViewsProps";
import { ChakraProvider } from "@chakra-ui/react";
import chakraUITheme from "@/theme/chakraUITheme";
import { ViewProvider } from "@/providers/ViewProvider";
import { Header } from "./components/Header";
import { HeaderFilter } from "./components/HeaderFilter";
import { FilterProvider } from "./providers/FilterProvider";
import { FieldsProvider } from "./providers/FieldsProvider";
import DrawerDetailPage from "./components/DrawerDetailPage";
import { DrawerFormSkeleton } from "./components/DrawerDetailPage/DrawerFormSkeleton";
import { VIEW_TYPES_MAP } from "@/utils/constants/viewTypes";

export const Views = ({
  isRelationView = false,
  handleCloseDrawer = () => {},
  onSectionSubmit = () => {},
  updateLayout = () => {},
  handleMouseDown = () => {},
  layoutData = {},
  isLayoutLoading = false,
  rootForm,
}) => {
  const {
    viewId,
    tableName,
    tableSlug,
    fieldsMap,
    fieldsMapRel,
    menuId,
    menuIdForViewsList,
    refetchViews,
    setSelectedView,
    views,
    view,
    refetchTableInfo,
    permissions,
    roleName,
    columnsForSearch,
    viewType,
    handleSearchOnChange,
    orderBy,
    setOrderBy,
    setSortedDatas,
    tableInfo,
    projectId,
    sortedDatas,
    visibleColumns,
    noDates,
    setNoDates,
    handleAddDate,
    navigateCreatePage,
    settingsForm,
    viewForm,
    authInfo,
    visibleRelationColumns,
    handleUpdateView,
    isViewUpdating,
    searchText,
    selectAll,
    setCheckedColumns,
    checkedColumns,
    computedVisibleFields,
    projectInfo,
    menuItem,
    currentPage,
    setCurrentPage,
    setLimit,
    setTotalCount,
    limit,
    totalCount,
    setSearchText,
    customEvents,
    layoutType,
    setLayoutType,
    selectedRow,
    setSelectedRow,
    layout,
    selectedViewType,
    setSelectedViewType,
    selectedView,
    tabs,
    getView,
    setCenterDate,
    fieldsForm,
    fields,
    isLoadingTable,
    selectedTabIndex,
    navigateToEditPage,
    refetchMainDataList,
    isLoadingTableInfo,
    isTableMetaReady,
    viewsLoader,
    setViewsLoader,
    isLoadingViews,
    defaultFiltersMap,
    setDefaultFiltersMap,
  } = useViewsProps({ isRelationView });

  // ponytail: viewType is undefined until the drawer's views list lands, and getView()
  // returns an empty fragment for it — that was the blank panel.
  const isDrawerContentLoading =
    isRelationView &&
    (!viewType ||
      (viewType === VIEW_TYPES_MAP.SECTION &&
        (isLayoutLoading || !isTableMetaReady)));

  return (
    <ChakraProvider theme={chakraUITheme}>
      <ViewProvider
        state={{
          view,
          tableSlug,
          refetchTableInfo,
          permissions,
          roleName,
          columnsForSearch,
          views,
          viewId,
          viewType,
          refetchViews,
          isRelationView,
          setSelectedView,
          tableInfo,
          projectId,
          menuId,
          menuIdForViewsList,
          visibleColumns,
          viewForm,
          authInfo,
          visibleRelationColumns,
          handleUpdateView,
          isViewUpdating,
          searchText,
          selectAll,
          setCheckedColumns,
          checkedColumns,
          computedVisibleFields,
          projectInfo,
          menuItem,
          currentPage,
          setCurrentPage,
          setLimit,
          setTotalCount,
          limit,
          totalCount,
          setSearchText,
          customEvents,
          layoutType,
          layout,
          setLayoutType,
          selectedRow,
          setSelectedRow,
          handleCloseDrawer,
          selectedView,
          selectedViewType,
          setSelectedViewType,
          layoutData,
          rootForm,
          onSectionSubmit,
          updateLayout,
          handleMouseDown,
          tabs,
          setCenterDate,
          setNoDates,
          noDates,
          isLoadingTable,
          selectedTabIndex,
          navigateToEditPage,
          refetchMainDataList,
          navigateCreatePage,
          isLoadingTableInfo,
          isTableMetaReady,
          viewsLoader,
          setViewsLoader,
        }}
      >
        <FilterProvider
          state={{
            handleSearchOnChange,
            orderBy,
            setOrderBy,
            setSortedDatas,
            sortedDatas,
            defaultFiltersMap,
            setDefaultFiltersMap,
          }}
        >
          <FieldsProvider
            state={{
              fieldsMap,
              fieldsMapRel,
              fieldsForm,
              fields,
            }}
          >
            <Header tableName={tableName} />

            <HeaderFilter
              noDates={noDates}
              setNoDates={setNoDates}
              handleAddDate={handleAddDate}
              navigateCreatePage={navigateCreatePage}
              settingsForm={settingsForm}
              isLoadingViews={isLoadingViews}
            />

            {isDrawerContentLoading ? <DrawerFormSkeleton /> : getView(viewType)}

            {!isRelationView && (
              <DrawerDetailPage
                tableSlug={tableSlug}
                menuId={menuId}
                view={view}
                projectInfo={projectInfo}
                selectedRow={selectedRow}
                menuItem={menuItem}
                layout={layout}
                refetchMainDataList={refetchMainDataList}
              />
            )}
          </FieldsProvider>
        </FilterProvider>
      </ViewProvider>
    </ChakraProvider>
  );
};
