import ClearIcon from "@mui/icons-material/Clear";
import {Box, Button, Card, Modal, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useQueryClient} from "react-query";
import SaveButton from "../../components/Buttons/SaveButton";
import HFSelect from "../../components/FormElements/HFSelect";
import menuSettingsService from "../../services/menuSettingsService";
import {useMicrofrontendListQuery} from "../../services/microfrontendService";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import HFTextField from "../../components/FormElements/HFTextField";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import { Add, Delete } from "@mui/icons-material";
import styles from "./style.module.scss";
import { store } from "../../store";
import { useSelector } from "react-redux";
import { CloseButton } from "../../components/CloseButton";
import cls from "./style.module.scss";
import TextFieldWithMultiLanguage from "../../components/NewFormElements/TextFieldWithMultiLanguage/TextFieldWithMultiLanguage";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HFAutocomplete from "../../components/FormElements/HFAutocomplete";
import { TrashIcon } from "../../utils/constants/icons";

const MicrofrontendLinkModal = ({
  closeModal,
  loading,
  selectedFolder,
  getMenuList,
}) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, watch } = useForm();

  const company = store.getState().company;
  const languages = useSelector((state) => state.languages.list);
  const { data: microfrontend } = useMicrofrontendListQuery();

  const {
    fields: values,
    append,
    remove,
  } = useFieldArray({
    control: control,
    name: "attributes.params",
  });

  const microfrontendOptions = useMemo(() => {
    return microfrontend?.functions?.map((item, index) => ({
      label: item.name,
      value: item.id,
    }));
  }, [microfrontend]);

  const addField = () => {
    append({
      key: "",
      value: "",
    });
  };

  const onSubmit = (data) => {
    if (selectedFolder?.type === "MICROFRONTEND") {
      updateType(data, selectedFolder);
    } else {
      createType(data, selectedFolder);
    }
  };

  const createType = (data, selectedFolder) => {
    menuSettingsService
      .create({
        ...data,
        parent_id: selectedFolder?.id || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type: "MICROFRONTEND",
        microfrontend_id: data?.microfrontend_id,
      })
      .then(() => {
        if (selectedFolder?.id) {
          queryClient.refetchQueries(["MENU_CHILD"]);
          closeModal();
        } else {
          console.log("entered second");
          getMenuList();
          closeModal();
        }
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
  const deleteField = (index) => {
    remove(index);
  };

  useEffect(() => {
    if (selectedFolder?.type === "MICROFRONTEND")
      menuSettingsService
        .getById(selectedFolder.id, company.projectId)
        .then((res) => {
          reset(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className={cls.modalHeader}>
            <h4 className={cls.modalTitle}>Create microfrontend</h4>
            <CloseButton onClick={closeModal} />
          </div>

          <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
            <Box display={"flex"} flexDirection={"column"} gap={"16px"}>
              <Box>
                <TextFieldWithMultiLanguage
                  control={control}
                  name={`attributes.label`}
                  placeholder="Name"
                  languages={languages}
                  id={"create_table_name"}
                  style={{ width: "100%", height: "36px" }}
                  watch={watch}
                />
                {/* <HFIconPicker name="icon" control={control} /> */}
                {/* {languages?.map((item, index) => (
                  <HFTextField
                    autoFocus
                    fullWidth
                    required
                    label={`Title ${item.slug}`}
                    control={control}
                    name={`attributes.label_${item.slug}`}
                  />
                ))} */}
              </Box>
              <Box display={"flex"} gap="6px">
                <HFIconPicker
                  name="icon"
                  control={control}
                  shape="rectangle"
                  size="md"
                  placeholder={<AddCircleOutlineIcon htmlColor="#98A2B3" />}
                />
                <HFAutocomplete
                  portal={null}
                  name="microfrontend_id"
                  control={control}
                  placeholder="Choose Microfrontend"
                  fullWidth
                  required
                  options={microfrontendOptions}
                />
              </Box>
              {/* <Box
                display={"flex"}
                columnGap={"16px"}
                className="form-elements"
              >
                <HFSelect
                  fullWidth
                  label="Microfrontend"
                  control={control}
                  name="microfrontend_id"
                  options={microfrontendOptions}
                  required
                />
              </Box> */}
            </Box>
            {values?.map((elements, index) => (
              <div key={elements?.key} className={styles.navigateWrap}>
                <HFTextField
                  fullWidth
                  control={control}
                  name={`attributes.params[${index}].key`}
                  placeholder={"key"}
                />
                <HFTextField
                  fullWidth
                  control={control}
                  name={`attributes.params[${index}].value`}
                  placeholder={"value"}
                />
                <button
                  className={styles.deleteBtn}
                  type="button"
                  onClick={() => deleteField(index)}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
            <Button
              className={styles.button}
              variant="outlined"
              fullWidth
              onClick={addField}
              startIcon={<Add />}
            >
              Add params
            </Button>
            <div className={cls.modalFooter}>
              <Button
                variant="contained"
                title="Add"
                type="submit"
                loading={loading}
              >
                Add
              </Button>
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default MicrofrontendLinkModal;
