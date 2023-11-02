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
import { useSelector } from "react-redux";
import HFSwitch from "../../components/FormElements/HFSwitch";
const flex = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  columnGap: "6px",
};
const WikiFolderCreateModal = ({
  closeModal,
  loading,
  modalType,
  appId,
  selectedFolder,
  getMenuList,
}) => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const menuItemLabel = useSelector((state) => state.menu.menuItem?.label);

  const onSubmit = (data) => {
    if (modalType === "create") {
      createType(data, selectedFolder);
    } else if (modalType === "parent") {
      createType(data, selectedFolder);
    } else if (modalType === "wiki_update") {
      updateType(data);
    }
  };

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      app_id: appId,
    },
  });

  useEffect(() => {
    if (modalType === "wiki_update")
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
        type: "WIKI_FOLDER",
        label: Object.values(data?.attributes).find((item) => item),
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
        label: Object.values(data?.attributes).find((item) => item),
        type: "WIKI_FOLDER",
      })
      .then(() => {
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const languages = useSelector((state) => state.languages.list);

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
              {languages?.map((language) => {
                const languageFieldName = `attributes.label_${language?.slug}`;
                const fieldValue = watch(languageFieldName);

                return (
                  <HFTextField
                    autoFocus
                    fullWidth
                    label={`Title (${language?.slug})`}
                    control={control}
                    name={`attributes.label_${language?.slug}`}
                    defaultValue={fieldValue || menuItemLabel}
                  />
                );
              })}
            </Box>
            <Box style={flex}>
              <Typography variant="h6">Is visible:</Typography>
              <HFSwitch
                control={control}
                name="is_visible"
                disabledHelperText
              />
            </Box>
            <div className="btns-row">
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

export default WikiFolderCreateModal;
