import {Box, Tooltip} from "@mui/material";
import React from "react";
import GoogleAuthLogin from "./GoogleAuthLogin";
import ChatwootLogin from "./ChatwootLogin";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

function ExternalAuth({setFormType = () => {}, getCompany = () => {}}) {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const location = useLocation();

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
          {t("or")}
        </Box>
        <Box sx={{border: "1px solid #F2F4F7", width: "40%"}}></Box>
      </Box>

      <Tooltip title="Google Auth!">
        <Box>
          <GoogleAuthLogin getCompany={getCompany} />
        </Box>
      </Tooltip>
      <ChatwootLogin />

      {
        !location?.pathname?.includes(
          "invite-user" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginTop: "24px",
                justifyContent: "center",
              }}>
              <p>{t("account.not")}</p>
              <Box
                onClick={() => navigate("/registration")}
                sx={{color: "#175CD3", fontSize: "14px", cursor: "pointer"}}>
                {t("create.account")}
              </Box>
            </Box>
          )
        )
      }
    </>
  );
}

export default ExternalAuth;
