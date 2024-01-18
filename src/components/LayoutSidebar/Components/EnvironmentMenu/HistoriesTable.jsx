import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, TableCell, Typography } from "@mui/material";
import React from "react";
import HistoryRow from "./HistoryRow";
import styles from "./styles.module.scss";
import TableCard from "../../../TableCard";
import { CTable, CTableBody, CTableHead, CTableHeadRow } from "../../../CTable";
import ClearIcon from "@mui/icons-material/Clear";

export default function HistoriesTable({
  histories,
  setSelectedEnvironment,
  selectedVersions,
  setSelectedVersions,
  setSelectedMigrate,
  handleClose,
}) {
  const handleSelectVersion = (e, index) => {
    if (e.target.checked) {
      const versionsUntilIndex = histories.slice(0, index + 1);
      setSelectedVersions(versionsUntilIndex);
    } else {
      const versionsUntilIndex = histories.slice(0, index);
      setSelectedVersions(versionsUntilIndex);
    }
  };

  return (
    <div style={{ height: 400, width: "100%", overflow: "auto" }}>
      <div className={styles.header}>
        <Typography variant="h4">History</Typography>
        <ClearIcon
          color="primary"
          onClick={handleClose}
          width="46px"
          style={{
            cursor: "pointer",
          }}
        />
      </div>
      <Box>
        <Button
          className={styles.button}
          onClick={() => setSelectedMigrate(null)}
        >
          <ArrowBackRoundedIcon />
        </Button>
      </Box>

      <TableCard withBorder borderRadius="md">
        <CTable
          removableHeight={0}
          tableStyle={{
            height: "auto",
          }}
          disablePagination={true}
        >
          <CTableHead>
            <CTableHeadRow>
              <TableCell width={40}>Action</TableCell>
              <TableCell>Action Type</TableCell>
              <TableCell>Action Source</TableCell>
              <TableCell width={200}>Label</TableCell>
              <TableCell width={130}>Action</TableCell>
            </CTableHeadRow>
          </CTableHead>
          <CTableBody
            style={{
              overflow: "auto",
            }}
            dataLength={histories?.length}
          >
            {histories?.map((history, index) => (
              <HistoryRow
                history={history}
                index={index}
                handleSelectVersion={handleSelectVersion}
                selectedVersions={selectedVersions}
              />
            ))}
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
}
