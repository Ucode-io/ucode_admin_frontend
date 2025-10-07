import { useViewsProps } from "./useViewsProps";
import { ChakraProvider } from "@chakra-ui/react";
import chakraUITheme from "@/theme/chakraUITheme";
import { ViewProvider } from "@/providers/ViewProvider";
import { Header } from "./components/Header";
import { HeaderFilter } from "./components/HeaderFilter";
import { FilterProvider } from "./providers/FilterProvider";
import { FieldsProvider } from "./providers/FieldsProvider";
import MaterialUIProvider from "@/providers/MaterialUIProvider";

export const Views = ({ relationFields, isRelationView = false }) => {
  const {
    viewsMap,
    viewId,
    tableName,
    tableSlug,
    fieldsMap,
    fieldsMapRel,
    menuId,
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
    handleSortClick,
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
    paginationCount,
    currentPage,
    setCurrentPage,
    customEvents,
    layoutType,
    setLayoutType,
    selectedRow,
    setSelectedRow,
  } = useViewsProps();

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
          paginationCount,
          currentPage,
          setCurrentPage,
          customEvents,
          layoutType,
          setLayoutType,
          selectedRow,
          setSelectedRow,
        }}
      >
        <FilterProvider
          state={{
            handleSearchOnChange,
            orderBy,
            handleSortClick,
            setOrderBy,
            setSortedDatas,
            sortedDatas,
          }}
        >
          <FieldsProvider
            state={{
              fieldsMap,
              fieldsMapRel,
              relationFields,
            }}
          >
            <Header tableName={tableName} />
            <HeaderFilter
              noDates={noDates}
              setNoDates={setNoDates}
              handleAddDate={handleAddDate}
              navigateCreatePage={navigateCreatePage}
              settingsForm={settingsForm}
            />
            {viewsMap[viewType]}
          </FieldsProvider>
        </FilterProvider>
      </ViewProvider>
    </ChakraProvider>
  );
};
