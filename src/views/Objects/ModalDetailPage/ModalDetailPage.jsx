import { Close } from "@mui/icons-material";
import { Box, Card, IconButton, Modal } from "@mui/material";
import React from "react";
import styles from "./style.module.scss";
import NewRelationSection from "../RelationSection/NewRelationSection";
import ObjectsFormPage from "../ObjectsFormPage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  minHeight: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "6px",
  boxShadow: 24,
};

export default function ModalDetailPage({ open, setOpen, tableSlug }) {
  const handleClose = () => setOpen(false);
  return (
    <Modal open={open} onClose={handleClose} className="child-position-center">
      
        <Card className={`${styles.card} PlatformModal`}>
          <div className={styles.header}>
            <div className={styles.cardTitle}>View settings</div>
            <IconButton className={styles.closeButton} onClick={handleClose}>
              <Close className={styles.closeIcon} />
            </IconButton>
          </div>

          <ObjectsFormPage tableSlugFromProps={tableSlug} handleClose={handleClose} modal={true}/>
        </Card>
      
    </Modal>
  );
}
