import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {useParams} from "react-router-dom";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import {Box} from "@mui/material";
import {Delete} from "@mui/icons-material";

function ActionButtons(props) {
  const {colDef, data} = props;

  return (
    <>
      {data?.new_field ? (
        <Box
          className="sssss"
          sx={{
            display: "flex",
            width: "100%",
            height: "41px",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}>
          <RectangleIconButton
            onClick={() => {
              colDef.removeRow(data?.guid);
            }}>
            <CloseIcon color="error" />
          </RectangleIconButton>
          <RectangleIconButton
            color="success"
            onClick={() => {
              colDef.addRow(data);
            }}>
            <DoneIcon color="success" />
          </RectangleIconButton>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "0px 0 0 0",
            width: "100%",
            height: "100%",
          }}>
          <RectangleIconButton
            color="error"
            style={{minWidth: 25, minHeight: 25, height: 25, marginTop: "15px"}}
            onClick={() => colDef.deleteFunction(data)}>
            <Delete color="error" />
          </RectangleIconButton>
        </Box>
      )}
    </>
  );
}

export default ActionButtons;
