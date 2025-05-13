import {Box, Button, Tooltip} from "@mui/material";
import React, {useState} from "react";
import {BsThreeDots} from "react-icons/bs";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import EnvironmentModal from "../EnvironmentMenu/EnvironmentModal";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";

function RecursiveBlock({projectSettingLan}) {
  const [open, setOpen] = useState(false);
  const {appId} = useParams();
  const {i18n} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const styles = {
    color: "#475467",
    borderRadius: "8px",
    margin: "5px 0",
    height: "32px",
  };

  return (
    <Box
      sx={{
        // backgroundColor: "#f2f4f7",
        color: "rgb(168, 168, 168)",
        paddingLeft: "10px",
        paddingRight: "10px",
        borderRadius: "10px",
        margin: "0px",
      }}>
      <div className="parent-block column-drag-handle">
        <Button
          style={styles}
          className="nav-element"
          onClick={(e) => {
            e?.stopPropagation();
            navigate(`/main/${appId}/project-setting`);
          }}>
          <div className="label" style={{padding: "0 10px", fontSize: "13px"}}>
            <Tooltip title="Project Settings" placement="top">
              <p>
                {generateLangaugeText(
                  projectSettingLan,
                  i18n?.language,
                  "Project Settings"
                ) || "Project Settings"}
              </p>
            </Tooltip>
          </div>
          <Box className="icon_group">
            <Tooltip title="Resource settings" placement="top">
              <Box className="extra_icon">
                <BsThreeDots size={13} />
              </Box>
            </Tooltip>
          </Box>
        </Button>
        <Button
          style={styles}
          className="nav-element"
          onClick={(e) => {
            e?.stopPropagation();
            navigate(`/main/${appId}/environments`);
          }}>
          <div className="label" style={{padding: "0 10px", fontSize: "13px"}}>
            <Tooltip title="Project Settings" placement="top">
              <p>
                {" "}
                {generateLangaugeText(
                  projectSettingLan,
                  i18n?.language,
                  "Environments"
                ) || "Environments"}
              </p>
            </Tooltip>
          </div>
          <Box className="icon_group">
            <Tooltip title="Resource settings" placement="top">
              <Box className="extra_icon">
                <BsThreeDots size={13} />
              </Box>
            </Tooltip>
          </Box>
        </Button>
        <Button
          style={styles}
          className="nav-element"
          onClick={(e) => {
            e?.stopPropagation();
            handleOpen();
            navigate("main/c57eedc3-a954-4262-a0af-376c65b5a280");
          }}>
          <div className="label" style={{padding: "0 10px", fontSize: "13px"}}>
            <Tooltip title="Project Settings" placement="top">
              <p>
                {" "}
                {generateLangaugeText(
                  projectSettingLan,
                  i18n?.language,
                  "Versions"
                ) || "Versions"}
              </p>
            </Tooltip>
          </div>
          <Box className="icon_group">
            <Tooltip title="Resource settings" placement="top">
              <Box className="extra_icon">
                <BsThreeDots size={13} />
              </Box>
            </Tooltip>
          </Box>
        </Button>
        <Button
          style={styles}
          className="nav-element"
          onClick={(e) => {
            e?.stopPropagation();
            navigate(`/main/${appId}/language-control`);
          }}>
          <div className="label" style={{padding: "0 10px", fontSize: "13px"}}>
            <Tooltip title="Project Settings" placement="top">
              <p>
                {" "}
                {generateLangaugeText(
                  projectSettingLan,
                  i18n?.language,
                  "Language Control"
                ) || "Language Control"}
              </p>
            </Tooltip>
          </div>
          <Box className="icon_group">
            <Tooltip title="Resource settings" placement="top">
              <Box className="extra_icon">
                <BsThreeDots size={13} />
              </Box>
            </Tooltip>
          </Box>
        </Button>
      </div>
      {open && <EnvironmentModal open={open} handleClose={handleClose} />}
    </Box>
  );
}

export default RecursiveBlock;
