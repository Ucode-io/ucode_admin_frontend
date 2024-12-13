import {Box} from "@mui/material";
import React from "react";
import QRCode from "react-qr-code";
import Modal from "@mui/material/Modal";

function HFQrForTableViewCellEditor({
  defaultValue = "",
  required = false,
  isDetailPage = false,
  qrRef,
  handClick = () => {},
  handModalClose = () => {},
  openModal = () => {},
  onChange = () => {},
  value,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <Box>
      <Box>
        <QRCode
          ref={qrRef}
          onClick={handClick}
          style={{
            height: "auto",
            maxWidth: "100%",
            width: isDetailPage ? "50px" : "25px",
            cursor: "pointer",
          }}
          value={value ?? ""}
        />
      </Box>
      <Modal open={openModal} onClose={handModalClose}>
        <Box sx={{...style}}>
          <Box>
            <QRCode
              ref={qrRef}
              onClick={handClick}
              style={{
                height: "auto",
                maxWidth: "100%",
                width: "100%",
                cursor: "pointer",
                margin: "0 auto",
              }}
              value={value ?? ""}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default HFQrForTableViewCellEditor;
