import {
  Box,
  Button,
  Card,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
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
import { useEffect, useMemo, useState } from "react";
import menuSettingsService from "../../services/menuSettingsService";
import HFSelect from "../../components/FormElements/HFSelect";
import ClearIcon from "@mui/icons-material/Clear";
const TableLinkModal = ({
  closeModal,
  loading,
  modalType,
  appId,
  selectedFolder,
  getMenuList,
}) => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const [tables, setTables] = useState();

  const onSubmit = (data) => {
    console.log("data", data);
    if (selectedFolder.type === "TABLE") {
      updateType(data, selectedFolder);
    } else {
      createType(data, selectedFolder);
    }
  };

  console.log("selectedFolder", selectedFolder);

  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (selectedFolder.type === "TABLE")
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
    console.log("data", data);
    menuSettingsService
      .create({
        ...data,
        parent_id: selectedFolder?.id || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type: "TABLE",
        table_id: data?.table_id,
      })
      .then(() => {
        closeModal();
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
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
    constructorTableService.getList().then((res) => {
      setTables(res);
    });
  };

  useEffect(() => {
    getTables();
  }, []);

  const tableOptions = useMemo(() => {
    return tables?.tables?.map((item, index) => ({
      label: item.label,
      value: item.id,
    }));
  }, [tables]);
  console.log("tableOptions", tableOptions);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Привязать table</Typography>
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
              <HFSelect
                fullWidth
                label="Tables"
                control={control}
                name="table_id"
                options={tableOptions}
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

export default TableLinkModal;
