import {Box, Button, Menu} from "@mui/material";
import React, {useState} from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {useQuery} from "react-query";
import conectionDatabaseService from "../../../../services/connectionDatabaseService";
import CloseIcon from "@mui/icons-material/Close";

function ExternalDatabases({
  setSelectedConnection = () => {},
  selectedConnection,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const {data: connections, refetch} = useQuery(
    ["GET_CONNECTION_DATABASE"],
    () => {
      return conectionDatabaseService.getConnections();
    },
    {
      select: (res) => res?.connections ?? [],
    }
  );

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          width: "240px",
          background: "#eff8ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        variant="outlined">
        <Box>
          <span style={{fontWeight: "400"}}> Resource</span>:{" "}
          {selectedConnection?.name || " "}{" "}
        </Box>
        <Box
          onClick={(e) => {
            e.stopPropagation();
            setSelectedConnection(null);
          }}
          sx={{
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            marginRight: "10px",
          }}>
          {selectedConnection?.id && (
            <Box sx={{height: "18px"}}>
              <CloseIcon />
            </Box>
          )}
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Box>
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{padding: "5px", widht: "120px"}}>
          {connections?.map((item) => (
            <Box
              onClick={() => {
                setSelectedConnection(item);
                handleClose();
              }}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  background: "#eee",
                },
                padding: "5px 8px",
                borderRadius: "6px",
              }}
              width={"200px"}>
              {item?.name}
            </Box>
          ))}
        </Box>
      </Menu>
    </>
  );
}

export default ExternalDatabases;
