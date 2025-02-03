import React, {useRef, useState} from "react";
import {
  Box,
  Button,
  Popover,
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import fileService from "../../services/fileService";

export default function TopUpBalance({
  value,
  onChange,
  disabled,
  tabIndex,
  field,
}) {
  const inputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    if (!e.target.files[0]) return;

    setLoading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fileService.folderUpload(data, {
        folder_name: field?.attributes?.path,
      });
      onChange(import.meta.env.VITE_CDN_BASE_URL + res.link);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = () => {
    onChange(null);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "file-options-popover" : undefined;

  return (
    <Card
      sx={{
        padding: 2,
        borderRadius: 1,
        boxShadow: 3,
        border: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%",
        textAlign: "center",
        margin: "20px auto 0",
      }}>
      {value ? (
        <>
          <CardContent
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Tooltip title="Click for options">
              <Button
                onClick={handlePopoverOpen}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                  border: "1px solid #ddd",
                  padding: 1,
                }}>
                <AttachFileIcon sx={{fontSize: 24, color: "#666"}} />
                <Typography variant="body2" sx={{flexGrow: 1, color: "#333"}}>
                  {value.split("_")[1] ?? "Uploaded receipt"}
                </Typography>
              </Button>
            </Tooltip>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
              <Box sx={{display: "flex", flexDirection: "column", padding: 1}}>
                {/* <Button
                  href={value}
                  download
                  target="_blank"
                  sx={{display: "flex", alignItems: "center", gap: 1}}>
                  <OpenInFullIcon />
                  View File
                </Button> */}

                <Button
                  disabled={disabled}
                  onClick={deleteImage}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "red",
                  }}>
                  <DeleteIcon />
                  Remove File
                </Button>

                <Button
                  disabled={disabled}
                  onClick={() => inputRef.current.click()}
                  sx={{display: "flex", alignItems: "center", gap: 1}}>
                  <ChangeCircleIcon />
                  Change File
                </Button>
              </Box>
            </Popover>
          </CardContent>

          <input
            type="file"
            style={{display: "none"}}
            ref={inputRef}
            tabIndex={tabIndex}
            onChange={handleFileChange}
            disabled={disabled}
          />
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{mb: 1, color: "#555"}}>
            Upload a Receipt
          </Typography>
          <Tooltip title="Click to upload">
            <IconButton
              onClick={() => inputRef.current.click()}
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                border: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                "&:hover": {backgroundColor: "#e0e0e0"},
              }}>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <UploadFileIcon sx={{fontSize: 30, color: "#666"}} />
              )}
            </IconButton>
          </Tooltip>

          <input
            type="file"
            style={{display: "none"}}
            ref={inputRef}
            tabIndex={tabIndex}
            onChange={handleFileChange}
            disabled={disabled}
          />
        </>
      )}
    </Card>
  );
}
