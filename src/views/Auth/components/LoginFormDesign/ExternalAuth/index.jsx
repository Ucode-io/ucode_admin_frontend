import {Box, Tooltip} from "@mui/material";
import React from "react";
import GoogleAuthLogin from "./GoogleAuthLogin";
import GithubAuthLogin from "./GithubAuthLogin";

function ExternalAuth({setFormType = () => {}, getCompany = () => {}}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
          marginTop: "16px",
        }}>
        <Box sx={{border: "1px solid #F2F4F7", width: "40%"}}></Box>
        <Box
          sx={{
            width: "20%",
            textAlign: "center",
            fontSize: "14px",
            color: "#475467",
          }}>
          Или
        </Box>
        <Box sx={{border: "1px solid #F2F4F7", width: "40%"}}></Box>
      </Box>

      <Tooltip title="Will be available soon!">
        <Box>
          <GoogleAuthLogin getCompany={getCompany} />
        </Box>
      </Tooltip>

      {/* <Tooltip title="Will be available soon!"> */}
      <Box>
        <GithubAuthLogin />
      </Box>
      {/* </Tooltip> */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginTop: "24px",
          justifyContent: "center",
        }}>
        <p>У вас нет аккаунта?</p>
        <Box
          onClick={() => setFormType("REGISTER")}
          sx={{color: "#175CD3", fontSize: "14px", cursor: "pointer"}}>
          Создайте его
        </Box>
      </Box>
    </>
  );
}

export default ExternalAuth;
