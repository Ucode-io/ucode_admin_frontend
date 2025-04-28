import cls from "./styles.module.scss";
import {useFunctionsProps} from "./useFunctionsProps";
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
import {StatusPipeline} from "../../components/StatusPipeline";
import {ContentTitle} from "../../components/ContentTitle";
import {Button} from "../../components/Button";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ChartDb from "../../../ChartDb";

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
    <>
      <Box position="relative">
        <ContentTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            <span>Environments</span>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={"16px"}>
              <SearchInput onChange={(e) => inputChangeHandler(e)} />
              <PermissionWrapperV2 tableSlug="app" type="write">
                <Button primary onClick={navigateToCreateForm}>
                  Add
                </Button>
              </PermissionWrapperV2>
            </Box>
          </Box>
        </ContentTitle>

        <TableCard type={"withoutPadding"}>
          <CTable disablePagination removableHeight={140}>
            <CTableHead>
              <CTableCell className={cls.tableHeadCell} width={10}>
                №
              </CTableCell>
              <CTableCell className={cls.tableHeadCell}>Name</CTableCell>
              <CTableCell className={cls.tableHeadCell}>Status</CTableCell>
              <CTableCell className={cls.tableHeadCell}>Path</CTableCell>
              <CTableCell className={cls.tableHeadCell}>Type</CTableCell>
              <CTableCell className={cls.tableHeadCell}>
                Replice count
              </CTableCell>
              <CTableCell className={cls.tableHeadCell} width={60}></CTableCell>
            </CTableHead>
            <CTableBody
              loader={loader}
              columnsCount={4}
              dataLength={list?.functions?.length}>
              {list?.functions?.map((element, index) => (
                <CTableRow
                  key={element.id}
                  onClick={() => navigateToEditForm(element.id)}>
                  <CTableCell className={cls.tBodyCell}>{index + 1}</CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    {element?.name}
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    <StatusPipeline element={element} />
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    {element?.path}
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    {element?.type === "FUNCTION" ? "OPENFAAS" : element?.type}
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    {element?.max_scale}
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    <RectangleIconButton
                      color="error"
                      onClick={() => deleteFunction(element.id)}>
                      <Delete color="error" />
                    </RectangleIconButton>
                  </CTableCell>
                </CTableRow>
              ))}
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
      </Box>
    </>
  );
};

{
  /* <Tabs>
  <TabList style={{borderBottom: "none", marginBottom: "10px"}}>
    <Tab style={{padding: "10px"}}>Environments</Tab>
    <Tab style={{padding: "10px"}}>ChartDB</Tab>
  </TabList>

  <TabPanel>
    <Box position="relative">
      <ContentTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Environments</span>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={"16px"}>
            <SearchInput onChange={(e) => inputChangeHandler(e)} />
            <PermissionWrapperV2 tableSlug="app" type="write">
              <Button primary onClick={navigateToCreateForm}>
                Add
              </Button>
            </PermissionWrapperV2>
          </Box>
        </Box>
      </ContentTitle>

      <TableCard type={"withoutPadding"}>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell className={cls.tableHeadCell} width={10}>
              №
            </CTableCell>
            <CTableCell className={cls.tableHeadCell}>Name</CTableCell>
            <CTableCell className={cls.tableHeadCell}>Status</CTableCell>
            <CTableCell className={cls.tableHeadCell}>Path</CTableCell>
            <CTableCell className={cls.tableHeadCell}>Type</CTableCell>
            <CTableCell className={cls.tableHeadCell} width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={loader}
            columnsCount={4}
            dataLength={list?.functions?.length}>
            {list?.functions?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}>
                <CTableCell className={cls.tBodyCell}>{index + 1}</CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {element?.name}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  <StatusPipeline element={element} />
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {element?.path}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {element?.type === "FUNCTION" ? "OPENFAAS" : element?.type}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteFunction(element.id)}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
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
    </Box>
  </TabPanel>
  <TabPanel>
    <Box sx={{height: "585px"}}>
      <ChartDb />
    </Box>
  </TabPanel>
</Tabs>; */
}
