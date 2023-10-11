import { Delete } from "@mui/icons-material";
import { Button, Checkbox } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useNavigate } from "react-router-dom";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import { CTableCell, CTableRow } from "../CTable";
import CellElementGenerator from "../ElementGenerators/CellElementGenerator";
import TableDataForm from "../ElementGenerators/TableDataForm";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import GeneratePdfFromTable from "./GeneratePdfFromTable";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import TableRowForm from "./TableRowForm";

const TableRow = ({
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
  // const [hovered, setHovered] = useState(false);

  const changeSetDelete = (row) => {
    if (selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)) {
      setSelectedObjectsForDelete(selectedObjectsForDelete?.filter((item) => item?.guid !== row?.guid));
    } else {
      setSelectedObjectsForDelete([...selectedObjectsForDelete, row]);
    }
  };

  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: columns.length,
  });

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
        <CTableRow
          // onMouseEnter={() => setHovered(true)}
          // onMouseLeave={() => setHovered(false)}
          style={style}
          ref={parentRef}
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
                {/* {rowIndex + 1} */}
              </span>

              {/* hovered ? (
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
            ) : (
              <span className="data_table__row_number" style={{ width: "35px" }}>
                {limit === "all" ? rowIndex + 1 : (currentPage - 1) * limit + rowIndex + 1}
              </span>
            ) */}

              <Checkbox
                className="table_multi_checkbox"
                style={{
                  display: selectedObjectsForDelete.find((item) => item?.guid === row?.guid) && "block",
                }}
                checked={selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)}
                onChange={() => {
                  changeSetDelete(row);
                }}
              />

              {/* {hovered || selectedObjectsForDelete.find((item) => item?.guid === row?.guid) ? (
                <Checkbox
                  checked={selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)}
                  onChange={() => {
                    changeSetDelete(row);
                  }}
                />
              ) : (
                ""
              )} */}
            </div>

            {/* {onCheckboxChange && (
              <div className={`data_table__row_checkbox ${isChecked(row) ? "checked" : ""}`}>
                <Checkbox checked={isChecked(row)} onChange={(_, val) => onCheckboxChange(val, row)} onClick={(e) => e.stopPropagation()} />
              </div>
            )} */}
          </CTableCell>

          {virtualizer.getVirtualItems().map(
            (virtualColumn) => (
              columns[virtualColumn.index]?.attributes?.field_permission?.view_permission && (
                <CTableCell
                  key={columns[virtualColumn.index].id}
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
                      tableSettings?.[pageName]?.find((item) => item?.id === columns[virtualColumn.index]?.id)?.isStiky ||
                      view?.attributes?.fixedColumns?.[columns[virtualColumn.index]?.id]
                        ? "sticky"
                        : "relative"
                    }`,
                    // left: `${
                    //   tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                    //     ? `${calculateWidth(column?.id, index)}px`
                    //     : "0"
                    // }`,
                    left: view?.attributes?.fixedColumns?.[columns[virtualColumn.index]?.id] ? `${calculateWidthFixedColumn(columns[virtualColumn.index].id) + 80}px` : "0",
                    backgroundColor: `${
                      tableSettings?.[pageName]?.find((item) => item?.id === columns[virtualColumn.index]?.id)?.isStiky ||
                      view?.attributes?.fixedColumns?.[columns[virtualColumn.index]?.id]
                        ? "#F6F6F6"
                        : "#fff"
                    }`,
                    zIndex: `${
                      tableSettings?.[pageName]?.find((item) => item?.id === columns[virtualColumn.index]?.id)?.isStiky ||
                      view?.attributes?.fixedColumns?.[columns[virtualColumn.index]?.id]
                        ? "1"
                        : "0"
                    }`,
                  }}
                >
                  {isTableView ? (
                    <TableDataForm
                      tableSlug={tableSlug}
                      fields={columns}
                      field={columns[virtualColumn.index]}
                      getValues={getValues}
                      mainForm={mainForm}
                      row={row}
                      index={rowIndex}
                      control={control}
                      setFormValue={setFormValue}
                      relationfields={relationFields}
                      data={data}
                      onRowClick={onRowClick}
                    />
                  ) : (
                    <CellElementGenerator field={columns[virtualColumn.index]} row={row} />
                  )}
                </CTableCell>
              )
            )
          )}

          {/* {columns.map(
            (column, index) =>
              column?.attributes?.field_permission?.view_permission && (
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
                    position: `${
                      tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "sticky" : "relative"
                    }`,
                    // left: `${
                    //   tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                    //     ? `${calculateWidth(column?.id, index)}px`
                    //     : "0"
                    // }`,
                    left: view?.attributes?.fixedColumns?.[column?.id] ? `${calculateWidthFixedColumn(column.id) + 80}px` : "0",
                    backgroundColor: `${
                      tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "#F6F6F6" : "#fff"
                    }`,
                    zIndex: `${tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "1" : "0"}`,
                  }}
                >
                  {isTableView ? (
                    <TableDataForm
                      tableSlug={tableSlug}
                      fields={columns}
                      field={column}
                      getValues={getValues}
                      mainForm={mainForm}
                      row={row}
                      isWrap={view?.attributes?.textWrap}
                      index={rowIndex}
                      control={control}
                      setFormValue={setFormValue}
                      relationfields={relationFields}
                      data={data}
                      onRowClick={onRowClick}
                    />
                  ) : (
                    <CellElementGenerator field={column} row={row} />
                  )}
                </CTableCell>
              )
          )} */}
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
              <CTableCell style={{ padding: 0, borderRight: "none", borderBottom: "none" }}>
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
      ) : relationAction?.action_relations?.[0]?.value === "go_to_page" || !relationAction?.action_relations ? (
        <CTableRow
          onClick={() => {
            onRowClick(row, rowIndex);
          }}
        >
          <CTableCell align="center" className="data_table__number_cell">
            <span className="data_table__row_number">{(currentPage - 1) * limit + rowIndex + 1}</span>
            {onCheckboxChange && (
              <div className={`data_table__row_checkbox ${isChecked(row) ? "checked" : ""}`}>
                <Checkbox checked={isChecked(row)} onChange={(_, val) => onCheckboxChange(val, row)} onClick={(e) => e.stopPropagation()} />
              </div>
            )}
          </CTableCell>

          {columns.map((column, index) => (
            <CTableCell
              key={column.id}
              className={`overflow-ellipsis ${tableHeight}`}
              style={{
                minWidth: "max-content",
                padding: "0 4px",
                position: tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky ? "sticky" : "relative",
                left: tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky ? `${calculateWidth(column?.id, index)}px` : "0",
                zIndex: tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky ? "1" : "",
              }}
            >
              <CellElementGenerator field={column} row={row} />
            </CTableCell>
          ))}
          <CTableCell
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
              <RectangleIconButton
                color="error"
                onClick={() => {
                  onDeleteClick(row, rowIndex);
                  // remove(rowIndex);
                  // navigate("/reloadRelations", {
                  //   state: {
                  //     redirectUrl: window.location.pathname,
                  //   },
                  // });
                }}
              >
                <Delete color="error" />
              </RectangleIconButton>
            </PermissionWrapperV2>
          </CTableCell>
        </CTableRow>
      ) : (
        <CTableRow
          onClick={() => {
            onChecked(row?.guid);
          }}
        >
          <CTableCell align="center" className="data_table__number_cell">
            <span className="data_table__row_number">{(currentPage - 1) * limit + rowIndex + 1}</span>
            {onCheckboxChange && (
              <div className={`data_table__row_checkbox ${isChecked(row) ? "checked" : ""}`}>
                <Checkbox checked={isChecked(row)} onChange={(_, val) => onCheckboxChange(val, row)} onClick={(e) => e.stopPropagation()} />
              </div>
            )}
          </CTableCell>

          {columns.map((column, index) => (
            <CTableCell
              key={column.id}
              className={`overflow-ellipsis ${tableHeight}`}
              style={{
                minWidth: "max-content",
                padding: "0 4px",
                position: tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky ? "sticky" : "relative",
                left: tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky ? `${calculateWidth(column?.id, index)}px` : "0",
                backgroundColor: "#fff",
                zIndex: tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky ? "1" : "",
              }}
            >
              <CellElementGenerator field={column} row={row} />
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
