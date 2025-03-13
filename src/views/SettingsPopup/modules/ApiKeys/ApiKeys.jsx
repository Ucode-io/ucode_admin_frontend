import { Box } from "@mui/material";
import { useApiKeysProps } from "./useApiKeysProps";
import { Delete, Edit } from "@mui/icons-material";
import HeaderSettings from "@/components/HeaderSettings";
import { DownloadIcon } from "@chakra-ui/icons";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "@/components/CTable";
import TableCard from "@/components/TableCard";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import TableRowButton from "@/components/TableRowButton";
import { numberWithSpaces } from "@/utils/formatNumbers";
import { ContentTitle } from "../../components/ContentTitle";

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
        </Box>
      </ContentTitle>
      {/* <HeaderSettings title={"Api keys"} sticky line={false} /> */}

      <Box marginTop="36px">
        <CTable loader={false} disablePagination removableHeight={false}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell>AppId</CTableCell>
            <CTableCell>Client ID</CTableCell>
            <CTableCell>Platform name</CTableCell>
            <CTableCell>Monthly limit</CTableCell>
            <CTableCell>RPS limit</CTableCell>
            <CTableCell>Used count</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>

          <CTableBody loader={false} columnsCount={4} dataLength={list.length}>
            {apiKeys?.map((element, index) => (
              <CTableRow
                onClick={() => navigateToForm(element?.id)}
                key={element.id}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>{element?.app_id}</CTableCell>
                <CTableCell>{element?.client_id}</CTableCell>
                <CTableCell>{element?.client_platform?.name}</CTableCell>
                <CTableCell>
                  {numberWithSpaces(element?.monthly_request_limit)}
                </CTableCell>
                <CTableCell>{numberWithSpaces(element?.rps_limit)}</CTableCell>
                <CTableCell>{numberWithSpaces(element?.used_count)}</CTableCell>
                <CTableCell>
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
            <PermissionWrapperV2 tableSlug="app" type="write">
              <TableRowButton colSpan={7} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </Box>
    </div>
  );
};