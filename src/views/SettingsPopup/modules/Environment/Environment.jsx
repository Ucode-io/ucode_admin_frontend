import { Box } from "@mui/material";
import { ContentTitle } from "../../components/ContentTitle";
import { useEnvironmentProps } from "./useEnvironmentProps";
import { generateLangaugeText } from "../../../../utils/generateLanguageText";
import FiltersBlock from "../../../../components/FiltersBlock";
import TableCard from "../../../../components/TableCard";
import { CTable, CTableBody, CTableCell, CTableHead, CTableRow } from "../../../../components/CTable";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import TableRowButton from "../../../../components/TableRowButton";

export const Environment = () => {

  const { 
    lang,
    i18n,
    environmentLoading,
    environments,
    navigateToEditForm,
    deleteEnvironment,
    navigateToCreateForm,
  } = useEnvironmentProps();

  return (
    <Box>
      <ContentTitle>
        {
          generateLangaugeText(
            lang,
            i18n?.language,
            "Environments"
          ) || "Environments"
        }
      </ContentTitle>

      <CTable disablePagination removableHeight={0}>
        <CTableHead>
          <CTableCell width={10}>№</CTableCell>
          <CTableCell>
            {generateLangaugeText(lang, i18n?.language, "Name") ||
              "Name"}
          </CTableCell>
          <CTableCell>
            {" "}
            {generateLangaugeText(
              lang,
              i18n?.language,
              "Description"
            ) || "Description"}{" "}
          </CTableCell>
          <CTableCell width={60}></CTableCell>
        </CTableHead>
        <CTableBody
          loader={environmentLoading}
          columnsCount={4}
          dataLength={environments?.environments?.length}>
          {environments?.environments?.map((element, index) => (
            <CTableRow
              key={element.id}
              onClick={() => navigateToEditForm(element.id)}>
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "8px",
                  }}>
                  <span
                    style={{
                      background: element.display_color,
                      width: "10px",
                      height: "10px",
                      display: "block",
                      borderRadius: "50%",
                    }}></span>
                  {element?.name}
                </div>
              </CTableCell>
              <CTableCell>{element?.description}</CTableCell>
              <CTableCell>
                <RectangleIconButton
                  color="error"
                  onClick={() => {
                    deleteEnvironment(element.id);
                  }}>
                  <Delete color="error" />
                </RectangleIconButton>
              </CTableCell>
            </CTableRow>
          ))}
          <PermissionWrapperV2 tabelSlug="app" type="write">
            <TableRowButton
              title={
                generateLangaugeText(lang, i18n?.language, "Add") ||
                "Add"
              }
              colSpan={4}
              onClick={navigateToCreateForm}
            />
          </PermissionWrapperV2>
        </CTableBody>
      </CTable>
    </Box>
  );
}
