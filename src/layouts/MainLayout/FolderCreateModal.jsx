import { Box, Card, IconButton, Modal, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelButton from "../../components/Buttons/CancelButton";
import CreateButton from "../../components/Buttons/CreateButton";
import SaveButton from "../../components/Buttons/SaveButton";
import { useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import HFTextField from "../../components/FormElements/HFTextField";
import HFCheckbox from "../../components/FormElements/HFCheckbox";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import constructorTableService from "../../services/constructorTableService";
import { useQueryClient } from "react-query";

const FolderCreateModal = ({
  closeModal,
  updateType,
  loading,
  modalType,
  selectedType,
  appId,
  selectedFolder,
}) => {
  const { projectId } = useParams();
  const [setQueryParams] = useSearchParams();
  const queryClient = useQueryClient();

  const onSubmit = (data) => {
    if (modalType === "create") {
      createType(data);
    } else if (modalType === "parent") {
      createType(data, selectedFolder);
    }

    // updateType({
    //   ...selectedType,
    //   ...data,
    // });
  };

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      //   confirm_by: 1,
      //   name: selectedType?.name ?? "",
      //   self_recover: selectedType?.self_recover ?? false,
      //   self_register: selectedType?.self_register ?? false,
      //   "project-id": projectId,
      app_id: appId,
    },
  });
  console.log("watch", watch());

  const createType = (data, selectedFolder) => {
    constructorTableService
      .createFolder({
        ...data,
        parent_id: modalType === "parent" ? selectedFolder.id : "",
      })
      .then(() => {
        queryClient.refetchQueries([
          "GET_TABLE_FOLDER",
          //   { scenarioId: scenarioId },
        ]);
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
              {modalType === "create" ? "Create folder" : "Edit folder"}
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
              {modalType === "typeCreate" ? (
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
