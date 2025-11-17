import {Box, Button, Drawer} from "@mui/material";
import {
  CellStyleModule,
  CheckboxEditorModule,
  ColumnApiModule,
  DateEditorModule,
  ModuleRegistry,
  NumberEditorModule,
  RenderApiModule,
  RowSelectionModule,
  TextEditorModule,
  UndoRedoEditModule,
  ValidationModule,
  themeQuartz,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  MenuModule,
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import {AgGridReact} from "ag-grid-react";
import React from "react";
import NoFieldsComponent from "./AggridNewDesignHeader/NoFieldsComponent";
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import style from "./style.module.scss";
import DeleteColumnModal from "./DeleteColumnModal";
import FieldCreateModal from "@/components/DataTable/FieldCreateModal";
import { FieldSettings } from "../../components/FieldSettings";
import { RelationSettings } from "../../components/RelationSettings";
import { useGridProps } from "./useGridProps";

ModuleRegistry.registerModules([
  MenuModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  ServerSideRowModelModule,
  RowSelectionModule,
  RowGroupingModule,
  TreeDataModule,
  ValidationModule,
  CellSelectionModule,
  TextEditorModule,
  CheckboxEditorModule,
  NumberEditorModule,
  ColumnApiModule,
  CellStyleModule,
  DateEditorModule,
  UndoRedoEditModule,
  RenderApiModule,
  MasterDetailModule,
  ServerSideRowModelApiModule,
]);

const myTheme = themeQuartz.withParams({
  columnBorder: true,
  rowHeight: "32px",
});

export const Tree = ({ getRelationFields = () => {} }) => {

  const {
    view,
    tableSlug,
    visibleColumns,
    viewForm,
    menuItem,
    tabs,
    selectedTabIndex,
    calculatedHeight,
    setGroupTab,
    groupTab,
    columns,
    gridApi,
    getColumnsUpdated,
    limit,
    rowSelection,
    isServerSideGroup,
    getServerSideGroupKey,
    defaultColDef,
    cellSelection,
    onColumnPinned,
    getMainMenuItems,
    addClickedRef,
    waitUntilStoreReady,
    autoGroupColumnDef,
    onGridReady,
    getDataPath,
    updateObject,
    columnId,
    handleCloseModal,
    openDeleteModal,
    initialTableInfo,
    fieldCreateAnchor,
    setFieldCreateAnchor,
    watch,
    control,
    setValue,
    handleSubmit,
    onSubmit,
    reset,
    fieldData,
    handleOpenFieldDrawer,
    register,
    drawerState,
    setDrawerState,
    update,
    setDrawerStateField,
    drawerStateField,
  } = useGridProps()

  return (
    <Box
      sx={{
        height: `calc(100vh - ${calculatedHeight + 85}px)`,
        overflow: "scroll",
      }}
    >
      <div className={style.gridTableTree}>
        <div
          className="ag-theme-quartz"
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <Box
            className="scrollbarNone"
            sx={{ width: "100%", background: "#fff" }}
          >
            {Boolean(tabs?.length) && (
              <Box
                sx={{
                  display: "flex",
                  padding: "10px 0 0 20px",
                  borderBottom: "1px solid #eee",
                }}
              >
                {tabs?.map((item) => (
                  <Button
                    key={item.value}
                    onClick={() => {
                      setGroupTab(item);
                    }}
                    variant="outlined"
                    className={
                      groupTab?.value === item?.value
                        ? style.tabGroupBtnActive
                        : style.tabGroupBtn
                    }
                  >
                    {item?.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box
              className="scrollbarNone"
              sx={{
                height: `calc(100vh - ${calculatedHeight + 85}px)`,
              }}
            >
              {!columns?.length ? (
                <NoFieldsComponent />
              ) : (
                <>
                  <AgGridReact
                    ref={gridApi}
                    theme={myTheme}
                    gridOptions={{
                      rowBuffer: 10,
                      cacheBlockSize: 100,
                      maxBlocksInCache: 10,
                    }}
                    serverSideStoreType="serverSide"
                    serverSideTransaction={true}
                    onColumnMoved={getColumnsUpdated}
                    columnDefs={columns}
                    enableClipboard={true}
                    groupDisplayType="single"
                    paginationPageSize={limit}
                    undoRedoCellEditing={true}
                    rowSelection={rowSelection}
                    isServerSideGroup={isServerSideGroup}
                    getServerSideGroupKey={getServerSideGroupKey}
                    rowModelType={"serverSide"}
                    undoRedoCellEditingLimit={5}
                    defaultColDef={defaultColDef}
                    cellSelection={cellSelection}
                    onColumnPinned={onColumnPinned}
                    getMainMenuItems={getMainMenuItems}
                    treeData={true}
                    onRowGroupOpened={(params) => {
                      addClickedRef.current === true &&
                        setTimeout(() => {
                          waitUntilStoreReady(params);
                          addClickedRef.current = false;
                        }, 1100);
                    }}
                    getRowId={(params) => params?.data?.guid}
                    autoGroupColumnDef={autoGroupColumnDef}
                    suppressServerSideFullWidthLoadingRow={true}
                    loadingOverlayComponent={CustomLoadingOverlay}
                    onGridReady={onGridReady}
                    getDataPath={getDataPath}
                    onCellValueChanged={(e) => {
                      updateObject(e.data);
                    }}
                    onCellDoubleClicked={(params) => params.api.stopEditing()}
                  />
                </>
              )}
            </Box>
          </Box>
        </div>
      </div>

      <DeleteColumnModal
        view={view}
        columnId={columnId}
        tableSlug={tableSlug}
        handleCloseModal={handleCloseModal}
        openDeleteModal={openDeleteModal}
      />
      <FieldCreateModal
        tableSlug={tableSlug}
        initialTableInfo={initialTableInfo}
        mainForm={viewForm}
        anchorEl={fieldCreateAnchor}
        setAnchorEl={setFieldCreateAnchor}
        watch={watch}
        control={control}
        setValue={setValue}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        fields={visibleColumns}
        reset={reset}
        menuItem={menuItem}
        fieldData={fieldData}
        handleOpenFieldDrawer={handleOpenFieldDrawer}
        register={register}
      />
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
      </Drawer>
    </Box>
  );
}
