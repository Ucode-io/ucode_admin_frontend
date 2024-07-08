import {Box, Container} from "@mui/material";
import React from "react";
import TableUiHead from "./TableUiHead/TableUiHead";
import MainContent from "./MainContent";
import TableHeadTitle from "./TableUiHead/TableHeadTitle";
import TableFilterBlock from "./TableFilterBlock";

function Table1CUi() {
  return (
    <Box>
      <TableUiHead />
      <TableHeadTitle />
      <TableFilterBlock />
      <MainContent />
    </Box>
  );
}

export default Table1CUi;
