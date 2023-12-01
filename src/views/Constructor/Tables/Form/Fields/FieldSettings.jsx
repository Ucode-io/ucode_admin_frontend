import { Close } from "@mui/icons-material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Card, Divider, IconButton, Typography } from "@mui/material";
import { TreeView } from "@mui/x-tree-view";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../../components/FormElements/FRow";
import HFCheckbox from "../../../../../components/FormElements/HFCheckbox";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../../components/FormElements/HFSwitch";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import constructorFieldService, {
  useFieldCreateMutation,
} from "../../../../../services/constructorFieldService";
import constructorObjectService from "../../../../../services/constructorObjectService";
import constructorViewService from "../../../../../services/constructorViewService";
import { useMenuListQuery } from "../../../../../services/menuService";
import { store } from "../../../../../store";
import { fieldTypesOptions } from "../../../../../utils/constants/fieldTypes";
import { generateGUID } from "../../../../../utils/generateID";
import Attributes from "./Attributes";
import DefaultValueBlock from "./Attributes/DefaultValueBlock";
import FieldTreeView from "./FieldTreeView";
import styles from "./style.module.scss";

const FieldSettings = ({
  closeSettingsBlock,
  mainForm,
  selectedTabIndex,
  selectedField,
  field,
  formType,
  height,
  isTableView = false,
  onSubmit = () => {},
  getRelationFields,
  slug,
}) => {
  const { id, appId } = useParams();
  const { handleSubmit, control, reset, watch, setValue } = useForm();
  const [formLoader, setFormLoader] = useState(false);
  const menuItem = store.getState().menu.menuItem;
  const queryClient = useQueryClient();
  const languages = useSelector((state) => state.languages.list);
  const [check, setCheck] = useState(false);
  const [folder, setFolder] = useState("");
  const [validationView, setValidationView] = useState(false);
  const [autofillView, setAutofillView] = useState(false);
  const detectorID = useMemo(() => {
    if (id) {
      return id;
    } else {
      return menuItem?.table_id;
    }
  }, [id, slug]);

  const updateFieldInform = (field) => {
    const fields = mainForm.getValues("fields");
    const index = fields.findIndex((el) => el.id === field.id);

    mainForm.setValue(`fields[${index}]`, field);
    onSubmit(index, field);
  };

  const prepandFieldInForm = (field) => {
    const fields = mainForm.getValues("fields") ?? [];
    mainForm.setValue(`fields`, [field, ...fields]);
  };

  const {
    data: { views, columns, relationColumns } = {
      views: [],
      columns: [],
      relationColumns: [],
    },
    isLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", { slug }],
    () => {
      if (!slug) return false;
      return constructorObjectService.getList(slug, {
        data: { limit: 10, offset: 0, app_id: appId },
      });
    },
    {
      enabled: Boolean(!!slug),
      select: ({ data }) => {
        return {
          views: data?.views ?? [],
          columns: data?.fields ?? [],
          relationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  const { mutate: createNewField, isLoading: createLoading } =
    useFieldCreateMutation({
      onSuccess: (res) => {
        prepandFieldInForm(res);
        closeSettingsBlock(null);
        getRelationFields();
        addColumnToView(res);
      },
    });

  const createField = (field) => {
    const data = {
      ...field,
      id: generateGUID(),
      label: Object.values(field?.attributes).find((item) => item),
      show_label: true,
    };
    if (id || menuItem?.table_id) {
      createNewField({ data, tableSlug: slug });
    } else {
      prepandFieldInForm(data);
      closeSettingsBlock();
    }
  };

  const addColumnToView = (data) => {
    if (isTableView) {
      const computedValues = {
        ...views[selectedTabIndex],
        columns: [...views[selectedTabIndex].columns, data?.id],
      };

      constructorViewService.update(slug, computedValues).then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      });
    }
  };

  const { data: backetOptions } = useMenuListQuery({
    params: {
      parent_id: "8a6f913a-e3d4-4b73-9fc0-c942f343d0b9",
    },
  });
  const updateField = (field) => {
    if (id || menuItem?.table_id) {
      setFormLoader(true);
      constructorFieldService
        .update(field)
        .then((res) => {
          updateFieldInform(field);
          closeSettingsBlock(null);
          getRelationFields();
        })
        .finally(() => setFormLoader(false));
    } else {
      updateFieldInform(field);
      closeSettingsBlock();
    }
  };

  const handleSelect = (e, item) => {
    setValue("attributes.path", item);
    setCheck(true);
    setFolder(item);
  };

  const submitHandler = (values) => {
    const data = {
      ...values,
      attributes: {
        ...values?.attributes,
        number_of_rounds: parseInt(values?.attributes?.number_of_rounds),
      },
    };

    if (formType === "CREATE") createField(data);
    else updateField(data);
  };

  const selectedAutofillTableSlug = useWatch({
    control,
    name: "autofill_table",
  });

  const layoutRelations = useWatch({
    control: mainForm.control,
    name: "layoutRelations",
  });
  const fieldType = useWatch({
    control: control,
    name: "type",
  });

  const selectedAutofillSlug = selectedAutofillTableSlug?.split("#")?.[0];
  const selectedAutofillFieldSlug = selectedAutofillTableSlug?.split("#")?.[1];

  const computedRelationTables = useMemo(() => {
    return layoutRelations?.map((table) => ({
      value: `${table.id?.split("#")?.[0]}#${table?.field_from}`,
      label: table.label,
    }));
  }, [layoutRelations]);

  const { data: computedRelationFields } = useQuery(
    ["GET_TABLE_FIELDS", selectedAutofillSlug],
    () => {
      if (!selectedAutofillSlug) return [];
      return constructorFieldService.getList({
        table_slug: selectedAutofillSlug,
        with_one_relation: true,
      });
    },
    {
      select: (res) => {
        const fields = res?.fields ?? [];
        const oneRelationFields = res?.data?.one_relation_fields ?? [];

        return [...fields, ...oneRelationFields]
          .filter(
            (field) => field.type !== "LOOKUPS" && field?.type !== "LOOKUP"
          )
          .map((el) => ({
            value: el?.path_slug ? el?.path_slug : el?.slug,
            label: el?.label,
          }));
      },
    }
  );
  useEffect(() => {
    const values = {
      attributes: {},
      default: "",
      index: "string",
      label: "",
      required: false,
      slug: "",
      table_id: detectorID,
      type: "",
      relation_field: selectedAutofillFieldSlug,
    };
    if (formType !== "CREATE") {
      reset({
        ...values,
        ...field,
      });
      setFolder(field?.path);
    } else {
      reset(values);
    }
  }, [field, formType, id, menuItem.table_id, reset]);

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <Typography variant="h4">
          {formType === "CREATE" ? "Create field" : "Edit field"}
        </Typography>
        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody} style={{ height }}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className={styles.fieldSettingsForm}
        >
          <Card>
            <Box className="p-2">
              <Typography variant="h4" className={styles.title}>
                General
              </Typography>
              <FRow
                label="Field Label"
                required
                classname={styles.custom_label}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {languages?.map((language) => {
                    const languageFieldName = `attributes.label_${language?.slug}`;
                    const fieldValue = watch({
                      control,
                      name: languageFieldName,
                    });

                    return (
                      <HFTextField
                        className={styles.input}
                        disabledHelperText
                        fullWidth
                        name={`attributes.label_${language?.slug}`}
                        control={control}
                        placeholder={`Field Label (${language?.slug})`}
                        autoFocus
                        defaultValue={fieldValue || selectedField?.label}
                      />
                    );
                  })}
                </Box>
              </FRow>

              <FRow label="Field SLUG" required classname={styles.custom_label}>
                <HFTextField
                  className={styles.input}
                  disabledHelperText
                  fullWidth
                  name="slug"
                  control={control}
                  placeholder="Field SLUG"
                  required
                  withTrim
                />
              </FRow>

              <FRow label="Field type" required classname={styles.custom_label}>
                <HFSelect
                  disabledHelperText
                  name="type"
                  control={control}
                  options={fieldTypesOptions}
                  optionType="GROUP"
                  placeholder="Type"
                  required
                  defaultValue={fieldType}
                  className={styles.input}
                />
              </FRow>

              {(fieldType === "FILE" ||
                fieldType === "VIDEO" ||
                fieldType === "PHOTO" ||
                fieldType === "CUSTOM_IMAGE") && (
                <FRow
                  label="Backet"
                  required
                  classname={styles.custom_label}
                  extra={
                    <>
                      <Typography variant="h6">
                        Selected folder: {folder}
                      </Typography>
                    </>
                  }
                >
                  <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    defaultSelected={folder}
                    onNodeSelect={handleSelect}
                    style={{
                      border: "1px solid #D4DAE2",
                    }}
                  >
                    {backetOptions?.menus?.map((item) => (
                      <FieldTreeView
                        element={item}
                        setCheck={setCheck}
                        check={check}
                        folder={folder}
                      />
                    ))}
                  </TreeView>
                </FRow>
              )}

              {(fieldType === "SINGLE_LINE" || fieldType === "MULTI_LINE") && (
                <HFCheckbox
                  control={control}
                  name="enable_multilanguage"
                  label="Multi language"
                  labelClassName={styles.custom_label}
                />
              )}
            </Box>

            <Attributes control={control} watch={watch} mainForm={mainForm} />
            <Divider />

            <div className="p-2">
              <Typography variant="h4" className={styles.title}>
                Additional
              </Typography>
              <DefaultValueBlock control={control} />
              <Box className={styles.checkbox}>
                <HFCheckbox
                  control={control}
                  name="attributes.disabled"
                  label="Disabled"
                  labelClassName={styles.custom_label}
                />
                <HFCheckbox
                  control={control}
                  name="required"
                  label="Required"
                  labelClassName={styles.custom_label}
                />
                <HFCheckbox
                  control={control}
                  name="unique"
                  label="Avoid duplicate values"
                  labelClassName={styles.custom_label}
                />
              </Box>
            </div>
            <Divider />
            <div className="p-2">
              <Typography
                variant="h4"
                className={styles.validation}
                onClick={() => setValidationView((prev) => !prev)}
              >
                Validation
                {validationView ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </Typography>
              {validationView && (
                <Box mt={1}>
                  <FRow label="Validation" classname={styles.custom_label}>
                    <HFTextField
                      className={styles.input}
                      fullWidth
                      name="attributes.validation"
                      control={control}
                    />
                  </FRow>
                  <FRow
                    label="Validation message"
                    classname={styles.custom_label}
                  >
                    <HFTextField
                      className={styles.input}
                      fullWidth
                      name="attributes.validation_message"
                      control={control}
                    />
                  </FRow>
                </Box>
              )}
            </div>
            <Divider />
            <div className="p-2">
              <Typography
                variant="h4"
                className={styles.validation}
                onClick={() => setAutofillView((prev) => !prev)}
              >
                Autofill settings
                {autofillView ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </Typography>

              {autofillView && (
                <Box mt={1}>
                  <FRow label="Autofill table" classname={styles.custom_label}>
                    <HFSelect
                      disabledHelperText
                      name="autofill_table"
                      control={control}
                      options={computedRelationTables}
                      placeholder="Type"
                      className={styles.input}
                    />
                  </FRow>

                  <FRow label="Autofill field" classname={styles.custom_label}>
                    <HFSelect
                      disabledHelperText
                      name="autofill_field"
                      control={control}
                      options={computedRelationFields}
                      placeholder="Type"
                      className={styles.input}
                    />
                  </FRow>
                  <FRow label="Automatic" classname={styles.custom_label}>
                    <HFCheckbox
                      control={control}
                      name="automatic"
                      label="automatic"
                      labelClassName={styles.custom_label}
                    />
                  </FRow>
                </Box>
              )}
            </div>
            <Divider />
          </Card>
        </form>

        <div className={styles.settingsFooter}>
          <PrimaryButton
            size="large"
            className={styles.button}
            style={{ width: "100%" }}
            onClick={handleSubmit(submitHandler)}
            loader={formLoader || createLoading}
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default FieldSettings;
