import { Close } from "@mui/icons-material";
import { Card, IconButton, Modal } from "@mui/material";
import React, { useState } from "react";
import ObjectsFormPageForModal from "../ObjectsFormpageForModal";
import styles from "./style.module.scss";

export default function ModalDetailPage({ open, setOpen, tableSlug, selectedRow, dateInfo, refetch, menuItem, layout, fieldsMap }) {
  const [fullScreen, setFullScreen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setFullScreen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} className="child-position-center">
      <Card className={`${fullScreen ? styles.cardModal : styles.card} PlatformModal`}>
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

        <ObjectsFormPageForModal
          refetch={refetch}
          menuItem={menuItem}
          layout={layout}
          selectedRow={selectedRow}
          tableSlugFromProps={tableSlug}
          handleClose={handleClose}
          modal={true}
          dateInfo={dateInfo}
          setFullScreen={setFullScreen}
          fullScreen={fullScreen}
          fieldsMap={fieldsMap}
        />
      </Card>
    </Modal>
  );
}
