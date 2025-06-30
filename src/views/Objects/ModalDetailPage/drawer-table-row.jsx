import {Delete} from "@mui/icons-material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import {Button, Checkbox} from "@mui/material";
import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import {CTableCell, CTableRow} from "@/components/CTable";
import CellElementGenerator from "@/components/ElementGenerators/CellElementGenerator";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import TableDataForm from "./tabledata-form";

const TableRow = ({
  relOptions,
  tableView,
  row,
  key,
  width,
  rowIndex,
  control,
  isTableView,
  onRowClick,
  calculateWidthFixedColumn,
  onDeleteClick,
  mainForm,
  getValues,
  currentPage,
  view,
  columns,
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  tableSettings,
  pageName,
  watch,
  setFormValue,
  tableSlug,
  remove,
  limit = 10,
  relationAction,
  onChecked,
  relationFields,
  data,
  style,
  firstRowWidth = 80,
  selectedTab,
}) => {
  const navigate = useNavigate();

  const changeSetDelete = (row) => {
    if (selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)) {
      setSelectedObjectsForDelete(
        selectedObjectsForDelete?.filter((item) => item?.guid !== row?.guid)
      );
    } else {
      setSelectedObjectsForDelete([...selectedObjectsForDelete, row]);
    }
  };
  const parentRef = useRef(null);
  const selected = Boolean(
    selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)
  );

  return (
    <>
      {!relationAction ? (
        <>
          <CTableRow key={key} style={style} className="new-ui" ref={parentRef}>
            <CTableCell
              align="center"
              className="data_table__number_cell"
              style={{
                padding: "0 4px",
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
                {!selected && (
                  <span
                    className="data_table__row_number"
                    style={{ width: "35px" }}
                  >
                    {limit === "all"
                      ? rowIndex + 1
                      : (currentPage - 1) * limit + rowIndex + 1}
                  </span>
                )}

                <PermissionWrapperV2 tableSlug={tableSlug} type={"delete_all"}>
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

            {columns.map(
              (virtualColumn, index) =>
                virtualColumn?.attributes?.field_permission
                  ?.view_permission && (
                  <CTableCell
                    key={virtualColumn.id}
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
                          (item) => item?.id === virtualColumn?.id
                        )?.isStiky ||
                        view?.attributes?.fixedColumns?.[virtualColumn?.id]
                          ? "sticky"
                          : "relative"
                      }`,
                      left: view?.attributes?.fixedColumns?.[virtualColumn?.id]
                        ? `${
                            calculateWidthFixedColumn(virtualColumn.id) +
                            firstRowWidth
                          }px`
                        : "0",
                      backgroundColor: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === virtualColumn?.id
                        )?.isStiky ||
                        view?.attributes?.fixedColumns?.[virtualColumn?.id]
                          ? "#F6F6F6"
                          : virtualColumn.attributes?.disabled ||
                              !virtualColumn.attributes?.field_permission
                                ?.edit_permission
                            ? "#f8f8f8"
                            : "#fff"
                      }`,
                      zIndex: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === virtualColumn?.id
                        )?.isStiky ||
                        view?.attributes?.fixedColumns?.[virtualColumn?.id]
                          ? "1"
                          : "0"
                      }`,
                    }}
                  >
                    {isTableView ? (
                      <TableDataForm
                        relOptions={relOptions}
                        tableView={tableView}
                        tableSlug={tableSlug}
                        fields={columns}
                        field={virtualColumn}
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
                        isTableView={isTableView}
                        view={view}
                        watch={watch}
                        newUi={true}
                        selectedTab={selectedTab}
                      />
                    ) : (
                      <CellElementGenerator field={virtualColumn} row={row} />
                    )}

                    {index === 0 && (
                      <div
                        onClick={() => onRowClick(row, rowIndex)}
                        className="first_button"
                      >
                        <OpenInFullIcon style={{ width: 14 }} fill="#007aff" />
                      </div>
                    )}
                    {(virtualColumn.attributes?.disabled ||
                      !virtualColumn.attributes?.field_permission
                        ?.edit_permission) && (
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
                )
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
                    <RectangleIconButton
                      color="error"
                      style={{ minWidth: 25, minHeight: 25, height: 25 }}
                      onClick={() =>
                        row.guid
                          ? onDeleteClick(row, rowIndex)
                          : remove(rowIndex)
                      }
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </PermissionWrapperV2>
                </CTableCell>
                {/*<PermissionWrapperV2 tableSlug={tableSlug} type={"pdf_action"}>*/}
                {/*  <GeneratePdfFromTable view={view} row={row}/>*/}
                {/*</PermissionWrapperV2>*/}
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
            (virtualColumn) =>
              virtualColumn?.attributes?.field_permission?.view_permission && (
                <CTableCell
                  key={virtualColumn.id}
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
                        (item) => item?.id === virtualColumn?.id
                      )?.isStiky ||
                      view?.attributes?.fixedColumns?.[virtualColumn?.id]
                        ? "sticky"
                        : "relative"
                    }`,
                    left: view?.attributes?.fixedColumns?.[virtualColumn?.id]
                      ? `${calculateWidthFixedColumn(virtualColumn.id) + firstRowWidth}px`
                      : "0",
                    backgroundColor: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === virtualColumn?.id
                      )?.isStiky ||
                      view?.attributes?.fixedColumns?.[virtualColumn?.id]
                        ? "#F6F6F6"
                        : "#fff"
                    }`,
                    zIndex: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === virtualColumn?.id
                      )?.isStiky ||
                      view?.attributes?.fixedColumns?.[virtualColumn?.id]
                        ? "1"
                        : "0"
                    }`,
                  }}
                >
                  {isTableView ? (
                    <TableDataForm
                      relOptions={relOptions}
                      tableView={tableView}
                      tableSlug={tableSlug}
                      fields={columns}
                      field={virtualColumn}
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
                      isTableView={isTableView}
                      view={view}
                      watch={watch}
                      selectedTab={selectedTab}
                    />
                  ) : (
                    <CellElementGenerator field={virtualColumn} row={row} />
                  )}
                </CTableCell>
              )
          )}
          <td
            style={{
              height: "30px",
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

          {columns.map((column, index) => (
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
                    (item) => item?.id === column?.id
                  )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                    ? "sticky"
                    : "relative"
                }`,
                left: view?.attributes?.fixedColumns?.[column?.id]
                  ? `${calculateWidthFixedColumn(column.id) + firstRowWidth}px`
                  : "0",
                backgroundColor: `${
                  tableSettings?.[pageName]?.find(
                    (item) => item?.id === column?.id
                  )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                    ? "#F6F6F6"
                    : "#fff"
                }`,
                zIndex: `${
                  tableSettings?.[pageName]?.find(
                    (item) => item?.id === column?.id
                  )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                    ? "1"
                    : "0"
                }`,
              }}
            >
              <TableDataForm
                relOptions={relOptions}
                isTableView={isTableView}
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
                view={view}
                watch={watch}
                selectedTab={selectedTab}
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
