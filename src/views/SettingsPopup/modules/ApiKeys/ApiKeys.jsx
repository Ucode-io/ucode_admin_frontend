import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { useApiKeysProps } from "./useApiKeysProps";
import { Delete, Edit } from "@mui/icons-material";
import { DownloadIcon } from "@chakra-ui/icons";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "@/components/CTable";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import { numberWithSpaces } from "@/utils/formatNumbers";
import { ContentTitle } from "../../components/ContentTitle";
import { Button } from "../../components/Button";

export const ApiKeys = () => {
  const {
    downloadUrl,
    URLFILE,
    apiKeys,
    navigateToForm,
    navigateToEditForm,
    deleteTable,
    navigateToCreateForm,
    list,
  } = useApiKeysProps();

  return (
    <div>
      <ContentTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Api keys</span>
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Box onClick={() => downloadUrl(URLFILE)}>
              <a
                target="_blank"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "14px",
                }}
                href="apikeys.zip"
                download
              >
                <DownloadIcon style={{ background: "#007af" }} />
                Download api documentation
              </a>
            </Box>
            <PermissionWrapperV2 tableSlug="app" type="write">
              <Button primary onClick={navigateToCreateForm}>
                Add API key
              </Button>
            </PermissionWrapperV2>
          </Box>
        </Box>
      </ContentTitle>
      {/* <HeaderSettings title={"Api keys"} sticky line={false} /> */}

      <Box marginTop="36px">
        <CTable loader={false} disablePagination removableHeight={false}>
          <CTableHead>
            <CTableCell className={cls.tableHeadCell} width={10}>
              №
            </CTableCell>
            <CTableCell className={cls.tableHeadCell}>Name</CTableCell>
            <CTableCell className={cls.tableHeadCell}>AppId</CTableCell>
            <CTableCell className={cls.tableHeadCell}>Client ID</CTableCell>
            <CTableCell className={cls.tableHeadCell}>Platform name</CTableCell>
            <CTableCell className={cls.tableHeadCell}>Monthly limit</CTableCell>
            <CTableCell className={cls.tableHeadCell}>RPS limit</CTableCell>
            <CTableCell className={cls.tableHeadCell}>Used count</CTableCell>
            <CTableCell className={cls.tableHeadCell} width={60}></CTableCell>
          </CTableHead>

          <CTableBody loader={false} columnsCount={4} dataLength={list.length}>
            {apiKeys?.map((element, index) => (
              <CTableRow
                onClick={() => navigateToForm(element?.id)}
                key={element.id}
              >
                <CTableCell className={cls.tBodyCell}>{index + 1}</CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {element?.name}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {element?.app_id}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {element?.client_id}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {element?.client_platform?.name}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {numberWithSpaces(element?.monthly_request_limit)}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {numberWithSpaces(element?.rps_limit)}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {numberWithSpaces(element?.used_count)}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  <div className="flex">
                    {element?.disable ? (
                      <RectangleIconButton
                        style={{
                          cursor: "not-allowed",
                          border: "1px solid #eee",
                          background: "#eeee",
                        }}
                        color="success"
                        className="mr-1"
                        size="small"
                      >
                        <Edit style={{ color: "#8888" }} color="success" />
                      </RectangleIconButton>
                    ) : (
                      <RectangleIconButton
                        color="success"
                        className="mr-1"
                        size="small"
                        onClick={() => navigateToEditForm(element.id)}
                      >
                        <Edit color="success" />
                      </RectangleIconButton>
                    )}
                    {element?.disable ? null : (
                      <RectangleIconButton
                        color="error"
                        onClick={() => deleteTable(element?.id)}
                      >
                        <Delete color="error" />
                      </RectangleIconButton>
                    )}
                  </div>
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </Box>
    </div>
  );
};
