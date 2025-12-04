import MaterialUIProvider from "@/providers/MaterialUIProvider";
import { useTableProps } from "./useTableProps";
import { DynamicTable } from "./components/DynamicTable";

export const Table = ({ tab, ...props }) => {
  const {
    tableLan,
    totalCount,
    tableData,
    setDrawerState,
    setDrawerStateField,
    multipleDelete,
    fields,
    setCurrentPage,
    columns,
    control,
    deleteHandler,
    onRowClick,
    selectedObjectsForDelete,
    setSelectedObjectsForDelete,
    limit,
    setLimit,
    view,
    refetch,
    setSortedDatas,
    sortedDatas,
    setFormValue,
    getValues,
    watch,
    currentPage,
    handleChange,
    rows,
    updateObject,
    tableLoading,
  } = useTableProps({ tab });

  return (
    <MaterialUIProvider style={{ height: "100%" }}>
      <div id="wrapper_drag" style={{ height: "100%" }}>
        <DynamicTable
          tableLan={tableLan}
          dataCount={totalCount}
          data={tableData}
          setDrawerState={setDrawerState}
          setDrawerStateField={setDrawerStateField}
          getValues={getValues}
          isTableView={true}
          multipleDelete={multipleDelete}
          sortedDatas={sortedDatas}
          fields={fields}
          currentPage={currentPage}
          onPaginationChange={setCurrentPage}
          setSortedDatas={setSortedDatas}
          columns={columns}
          watch={watch}
          control={control}
          setFormValue={setFormValue}
          onDeleteClick={deleteHandler}
          onRowClick={onRowClick}
          selectedObjectsForDelete={selectedObjectsForDelete}
          setSelectedObjectsForDelete={setSelectedObjectsForDelete}
          limit={limit}
          setLimit={setLimit}
          // isChecked={(row) => selectedObjects?.includes(row.guid)}
          summaries={view?.attributes?.summaries}
          refetch={refetch}
          updateObject={updateObject}
          handleChange={handleChange}
          rows={rows}
          tableLoading={tableLoading}
          {...props}
        />
      </div>
    </MaterialUIProvider>
  );
};
