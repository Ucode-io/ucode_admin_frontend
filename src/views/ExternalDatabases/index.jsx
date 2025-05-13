import React, {useState} from "react";
import {ContentTitle} from "../SettingsPopup/components/ContentTitle";
import {Box, Button} from "@mui/material";
import SearchInput from "../../components/SearchInput";
import TableCard from "../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import cls from "./style.module.scss";
import {useQuery} from "react-query";
import conectionDatabaseService from "../../services/connectionDatabaseService";
import AddConnectionModal from "./AddConnectionModal";
import {useSearchParams} from "react-router-dom";

function ExternalDatabases() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const {data: connections, refetch} = useQuery(
    ["GET_CONNECTION_DATABASE"],
    () => {
      return conectionDatabaseService.getConnections();
    },
    {
      select: (res) => res?.connections ?? [],
    }
  );

  const handleSingleConnection = (id) => {
    setSearchParams({tab: "connectionDetail", connect: id});
  };

  return (
    <>
      <div>
        <ContentTitle>
          <Box
            display={"flex"}
            justifyContent="space-between"
            alignItems={"center"}>
            <Box
              display={"flex"}
              justifyContent="space-between"
              alignItems={"center"}>
              <span>Connections</span>
            </Box>

            <Box display={"flex"} alignItems={"center"}>
              <SearchInput
                onChange={(val) => {
                  setSearchText(val);
                }}
              />
              <Button
                onClick={handleOpen}
                sx={{marginLeft: "10px"}}
                color="primary"
                variant="outlined">
                Add Connection
              </Button>
            </Box>
          </Box>
        </ContentTitle>

        <TableCard type={"withoutPadding"}>
          <CTable disablePagination removableHeight={120}>
            <CTableHead>
              <CTableCell className={cls.tableHeadCell} width={10}>
                №
              </CTableCell>
              <CTableCell className={cls.tableHeadCell}>Name</CTableCell>
              <CTableCell className={cls.tableHeadCell}>
                Connection string
              </CTableCell>
            </CTableHead>
            <CTableBody columnsCount={4} dataLength={1} loader={false}>
              {connections?.map((element, index) => (
                <CTableRow
                  onClick={() => {
                    handleSingleConnection(element?.id);
                  }}
                  key={element.id}>
                  <CTableCell
                    style={{textAlign: "center"}}
                    className={cls.tBodyCell}>
                    {index + 1}
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    {element.name}
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    {element.connection_string}
                  </CTableCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </TableCard>

        <AddConnectionModal
          refetch={refetch}
          openModal={openModal}
          handleClose={handleClose}
        />
      </div>{" "}
    </>
  );
}

export default ExternalDatabases;
