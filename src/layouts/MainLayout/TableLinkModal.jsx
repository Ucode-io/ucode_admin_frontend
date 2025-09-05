import ClearIcon from "@mui/icons-material/Clear";
import {Box, Card, Modal, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useQueryClient} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import SaveButton from "../../components/Buttons/SaveButton";
import constructorTableService from "../../services/constructorTableService";
import menuSettingsService from "../../services/menuSettingsService";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import HFTextField from "../../components/FormElements/HFTextField";
import HFAutocomplete from "../../components/FormElements/HFAutocomplete";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import menuService from "../../services/menuService";
import { CloseButton } from "../../components/CloseButton";
import cls from "./style.module.scss";
import TextFieldWithMultiLanguage from "../../components/NewFormElements/TextFieldWithMultiLanguage/TextFieldWithMultiLanguage";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const TableLinkModal = ({
  closeModal,
  loading,
  selectedFolder,
  setSelectedFolder = () => {},
  getMenuList = () => {},
}) => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const [tables, setTables] = useState();
  const languages = useSelector((state) => state.languages.list);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  const { control, handleSubmit, reset, watch, getValues } = useForm({
    defaultValues: {
      attributes: {
        label_en: "",
        label_ru: "",
      },
    },
  });
  console.log(getValues());

  const tableOptions = useMemo(() => {
    return tables?.tables?.map((item, index) => ({
      label: item.label,
      value: item.id,
    }));
  }, [tables]);

  const onSubmit = (data) => {
    if (selectedFolder?.type === "TABLE") {
      updateType(data, selectedFolder);
    } else {
      createType(data, selectedFolder);
    }
  };

  const createType = (data, selectedFolder) => {
    setIsLoading(true);
    menuSettingsService
      .create({
        ...data,
        parent_id: selectedFolder?.id || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type: "TABLE",
        table_id: data?.table_id,
        label: Object.values(data?.attributes).find((item) => item),
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
      })
      .finally(() => {
        setIsLoading(false);
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
      })
      .finally(() => setIsLoading(false));
  };

  const getTables = (search) => {
    constructorTableService
      .getList({
        search: search || undefined,
      })
      .then((res) => {
        setTables(res);
      });
  };

  useEffect(() => {
    if (selectedFolder?.type === "TABLE")
      menuSettingsService
        .getById(selectedFolder.id, projectId)
        .then((res) => {
          reset(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [selectedFolder]);

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
        .getByID({
          menuId: searchParams.get("menuId"),
        })
        .then((res) => {
          setMenuItem(res);
        });
    }
  }, []);

  useEffect(() => {
    getTables();
  }, []);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className={cls.modalHeader}>
            <h4 className={cls.modalTitle}>Attach to table</h4>
            <CloseButton onClick={closeModal} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <Box display={"flex"} flexDirection={"column"} gap={"16px"}>
              <Box>
                <TextFieldWithMultiLanguage
                  control={control}
                  name="attributes.label"
                  placeholder="Name"
                  languages={languages}
                  id={"text_field_label"}
                  style={{ width: "100%", height: "36px" }}
                  watch={watch}
                />

                {/* {languages?.map((language) => {
                  const languageFieldName = `attributes.label_${language?.slug}`;
                  const fieldValue = watch(languageFieldName);

                  return (
                    <HFTextField
                      autoFocus
                      fullWidth
                      label={`Title (${language?.slug})`}
                      control={control}
                      required
                      name={`attributes.label_${language?.slug}`}
                      defaultValue={fieldValue || menuItem?.label}
                    />
                  );
                })} */}
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
                  name="table_id"
                  control={control}
                  placeholder="Choose table"
                  fullWidth
                  required
                  options={tableOptions}
                  onFieldChange={(e) => {
                    getTables(e.target.value);
                  }}
                />
              </Box>
            </Box>

            <div className="btns-row">
              <SaveButton
                disabled={isLoading}
                title="Add"
                type="submit"
                loading={isLoading}
              />
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default TableLinkModal;
