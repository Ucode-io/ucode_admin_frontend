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
import {store} from "../../store";
import {useSelector} from "react-redux";
import { CloseButton } from "../../components/CloseButton";
import cls from "./style.module.scss";
import TextFieldWithMultiLanguage from "../../components/NewFormElements/TextFieldWithMultiLanguage/TextFieldWithMultiLanguage";

const WebsiteModal = ({
  closeModal = () => {},
  loading,
  selectedFolder,
  getMenuList = () => {},
}) => {
  console.log("selectedFolderselectedFolder", selectedFolder);
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

  const onSubmit = (data) => {
    if (!selectedFolder?.data) {
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
        type: "LINK",
      })
      .then(() => {
        if (selectedFolder?.id) {
          queryClient.refetchQueries(["MENU_CHILD"], selectedFolder?.id);
          closeModal();
        } else {
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

  useEffect(() => {
    if (selectedFolder?.data)
      menuSettingsService
        .getById(selectedFolder?.id, company.projectId)
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
            <h4 className={cls.modalTitle}>Website Link</h4>
            <CloseButton onClick={closeModal} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={cls.form}>
            <Box display={"flex"} flexDirection={"column"} gap={"16px"}>
              <Box
                display={"flex"}
                columnGap={"16px"}
                className="form-elements"
              >
                <TextFieldWithMultiLanguage
                  control={control}
                  name={`attributes.label`}
                  placeholder="Name"
                  languages={languages}
                  id={"create_table_name"}
                  style={{ width: "100%", height: "36px" }}
                  watch={watch}
                />
                {/* <HFIconPicker name="icon" control={control} />
                {languages?.map((item, index) => (
                  <>
                    <HFTextField
                      autoFocus
                      fullWidth
                      required
                      label={`Title ${item.slug}`}
                      control={control}
                      name={`attributes.label_${item.slug}`}
                    />
                  </>
                ))} */}
              </Box>
              <Box>
                <HFTextField
                  autoFocus
                  fullWidth
                  required
                  placeholder={"Website link"}
                  // label={`Title ${item.slug}`}
                  control={control}
                  name={`attributes.website_link`}
                />
              </Box>
            </Box>
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

export default WebsiteModal;
