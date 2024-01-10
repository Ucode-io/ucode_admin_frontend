import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";
import HistoryRow from "./HistoryRow";

export default function HistoriesTable({ histories, setSelectedEnvironment, selectedVersions, setSelectedVersions }) {
  const handleSelectVersion = (e, index) => {
    if (e.target.checked) {
      const versionsUntilIndex = histories.slice(0, index + 1)
      setSelectedVersions(versionsUntilIndex)
    } else {
      const versionsUntilIndex = histories.slice(0, index)
      setSelectedVersions(versionsUntilIndex)
    }
  }

  return (
    <div style={{ height: 400, width: "100%", overflow: "scroll" }}>
      <Box>
        <Button
          onClick={() => setSelectedEnvironment(null)}
          sx={{
            marginBottom: "10px",
          }}
        >
          <ArrowBackRoundedIcon />
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: "40px" }}>
                Action
              </TableCell>
              <TableCell align="left">Action Type</TableCell>
              <TableCell align="left">Action Source</TableCell>
              <TableCell align="left">Label</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {histories?.map((history, index) => (
              <HistoryRow history={history} index={index} handleSelectVersion={handleSelectVersion} selectedVersions={selectedVersions}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
