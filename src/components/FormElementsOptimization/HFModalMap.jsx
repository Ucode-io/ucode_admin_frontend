import React, {useState} from "react";
import { Box, Button, Dialog } from "@mui/material";
import HFMapField from "./HFMapField";
import styles from "./style.module.scss";
import { generateLink } from "../../utils/generateYandexLink";

import LaunchIcon from "@mui/icons-material/Launch";

function HFModalMap({ disabled = false, handleChange, row }) {
  const [open, setOpen] = useState(false);

  const value = row?.value;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const generatedLink =
    generateLink(value?.split(",")?.[0], value?.split(",")?.[1]) || "";

  return (
    <Box>
      <div
        className={styles.mapText}
        onClick={() => {
          if (disabled) return;
          handleOpen();
        }}
      >
        <span>{generatedLink}</span>
        <a
          href={generatedLink || "#"}
          className={styles.linkBtn}
          style={{ pointerEvents: Boolean(!generatedLink) ? "none" : "auto" }}
          target="_blank"
          rel="noreferrer"
        >
          <LaunchIcon
            htmlColor="rgb(99, 115, 129)"
            style={{ fontSize: "20px" }}
          />
        </a>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <div className={styles.mapField}>
          <HFMapField
            handleChange={handleChange}
            row={row}
            width={"500px"}
            height={"400px"}
          />

          <Box>
            <Button onClick={handleClose} variant="outlined" color="error">
              Cancel
            </Button>
            <Button
              onClick={handleClose}
              sx={{ marginLeft: "10px" }}
              variant="outlined"
            >
              Confirm
            </Button>
          </Box>
        </div>
      </Dialog>
    </Box>
  );
}

export default HFModalMap;
