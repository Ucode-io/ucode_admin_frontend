import { Delete } from "@mui/icons-material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Button, Checkbox } from "@mui/material";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import { CTableCell, CTableRow } from "@/components/CTable";
import CellElementGenerator from "@/components/ElementGenerators/CellElementGenerator";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
// import TableDataForm from "@/components/ElementGenerators/TableDataForm";
import { useTableRowProps } from "./useTableRowProps";
import GeneratePdfFromTable from "@/components/DataTable/GeneratePdfFromTable";
import TableDataForm from "@/views/views/components/ElementGenerators/TableDataForm";
// import TableDataForm from "@/components/ElementGenerators/TableDataForm";

export const TableRow = ({
  relOptions,
  row,
  width,
  rowIndex,
  control,
  isTableView,
  onRowClick,
  calculateWidthFixedColumn,
  onDeleteClick,
  // mainForm,
  getValues,
  currentPage,
  // view,
  columns,
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  tableSettings,
  pageName,
  watch,
  setFormValue,
  // tableSlug,
  limit = 10,
  relationAction,
  onChecked,
  relationFields,
  data,
  style,
  firstRowWidth = 80,
  relationView,
  handleChange,
  updateObject,
}) => {
  const {
    navigate,
    projectId,
    hasPermission,
    changeSetDelete,
    parentRef,
    selected,
    tableSlug,
    viewForm,
    view,
  } = useTableRowProps({
    selectedObjectsForDelete,
    setSelectedObjectsForDelete,
    row,
    rowIndex,
    getValues,
  });

  return (
    <>
      {!relationAction ? (
        <>
          <CTableRow
            style={{ ...style, height: "32px" }}
            className="new-ui small"
            ref={parentRef}
          >
            <CTableCell
              align="center"
              className="data_table__number_cell small"
              style={{
                padding: "0 4px",
                position: "sticky",
                left: "0",
                backgroundColor: "#F6F6F6",
                zIndex: "1",
                height: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!selected && (
                  <span
                    className={`data_table__row_number ${!hasPermission ? "show" : ""}`}
                    style={{ width: "35px" }}
                  >
                    {limit === "all"
                      ? rowIndex + 1
                      : (currentPage - 1) * limit + rowIndex + 1}
                  </span>
                )}
                <PermissionWrapperV2 tableSlug={tableSlug} type={"delete"}>
                  <Checkbox
                    size="small"
                    sx={{ padding: "4px" }}
                    className="table_multi_checkbox"
                    style={selected ? { display: "block" } : {}}
                    checked={selected}
                    onChange={() => {
                      changeSetDelete(row);
                    }}
                  />
                </PermissionWrapperV2>
              </div>
            </CTableCell>

            {row.map(
              (field) =>
                field?.attributes?.field_permission?.view_permission && (
                  <CTableCell
                    key={field.id}
                    className="overflow-ellipsis"
                    style={{
                      minWidth: "220px",
                      color: "#262626",
                      fontSize: "13px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                      padding: "0 5px",
                      // height: "26px",
                      position: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === field?.id,
                        )?.isStiky ||
                        view?.attributes?.fixedColumns?.[field?.id]
                          ? "sticky"
                          : "relative"
                      }`,
                      left: view?.attributes?.fixedColumns?.[field?.id]
                        ? `${
                            calculateWidthFixedColumn(field.id) + firstRowWidth
                          }px`
                        : "0",
                      backgroundColor: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === field?.id,
                        )?.isStiky ||
                        view?.attributes?.fixedColumns?.[field?.id]
                          ? "#F6F6F6"
                          : field.attributes?.disabled ||
                              !field.attributes?.field_permission
                                ?.edit_permission
                            ? "#f8f8f8"
                            : "#fff"
                      }`,
                      zIndex: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === field?.id,
                        )?.isStiky ||
                        view?.attributes?.fixedColumns?.[field?.id]
                          ? "1"
                          : "0"
                      }`,
                      height: "24px",
                      overflow: "hidden",
                    }}
                  >
                    {isTableView ? (
                      <TableDataForm
                        relOptions={relOptions}
                        tableSlug={tableSlug}
                        fields={columns}
                        field={field}
                        getValues={getValues}
                        mainForm={viewForm}
                        row={field}
                        rowData={row}
                        index={rowIndex}
                        control={control}
                        setFormValue={setFormValue}
                        relationfields={relationFields}
                        data={data}
                        onRowClick={onRowClick}
                        width={width}
                        isTableView={isTableView}
                        relationView={relationView}
                        view={view}
                        newUi={true}
                        handleChange={handleChange}
                        updateObject={updateObject}
                      />
                    ) : (
                      <CellElementGenerator field={field} row={row} />
                    )}

                    {/* {index === 0 && ( */}
                    <div
                      onClick={() => onRowClick(row, rowIndex)}
                      className="newUIi_first_button"
                    >
                      <OpenInFullIcon style={{ width: 14 }} fill="#007aff" />
                    </div>
                    {/* )} */}
                    {(field.attributes?.disabled ||
                      !field.attributes?.field_permission?.edit_permission) && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          right: 4,
                          backgroundColor: "inherit",
                          padding: 4,
                          borderRadius: 6,
                          zIndex: 1,
                        }}
                      >
                        <img src="/table-icons/lock.svg" alt="lock" />
                      </div>
                    )}
                  </CTableCell>
                ),
            )}
            <td
              style={{
                width: 50,
                color: "#262626",
                fontSize: "13px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                padding: "0 5px",
                position: "sticky",
                right: "0",
                backgroundColor: "#fff",
                zIndex: 0,
                borderLeft: "1px solid #eee",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CTableCell
                  style={{
                    padding: 0,
                    borderRight: "none",
                    borderBottom: "none",
                  }}
                >
                  <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
                    <RectangleIconButton
                      color="error"
                      style={{ minWidth: 25, minHeight: 25, height: 25 }}
                      onClick={() => {
                        const rowId = row[0]?.guid;

                        if (!rowId) return;

                        onDeleteClick(rowId);
                      }}
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </PermissionWrapperV2>
                </CTableCell>
                {projectId === "b9029a9f-9431-4a44-b5e4-be148e4cc573" ||
                  projectId === "6fd296f6-9195-4ed3-af84-c1dcca929273" ||
                  (projectId === "c7168030-b876-4d01-8063-f7ad9f92e974" && (
                    <GeneratePdfFromTable
                      view={view}
                      row={row}
                      projectId={projectId}
                    />
                  ))}
              </div>
            </td>
          </CTableRow>
        </>
      ) : relationAction?.action_relations?.[0]?.value === "go_to_page" ||
        !relationAction?.action_relations ? (
        <CTableRow>
          <CTableCell
            align="center"
            className="data_table__number_cell"
            style={{
              padding: "0 4px",
              minWidth: width,
              position: "sticky",
              left: "0",
              backgroundColor: "#F6F6F6",
              zIndex: "1",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => {
                  onRowClick(row, rowIndex);
                }}
                className="first_button"
                style={{
                  minWidth: "max-content",
                }}
              >
                <OpenInFullIcon />
              </Button>

              <span
                className="data_table__row_number"
                style={{ width: "35px" }}
              >
                {limit === "all"
                  ? rowIndex + 1
                  : (currentPage - 1) * limit + rowIndex + 1}
                {/* {rowIndex + 1} */}
              </span>
            </div>
          </CTableCell>

          {columns.map(
            (column) =>
              column?.attributes?.field_permission?.view_permission && (
                <CTableCell
                  key={column.id}
                  className="overflow-ellipsis"
                  style={{
                    minWidth: "220px",
                    color: "#262626",
                    fontSize: "13px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                    padding: "0 5px",
                    position: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === column?.id,
                      )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                        ? "sticky"
                        : "relative"
                    }`,
                    left: view?.attributes?.fixedColumns?.[column?.id]
                      ? `${calculateWidthFixedColumn(column.id) + firstRowWidth}px`
                      : "0",
                    backgroundColor: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === column?.id,
                      )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                        ? "#F6F6F6"
                        : "#fff"
                    }`,
                    zIndex: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === column?.id,
                      )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                        ? "1"
                        : "0"
                    }`,
                  }}
                >
                  {isTableView ? (
                    <TableDataForm
                      relOptions={relOptions}
                      tableSlug={tableSlug}
                      fields={columns}
                      field={column}
                      getValues={getValues}
                      mainForm={viewForm}
                      row={row}
                      index={rowIndex}
                      control={control}
                      setFormValue={setFormValue}
                      relationfields={relationFields}
                      data={data}
                      onRowClick={onRowClick}
                      width={width}
                      isTableView={isTableView}
                      view={view}
                      watch={watch}
                    />
                  ) : (
                    <CellElementGenerator field={column} row={row} />
                  )}
                </CTableCell>
              ),
          )}
          <td
            style={{
              height: "34px",
              minWidth: "85px",
              color: "#262626",
              fontSize: "13px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              padding: "0 5px",
              position: `${"sticky"}`,
              right: "0",
              backgroundColor: "#fff",
              zIndex: 0,
              borderLeft: "1px solid #eee",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CTableCell
                style={{
                  padding: 0,
                  borderRight: "none",
                  borderBottom: "none",
                }}
              >
                <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
                  <RectangleIconButton
                    color="error"
                    onClick={() =>
                      row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex)
                    }
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </PermissionWrapperV2>
              </CTableCell>
              {/* <PermissionWrapperV2 tableSlug={tableSlug} type={"pdf_action"}>
                <GeneratePdfFromTable row={row} />
              </PermissionWrapperV2> */}
            </div>
          </td>
        </CTableRow>
      ) : (
        <CTableRow
          onClick={() => {
            onChecked(row?.guid);
          }}
        >
          <CTableCell
            align="center"
            className="data_table__number_cell"
            style={{
              padding: "0 4px",
              minWidth: width,
              position: "sticky",
              left: "0",
              backgroundColor: "#F6F6F6",
              zIndex: "1",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => {
                  onRowClick(row, rowIndex);
                }}
                className="first_button"
                style={{
                  minWidth: "max-content",
                }}
              >
                <OpenInFullIcon />
              </Button>

              <span
                className="data_table__row_number"
                style={{ width: "35px" }}
              >
                {limit === "all"
                  ? rowIndex + 1
                  : (currentPage - 1) * limit + rowIndex + 1}
                {/* {rowIndex + 1} */}
              </span>
            </div>
          </CTableCell>

          {columns.map((column) => (
            <CTableCell
              key={column.id}
              className="overflow-ellipsis"
              style={{
                minWidth: "220px",
                color: "#262626",
                fontSize: "13px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                padding: "0 5px",
                position: `${
                  tableSettings?.[pageName]?.find(
                    (item) => item?.id === column?.id,
                  )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                    ? "sticky"
                    : "relative"
                }`,
                left: view?.attributes?.fixedColumns?.[column?.id]
                  ? `${calculateWidthFixedColumn(column.id) + firstRowWidth}px`
                  : "0",
                backgroundColor: `${
                  tableSettings?.[pageName]?.find(
                    (item) => item?.id === column?.id,
                  )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                    ? "#F6F6F6"
                    : "#fff"
                }`,
                zIndex: `${
                  tableSettings?.[pageName]?.find(
                    (item) => item?.id === column?.id,
                  )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                    ? "1"
                    : "0"
                }`,
              }}
            >
              <TableDataForm
                relOptions={relOptions}
                isTableView={isTableView}
                tableSlug={tableSlug}
                fields={columns}
                field={column}
                getValues={getValues}
                mainForm={viewForm}
                row={row}
                index={rowIndex}
                control={control}
                setFormValue={setFormValue}
                relationfields={relationFields}
                data={data}
                onRowClick={onRowClick}
                width={width}
                view={view}
                watch={watch}
              />
            </CTableCell>
          ))}
          <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
            <RectangleIconButton
              color="error"
              onClick={() => {
                onDeleteClick(row, rowIndex);
                remove(rowIndex);
                navigate("/reloadRelations", {
                  state: {
                    redirectUrl: window.location.pathname,
                  },
                });
              }}
            >
              <Delete color="error" />
            </RectangleIconButton>
          </PermissionWrapperV2>
        </CTableRow>
      )}
    </>
  );
};
