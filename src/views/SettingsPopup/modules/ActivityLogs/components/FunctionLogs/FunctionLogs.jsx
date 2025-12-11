import Select from "react-select";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "@/components/CTable";
import { Box } from "@mui/material";
import EmptyDataComponent from "@/components/EmptyDataComponent";
import {ContentTitle} from "../../../../components/ContentTitle"
import TableCard from "@/components/TableCard";
import { useFunctionLogsProps } from "./useFunctionLogsProps";
import cls from "../../styles/styles.module.scss";
import { TableDataSkeleton } from "@/components/TableDataSkeleton";
import { format } from "date-fns";

const selectStyles = {
  control: (provided) => ({
    ...provided,
    background: "transparent",
    width: "100%",
    display: "flex",
    alignItems: "center",
    minWidth: "200px",
    outline: "none",
    minHeight: "24px",
    height: "24px",
    border: "none",
    cursor: "pointer",
  }),
  input: (provided) => ({
    ...provided,
    width: "100%",
  }),
  placeholder: (provided) => ({
    ...provided,
    display: "flex",
    fontSize: "12px",
    fontWeight: "500",
    color: "#475467",
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected ? "#007AFF" : provided.background,
    color: state.isSelected ? "#fff" : provided.color,
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    width: "20px",
    height: "20px",
    padding: "0",
  }),
};

export const FunctionLogs = () => {
  const {
    inputValue,
    setInputValue,
    functionValue,
    pageCount,
    currentPage,
    setCurrentPage,
    changeHandler,
    totalCount,
    functionOptions,
    functionLogs,
    onRowClick,
    isLoading,
    statusOptions,
    changeStatusHandler,
    selectedStatus,
    onMenuScrollToBottom,
  } = useFunctionLogsProps();

  return (
    <Box marginTop="20px" height="100%">
      <ContentTitle subtitle={`${totalCount} items`}>
        <Box height="28.8px">Function Logs</Box>
      </ContentTitle>
      <TableCard cardStyles={{ padding: "1px", height: "100%" }}>
        <CTable
          loader={false}
          removableHeight={false}
          count={pageCount}
          page={currentPage}
          setCurrentPage={setCurrentPage}
          dataCount={totalCount}
          wrapperStyle={{ height: "100%" }}
          disablePagination={!functionLogs?.length}
        >
          <CTableHead>
            <CTableCell className={cls.tableHeadCell} width={10}>
              №
            </CTableCell>
            <CTableCell className={cls.tableHeadCell} width={130}>
              <Select
                inputValue={inputValue}
                onInputChange={(newInputValue) => {
                  setInputValue(newInputValue);
                }}
                onMenuScrollToBottom={onMenuScrollToBottom}
                options={functionOptions}
                isClearable
                isSearchable
                onChange={(newValue, { action }) => {
                  if (action === "clear") {
                    setInputValue("");
                  }
                  changeHandler(newValue);
                }}
                value={functionValue?.label ? functionValue : null}
                menuShouldScrollIntoView
                styles={selectStyles}
                isOptionSelected={(option, value) =>
                  value.some((val) => val.guid === value)
                }
                placeholder={"Function"}
                blurInputOnSelect
              />
            </CTableCell>
            <CTableCell
              className={cls.tableHeadCell}
              id="status"
              style={{ position: "relative" }}
            >
              <span>Time</span>
            </CTableCell>
            <CTableCell
              className={cls.tableHeadCell}
              id="status"
              style={{ position: "relative" }}
            >
              <Select
                options={statusOptions}
                isClearable
                isSearchable
                onChange={(newValue, { action }) => {
                  if (action === "clear") {
                    changeStatusHandler(null);
                  } else {
                    changeStatusHandler(newValue);
                  }
                }}
                value={selectedStatus?.label ? selectedStatus : null}
                menuShouldScrollIntoView
                styles={selectStyles}
                isOptionSelected={(option, value) =>
                  value.some((val) => val.guid === value)
                }
                placeholder={"Status"}
                blurInputOnSelect
              />
            </CTableCell>
            <CTableCell
              className={cls.tableHeadCell}
              id="table_slug"
              style={{ position: "relative" }}
            >
              <Box>
                <span>Table slug</span>
              </Box>
            </CTableCell>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={5}
            dataLength={functionLogs?.length}
            style={{ height: "100%" }}
          >
            {isLoading ? (
              <TableDataSkeleton colLength={5} rowLength={10} height={33} />
            ) : (
              functionLogs?.map((element, index) => {
                return (
                  <CTableRow
                    className={cls.row}
                    key={element.id}
                    onClick={() => {
                      onRowClick(element);
                    }}
                    style={{
                      width: "80px",
                    }}
                  >
                    <CTableCell className={cls.tBodyCell}>
                      {(currentPage - 1) * 10 + index + 1}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      {element?.function_name}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      {format(
                        new Date(element?.completed_at),
                        "yyyy-MM-dd HH:mm:ss",
                      )}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      <Box display="flex" alignItems="baseline" gap="6px">
                        {/* <Tag
                        shape="subtle"
                        size="large"
                        style={{
                          backgroundColor: `${statusColors(element?.status)}`,
                        }}
                        className={cls.tag}
                      >
                      </Tag> */}
                        <span>{element?.status?.toLowerCase()}</span>
                        <span style={{ fontSize: "10px" }}>
                          {element?.duration}ms
                        </span>
                      </Box>
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      {element?.table_slug}
                    </CTableCell>
                  </CTableRow>
                );
              })
            )}
            <EmptyDataComponent
              columnsCount={4}
              isVisible={!functionLogs?.length}
            />
          </CTableBody>
        </CTable>
      </TableCard>
    </Box>
  );
};