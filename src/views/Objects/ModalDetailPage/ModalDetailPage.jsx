import { Close } from "@mui/icons-material";
import { Card, IconButton, Modal } from "@mui/material";
import React from "react";
import styles from "./style.module.scss";
import ObjectsFormPage from "../ObjectsFormPage";

export default function ModalDetailPage({
  open,
  setOpen,
  tableSlug,
  selectedRow,
  dateInfo,
  fullScreen,
  setFullScreen,
}) {
  const handleClose = () => setOpen(false);
  return (
    <Modal open={open} onClose={handleClose} className="child-position-center">
      <Card
        className={`${
          fullScreen ? styles.cardModal : styles.card
        } PlatformModal`}
      > 
        <div className={styles.header}>
          <div className={styles.cardTitle}>Detailed</div>
          <IconButton
            className={styles.closeButton}
            onClick={() => {
              setFullScreen((prev) => !prev);
              handleClose();
            }}
          >
            <Close className={styles.closeIcon} />
          </IconButton>
        </div>

        <ObjectsFormPage
          selectedRow={selectedRow}
          tableSlugFromProps={tableSlug}
          handleClose={handleClose}
          modal={true}
          dateInfo={dateInfo}
        />
      </Card>
    </Modal>
  );
}
