import React, { useState } from "react";
import { Box, Button, Dialog, TextField } from "@mui/material";
import HFMapField from "./HFMapField";
import { useWatch } from "react-hook-form";
import styles from "./style.module.scss";
import { generateLink } from "../../utils/generateYandexLink";

function HFModalMap({
  control,
  field,
  defaultValue,
  isFormEdit,
  name,
  required,
}) {
  const [open, setOpen] = useState(false);

  const value = useWatch({
    control,
    name,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TextField
        value={value ? generateLink(value?.split(',')?.[0], value?.split(',')?.[1]) : ''}
        defaultValue={defaultValue}
        width="small"
        onClick={() => handleOpen()}
        sx={{width: '100%'}}
      />

      <Dialog open={open} onClose={handleClose}>
        <div className={styles.mapField}>
          <HFMapField
            field={field}
            width={"500px"}
            height={"400px"}
            control={control}
            name={name}
            defaultValue={defaultValue}
          />

          <Box>
            <Button onClick={handleClose} variant="outlined" color="error">Cancel</Button>
            <Button onClick={handleClose} sx={{marginLeft: '10px'}} variant="outlined">Confirm</Button>
          </Box>
        </div>
      </Dialog>
    </>
  );
}

export default HFModalMap;
