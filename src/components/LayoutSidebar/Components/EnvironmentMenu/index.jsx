import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import IconGenerator from "../../../IconPicker/IconGenerator";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import EnvironmentModal from "./EnvironmentModal";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function EnvironmentMenu({
  level = 1,
  menuStyle,
  setSubMenuIsOpen,
  menuItem,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ margin: "0 5px" }}>
      <div className="parent-block column-drag-handle">
        <Button className={`nav-element`} onClick={handleOpen}>
          <div
            className="label"
            style={{
              color: menuStyle?.text,
            }}
          >
            <LocalOfferIcon />
            Environment changes
          </div>
        </Button>
      </div>

      {open && <EnvironmentModal open={open} handleClose={handleClose} />}
    </Box>
  );
}
