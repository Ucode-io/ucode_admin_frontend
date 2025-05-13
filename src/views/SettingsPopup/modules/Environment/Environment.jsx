import { Box } from "@mui/material";
import { ContentTitle } from "../../components/ContentTitle";
import { useEnvironmentProps } from "./useEnvironmentProps";
import { generateLangaugeText } from "../../../../utils/generateLanguageText";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../components/CTable";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
// import { Delete } from "@mui/icons-material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import TableRowButton from "../../../../components/TableRowButton";
import cls from "./styles.module.scss";
import { Button } from "../../components/Button";

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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>
            {generateLangaugeText(lang, i18n?.language, "Environments") ||
              "Environments"}
          </span>
          <Button primary onClick={navigateToCreateForm}>
            {generateLangaugeText(lang, i18n?.language, "Add") || "Add"}
          </Button>
        </Box>
      </ContentTitle>

      <CTable disablePagination removableHeight={0}>
        <CTableHead>
          <CTableCell className={cls.tableHeadCell} width={10}>
            №
          </CTableCell>
          <CTableCell className={cls.tableHeadCell}>
            {generateLangaugeText(lang, i18n?.language, "Name") || "Name"}
          </CTableCell>
          <CTableCell className={cls.tableHeadCell}>
            {" "}
            {generateLangaugeText(lang, i18n?.language, "Description") ||
              "Description"}{" "}
          </CTableCell>
          <CTableCell width={60}></CTableCell>
        </CTableHead>
        <CTableBody
          loader={environmentLoading}
          columnsCount={4}
          dataLength={environments?.environments?.length}
        >
          {environments?.environments?.map((element, index) => (
            <CTableRow
              key={element.id}
              onClick={() => navigateToEditForm(element.id)}
            >
              <CTableCell className={cls.tBodyCell}>{index + 1}</CTableCell>
              <CTableCell className={cls.tBodyCell}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "8px",
                  }}
                >
                  <span
                    style={{
                      background: element.display_color,
                      width: "10px",
                      height: "10px",
                      display: "block",
                      borderRadius: "50%",
                    }}
                  ></span>
                  {element?.name}
                </div>
              </CTableCell>
              <CTableCell className={cls.tBodyCell}>
                {element?.description}
              </CTableCell>
              <CTableCell className={cls.tBodyCell}>
                <button
                  className={cls.btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEnvironment(element.id);
                  }}
                >
                  <span>
                    <DeleteOutlinedIcon color="inherit" />
                  </span>
                </button>
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </Box>
  );
};
