import {Box, Button, Tooltip} from "@mui/material";
import React, {useState} from "react";
import IconGenerator from "../../../IconPicker/IconGenerator";
import DeleteIcon from "@mui/icons-material/Delete";
import {BsThreeDots} from "react-icons/bs";
import EnvironmentModal from "../EnvironmentMenu/EnvironmentModal";

function RecursiveBlock({activeStyle}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Box
      sx={{
        backgroundColor: "rgb(255, 255, 255)",
        color: "rgb(168, 168, 168)",
        paddingLeft: "10px",
        paddingRight: "10px",
        borderRadius: "10px",
        margin: "0px",
      }}>
      <div className="parent-block column-drag-handle">
        <Button style={activeStyle} className="nav-element">
          <div className="label" style={{padding: "0 10px"}}>
            <Tooltip title="Project Settings" placement="top">
              <p>Environments</p>
            </Tooltip>
          </div>
          <Box className="icon_group">
            <Tooltip title="Resource settings" placement="top">
              <Box className="extra_icon">
                <BsThreeDots
                  size={13}
                  // onClick={(e) => {
                  //   e?.stopPropagation();
                  //   handleOpenNotify(e, "FOLDER");
                  // }}
                />
              </Box>
            </Tooltip>
          </Box>
        </Button>
        <Button
          style={activeStyle}
          className="nav-element"
          onClick={(e) => {
            e?.stopPropagation();
            handleOpen();
          }}>
          <div className="label" style={{padding: "0 10px"}}>
            <Tooltip title="Project Settings" placement="top">
              <p>Versions</p>
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
