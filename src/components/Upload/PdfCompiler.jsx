import {Box, Button, Dialog, DialogContent, DialogTitle} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {useEffect, useState} from "react";
import React from "react";

function PdfCompiler({
  value,
  openModal = false,
  handleClick = () => {},
  valueGenerate = () => {},
  handleClose = () => {},
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (value) {
      setDisplayValue(value);
    }
  }, [value]);

  const fileExt = displayValue?.split(".").pop()?.toLowerCase();
  const isPDF = fileExt === "pdf";
  const isWord = fileExt === "doc" || fileExt === "docx";
  const isExcel = fileExt === "xls" || fileExt === "xlsx";

  const encodedURL = encodeURIComponent(displayValue || "");

  return (
    <Dialog
      aria-labelledby="telegram-dialog-title"
      open={openModal}
      onClose={handleClose}
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: "#f8f9fa",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        },
      }}>
      <DialogTitle
        id="telegram-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "16px",
          fontWeight: 500,
          backgroundColor: "#eee",
          padding: "10px 16px",
          color: "#0D2E47",
        }}>
        <span>{valueGenerate(displayValue) || "Файл"}</span>
        <Box sx={{display: "flex", alignItems: "center"}}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginRight: "15px",
              cursor: "pointer",
            }}
            onClick={handleClick}>
            <MoreHorizIcon
              htmlColor="#000"
              style={{width: "24px", height: "24px"}}
            />
          </Box>
          <Button onClick={handleClose} sx={{minWidth: "auto", padding: 0}}>
            <CloseIcon style={{color: "#0D2E47"}} />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          padding: 0,
          backgroundColor: "#eee",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 100px)",
        }}>
        {displayValue ? (
          isPDF ? (
            <iframe
              src={displayValue}
              style={{width: "100%", height: "100%", border: "none"}}
              title="PDF Viewer"
            />
          ) : isWord || isExcel ? (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodedURL}`}
              width="100%"
              height="100%"
              frameBorder="0"
              title={`${isExcel ? "Excel" : "Word"} Viewer`}
            />
          ) : (
            <div>Unsupported file format</div>
          )
        ) : (
          <div>Document could not be loaded</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PdfCompiler;
