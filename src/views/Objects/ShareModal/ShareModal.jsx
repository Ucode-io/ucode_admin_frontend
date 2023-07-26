import { Button, Dialog } from "@mui/material";
import HexagonIcon from "@mui/icons-material/Hexagon";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ShareContent from "./ShareModalContent/ShareContent";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styles from './styles.module.scss'

function ShareModal() {
  const [open, setOpen] = useState(false);
  const { tableSlug } = useParams();
  const client_type_id = useSelector((state) => state.auth.clientType?.id);
  const role_id = useSelector((state) => state.auth.roleInfo?.id);
  const projectId = useSelector((state) => state.auth.projectId);

  const { control, reset, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      client_type: client_type_id,
      guid: role_id,
      project_id: projectId,
      table: {
        record_permissions: {},
        field_permissions: [],
        view_permissions: [],
        action_permissions: [],
        client_type_default: client_type_id,
        role_id_default: role_id,
        slug: tableSlug,
        id: ''
      }
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValue('guid', role_id)
    setValue('client_type', client_type_id)
  };

  return (
    <>
      <Button onClick={handleClickOpen} variant="outlined">
        <HexagonIcon />
        Share modal
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.dialog}
      >
        <ShareContent
          handleClose={handleClose}
          control={control}
          reset={reset}
          watch={watch}
          setValue={setValue}
          handleSubmit={handleSubmit}
        />
      </Dialog>
    </>
  );
}

export default ShareModal;
