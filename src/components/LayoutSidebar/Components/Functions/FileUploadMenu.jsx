import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  Typography,
} from "@mui/material";
import React, {useState} from "react";
import IconGenerator from "../../../IconPicker/IconGenerator";
import {useDispatch} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import ClearIcon from "@mui/icons-material/Clear";
import FileUploadWithDraggable from "./FileUploadDraggable";
import erdService from "../../../../services/erdService";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const functionFolder = {
  label: "File upload",
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

function FileUploadMenu({projectSettingLan}) {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState();
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    data.delete("file");
  };

  const clickHandler = (val) => {
    dispatch(menuActions.setMenuItem(functionFolder));
    handleOpen();
  };

  const onUpload = () => {
    setLoader(true);
    erdService
      .upload(data, {})
      .then((res) => {
        dispatch(showAlert("Successfully uploaded", "success"));
        handleClose();
        setLoader(false);
      })
      .catch(() => {})
      .finally(() => setLoader(false));
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={{borderRadius: "8px", height: "32px", fontSize: "13px"}}
          className="nav-element highlight-on-hover"
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label" style={{color: "#475467", fontSize: "13px"}}>
            <IconGenerator icon={"upload.svg"} size={18} />
            {generateLangaugeText(
              projectSettingLan,
              i18n?.language,
              "Upload ERD"
            ) || "Upload ERD"}
          </div>
        </Button>
      </div>

      <Dialog onClose={handleClose} open={openModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Add file</Typography>
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
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <CircularProgress />
              </Box>
            ) : (
              <FileUploadWithDraggable
                data={data}
                loader={loader}
                setData={setData}
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
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button onClick={onUpload} variant="contained">
              Upload
            </Button>
          </Box>
        </Card>
      </Dialog>
    </Box>
  );
}

export default FileUploadMenu;
