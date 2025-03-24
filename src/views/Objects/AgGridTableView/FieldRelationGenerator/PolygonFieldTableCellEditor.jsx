import {Box, Button, Modal} from "@mui/material";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import HFPolygonFieldCellEditor from "./MapCellEditorComponents/HFPolygonFieldCellEditor";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  height: "500px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};
function PolygonFieldTableCellEditor(props) {
  const [open, setOpen] = useState(false);
  const {field, value, setValue} = props;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePolygon = () => {
    handleClose();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "0  0 0 13px",
        }}
        onClick={handleOpen}>
        <span>Polygon</span>
        <Button>
          <LocationSearchingIcon />
        </Button>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box>
            <HFPolygonFieldCellEditor
              width={"740px"}
              height={"400px"}
              field={field}
              onChange={setValue}
              value={value}
            />
          </Box>

          <Box
            sx={{
              bottom: "20px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "20px 0 0 0",
            }}>
            <Button
              sx={{width: "150px"}}
              variant="outlined"
              color="error"
              onClick={handleClose}>
              Cancel
            </Button>
            <Button
              sx={{width: "150px"}}
              variant="contained"
              onClick={updatePolygon}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default PolygonFieldTableCellEditor;
