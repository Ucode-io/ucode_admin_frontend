import ClearIcon from "@mui/icons-material/Clear";
import { Box, Card, Modal, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import SaveButton from "../../components/Buttons/SaveButton";
import HFSelect from "../../components/FormElements/HFSelect";
import menuSettingsService from "../../services/menuSettingsService";
import microfrontendService from "../../services/microfrontendService";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import HFTextField from "../../components/FormElements/HFTextField";

const MicrofrontendLinkModal = ({
  closeModal,
  loading,
  selectedFolder,
  getMenuList,
}) => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const [list, setList] = useState();

  const onSubmit = (data) => {
    if (selectedFolder.type === "MICROFRONTEND") {
      updateType(data, selectedFolder);
    } else {
      createType(data, selectedFolder);
    }
  };

  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (selectedFolder.type === "MICROFRONTEND")
      menuSettingsService
        .getById(selectedFolder.id, projectId)
        .then((res) => {
          reset(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);

  const createType = (data, selectedFolder) => {
    menuSettingsService
      .create({
        ...data,
        parent_id: selectedFolder?.id || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type: "MICROFRONTEND",
        microfrontend_id: data?.microfrontend_id,
      })
      .then(() => {
        closeModal();
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
        getMenuList();
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
        closeModal();
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTables = () => {
    microfrontendService.getList().then((res) => {
      setList(res);
    });
  };

  useEffect(() => {
    getTables();
  }, []);

  const microfrontendOptions = useMemo(() => {
    return list?.functions?.map((item, index) => ({
      label: item.name,
      value: item.id,
    }));
  }, [list]);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Привязать microfrontend</Typography>
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
              <HFTextField
                autoFocus
                fullWidth
                label="Title"
                control={control}
                name="label"
              />
            </Box>
            <Box display={"flex"} columnGap={"16px"} className="form-elements">
              <HFSelect
                fullWidth
                label="Microfrontend"
                control={control}
                name="microfrontend_id"
                options={microfrontendOptions}
              />
            </Box>

            <div className="btns-row">
              <SaveButton title="Добавить" type="submit" loading={loading} />
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default MicrofrontendLinkModal;
