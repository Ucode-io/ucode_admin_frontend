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
import {
  useCustomErrorCreateMutation,
  useCustomErrorUpdateMutation,
} from "../../../../../services/customErrorMessageService";
import HFNumberField from "../../../../../components/FormElements/HFNumberField";
import { useQueryClient } from "react-query";
import HFTextArea from "../../../../../components/FormElements/HFTextArea";

const CustomErrorsSettings = ({
  closeSettingsBlock = () => {},
  customError,
  getRelationFields,
  formType,
  height,
  languages,
}) => {
  const authStore = store.getState().auth;
  const { appId, slug, id } = useParams();
  const [loader, setLoader] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const queryClient = useQueryClient();

  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      project_id: authStore.projectId,
      table_id: id,
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

  const { mutate: create, isLoading: createLoading } =
    useCustomErrorCreateMutation({
      onSuccess: () => {
        closeSettingsBlock(null);
        queryClient.refetchQueries(["CUSTOM_ERROR_MESSAGE"]);
      },
    });

  const { mutate: update, isLoading: updateLoading } =
    useCustomErrorUpdateMutation({
      onSuccess: () => {
        closeSettingsBlock(null);
        queryClient.refetchQueries(["CUSTOM_ERROR_MESSAGE"]);
      },
    });

  const submitHandler = (values) => {
    // const data = {
    //   ...values,
    //   relation_table_slug: slug,
    //   // compute columns
    //   columns: values.columnsList
    //     ?.filter((el) => el.is_checked)
    //     ?.map((el) => el.id),

    //   // compute filters
    //   quick_filters: values.filtersList
    //     ?.filter((el) => el.is_checked)
    //     ?.map((el) => ({
    //       field_id: el.id,
    //       default_value: "",
    //     })),

    //   // compute default value
    //   default_values: values?.default_values
    //     ? Array.isArray(values.default_values)
    //       ? values.default_values
    //       : [values.default_values]
    //     : [],
    // };

    // delete data?.field_name;
    // delete data?.formula_name;

    setFormLoader(true);

    if (formType === "CREATE") {
      // constructorRelationService
      //   .create(values)
      //   .then((res) => {
      //     updateRelations();
      //   })
      //   .finally(() => setFormLoader(false));
      create({
        ...values,
      });
    } else {
      // constructorRelationService
      //   .update(values)
      //   .then((res) => {
      //     updateRelations();
      //   })
      //   .finally(() => setFormLoader(false));
      update({
        ...values,
      });
    }
  };

  useEffect(() => {
    if (formType === "CREATE") return;
    reset({
      ...customError,
    });
  }, [customError]);

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
              <HFNumberField
                name="code"
                control={control}
                placeholder="Type code"
                fullWidth
                required
              />
            </FRow>
            <FRow label="Message" required>
              <HFTextArea
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
              loader={createLoading || updateLoading}
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
