import MaterialUIProvider from "@/providers/MaterialUIProvider";
// import FieldSettings from "@/views/Constructor/Tables/Form/Fields/FieldSettings";
// import RelationSettings from "@/views/Constructor/Tables/Form/Relations/RelationSettings";
import styles from "@/views/Objects/style.module.scss";
// import {Drawer} from "@mui/material";
// import DrawerDetailPage from "../Objects/DrawerDetailPage";
// import OldDrawerDetailPage from "../Objects/DrawerDetailPage/OldDrawerDetailPage";
// import ModalDetailPage from "@/views/Objects/ModalDetailPage/ModalDetailPage";
import { useTableProps } from "./useTableProps";
import { DynamicTable } from "./components/DynamicTable";
// import OldModalDetailPage from "../Objects/ModalDetailPage/OldModalDetailPage";

export const Table = ({ tab, ...props }) => {
  const {
    tableLan,
    dataCount,
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
    <MaterialUIProvider>
      <div id="wrapper_drag" className={styles.wrapper}>
        <DynamicTable
          tableLan={tableLan}
          dataCount={dataCount}
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
