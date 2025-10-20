import React, {useRef, useState} from "react";
import HFQrForTableView from "./HFQrForTableView";
import {Box, Menu} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

function HFQrFieldComponent({
  field,
  required,
  isTableView,
  newColumn,
  disabled = false,
  row,
}) {

  const defaultValue = row?.[field?.slug]

  const [openMenu, setMenu] = useState(false);
  const qrRef = useRef(null);
  const [switchInput, setSwitchInput] = useState(
    isTableView ? true : newColumn ? false : true
  );
  const open = Boolean(openMenu);
  const handClick = (event) => {
    setMenu(event.currentTarget);
  };
  const handleClose = () => {
    setMenu(null);
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handModalClose = () => setOpenModal(false);

  const isDetailPage = !isTableView && !newColumn;

  return (
    <>
      <Box sx={{display: "flex"}}>
        <Box>
        <HFQrForTableView
          disabled={disabled}
          defaultValue={defaultValue}
          field={field}
          required={required}
          isTableView={isTableView}
          isDetailPage={isDetailPage}
          handClick={handClick}
          qrRef={qrRef}
          openModal={openModal}
          handModalClose={handModalClose}
          value={row?.[field?.slug]}
        />
        </Box>
      </Box>
      <Menu anchorEl={openMenu} open={open} onClose={handleClose}>
        <Box
          sx={{
            cursor: "pointer",
            width: "150px",
            minHeight: "20px",
            padding: "10px 0 0px 20px",
          }}>
          <Box
            sx={{
              color: "#007aff",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              handleOpen();
              handleClose();
            }}>
            <FullscreenIcon style={{marginRight: "10px"}} />
            Full Scrren
          </Box>
          {!isTableView && (
            <Box
              sx={{
                color: "#007aff",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                setSwitchInput((item) => !item);
                handleClose();
              }}>
              <EditIcon style={{marginRight: "10px"}} />
              Change Qr
            </Box>
          )}
        </Box>
      </Menu>
    </>
  );
}

export default HFQrFieldComponent;
