import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  Typography,
} from "@mui/material";
import React, {useState} from "react";
import {updateLevel} from "../../../../utils/level";
import {useDispatch} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import erdService from "../../../../services/erdService";
import {showAlert} from "../../../../store/alert/alert.thunk";
import IconGenerator from "../../../IconPicker/IconGenerator";
import ClearIcon from "@mui/icons-material/Clear";
import FileUploadDraggable from "./FileUploadDraggable";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const functionFolder = {
  label: "File Upload",
  type: "USER_FOLDER",
  icon: "documents.svg",
  parent_id: adminId,
  id: "35",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

function FileUploadMenu({level = 1, menuStyle, menuItem}) {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const menuActive = functionFolder?.id === menuItem?.id;

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setData({});
  };

  const clickHandler = (val) => {
    dispatch(menuActions.setMenuItem(functionFolder));
    handleOpen();
  };

  const onUpload = () => {
    setLoader(true);
    erdService.upload(data, {}).then((res) => {
      dispatch(showAlert("Successfully Uploaded", "success"));
      setLoader(false);
      handleClose();
    });
  };

  const activeStyles = {
    backgrounColor: menuActive
      ? menuStyle?.active_background || "#007AFF"
      : menuStyle?.background,
    color: menuActive ? menuStyle?.active_text || "#fff" : menuStyle?.text,
    paddingLeft: updateLevel(level),
    borderRadius: "8px",
    display:
      menuItem.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const labelStyle = {
    paddingLeft: "15px",
    color: menuActive ? menuStyle?.active_text : menuStyle?.text,
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          className="nav-element"
          style={activeStyles}
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label" style={labelStyle}>
            <IconGenerator icon={"upload.svg"} size={18} />
            Upload ERD
          </div>
        </Button>
      </div>

      <Dialog open={openModal} onClose={handleClose}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Add File</Typography>
            <ClearIcon
              color="primary"
              onClick={handleClose}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <Box padding={2}>
            {loader ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <CircularProgress />
              </Box>
            ) : (
              <FileUploadDraggable
                data={data}
                setData={setData}
                loader={loader}
              />
            )}
          </Box>

          <Box
            sx={{
              padding: "0 15px 15px 15px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Button variant="outlined" color="error">
              Cancel
            </Button>
            <Button variant="contained">Upload</Button>
          </Box>
        </Card>
      </Dialog>
    </Box>
  );
}

export default FileUploadMenu;
