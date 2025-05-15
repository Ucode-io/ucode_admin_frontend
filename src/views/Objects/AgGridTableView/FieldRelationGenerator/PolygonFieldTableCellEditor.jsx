import {Box, Button, Modal} from "@mui/material";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import HFPolygonFieldCellEditor from "./MapCellEditorComponents/HFPolygonFieldCellEditor";
import RowClickButton from "../RowClickButton";

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
  const {value, setValue, data, colDef} = props;

  const field = props?.colDef?.fieldObj;

  const disabled =
    field?.attributes?.disabled ||
    !field?.attributes?.field_permission?.edit_permission;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePolygon = () => {
    handleClose();
  };

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#0000",

        "&:hover .rowClickButton": {
          display: "block",
        },
      }}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0  14px 0 13px",
          }}
          onClick={() => !disabled && handleOpen()}>
          <Box>
            <span>Polygon</span>
            <Button>
              <LocationSearchingIcon />
            </Button>
          </Box>

          {disabled && (
            <Box>
              <img src="/table-icons/lock.svg" alt="lock" />
            </Box>
          )}
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
      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} />
      {/* )} */}
    </Box>
  );
}

export default PolygonFieldTableCellEditor;
