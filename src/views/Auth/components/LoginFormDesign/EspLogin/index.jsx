import {Box} from "@mui/material";
import React from "react";
import ExternalAuth from "../ExternalAuth";

function EspLogin({setFormType = () => {}, control}) {
  return (
    <>
      <Box>EspLogin</Box>
      <ExternalAuth setFormType={setFormType} />
    </>
  );
}

export default EspLogin;
