import { Box, Card, IconButton, Modal, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelButton from "../../components/Buttons/CancelButton";
import CreateButton from "../../components/Buttons/CreateButton";
import SaveButton from "../../components/Buttons/SaveButton";
import { useForm } from "react-hook-form";
import constructorTableService from "../../services/constructorTableService";
import { useQueryClient } from "react-query";
import HFSelect from "../FormElements/HFSelect";
import { useMemo } from "react";

const FolderModal = ({
  closeModal,
  tableFolder,
  modalType,
  loading,
  selectedTable,
  getAppById,
}) => {
  const queryClient = useQueryClient();
  const computedOption = useMemo(() => {
    return tableFolder?.map((item, index) => ({
      label: item.title,
      value: item.id,
    }));
  }, []);

  const onSubmit = (data) => {
    console.log("sentdata", data);

    createType(data);
  };

  const { control, handleSubmit } = useForm();

  const createType = (data) => {
    constructorTableService
      .update({
        ...selectedTable,
        folder_id: data.folder_id,
      })
      .then(() => {
        queryClient.refetchQueries(["GET_TABLE_FOLDER"]);
        closeModal();
        getAppById();
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
              {modalType === "create" ? "Select folder" : "Select folder"}
            </Typography>
            <IconButton color="primary" onClick={closeModal}>
              <HighlightOffIcon fontSize="large" />
            </IconButton>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <Box display={"flex"} columnGap={"16px"} className="form-elements">
              <HFSelect
                autoFocus
                fullWidth
                label="Title"
                control={control}
                name="folder_id"
                options={computedOption}
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

export default FolderModal;
