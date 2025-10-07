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

export const Table = ({
  tab,
  ...props
}) => {

  const {
    tableLan,
    dataCount,
    tableData,
    setDrawerState,
    setDrawerStateField,
    viewForm,
    multipleDelete,
    fields,
    setCurrentPage,
    columns,
    control,
    deleteHandler,
    navigateToEditPage,
    selectedObjectsForDelete,
    setSelectedObjectsForDelete,
    limit,
    setLimit,
    view,
    refetch,
    loader,
    setSortedDatas,
    sortedDatas,
    setFormValue,
    getValues,
    watch,
    currentPage,
  } = useTableProps({ tab })
  

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
          mainForm={viewForm}
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
          onRowClick={navigateToEditPage}
          selectedObjectsForDelete={selectedObjectsForDelete}
          setSelectedObjectsForDelete={setSelectedObjectsForDelete}
          limit={limit}
          setLimit={setLimit}
          // isChecked={(row) => selectedObjects?.includes(row.guid)}
          summaries={view?.attributes?.summaries}
          refetch={refetch}
          loader={loader}
          {...props}
        />
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
        )}

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
            mainForm={mainForm}
            selectedTabIndex={selectedTabIndex}
            height={`calc(100vh - 48px)`}
            getRelationFields={getRelationFields}
            menuItem={menuItem}
          />
        </Drawer>

        <Drawer
          open={drawerStateField}
          anchor="right"
          onClose={() => setDrawerState(null)}
          orientation="horizontal"
        >
          <RelationSettings
            relation={drawerStateField}
            closeSettingsBlock={() => setDrawerStateField(null)}
            getRelationFields={getRelationFields}
            formType={drawerStateField}
            height={`calc(100vh - 48px)`}
          />
        </Drawer> */}
      </div>
    </MaterialUIProvider>
  );
};
