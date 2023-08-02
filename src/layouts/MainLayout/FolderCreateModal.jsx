import { Box, Card, Modal, Typography } from "@mui/material";
import CreateButton from "../../components/Buttons/CreateButton";
import SaveButton from "../../components/Buttons/SaveButton";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import HFTextField from "../../components/FormElements/HFTextField";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import { useQueryClient } from "react-query";
import { useEffect } from "react";
import menuSettingsService from "../../services/menuSettingsService";
import ClearIcon from "@mui/icons-material/Clear";

const FolderCreateModal = ({ closeModal, loading, modalType, appId, selectedFolder, getMenuList }) => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();

  const onSubmit = (data) => {
    const computedData = {
      ...data,
      label: data.label.length ? data.label : data.label_uz.length ? data.label_uz : data.label_en,
      label_uz: data.label_uz.length ? data.label_uz : data.label.length ? data.label : data.label_en,
      label_en: data.label_en.length ? data.label_en : data.label.length ? data.label : data.label_uz,
    };

    if (modalType === "create") {
      createType(computedData, selectedFolder);
    } else if (modalType === "parent") {
      createType(computedData, selectedFolder);
    } else if (modalType === "update") {
      updateType(computedData);
    }
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      app_id: appId,
    },
  });

  useEffect(() => {
    if (modalType === "update")
      menuSettingsService
        .getById(selectedFolder.id, projectId)
        .then((res) => {
          reset(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [modalType]);

  const createType = (data, selectedFolder) => {
    menuSettingsService
      .create({
        ...data,
        parent_id: selectedFolder?.id || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type: selectedFolder?.type || "FOLDER",
        label: data.label,
      })
      .then(() => {
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
        getMenuList();
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateType = (data, selectedFolder) => {
    menuSettingsService
      .update({
        ...data,
      })
      .then(() => {
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
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
            <Typography variant="h4">{modalType === "create" || modalType === "parent" ? "Create folder" : "Edit folder"}</Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <Box display={"flex"} columnGap={"16px"} className="form-elements">
              <HFIconPicker name="icon" control={control} />
              <HFTextField autoFocus fullWidth label="Title (RU)" control={control} name="label" />
              <HFTextField fullWidth label="Title (EN)" control={control} name="label_en" />
              <HFTextField fullWidth label="Title (UZ)" control={control} name="label_uz" />
            </Box>

            <div className="btns-row">{modalType === "crete" ? <CreateButton type="submit" loading={loading} /> : <SaveButton type="submit" loading={loading} />}</div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default FolderCreateModal;
