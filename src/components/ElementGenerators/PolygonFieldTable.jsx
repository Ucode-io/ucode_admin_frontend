import {Box, Button, Modal} from "@mui/material";
import {useState} from "react";
import HFPolygonField from "../FormElements/HFPolygonField";
import {get} from "@ngard/tiny-get";

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
function PolygonFieldTable({
  control,
  field,
  updateObject,
  computedSlug,
  isNewTableView = false,
  row,
  drawerDetail = false,
  disabled,
  setValue = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [polygonValue, setPolygonValue] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePolygon = () => {
    setValue(computedSlug, polygonValue);
    handleClose();
  };

  return (
    <Box id="polygon_field">
      <Box
        id="polygonField"
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          height: "32px",
          columnGap: "16px",
          width: "330px",
          borderRadius: drawerDetail ? "6px" : "",
          justifyContent: drawerDetail ? "space-between" : "",
          "&:hover": {
            background: "#f7f7f7",
          },
        }}
        onClick={() => {
          if (disabled) return;
          handleOpen();
        }}
      >
        <Box
          sx={{
            fontSize: drawerDetail ? "13px" : "11px",
            color: polygonValue ? "#212b36" : "#adb5bd",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          Polygon
        </Box>
        <img src="/table-icons/polygon.svg" alt="Polygon" />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box>
            <HFPolygonField
              disabled={disabled}
              width={"740px"}
              height={"400px"}
              control={control}
              field={field}
              updateObject={updateObject}
              name={computedSlug}
              isNewTableView={isNewTableView}
              setValue={setPolygonValue}
              polygonValue={polygonValue || []}
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
            }}
          >
            <Button
              sx={{ width: "150px" }}
              variant="outlined"
              color="error"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              disabled={disabled}
              sx={{ width: "150px" }}
              variant="contained"
              onClick={updatePolygon}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default PolygonFieldTable;
