import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";

export default function EnvironmentsTable({ environments, setSelectedEnvironment }) {
  console.log("ssssssss", environments);
  return (
    <div style={{ height: 400, width: "100%" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="center" sx={{ width: "40px" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {environments?.map((environment) => (
              <TableRow key={environment.id}>
                <TableCell align="left" sx={{ padding: "16px 24px 16px 16px !important" }}>
                  {environment.name}
                </TableCell>

                <TableCell align="center" component="th" scope="row" sx={{ padding: "16px 24px 16px 16px !important" }}>
                  <Button variant="outlined" onClick={() => setSelectedEnvironment(environment?.id)}>
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
