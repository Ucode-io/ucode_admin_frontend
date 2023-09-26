import React from "react";
import HFTextEditor from "../FormElements/HFTextEditor";
import {Box, Button, Modal} from "@mui/material";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import {useWatch} from "react-hook-form";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

export default function MultiLineCellFormElement({
  control,
  computedSlug,
  updateObject,
  isNewTableView = false,
  field,
  isDisabled,
  ...props
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const value = useWatch({
    control,
    name: computedSlug,
  });

  const stripHtmlTags = (input) => {
    return input.replace(/<[^>]*>/g, "");
  };

  return (
    <>
      {stripHtmlTags(
        `${value.slice(0, 200)}${value.length > 200 ? "..." : ""}` ?? ""
      )}
      <Button onClick={handleOpen}>
        <ZoomOutMapIcon />
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <HFTextEditor
            control={control}
            updateObject={updateObject}
            isNewTableView={isNewTableView}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            multiline
            rows={4}
            defaultValue={field.defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            isTransparent={true}
            {...props}
          />
          <Button
            variant="contained"
            style={{
              marginTop: "1rem",
              width: "100%",
            }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}
