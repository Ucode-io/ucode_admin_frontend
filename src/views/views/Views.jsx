import { useViewsProps } from "./useViewsProps";
import { ChakraProvider } from "@chakra-ui/react";
import chakraUITheme from "@/theme/chakraUITheme";
import { ViewProvider } from "@/providers/ViewProvider";
import { Header } from "./components/Header";
import { HeaderFilter } from "./components/HeaderFilter";
import { FilterProvider } from "./providers/FilterProvider";
import { FieldsProvider } from "./providers/FieldsProvider";
import DrawerDetailPage from "./components/DrawerDetailPage";

export const Views = ({
  relationFields,
  isRelationView = false,
  handleCloseDrawer = () => {},
  onSectionSubmit = () => {},
  updateLayout = () => {},
  handleMouseDown = () => {},
  layoutData = {},
  rootForm,
}) => {
  const {
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
  } = useViewsProps({ isRelationView });

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
            />

            {getView(viewType)}

            {!isRelationView && (
              <DrawerDetailPage
                tableSlug={tableSlug}
                menuId={menuId}
                view={view}
                projectInfo={projectInfo}
                selectedRow={selectedRow}
                menuItem={menuItem}
                layout={layout}
                // selectedViewType={selectedViewType}
                // setSelectedViewType={setSelectedViewType}
              />
            )}
          </FieldsProvider>
          {/* TEMPORARY COMMENT */}
          {/* {Boolean(open && projectInfo?.new_layout) &&
          selectedViewType === "SidePeek" ? (
            new_router ? (
              <DrawerDetailPage
                view={view}
                projectInfo={projectInfo}
                open={open}
                setFormValue={setFormValue}
                selectedRow={selectedRow}
                menuItem={menuItem}
                layout={layout}
                fieldsMap={fieldsMap}
                refetch={refetch}
                layoutType={layoutType}
                setLayoutType={setLayoutType}
                selectedViewType={selectedViewType}
                setSelectedViewType={setSelectedViewType}
                navigateToEditPage={navigateToDetailPage}
              />
            ) : (
              <OldDrawerDetailPage
                view={view}
                projectInfo={projectInfo}
                open={open}
                setFormValue={setFormValue}
                selectedRow={selectedRow}
                menuItem={menuItem}
                layout={layout}
                fieldsMap={fieldsMap}
                refetch={refetch}
                layoutType={layoutType}
                setLayoutType={setLayoutType}
                selectedViewType={selectedViewType}
                setSelectedViewType={setSelectedViewType}
                navigateToEditPage={navigateToDetailPage}
              />
            )
          ) : selectedViewType === "CenterPeek" ? (
            Boolean(new_router) ? (
              <ModalDetailPage
                view={view}
                projectInfo={projectInfo}
                open={open}
                setFormValue={setFormValue}
                selectedRow={selectedRow}
                menuItem={menuItem}
                layout={layout}
                fieldsMap={fieldsMap}
                refetch={refetch}
                layoutType={layoutType}
                setLayoutType={setLayoutType}
                selectedViewType={selectedViewType}
                setSelectedViewType={setSelectedViewType}
                navigateToEditPage={navigateToDetailPage}
                tableSlug={tableSlug}
              />
            ) : (
              <OldModalDetailPage
                open={open}
                selectedRow={selectedRow}
                menuItem={menuItem}
                layout={layout}
                fieldsMap={fieldsMap}
                refetch={refetch}
                setLayoutType={setLayoutType}
                selectedViewType={selectedViewType}
                setSelectedViewType={setSelectedViewType}
                navigateToEditPage={navigateToDetailPage}
              />
            )
          ) : null} */}

          {/* {Boolean(open && !projectInfo?.new_layout) && (
            <ModalDetailPage
              open={open}
              selectedRow={selectedRow}
              menuItem={menuItem}
              layout={layout}
              fieldsMap={fieldsMap}
              refetch={refetch}
              setLayoutType={setLayoutType}
              selectedViewType={selectedViewType}
              setSelectedViewType={setSelectedViewType}
              navigateToEditPage={navigateToDetailPage}
              tableSlug={tableSlug}
              modal
            />
          )} */}
        </FilterProvider>
      </ViewProvider>
    </ChakraProvider>
  );
};
