import React, {useEffect, useState} from "react";
import sessionService from "../../services/sessionService";
import TableCard from "../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import {useParams} from "react-router-dom";
import {Delete} from "@mui/icons-material";
import {format} from "date-fns";
import {Box} from "@mui/material";

function UserSessionsLogs() {
  const {userId} = useParams();
  const [sessions, setSessions] = useState([]);

  const getSessions = () => {
    sessionService
      .getList({user_id: userId})
      .then((res) => setSessions(res?.sessions));
  };

  const deleteSession = (id) => {
    sessionService.delete(id).then(() => getSessions());
  };

  useEffect(() => {
    getSessions();
  }, []);

  return (
    <Box
      sx={{
        height: "calc(100vh - 56px)",
        background: "#fff",
        overflow: "scroll",
      }}>
      <TableCard type={"withoutPadding"}>
        <CTable
          tableStyle={{border: "none"}}
          disablePagination
          removableHeight={false}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Data</CTableCell>
            <CTableCell>IP</CTableCell>
            <CTableCell>Created time</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={false}
            columnsCount={6}
            // dataLength={sessions?.length}
          >
            {sessions?.map((element, index) => (
              <CTableRow
                key={element.id}
                // onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.data}</CTableCell>
                <CTableCell>{element?.ip}</CTableCell>
                <CTableCell>
                  {format(
                    new Date(element?.created_at),
                    "dd-MM-yyyy - HH:mm:ss"
                  )}
                </CTableCell>

                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      deleteSession(element.id);
                    }}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            {/* <PermissionWrapperV2 tabelSlug="app" type="write">
              <TableRowButton colSpan={6} onClick={navigateToCreateForm} />
            </PermissionWrapperV2> */}
          </CTableBody>
        </CTable>
      </TableCard>
    </Box>
  );
}

export default UserSessionsLogs;
