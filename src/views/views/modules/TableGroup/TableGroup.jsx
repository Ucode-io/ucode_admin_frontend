import styles from "./styles.module.scss";
import {Drawer} from "@mui/material";
import GroupObjectDataTable from "@/components/DataTable/GroupObjectDataTable";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import { useTableGroupProps } from "./useTableGroupProps";
import { FieldSettings } from "../../components/FieldSettings";

export const TableGroup = () => {

  const {
    view,
    tableSlug,
    currentPage,
    setCurrentPage,
    selectedView,
    setSortedDatas,
    sortedDatas,
    fieldsForm,
    selectedTabIndex,
    filters,
    filterChangeHandler,
    limit,
    setLimit,
    deleteLoader,
    drawerState,
    setDrawerState,
    viewForm,
    update,
    columns,
    pageCount,
    tableLoader,
    deleteHandler,
    navigateToEditPage,
    openFieldSettings,
    setSelectedObjectsForDelete,
    multipleDelete,
    elementHeight,
    tableData,
    selectedObjectsForDelete,
    filterHeight,
    isFilterOpen,
  } = useTableGroupProps()

  return (
    <div className={styles.wrapper}>
      <PermissionWrapperV2 tableSlug={tableSlug} type={"read"}>
        <div
          style={{ display: "flex", alignItems: "flex-start", width: "100%" }}
          id="data-table"
        >
          <GroupObjectDataTable
            disablePagination={false}
            defaultLimit={view?.default_limit}
            selectedView={selectedView}
            setSortedDatas={setSortedDatas}
            sortedDatas={sortedDatas}
            setDrawerState={setDrawerState}
            isTableView={true}
            elementHeight={elementHeight}
            setFormValue={fieldsForm.setValue}
            mainForm={viewForm}
            isRelationTable={false}
            removableHeight={isFilterOpen ? (filterHeight + 129) : 129}
            currentPage={currentPage}
            pagesCount={pageCount}
            selectedObjectsForDelete={selectedObjectsForDelete}
            setSelectedObjectsForDelete={setSelectedObjectsForDelete}
            columns={columns}
            multipleDelete={multipleDelete}
            openFieldSettings={openFieldSettings}
            limit={limit}
            setLimit={setLimit}
            onPaginationChange={setCurrentPage}
            loader={tableLoader || deleteLoader}
            data={tableData}
            disableFilters
            filters={filters}
            filterChangeHandler={filterChangeHandler}
            onRowClick={navigateToEditPage}
            onDeleteClick={deleteHandler}
            tableSlug={tableSlug}
            view={view}
            tableStyle={{
              borderRadius: 0,
              border: "none",
              borderBottom: "1px solid #E5E9EB",
              width: "100%",
              margin: 0,
            }}
            isResizeble={true}
          />

          {/* <Button variant="outlined" style={{ borderColor: "#F0F0F0", borderRadius: "0px" }} onClick={openFieldSettings}>
            <AddRoundedIcon />
            Column
          </Button> */}
        </div>
      </PermissionWrapperV2>
      {/* {open && <ModalDetailPage open={open} setOpen={setOpen} view={view} />} */}

      <Drawer
        open={drawerState}
        anchor="right"
        onClose={() => setDrawerState(null)}
        orientation="horizontal"
      >
        <FieldSettings
          closeSettingsBlock={() => setDrawerState(null)}
          isTableView={true}
          onSubmit={(index, field) => update(index, field)}
          field={drawerState}
          formType={drawerState}
          mainForm={viewForm}
          selectedTabIndex={selectedTabIndex}
          height={`calc(100vh - 48px)`}
          // getRelationFields={getRelationFields}
        />
      </Drawer>
    </div>
  );
};
