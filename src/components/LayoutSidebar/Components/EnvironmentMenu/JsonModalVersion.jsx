import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "max-content",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 0,
  outline: "none",
  borderRadius: "10px",
  maxHeight: "80vh",
  maxWidth: "80vw",
  overflow: "scroll",
  height: "80vh",
};

export default function JsonModalVersion({ history }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Show JSON
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
              padding: "16px",
              position: "sticky",
              top: "0",
              backgroundColor: "#fff",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                width: "40px",
                height: "40px",
                padding: "0px",
                minWidth: "40px",
              }}
            >
              <CloseRoundedIcon onClick={handleClose} />
            </Button>
          </Box>

          <Box
            sx={{
              padding: "16px",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  history?.current && history?.previus ? "1fr 1fr" : "1fr",
                gap: "16px",
              }}
            >
              {history?.current && history?.previus && (
                <>
                  <Box
                    sx={{
                      backgroundColor: "#000",
                      borderRadius: "10px",
                      padding: "16px",
                      color: "#fff",
                    }}
                  >
                    <pre>{JSON.stringify(history?.current, null, 2)}</pre>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: "#000",
                      borderRadius: "10px",
                      padding: "16px",
                      color: "#fff",
                    }}
                  >
                    <pre>{JSON.stringify(history?.previus, null, 2)}</pre>
                  </Box>
                </>
              )}

              {history?.current && !history?.previus && (
                <Box
                  sx={{
                    backgroundColor: "#000",
                    borderRadius: "10px",
                    padding: "16px",
                    color: "#fff",
                  }}
                >
                  <pre>{JSON.stringify(history?.current, null, 2)}</pre>
                </Box>
              )}

              {!history?.current && history?.previus && (
                <Box
                  sx={{
                    backgroundColor: "#000",
                    borderRadius: "10px",
                    padding: "16px",
                    color: "#fff",
                  }}
                >
                  <pre>{JSON.stringify(history?.previus, null, 2)}</pre>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
