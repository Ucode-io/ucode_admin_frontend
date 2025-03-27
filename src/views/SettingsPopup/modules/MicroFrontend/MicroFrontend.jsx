import {Delete} from "@mui/icons-material";
import {Box, Pagination} from "@mui/material";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "@/components/CTable";
import FiltersBlock from "@/components/FiltersBlock";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "@/components/SearchInput";
import TableCard from "@/components/TableCard";
import TableRowButton from "@/components/TableRowButton";
import {generateLangaugeText} from "@/utils/generateLanguageText";
import { useMicroFrontendProps } from "./useMicroFrontendProps";
import { StatusPipeline } from "../../components/StatusPipeline";
import { ContentTitle } from "../../components/ContentTitle";

export const MicroFrontend = () => {

  const {
    loader,
    list,
    setCurrentPage,
    i18n,
    microLan,
    navigateToEditForm,
    navigateToCreateForm,
    deleteTable,
    inputChangeHandler,
  } = useMicroFrontendProps();

  return (
    <Box position="relative">
      <ContentTitle>
        {generateLangaugeText(microLan, i18n?.language, "Microfrontend") ||
          "Microfrontend"}
      </ContentTitle>
      <FiltersBlock>
        <div className="p-1">
          <SearchInput onChange={inputChangeHandler} />
        </div>
      </FiltersBlock>

      <TableCard type={"withoutPadding"}>
        <CTable
          tableStyle={{
            borderRadius: "0px",
            border: "none",
          }}
          disablePagination
          removableHeight={140}
        >
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>
              {generateLangaugeText(microLan, i18n?.language, "Name") || "Name"}
            </CTableCell>
            <CTableCell>
              {generateLangaugeText(microLan, i18n?.language, "Status") ||
                "Status"}
            </CTableCell>
            <CTableCell>
              {generateLangaugeText(microLan, i18n?.language, "Description") ||
                "Description"}
            </CTableCell>
            <CTableCell>
              {generateLangaugeText(microLan, i18n?.language, "Link") || "Link"}
            </CTableCell>
            <CTableCell>
              {generateLangaugeText(
                microLan,
                i18n?.language,
                "Framework type"
              ) || "Framework type"}
            </CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={loader}
            columnsCount={4}
            dataLength={list?.functions?.length}
          >
            {list?.functions?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>
                  <StatusPipeline element={element} />
                </CTableCell>
                <CTableCell>{element?.description}</CTableCell>
                <CTableCell>{element?.path}</CTableCell>
                <CTableCell>{element?.framework_type}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteTable(element.id)}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tableSlug="app" type="write">
              <TableRowButton colSpan={7} onClick={navigateToCreateForm} />
              {/*<TableRowButton colSpan={5} onClick={navigateToGithub} title="Подключить из GitHub" />*/}
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
        color="primary"
      >
        <Box>
          <Pagination
            count={Math.ceil(list?.count / 10)}
            onChange={(e, val) => setCurrentPage(val - 1)}
          />
        </Box>
      </Box>
    </Box>
  );
};
