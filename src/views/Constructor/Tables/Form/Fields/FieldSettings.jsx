import { Close } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SettingsIcon from "@mui/icons-material/Settings";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../../components/FormElements/FRow";
import HFIconPicker from "../../../../../components/FormElements/HFIconPicker";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../../components/FormElements/HFSwitch";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import constructorFieldService from "../../../../../services/constructorFieldService";
import { fieldTypesOptions } from "../../../../../utils/constants/fieldTypes";
import { generateGUID } from "../../../../../utils/generateID";
import Attributes from "./Attributes";
import DefaultValueBlock from "./Attributes/DefaultValueBlock";
import styles from "./style.module.scss";
import { store } from "../../../../../store";
import { add } from "date-fns";
import constructorObjectService from "../../../../../services/constructorObjectService";
import constructorViewService from "../../../../../services/constructorViewService";
import { useSelector } from "react-redux";

const FieldSettings = ({ closeSettingsBlock, mainForm, selectedTabIndex, selectedField, field, formType, height, isTableView = false, onSubmit = () => {}, getRelationFields }) => {
  const { id, tableSlug, appId } = useParams();
  const { handleSubmit, control, reset, watch } = useForm();
  const [formLoader, setFormLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const menuItem = store.getState().menu.menuItem;
  const queryClient = useQueryClient();
  const languages = useSelector((state) => state.languages.list);
  const detectorID = useMemo(() => {
    if (id) {
      return id;
    } else {
      return menuItem?.table_id;
    }
  }, [id, tableSlug]);

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

  const showTooltip = useWatch({
    control,
    name: "attributes.showTooltip",
  });

  const {
    data: { views, columns, relationColumns } = {
      views: [],
      columns: [],
      relationColumns: [],
    },
    isLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", { tableSlug }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { limit: 10, offset: 0, with_relations: true, app_id: appId },
      });
    },
    {
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

  const createField = (field) => {
    const data = {
      ...field,
      id: generateGUID(),
      label: Object.values(field?.attributes).find((item) => item),
    };

    if (id || menuItem?.table_id) {
      setFormLoader(true);
      constructorFieldService
        .create(data)
        .then((res) => {
          prepandFieldInForm(res);
          closeSettingsBlock(null);
          getRelationFields();
          addColumnToView(res);
        })
        .finally(() => setFormLoader(false));
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

      constructorViewService.update(computedValues).then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      });
    }
  };

  const updateField = (field) => {
    if (!id || !menuItem?.table_id) {
      updateFieldInform(field);
      closeSettingsBlock();
    } else {
      setFormLoader(true);
      constructorFieldService
        .update(field)
        .then((res) => {
          updateFieldInform(field);
          closeSettingsBlock(null);
          getRelationFields();
        })
        .finally(() => setFormLoader(false));
    }
  };

  const submitHandler = (values) => {
    const data = {
      ...values,
      attributes: {
        ...values?.attributes,
        number_of_rounds: parseInt(values?.attributes?.number_of_rounds)
      }
    }

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
          .filter((field) => field.type !== "LOOKUPS" && field?.type !== "LOOKUP")
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
    } else {
      reset(values);
    }
  }, [field, formType, id, menuItem.table_id, reset]);

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>{formType === "CREATE" ? "Create field" : "Edit field"}</h2>

        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody} style={{ height }}>
        <form onSubmit={handleSubmit(submitHandler)} className={styles.fieldSettingsForm}>
          <Tabs direction={"ltr"} selectedIndex={selectedTab} onSelect={setSelectedTab}>
            <div>
              <Card>
                <TabList
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    borderBottom: "3px solid #E5E9EB",
                  }}
                >
                  <Tab
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                    selectedClassName={styles.selectedTab}
                  >
                    <SettingsIcon style={{ width: "20px", height: "20px" }} />
                  </Tab>
                  <Tab
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                    selectedClassName={styles.selectedTab}
                  >
                    <FlashOnIcon style={{ width: "20px", height: "20px" }} />
                  </Tab>
                </TabList>

                <TabPanel>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                      <h2>Field settings</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <div className="p-2">
                        <FRow label="Field Label and icon" required>
                          <div className="flex align-center gap-1">
                            <HFIconPicker control={control} name="attributes.icon" shape="rectangle" />
                          </div>
                        {/* selectedField */}
                        <Box style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {
                        languages?.map((language) => {
                          const languageFieldName = `attributes.label_${language?.slug}`;
                          const fieldValue = useWatch({
                            control,
                            name: languageFieldName
                          });

                          return (
                            <HFTextField
                            disabledHelperText
                            fullWidth
                            name={`attributes.label_${language?.slug}`}
                            control={control}
                            placeholder={`Field Label (${language?.slug})`}
                            autoFocus
                            defaultValue={fieldValue || selectedField?.label} 
                          />
                          );
                        })
                      }
                       </Box> 
{/* 
                          <Box style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {languages?.map((lang) => (
                              <HFTextField
                                disabledHelperText
                                fullWidth
                                name={`attributes.label_${lang?.slug}`}
                                control={control}
                                placeholder={`Field Label (${lang?.slug})`}
                                autoFocus
                              />
                            ))}
                          </Box> */}
                        </FRow>

                        <FRow label="Field SLUG" required>
                          <HFTextField disabledHelperText fullWidth name="slug" control={control} placeholder="Field SLUG" required withTrim />
                        </FRow>

                        <FRow label="Field type" required>
                          <HFSelect disabledHelperText name="type" control={control} options={fieldTypesOptions} optionType="GROUP" placeholder="Type" required />
                        </FRow>

                        {(fieldType === "SINGLE_LINE" || fieldType === "MULTI_LINE") && (
                          <FRow style={{ marginTop: "15px" }} label="Multi language">
                            <HFSwitch control={control} name="enable_multilanguage" label="" className="mb-1" />
                          </FRow>
                        )}
                      </div>

                      <Attributes control={control} watch={watch} mainForm={mainForm} />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                      <h2>Appearance</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <div className="p-2">
                        <HFSwitch control={control} name="attributes.show_label" label="Show label" className="mb-1" />

                        <DefaultValueBlock control={control} />

                        <HFSwitch control={control} name="attributes.showTooltip" label="Show tooltip" className="mb-1" />

                        {showTooltip && (
                          <FRow label="Tooltip text">
                            <HFTextField fullWidth name="attributes.tooltipText" control={control} />
                          </FRow>
                        )}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </TabPanel>

                <TabPanel>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                      <h2>Validation</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <div className="p-2">
                        <HFSwitch control={control} name="attributes.disabled" label="Disabled" />
                        <HFSwitch control={control} name="required" label="Required" />
                        <HFSwitch control={control} name="unique" label="Avoid duplicate values" />
                        <HFSwitch control={control} name="attributes.creatable" label="Can create" />
                        <FRow label="Validation">
                          <HFTextField fullWidth name="attributes.validation" control={control} />
                        </FRow>
                        <FRow label="Validation message">
                          <HFTextField fullWidth name="attributes.validation_message" control={control} />
                        </FRow>
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                      <h2>Autofill settings</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <div className="p-2">
                        <FRow label="Autofill table">
                          <HFSelect disabledHelperText name="autofill_table" control={control} options={computedRelationTables} placeholder="Type" />
                        </FRow>

                        <FRow label="Autofill field">
                          <HFSelect disabledHelperText name="autofill_field" control={control} options={computedRelationFields} placeholder="Type" />
                        </FRow>
                        <FRow label="Automatic">
                          <HFSwitch control={control} name="automatic" label="automatic" />
                        </FRow>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </TabPanel>
              </Card>
            </div>
          </Tabs>
        </form>

        <div className={styles.settingsFooter}>
          <PrimaryButton size="large" className={styles.button} style={{ width: "100%" }} onClick={handleSubmit(submitHandler)} loader={formLoader}>
            Сохранить
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default FieldSettings;
