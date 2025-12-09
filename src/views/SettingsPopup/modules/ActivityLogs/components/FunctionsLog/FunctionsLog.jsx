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
import { useFunctionsLogProps } from "./useFunctionsLogProps";
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


export const FunctionsLog = () => {

  const {
    inputValue,
    setInputValue,
    functionValue,
    pageCount,
    setPageCount,
    currentPage,
    setCurrentPage,
    changeHandler,
    count,
    functionOptions,
    data,
    onRowClick,
    isLoading
  } = useFunctionsLogProps();

  return  <Box marginTop="20px" height="100%">
    <ContentTitle subtitle={`${count} items`}>
      <Box height="28.8px">Functions Log</Box>
    </ContentTitle>
    <TableCard cardStyles={{ padding: "1px", height: "100%" }}>
      <CTable
        loader={false}
        removableHeight={false}
        count={pageCount}
        page={currentPage}
        setCurrentPage={setCurrentPage}
        dataCount={count}
        wrapperStyle={{height: "100%" }}
      >
        <CTableHead>
          <CTableCell className={cls.tableHeadCell} width={10}>
            №
          </CTableCell>
          <CTableCell className={cls.tableHeadCell} width={130}>
            {/* Action */}
            <Select
              inputValue={inputValue}
              onInputChange={(newInputValue) => {
                setInputValue(newInputValue);
              }}
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
              placeholder={"Functions"}
              blurInputOnSelect
            />
          </CTableCell>
          <CTableCell
            className={cls.tableHeadCell}
            id="collection"
            style={{ position: "relative" }}
          >
            <Box>
              <span>Collection</span>
            </Box>
          </CTableCell>
          <CTableCell className={cls.tableHeadCell}>Action On</CTableCell>
        </CTableHead>
        <CTableBody
          loader={false}
          columnsCount={5}
          dataLength={10}
          style={{height: "100%" }}
        >
          {isLoading ? (
            <TableDataSkeleton colLength={5} rowLength={10} height={33} />
          ) : (
            data?.map((element, index) => {
              return (
                <CTableRow
                  className={cls.row}
                  key={element.id}
                  onClick={() => {
                    onRowClick(element?.id);
                  }}
                  style={{
                    width: "80px",
                  }}
                >
                  <CTableCell className={cls.tBodyCell}>
                    {(currentPage - 1) * 10 + index + 1}
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    Cell
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    {element?.table_slug}
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    {format(new Date(element?.date), "yyyy-MM-dd HH:mm:ss")}
                  </CTableCell>
                </CTableRow>
              );
            })
          )}
          <EmptyDataComponent
            columnsCount={5}
            isVisible={false}
          />
        </CTableBody>
      </CTable>
    </TableCard>
  </Box>
}