import {Close} from "@mui/icons-material";
import {Card, IconButton, Modal} from "@mui/material";
import React, {useState} from "react";
import styles from "./style.module.scss";
import ObjectsFormPageForModal from "../ObjectsFormpageForModal";

export default function ModalDetailPage({
  open,
  setOpen,
  tableSlug,
  selectedRow,
  dateInfo,
}) {
  const [fullScreen, setFullScreen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setFullScreen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} className="child-position-center">
      <Card
        className={`${
          fullScreen ? styles.cardModal : styles.card
        } PlatformModal`}
      >
        <div className={styles.header}>
          <div className={styles.cardTitle}>View settings</div>
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

        <ObjectsFormPageForModal
          selectedRow={selectedRow}
          tableSlugFromProps={tableSlug}
          handleClose={handleClose}
          modal={true}
          dateInfo={dateInfo}
          setFullScreen={setFullScreen}
          fullScreen={fullScreen}
        />
      </Card>
    </Modal>
  );
}
