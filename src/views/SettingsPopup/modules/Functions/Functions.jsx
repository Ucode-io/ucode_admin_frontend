import { useFunctionsProps } from "./useFunctionsProps";
import {Delete} from "@mui/icons-material";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "@/components/CTable";
import FiltersBlock from "@/components/FiltersBlock";
import HeaderSettings from "@/components/HeaderSettings";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "@/components/SearchInput";
import TableCard from "@/components/TableCard";
import TableRowButton from "@/components/TableRowButton";
import {Box, Pagination} from "@mui/material";
import { StatusPipeline } from "../../components/StatusPipeline";
import { ContentTitle } from "../../components/ContentTitle";

export const Functions = () => {

  const {
    loader,
    list,
    setCurrentPage,
    navigateToEditForm,
    navigateToCreateForm,
    deleteFunction,
    inputChangeHandler,
  } = useFunctionsProps();

  return (
    <div>
      <ContentTitle>
        Faas функции
      </ContentTitle>

      <FiltersBlock>
        <SearchInput onChange={(e) => inputChangeHandler(e)} />
      </FiltersBlock>

      <TableCard type={"withoutPadding"}>
        <CTable
          tableStyle={{
            borderRadius: "0px",
            border: "none",
          }}
          disablePagination
          removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell>Status</CTableCell>
            <CTableCell>Path</CTableCell>
            <CTableCell>Type</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={loader}
            columnsCount={4}
            dataLength={list?.functions?.length}>
            {list?.functions?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}>
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>
                  <StatusPipeline element={element} />
                </CTableCell>
                <CTableCell>{element?.path}</CTableCell>
                <CTableCell>
                  {element?.type === "FUNCTION" ? "OPENFAAS" : element?.type}
                </CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteFunction(element.id)}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tableSlug="app" type="write">
              <TableRowButton colSpan={7} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
      <Box
        sx={{
          height: "50px",
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          borderTop: "1px solid #eee",
          paddingRight: "30px",
        }}
        color="primary">
        <Box>
          <Pagination
            count={Math.ceil(list?.count / 10)}
            onChange={(e, val) => setCurrentPage(val - 1)}
          />
        </Box>
      </Box>
    </div>
  );
}
