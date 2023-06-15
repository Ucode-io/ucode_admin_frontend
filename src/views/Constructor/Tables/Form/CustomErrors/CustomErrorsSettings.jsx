import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../../components/FormElements/FRow";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import constructorRelationService from "../../../../../services/constructorRelationService";
import styles from "./style.module.scss";
import { store } from "../../../../../store";
import actionTypes from "./mock/ActionTypes";

const CustomErrorsSettings = ({
  closeSettingsBlock = () => {},
  relation,
  getRelationFields,
  formType,
  height,
  languages,
}) => {
  const authStore = store.getState().auth;
  const { appId, slug } = useParams();
  const [loader, setLoader] = useState(false);
  const [formLoader, setFormLoader] = useState(false);

  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      project_id: authStore.projectId,
    },
  });
  const values = watch();
  console.log("values", values);
  console.log("languages", languages);

  const computedLanguageOptions = useMemo(() => {
    return languages?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [languages]);

  console.log("computedLanguageOptions", computedLanguageOptions);

  const updateRelations = async () => {
    setLoader(true);

    await getRelationFields();

    closeSettingsBlock(null);
    setLoader(false);
  };

  const submitHandler = (values) => {
    const data = {
      ...values,
      relation_table_slug: slug,
      // compute columns
      columns: values.columnsList
        ?.filter((el) => el.is_checked)
        ?.map((el) => el.id),

      // compute filters
      quick_filters: values.filtersList
        ?.filter((el) => el.is_checked)
        ?.map((el) => ({
          field_id: el.id,
          default_value: "",
        })),

      // compute default value
      default_values: values?.default_values
        ? Array.isArray(values.default_values)
          ? values.default_values
          : [values.default_values]
        : [],
    };

    delete data?.field_name;
    delete data?.formula_name;

    setFormLoader(true);

    if (formType === "CREATE") {
      constructorRelationService
        .create(data)
        .then((res) => {
          updateRelations();
        })
        .finally(() => setFormLoader(false));
    } else {
      constructorRelationService
        .update(data)
        .then((res) => {
          updateRelations();
        })
        .finally(() => setFormLoader(false));
    }
  };

  useEffect(() => {
    if (formType === "CREATE") return;
    reset({
      ...relation,
      table_from: relation?.table_from?.slug ?? "",
      table_to: relation?.table_to?.slug ?? "",
      type: relation?.type ?? "",
      id: relation?.id ?? "",
      editable: relation?.editable ?? false,
      summaries: relation?.summaries ?? [],
      view_fields: relation?.view_fields?.map((field) => field.id) ?? [],
    });
  }, [relation]);

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>
          {formType === "CREATE" ? "Create" : "Edit"} Custom Error Message
        </h2>

        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody} style={{ height }}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className={styles.fieldSettingsForm}
        >
          <div className="p-2">
            <FRow label="Code" required>
              <HFTextField
                name="code"
                control={control}
                placeholder="Type code"
                fullWidth
                required
              />
            </FRow>
            <FRow label="Message" required>
              <HFTextField
                name="message"
                control={control}
                placeholder="Type Message"
                fullWidth
                required
              />
            </FRow>
            <FRow label="Error id" required>
              <HFTextField
                name="error_id"
                control={control}
                placeholder="Type Error id"
                fullWidth
                required
              />
            </FRow>
            <FRow label="Languages" required>
              <HFSelect
                name="language_id"
                control={control}
                placeholder="Languages"
                options={computedLanguageOptions}
                autoFocus
                required
              />
            </FRow>
            <FRow label="Action type" required>
              <HFSelect
                name="action_type"
                control={control}
                placeholder="Action type"
                options={actionTypes}
                autoFocus
                required
              />
            </FRow>
          </div>

          {/* <RowBlock control={control} /> */}

          <div className={styles.settingsFooter}>
            <PrimaryButton
              size="large"
              className={styles.button}
              style={{ width: "100%" }}
              onClick={handleSubmit(submitHandler)}
              loader={formLoader || loader}
            >
              Сохранить
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomErrorsSettings;
