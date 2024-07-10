import {Box, Container} from "@mui/material";
import React, {useState} from "react";
import TableUiHead from "./TableUiHead/TableUiHead";
import TableHeadTitle from "./TableUiHead/TableHeadTitle";
import TableFilterBlock from "./TableFilterBlock";
import TableComponent from "./TableComponent/TableComponent";

function Table1CUi({menuItem}) {
  const [openFilter, setOpenFilter] = useState(false);
  return (
    <Box>
      <TableUiHead menuItem={menuItem} />
      <TableHeadTitle />
      <TableFilterBlock openFilter={openFilter} setOpenFilter={setOpenFilter} />
      <TableComponent openFilter={openFilter} />
    </Box>
  );
}

export default Table1CUi;
