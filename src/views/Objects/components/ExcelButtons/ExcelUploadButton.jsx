import { useState } from "react";
import { Upload } from "@mui/icons-material";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { Dialog } from "@mui/material";
import ExcelUploadModal from "./ExcelUploadModal";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {},
});

const ExcelUploadButton = ({ fieldsMap }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const classes = useStyles();
  return (
    <div>
      <RectangleIconButton color="white" onClick={() => handleClick()}>
        <Upload />
      </RectangleIconButton>

      <Dialog className={classes.root} open={open} onClose={handleClose}>
        <ExcelUploadModal fieldsMap={fieldsMap} handleClose={handleClose} />
      </Dialog>
    </div>
  );
};

export default ExcelUploadButton;
