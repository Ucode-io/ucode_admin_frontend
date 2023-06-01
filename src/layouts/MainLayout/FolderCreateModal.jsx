import { Box, Card, IconButton, Modal, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelButton from "../../components/Buttons/CancelButton";
import CreateButton from "../../components/Buttons/CreateButton";
import SaveButton from "../../components/Buttons/SaveButton";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import HFTextField from "../../components/FormElements/HFTextField";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import constructorTableService from "../../services/constructorTableService";
import { useQueryClient } from "react-query";
import { useEffect } from "react";

const FolderCreateModal = ({
  closeModal,
  loading,
  modalType,
  appId,
  selectedFolder,
}) => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();

  const onSubmit = (data) => {
    if (modalType === "create") {
      createType(data);
    } else if (modalType === "parent") {
      createType(data, selectedFolder);
    } else if (modalType === "update") {
      updateType(data);
    }
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      app_id: appId,
    },
  });

  useEffect(() => {
    if (modalType === "update")
      constructorTableService
        .getFolderById(selectedFolder.id, projectId)
        .then((res) => {
          reset({ ...res, app_id: appId });
        })
        .catch((err) => {
          console.log(err);
        });
  }, [modalType]);

  const createType = (data, selectedFolder) => {
    constructorTableService
      .createFolder({
        ...data,
        parent_id: modalType === "parent" ? selectedFolder.id : "0",
      })
      .then(() => {
        queryClient.refetchQueries(["GET_TABLE_FOLDER", appId]);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateType = (data, selectedFolder) => {
    constructorTableService
      .updateFolder({
        ...data,
        // parent_id: modalType === "parent" ? selectedFolder.id : "",
        app_id: appId,
      })
      .then((res) => {
        queryClient.refetchQueries(["GET_TABLE_FOLDER", appId]);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {modalType === "create" || modalType === "parent"
                ? "Create folder"
                : "Edit folder"}
            </Typography>
            <IconButton color="primary" onClick={closeModal}>
              <HighlightOffIcon fontSize="large" />
            </IconButton>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <Box display={"flex"} columnGap={"16px"} className="form-elements">
              <HFIconPicker name="icon" control={control} />
              <HFTextField
                autoFocus
                fullWidth
                label="Title"
                control={control}
                name="title"
              />
            </Box>

            <div className="btns-row">
              <CancelButton onClick={closeModal} />
              {modalType === "crete" ? (
                <CreateButton type="submit" loading={loading} />
              ) : (
                <SaveButton type="submit" loading={loading} />
              )}
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default FolderCreateModal;
