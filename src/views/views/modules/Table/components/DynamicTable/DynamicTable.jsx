import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Pagination, Button } from "@mui/material";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SummaryRow from "@/components/DataTable/SummaryRow";
import { CreatableSelect } from "chakra-react-select";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import { mockColumns } from "./constants";
import { useDynamicTableProps } from "./useDynamicTableProps";
import { Th } from "./components/Th";
import { TableDataSkeleton } from "@/components/TableDataSkeleton";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import { TableRow } from "./components/TableRow";
import { AddNewData } from "./components/AddNewData";
import { IndexTh } from "./components/IndexTh";
import { FieldButton } from "./components/FieldButton";

export const DynamicTable = ({
  tableLan,
  dataCount,
  data = [],
  setDrawerState,
  setDrawerStateField,
  getValues,
  additionalRow,
  mainForm,
  isTableView = true,
  remove,
  multipleDelete,
  sortedDatas,
  fields = [],
  isRelationTable = false,
  currentPage = 1,
  onPaginationChange = () => {},
  setSortedDatas,
  columns = [],
  watch,
  control,
  setFormValue,
  onDeleteClick,
  onRowClick = () => {},
  isResizable,
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  limit,
  setLimit,
  summaries,
  relationAction,
  onChecked,
  refetch = () => {},
  loader,
  isPaginationPositionSticky,
  getAllData = () => {},
}) => {
  const {
    i18n,
    tableSize,
    tableSettings,
    fieldCreateAnchor,
    setFieldCreateAnchor,
    fieldData,
    setFieldData,
    addNewRow,
    setAddNewRow,
    formType,
    setFormType,
    isModal,
    limitOptions,
    pageName,
    calculateWidthFixedColumn,
    renderColumns,
    onCreateLimitOption,
    getLimitValue,
    calculatedHeight,
    tableSlug,
    view,
    menuItem,
    isRelationView,
    fieldsMap,
  } = useDynamicTableProps({ columns, isResizable, setLimit, data, fields });
  console.log("Rendered");
  return (
    <div
      className="CTableContainer"
      style={
        isPaginationPositionSticky
          ? { display: "flex", flexDirection: "column", height: "100%" }
          : {}
      }
    >
      <div
        className="table"
        style={{
          border: "none",
          borderRadius: 0,
          flexGrow: 1,
          backgroundColor: "#fff",
          height: `calc(100vh - ${calculatedHeight + (isModal ? 230 : 130)}px)`,
        }}
      >
        <table id="resizeMe">
          <thead
            style={{
              borderBottom: "1px solid #EAECF0",
              position: "sticky",
              top: 0,
              zIndex: 0,
              background: "red",
            }}
          >
            <tr>
              <IndexTh
                items={isRelationTable ? fields : data}
                selectedItems={selectedObjectsForDelete}
                onSelectAll={(checked) =>
                  setSelectedObjectsForDelete(
                    checked ? (isRelationTable ? fields : data) : []
                  )
                }
              />
              {loader
                ? mockColumns.map((column) => (
                    <Th
                      key={column.id}
                      tableSlug={tableSlug}
                      columns={columns}
                      column={column}
                      tableSettings={tableSettings}
                      tableSize={tableSize}
                      pageName={pageName}
                      sortedDatas={sortedDatas}
                      setSortedDatas={setSortedDatas}
                      relationAction={relationAction}
                      isRelationTable={isRelationTable}
                      getAllData={getAllData}
                      setFieldCreateAnchor={setFieldCreateAnchor}
                      setFieldData={setFieldData}
                    />
                  ))
                : renderColumns.map((column) => (
                    <Th
                      key={column.id}
                      tableSlug={tableSlug}
                      columns={renderColumns}
                      column={column}
                      tableSettings={tableSettings}
                      tableSize={tableSize}
                      pageName={pageName}
                      relationAction={relationAction}
                      isRelationTable={isRelationTable}
                      setFieldCreateAnchor={(e) => {
                        setFormType("EDIT");
                        setFieldCreateAnchor(e);
                      }}
                      setFieldData={setFieldData}
                      getAllData={getAllData}
                    />
                  ))}
              {!isRelationTable && (
                <PermissionWrapperV2
                  tableSlug={tableSlug}
                  type="add_field"
                  id="addField"
                >
                  <FieldButton
                    tableSlug={tableSlug}
                    tableLan={tableLan}
                    view={view}
                    mainForm={mainForm}
                    setFieldCreateAnchor={setFieldCreateAnchor}
                    fieldCreateAnchor={fieldCreateAnchor}
                    fieldData={fieldData}
                    setFieldData={setFieldData}
                    setDrawerState={setDrawerState}
                    setDrawerStateField={setDrawerStateField}
                    menuItem={menuItem}
                    setSortedDatas={setSortedDatas}
                    sortedDatas={sortedDatas}
                    formType={formType}
                    setFormType={setFormType}
                    renderColumns={renderColumns}
                  />
                </PermissionWrapperV2>
              )}
            </tr>
          </thead>
          <tbody>
            {loader ? (
              <TableDataSkeleton colLength={5 + (!isRelationTable ? 2 : 1)} />
            ) : (
              (isRelationTable ? fields : data).map(
                (virtualRowObject, index) => {
                  return (
                    <TableRow
                      key={isRelationTable ? virtualRowObject?.id : index}
                      row={virtualRowObject}
                      width={"40px"}
                      rowIndex={index}
                      remove={remove}
                      watch={watch}
                      getValues={getValues}
                      control={control}
                      mainForm={mainForm}
                      isTableView={isTableView}
                      selectedObjectsForDelete={selectedObjectsForDelete}
                      setSelectedObjectsForDelete={setSelectedObjectsForDelete}
                      isRelationTable={isRelationTable}
                      onRowClick={onRowClick}
                      calculateWidthFixedColumn={calculateWidthFixedColumn}
                      currentPage={currentPage}
                      limit={limit}
                      setFormValue={setFormValue}
                      columns={columns}
                      tableSettings={tableSettings}
                      pageName={pageName}
                      tableSlug={tableSlug}
                      onDeleteClick={onDeleteClick}
                      relationAction={relationAction}
                      relationView={isRelationView}
                      onChecked={onChecked}
                      relationFields={fields?.length}
                      data={data}
                      view={view}
                      firstRowWidth={45}
                    />
                  );
                }
              )
            )}
            {addNewRow && (
              <AddNewData
                rows={isRelationTable ? fields : data}
                columns={columns}
                isRelationTable={isRelationTable}
                setAddNewRow={setAddNewRow}
                isTableView={isTableView}
                tableSlug={tableSlug}
                getValues={getValues}
                mainForm={mainForm}
                relationfields={fields}
                data={data}
                view={view}
                onRowClick={onRowClick}
                width={"80px"}
                refetch={refetch}
                pageName={pageName}
                tableSettings={tableSettings}
                calculateWidthFixedColumn={calculateWidthFixedColumn}
                firstRowWidth={45}
                relationView={isRelationView}
                fieldsMap={fieldsMap}
              />
            )}
            <PermissionWrapperV2 tableSlug={tableSlug} type={"write"}>
              <tr>
                <td
                  style={{
                    padding: "0",
                    position: "sticky",
                    left: "0",
                    backgroundColor: "#FFF",
                    zIndex: "1",
                    width: "45px",
                    color: "#007aff",
                  }}
                >
                  <Flex
                    id="addRowBtn"
                    h="30px"
                    alignItems="center"
                    justifyContent="center"
                    transition="background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
                    cursor="pointer"
                    _hover={{ bg: "rgba(0, 122, 255, 0.08)" }}
                    onClick={() => setAddNewRow(true)}
                  >
                    <AddRoundedIcon fill="#007aff" />
                  </Flex>
                </td>
              </tr>
            </PermissionWrapperV2>

            {!!summaries?.length && (
              <SummaryRow summaries={summaries} columns={columns} data={data} />
            )}
            {additionalRow}
          </tbody>
        </table>
      </div>

      <Flex
        px="16px"
        py="6px"
        borderTop="1px solid #EAECF0"
        justifyContent="space-between"
        bg="#fff"
      >
        <Flex
          columnGap="16px"
          alignItems="center"
          fontSize={14}
          fontWeight={600}
          color="#344054"
        >
          {generateLangaugeText(tableLan, i18n?.language, "Show") || "Show"}
          <ChakraProvider>
            <CreatableSelect
              chakraStyles={{
                container: (provided) => ({
                  ...provided,
                  width: "150px",
                }),
              }}
              value={{
                value: limit,
                label: `${limit} ${
                  generateLangaugeText(tableLan, i18n?.language, "Show") ||
                  "Show"
                }`,
              }}
              options={limitOptions?.map((option) => ({
                ...option,
                label: `${option.value} ${generateLangaugeText(tableLan, i18n?.language, "rows") || "rows"}`,
              }))}
              menuPlacement="top"
              onChange={({ value }) => getLimitValue(value)}
              onCreateOption={onCreateLimitOption}
            />
          </ChakraProvider>
          {generateLangaugeText(tableLan, i18n?.language, "out of") || "out of"}{" "}
          {dataCount}
        </Flex>

        <Pagination
          page={currentPage}
          onChange={(_, page) => onPaginationChange(page)}
          count={Math.ceil((dataCount ?? 0) / limit)}
          variant="outlined"
          shape="rounded"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />

        {selectedObjectsForDelete?.length > 0 && (
          <RectangleIconButton
            style={{ minWidth: "160px", border: "none" }}
            color="error"
            onClick={multipleDelete}
          >
            <Button variant="outlined" color="error">
              {generateLangaugeText(
                tableLan,
                i18n?.language,
                "Delete all selected"
              ) || "Delete all selected"}
            </Button>
          </RectangleIconButton>
        )}
      </Flex>
    </div>
  );
};
