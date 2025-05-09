import {Box, Button, Menu} from "@mui/material";
import React, {useState} from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {useQuery} from "react-query";
import conectionDatabaseService from "../../../../services/connectionDatabaseService";
import CloseIcon from "@mui/icons-material/Close";
import ResourcesIcon from "@/assets/icons/rows.svg";

function ExternalDatabases({
  setSelectedConnection = () => {},
  selectedConnection,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { data: connections, refetch } = useQuery(
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
          background: "#eff8ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        variant="outlined"
      >
        <Box sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
          <span style={{ fontWeight: "400", color: "rgb(0, 122, 255)" }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 9H21M3 15H21M7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 6H17.01M17 12H17.01M17 18H17.01"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
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
          }}
        >
          {selectedConnection?.id && (
            <Box sx={{ height: "18px" }}>
              <CloseIcon />
            </Box>
          )}
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Box>
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ padding: "5px", widht: "120px" }}>
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
              width={"200px"}
            >
              {item?.name}
            </Box>
          ))}
        </Box>
      </Menu>
    </>
  );
}

export default ExternalDatabases;
