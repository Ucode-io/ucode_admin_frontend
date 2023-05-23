import { Box, Card, IconButton, Modal, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelButton from "../../components/Buttons/CancelButton";
import CreateButton from "../../components/Buttons/CreateButton";
import SaveButton from "../../components/Buttons/SaveButton";
import { useParams, useSearchParams } from "react-router-dom";
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
  const { projectId } = useParams();
  const [setQueryParams] = useSearchParams();
  const queryClient = useQueryClient();
  const computedOption = useMemo(() => {
    return tableFolder?.map((item, index) => ({
      label: item.title,
      value: item.id,
    }));
  }, []);

  console.log("selectedTable", selectedTable);

  const onSubmit = (data) => {
    console.log("sentdata", data);

    createType(data);
  };

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      //   confirm_by: 1,
      //   name: selectedType?.name ?? "",
      //   self_recover: selectedType?.self_recover ?? false,
      //   self_register: selectedType?.self_register ?? false,
      //   "project-id": projectId,
    },
  });
  console.log("watch", watch());

  const createType = (data) => {
    console.log("sentdata", data);
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
