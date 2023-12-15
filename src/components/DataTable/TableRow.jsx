import { Delete } from "@mui/icons-material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Button, Checkbox } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import { CTableCell, CTableRow } from "../CTable";
import CellElementGenerator from "../ElementGenerators/CellElementGenerator";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import GeneratePdfFromTable from "./GeneratePdfFromTable";
import TableRowForm from "./TableRowForm";
import TableDataForm from "../ElementGenerators/TableDataForm";

const TableRow = ({
  relOptions,
  tableView,
  row,
  key,
  width,
  rowIndex,
  control,
  isTableView,
  relatedTableSlug,
  onRowClick,
  calculateWidthFixedColumn,
  onDeleteClick,
  mainForm,
  checkboxValue,
  getValues,
  onCheckboxChange,
  currentPage,
  view,
  columns,
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  tableHeight,
  tableSettings,
  pageName,
  calculateWidth,
  watch,
  setFormValue,
  tableSlug,
  isChecked = () => {},
  formVisible,
  remove,
  limit = 10,
  relationAction,
  onChecked,
  relationFields,
  data,
  style,
}) => {
  const navigate = useNavigate();
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: columns.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30,
    overscan: 10,
  });

  const changeSetDelete = (row) => {
    if (selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)) {
      setSelectedObjectsForDelete(selectedObjectsForDelete?.filter((item) => item?.guid !== row?.guid));
    } else {
      setSelectedObjectsForDelete([...selectedObjectsForDelete, row]);
    }
  };

  if (formVisible)
    return (
      <TableRowForm
        onDeleteClick={onDeleteClick}
        isTableView={isTableView}
        remove={remove}
        watch={watch}
        onCheckboxChange={onCheckboxChange}
        checkboxValue={checkboxValue}
        row={row}
        key={key}
        formVisible={formVisible}
        currentPage={currentPage}
        limit={limit}
        control={control}
        setFormValue={setFormValue}
        rowIndex={rowIndex}
        columns={columns}
        tableHeight={tableHeight}
        tableSettings={tableSettings}
        pageName={pageName}
        calculateWidth={calculateWidth}
        tableSlug={tableSlug}
        relationFields={relationFields}
        data={data}
      />
    );

  return (
    <>
      {!relationAction ? (
        <>
          <CTableRow style={style} parentRef={parentRef}>
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

                <span className="data_table__row_number" style={{ width: "35px" }}>
                  {limit === "all" ? rowIndex + 1 : (currentPage - 1) * limit + rowIndex + 1}
                  {/* {rowIndex + 1} */}
                </span>

                <Checkbox
                  className="table_multi_checkbox"
                  style={{
                    display: selectedObjectsForDelete?.find((item) => item?.guid === row?.guid) && "block",
                  }}
                  checked={selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)}
                  onChange={() => {
                    changeSetDelete(row);
                  }}
                />
              </div>
            </CTableCell>

            {virtualizer.getVirtualItems().map((virtualRow, virtualIndex) => {
              const virtualRowObject = columns?.[virtualRow.index];
              return (
                virtualRowObject?.attributes?.field_permission?.view_permission && (
                  <CTableCell
                    key={virtualRowObject.guid}
                    className={`overflow-ellipsis ${tableHeight}`}
                    style={{
                      minWidth: "220px",
                      color: "#262626",
                      fontSize: "13px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                      padding: "0 5px",
                      position: `${
                        tableSettings?.[pageName]?.find((item) => item?.id === virtualRowObject?.id)?.isStiky || view?.attributes?.fixedColumns?.[virtualRowObject?.id]
                          ? "sticky"
                          : "relative"
                      }`,
                      left: view?.attributes?.fixedColumns?.[virtualRowObject?.id] ? `${calculateWidthFixedColumn(virtualRowObject.id) + 80}px` : "0",
                      backgroundColor: `${
                        tableSettings?.[pageName]?.find((item) => item?.id === virtualRowObject?.id)?.isStiky || view?.attributes?.fixedColumns?.[virtualRowObject?.id]
                          ? "#F6F6F6"
                          : "#fff"
                      }`,
                      zIndex: `${
                        tableSettings?.[pageName]?.find((item) => item?.id === virtualRowObject?.id)?.isStiky || view?.attributes?.fixedColumns?.[virtualRowObject?.id] ? "1" : "0"
                      }`,
                    }}
                  >
                    {isTableView ? (
                      <TableDataForm
                        relOptions={relOptions}
                        tableView={tableView}
                        tableSlug={tableSlug}
                        fields={columns}
                        field={virtualRowObject}
                        getValues={getValues}
                        mainForm={mainForm}
                        row={row}
                        index={rowIndex}
                        control={control}
                        setFormValue={setFormValue}
                        relationfields={relationFields}
                        data={data}
                        onRowClick={onRowClick}
                        width={width}
                      />
                    ) : (
                      <CellElementGenerator field={virtualRowObject} row={row} />
                    )}
                  </CTableCell>
                )
              );
            })}
            <td style={{ height: "30px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  padding: "3px",
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
                    <RectangleIconButton color="error" onClick={() => (row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex))}>
                      <Delete color="error" />
                    </RectangleIconButton>
                  </PermissionWrapperV2>
                </CTableCell>
                <GeneratePdfFromTable row={row} />
              </div>
            </td>

            <td>
              <div style={{ display: "flex", gap: "5px", padding: "3px" }}></div>
            </td>
          </CTableRow>
        </>
      ) : relationAction?.action_relations?.[0]?.value === "go_to_page" || !relationAction?.action_relations ? (
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

              <span className="data_table__row_number" style={{ width: "35px" }}>
                {limit === "all" ? rowIndex + 1 : (currentPage - 1) * limit + rowIndex + 1}
              </span>
            </div>
          </CTableCell>

          {columns.map((column, index) => (
            <CTableCell
              key={column.id}
              className={`overflow-ellipsis ${tableHeight}`}
              style={{
                minWidth: "220px",
                color: "#262626",
                fontSize: "13px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                padding: "0 5px",
                position: `${tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "sticky" : "relative"}`,
                left: view?.attributes?.fixedColumns?.[column?.id] ? `${calculateWidthFixedColumn(column.id) + 80}px` : "0",
                backgroundColor: `${
                  tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "#F6F6F6" : "#fff"
                }`,
                zIndex: `${tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "1" : "0"}`,
              }}
            >
              <TableDataForm
                relOptions={relOptions}
                tableView={tableView}
                tableSlug={tableSlug}
                fields={columns}
                field={column}
                getValues={getValues}
                mainForm={mainForm}
                row={row}
                index={rowIndex}
                control={control}
                setFormValue={setFormValue}
                relationfields={relationFields}
                data={data}
                onRowClick={onRowClick}
                width={width}
              />
            </CTableCell>
          ))}
          <td>
            <div
              style={{
                display: "flex",
                gap: "5px",
                padding: "3px",
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
                  <RectangleIconButton color="error" onClick={() => (row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex))}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </PermissionWrapperV2>
              </CTableCell>
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

              <span className="data_table__row_number" style={{ width: "35px" }}>
                {limit === "all" ? rowIndex + 1 : (currentPage - 1) * limit + rowIndex + 1}
              </span>
            </div>
          </CTableCell>

          {columns.map((column, index) => (
            <CTableCell
              key={column.id}
              className={`overflow-ellipsis ${tableHeight}`}
              style={{
                minWidth: "220px",
                color: "#262626",
                fontSize: "13px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                padding: "0 5px",
                position: `${tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "sticky" : "relative"}`,
                left: view?.attributes?.fixedColumns?.[column?.id] ? `${calculateWidthFixedColumn(column.id) + 80}px` : "0",
                backgroundColor: `${
                  tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "#F6F6F6" : "#fff"
                }`,
                zIndex: `${tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "1" : "0"}`,
              }}
            >
              <TableDataForm
                relOptions={relOptions}
                tableView={tableView}
                tableSlug={tableSlug}
                fields={columns}
                field={column}
                getValues={getValues}
                mainForm={mainForm}
                row={row}
                index={rowIndex}
                control={control}
                setFormValue={setFormValue}
                relationfields={relationFields}
                data={data}
                onRowClick={onRowClick}
                width={width}
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

export default TableRow;
