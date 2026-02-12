import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

const AddCustomPermissionModal = ({
  open,
  handleClose,
  onSubmit,
  selectedRow,
}) => {
  const { register, handleSubmit, reset } = useForm();

  const onFormSubmit = (data) => {
    onSubmit({
      title: data.title,
      attributes: {
        description: data.description,
      },
      ...(selectedRow ? { parent_id: selectedRow.custom_permission_id } : {}),
    });
    reset();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {selectedRow ? "Add Child Permission" : "Add Custom Permission"}
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {selectedRow && (
            <TextField
              label="Parent Permission"
              variant="outlined"
              size="small"
              fullWidth
              disabled
              value={selectedRow.title}
            />
          )}
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            fullWidth
            required
            {...register("title", { required: true })}
          />
          <TextField
            label="Description"
            variant="outlined"
            size="small"
            fullWidth
            {...register("description")}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onFormSubmit)}
          variant="contained"
          color="primary"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomPermissionModal;
