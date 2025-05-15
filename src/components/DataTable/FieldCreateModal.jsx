import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import {Box, Button, Card, Menu, Popover, Typography} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {useFieldArray, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery, useQueryClient} from "react-query";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import constructorTableService from "../../services/constructorTableService";

import {useRelationGetByIdQuery} from "../../services/relationService";
import {applyDrag} from "../../utils/applyDrag";
import {
  FormatOptionType,
  FormatTypes,
  ValueTypes,
  fieldFormats,
  formatIncludes,
  math,
  newFieldTypes,
} from "../../utils/constants/fieldTypes";
import {colorList} from "../ColorPicker/colorList";
import FRow from "../FormElements/FRow";
import HFSelect from "../FormElements/HFSelect";
import HFSwitch from "../FormElements/HFSwitch";
import HFTextArea from "../FormElements/HFTextArea";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMultiLanguage from "../FormElements/HFTextFieldWithMultiLanguage";
import RelationFieldForm from "./RelationFieldForm";
import style from "./field.module.scss";
import "./style.scss";
import constructorFieldService, {
  useFieldsListQuery,
} from "../../services/constructorFieldService";
import StatusFieldSettings from "../../views/Constructor/Tables/Form/Fields/StatusFieldSettings";
import { generateLangaugeText } from "../../utils/generateLanguageText";
import FormulaFilters from "../../views/Constructor/Tables/Form/Fields/Attributes/FormulaFilters";
import constructorRelationService from "../../services/constructorRelationService";
import { listToMap } from "../../utils/listToMap";

const formulaTypes = [
  { label: "Сумма", value: "SUMM" },
  { label: "Максимум", value: "MAX" },
  { label: "Среднее", value: "AVG" },
];

const formulaFormatOptions = [
  {
    label: "Formula frontend",
    label_ru: "Формула frontend",
    label_en: "Formula frontend",
    label_uz: "Formula frontend",
    value: "FORMULA_FRONTEND",
    icon: "plus-minus.svg",
  },
  {
    label: "Formula backend",
    label_ru: "Формула backend",
    label_en: "Formula backend",
    label_uz: "Formula backend",
    value: "FORMULA",
    icon: "plus-minus.svg",
  },
];

export default function FieldCreateModal({
  tableLan,
  anchorEl,
  setAnchorEl,
  watch,
  control,
  setValue,
  handleSubmit,
  onSubmit,
  setFieldOptionAnchor,
  target,
  reset,
  fieldData,
  handleOpenFieldDrawer,
  menuItem,
  mainForm,
}) {
  const { tableSlug, id } = useParams();
  const tableRelations = useWatch({
    control: mainForm.control,
    name: "tableRelations",
  });

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList(
        {
          table_id: id,
        },
        tableSlug
      );

      const getRelations = constructorRelationService.getList(
        {
          table_slug: tableSlug,
          relation_table_slug: tableSlug,
        },
        tableSlug
      );
      const [{ relations = [] }, { fields = [] }] = await Promise.all([
        getRelations,
        getFieldsData,
      ]);
      mainForm.setValue("fields", fields);
      const relationsWithRelatedTableSlug = relations?.map((relation) => ({
        ...relation,
        relatedTableSlug:
          relation.table_to?.slug === tableSlug ? "table_from" : "table_to",
      }));

      const layoutRelations = [];
      const tableRelations = [];

      relationsWithRelatedTableSlug?.forEach((relation) => {
        if (
          (relation.type === "Many2One" &&
            relation.table_from?.slug === tableSlug) ||
          (relation.type === "One2Many" &&
            relation.table_to?.slug === tableSlug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === tableSlug)
        ) {
          layoutRelations.push(relation);
        } else {
          tableRelations.push(relation);
        }
      });

      const layoutRelationsFields = layoutRelations.map((relation) => ({
        ...relation,
        id: `${relation[relation.relatedTableSlug]?.slug}#${relation.id}`,
        attributes: {
          fields: relation.view_fields ?? [],
        },
        label:
          (relation?.label ?? relation[relation.relatedTableSlug]?.label)
            ? relation[relation.relatedTableSlug]?.label
            : relation?.title,
      }));

      mainForm.setValue("relations", relations);
      mainForm.setValue("relationsMap", listToMap(relations));
      mainForm.setValue("layoutRelations", layoutRelationsFields);
      mainForm.setValue("tableRelations", tableRelations);
      resolve();
    });
  };

  useEffect(() => {
    getRelationFields();
  }, [id, tableSlug]);

  const format = useWatch({
    control,
    name: "attributes.format",
  });

  const fieldWatch = useWatch({
    control,
  });

  const type = useWatch({
    control,
    name: "attributes.type",
  });

  const selectedTableSlug = useWatch({
    control,
    name: "attributes.table_from",
  });

  console.log({ fieldData });

  const [fields, setFields] = useState([]);
  const [colorEl, setColorEl] = useState(null);
  const [mathEl, setMathEl] = useState(null);
  const [idx, setIdx] = useState(null);
  const languages = useSelector((state) => state.languages.list);
  const mathType = watch("attributes.math");
  const values = watch();
  const { i18n } = useTranslation();

  const { isLoading: relationLoading } = useRelationGetByIdQuery({
    tableSlug: tableSlug,
    id: fieldData?.attributes?.relation_data?.id,
    queryParams: {
      enabled: Boolean(fieldData?.attributes?.relation_data?.id),
      onSuccess: (res) => {
        reset({
          ...res,
          table_from: res?.table_from?.slug ?? "",
          table_to: res?.table_to?.slug ?? "",
          type: res?.type ?? "",
          id: res?.id ?? "",
          editable: res?.editable ?? false,
          summaries: res?.summaries ?? [],
          view_fields: res?.view_fields?.map((field) => field.id) ?? [],
          field_name: res?.label,
        });
      },
    },
  });

  const relatedTableSlug = useMemo(() => {
    const tableTo = values.table_to?.split("/")?.[1];

    if (values.type === "Recursive") return values.table_from;
    if (tableTo === tableSlug) return values.table_from;
    else if (values.table_from === tableSlug) return tableTo;
    return null;
  }, [values, tableSlug]);

  const {
    fields: dropdownFields,
    append: dropdownAppend,
    remove: dropdownRemove,
  } = useFieldArray({
    control,
    name: "attributes.options",
  });
  const open = Boolean(anchorEl);
  const openColor = Boolean(colorEl);
  const openMath = Boolean(mathEl);

  const onDrop = (dropResult) => {
    const result = applyDrag(watch("attributes.options"), dropResult);
    if (result) {
      setValue("attributes.options", result);
    }
  };

  const { isLoading: fieldLoading } = useFieldsListQuery({
    params: {
      table_id: menuItem?.table_id,
      tableSlug: tableSlug,
    },
    queryParams: {
      enabled: Boolean(menuItem?.table_id),
      onSuccess: (res) => {
        setFields(
          res?.fields?.map((item) => {
            return { value: item.slug, label: item.label };
          })
        );
      },
    },
  });

  const params = {
    language_setting: i18n?.language,
  };

  const { isLoading: fieldsLoading } = useQuery(
    ["GET_VIEWS_AND_FIELDS", relatedTableSlug, i18n?.language],
    () => {
      if (!relatedTableSlug) return [];
      return constructorTableService.getTableInfo(
        relatedTableSlug,
        {
          data: { limit: 0, offset: 0 },
        },
        params
      );
    },
    {
      cacheTime: 10,
      onSuccess: (data) => {
        if (!data) return;
        setFields(data?.fields ?? []);
        const fields = data?.fields ?? [];

        const checkedColumns =
          values.columns
            ?.map((id) => {
              const field = fields.find((field) => field.id === id);
              if (field)
                return {
                  ...field,
                  is_checked: true,
                };
              return null;
            })
            .filter((field) => field) ?? [];
        const unCheckedColumns = fields.filter(
          (field) => !values.columns?.includes(field.id)
        );

        const checkedFilters =
          values.quick_filters
            ?.map((filter) => {
              const field = fields.find(
                (field) => field.id === filter.field_id
              );
              if (field)
                return {
                  ...field,
                  is_checked: true,
                };
              return null;
            })
            .filter((field) => field) ?? [];

        const unCheckedFilters = fields.filter(
          (field) =>
            !values.quick_filters?.some(
              (filter) => filter.field_id === field.id
            )
        );
        setValue("filtersList", [...checkedFilters, ...unCheckedFilters]);
        setValue("columnsList", [...checkedColumns, ...unCheckedColumns]);
      },
    }
  );

  const handleClose = () => {
    setValue("relation_type", "");
    setValue("view_fields", "");
    setValue("table_to", "");
    setValue("attributes.type", "");

    setAnchorEl(null);
    !fieldData && setValue("type", "");
  };

  const handleCloseColor = () => {
    setColorEl(null);
  };

  const handleCloseMath = () => {
    setMathEl(null);
  };

  const handleClick = () => {
    setAnchorEl(null);
    handleClose();
    if (!fieldData) {
      setValue("type", "");
      setFieldOptionAnchor(target);
    }
  };

  const handleOpenColor = (e, index) => {
    setIdx(index);
    setColorEl(e.currentTarget);
  };

  const closeAllDrawer = () => {
    setFieldOptionAnchor(null);
    setAnchorEl(null);
  };

  const tableName = useWatch({
    control,
    name: "label",
  });

  const {
    fields: relation,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "attributes.formula_filters",
  });

  const deleteSummary = (index) => {
    remove(index);
  };

  const addNewSummary = () => {
    append({
      key: "",
      value: "",
    });
  };

  const computedTables = useMemo(() => {
    return tableRelations?.map((relation) => {
      const relatedTable = relation[relation.relatedTableSlug];

      return {
        label: relatedTable?.label,
        value: `${relatedTable?.slug}#${relation?.id}`,
      };
    });
  }, [tableRelations]);

  useEffect(() => {
    if (watch("type") !== "MULTISELECT") {
      setValue("attributes.options", []);
    }
  }, [watch("type")]);

  return (
    <Popover
      anchorReference="anchorPosition"
      anchorPosition={{ top: 450, left: 900 }}
      id="menu-appbar"
      open={open}
      onClose={handleClose}
      anchorEl={anchorEl}
      background="red"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <div className={style.field}>
        <Typography
          variant="h6"
          textTransform="uppercase"
          className={style.title}
        >
          {generateLangaugeText(tableLan, i18n?.language, "Add column") ||
            "ADD COLUMN"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
          <Box
            className={style.field}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              {!ValueTypes(values?.type) && !FormatTypes(format) ? (
                <FRow
                  label={
                    generateLangaugeText(tableLan, i18n?.language, "Label") ||
                    "Label"
                  }
                  classname={style.custom_label}
                  required
                >
                  <Box style={{ display: "flex", gap: "6px" }}>
                    <HFTextFieldWithMultiLanguage
                      control={control}
                      name="attributes.label"
                      fullWidth
                      placeholder="Name"
                      defaultValue={tableName}
                      languages={languages}
                      id={"text_field_label"}
                    />
                  </Box>
                </FRow>
              ) : null}
            </Box>
            <FRow
              label={
                generateLangaugeText(tableLan, i18n?.language, "Type") || "Type"
              }
              componentClassName="flex gap-2 align-center"
              required
              classname={style.custom_label}
            >
              <HFSelect
                className={style.input}
                disabledHelperText
                options={fieldData ? fieldFormats : newFieldTypes}
                name="attributes.format"
                control={control}
                disabled={fieldData}
                fullWidth
                required
                onChange={(e) => {
                  if (e === "NUMBER") {
                    setValue("type", "NUMBER");
                  } else if (e === "DATE") {
                    setValue("type", "DATE");
                  } else if (e === "INCREMENT") {
                    setValue("type", "INCREMENT_ID");
                  } else if (e === "SINGLE_LINE") {
                    setValue("type", "SINGLE_LINE");
                  } else {
                    setValue("type", e);
                  }
                }}
                placeholder="Select type"
              />
            </FRow>
          </Box>
          <Box sx={{ padding: "0 5px" }}>
            {formatIncludes?.includes(format) ? (
              <FRow
                label={
                  generateLangaugeText(tableLan, i18n?.language, "Format") ||
                  "Format"
                }
                componentClassName="flex gap-2 align-center"
                required
                classname={style.custom_label}
              >
                <HFSelect
                  className={style.input}
                  disabledHelperText
                  options={FormatOptionType(format)}
                  name="type"
                  control={control}
                  disabled={fieldData}
                  fullWidth
                  required
                  placeholder={
                    generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Select type"
                    ) || "Select type"
                  }
                />
              </FRow>
            ) : null}
            {fieldData && (
              <Button
                fullWidth
                className={style.advanced}
                onClick={() => {
                  handleOpenFieldDrawer(fieldData);
                  closeAllDrawer();
                }}
              >
                <SettingsIcon />
                {generateLangaugeText(
                  tableLan,
                  i18n?.language,
                  "Advanced settings"
                ) || "Advanced settings"}
              </Button>
            )}
          </Box>
          <div>
            {format === "MULTISELECT" && (
              <Box className={style.dropdown}>
                <Container
                  lockAxis="y"
                  orientation="vertical"
                  onDrop={onDrop}
                  dragHandleSelector=".column-drag-handle"
                >
                  {dropdownFields.map((item, index) => (
                    <Draggable key={item.id}>
                      <Box key={item.id} className="column-drag-handle">
                        <Box
                        // sx={{
                        //   display: "flex",
                        //   alignItems: "center",
                        //   justifyContent: "space-around",
                        // }}
                        >
                          <FRow
                            label={`Option ${index + 1}`}
                            className={style.option}
                          >
                            <span
                              className={style.startAdornment}
                              style={{
                                background: watch(
                                  `attributes.options.${index}.color`
                                ),
                              }}
                            ></span>

                            <HFTextField
                              disabledHelperText
                              name={`attributes.options.${index}.label`}
                              control={control}
                              fullWidth
                              required
                              placeholder="Type..."
                              className={style.input}
                              customOnChange={(e) => {
                                setValue(
                                  `attributes.options.${index}.value`,
                                  e.target.value
                                );
                              }}
                              endAdornment={
                                <Box className={style.adornment}>
                                  <p onClick={(e) => handleOpenColor(e, index)}>
                                    {generateLangaugeText(
                                      tableLan,
                                      i18n?.language,
                                      "Add color"
                                    ) || "Add color"}
                                  </p>
                                  <CloseIcon
                                    onClick={() => dropdownRemove(index)}
                                  />
                                </Box>
                              }
                            />
                          </FRow>
                          {/* <FRow
                            label={`Value ${index + 1}`}
                            className={style.option}
                          >
                            <HFTextField
                              disabledHelperText
                              name={`attributes.options.${index}.value`}
                              control={control}
                              fullWidth
                              required
                              placeholder="Type..."
                              className={style.input}
                              endAdornment={
                                <Box className={style.adornment}>
                                  <CloseIcon
                                    onClick={() => dropdownRemove(index)}
                                  />
                                </Box>
                              }
                            />
                          </FRow> */}
                        </Box>
                      </Box>
                      <Popover
                        open={openColor}
                        anchorEl={colorEl}
                        onClose={handleCloseColor}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <Card elevation={12} className="ColorPickerPopup">
                          {colorList.map((color, colorIndex) => (
                            <div
                              className="round"
                              key={colorIndex}
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setValue(
                                  `attributes.options.${idx}.color`,
                                  color
                                );
                                setValue(`attributes.has_color`, true);
                                handleCloseColor();
                              }}
                            />
                          ))}
                        </Card>
                      </Popover>
                    </Draggable>
                  ))}
                </Container>
                {watch("type") === "MULTISELECT" && (
                  <Button
                    onClick={() => {
                      dropdownAppend({
                        label: "",
                        value: "",
                      });
                    }}
                  >
                    +
                    {generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Add option"
                    ) || "Add option"}
                  </Button>
                )}

                {watch("type") === "STATUS" && (
                  <StatusFieldSettings control={control} />
                )}
              </Box>
            )}
          </div>
          {format === "FORMULA" && (
            <>
              <FRow label="Formula type">
                <FRow label="Formula format">
                  <HFSelect
                    name="attributes.format"
                    control={control}
                    options={formulaFormatOptions}
                    isClearable={false}
                  />
                </FRow>
                <HFSelect
                  name="attributes.type"
                  control={control}
                  options={formulaTypes}
                />
              </FRow>
              {(type === "SUMM" || type === "MAX" || type === "AVG") && (
                <>
                  <FRow label="Table from">
                    <HFSelect
                      name="attributes.table_from"
                      control={control}
                      options={computedTables}
                    />
                  </FRow>

                  <FRow label="Field from">
                    <HFSelect
                      name="attributes.sum_field"
                      control={control}
                      options={fields}
                    />
                  </FRow>

                  <FRow label="Rounds">
                    <HFTextField
                      name="attributes.number_of_rounds"
                      type="number"
                      fullWidth
                      control={control}
                      options={fields}
                    />
                  </FRow>

                  <FRow label="Filters"></FRow>

                  <div className="">
                    {relation?.map((summary, index) => (
                      <FormulaFilters
                        summary={summary}
                        selectedTableSlug={selectedTableSlug}
                        index={index}
                        control={control}
                        deleteSummary={deleteSummary}
                      />
                    ))}
                    <div
                      className={style.summaryButton}
                      onClick={addNewSummary}
                    >
                      <button type="button">+ Create new</button>
                    </div>
                  </div>
                </>
              )}
            </>
            // <FormulaAttributes control={control} mainForm={{ control }} />
          )}
          {format === "FORMULA_FRONTEND" && (
            <>
              <FRow label="Formula format">
                <HFSelect
                  name="attributes.format"
                  control={control}
                  options={formulaFormatOptions}
                  isClearable={false}
                />
              </FRow>
              {watch("attributes.advanced_type") ? (
                <>
                  <Box className={style.formula}>
                    <HFTextArea
                      className={style.input}
                      disabledHelperText
                      name="attributes.formula"
                      control={control}
                      fullWidth
                      id="formula_textarea"
                      required
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Formula"
                        ) || "Formula"
                      }
                    />
                  </Box>
                  <h2>
                    {generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Fields list"
                    ) || "Fields list"}
                    :
                  </h2>
                  {fields.map((field) => (
                    <div>
                      {field.label} - <strong>{field.value}</strong>{" "}
                    </div>
                  ))}
                </>
              ) : (
                <Box className={style.formula}>
                  <HFSelect
                    className={style.input}
                    disabledHelperText
                    options={fields}
                    name="attributes.from_formula"
                    control={control}
                    fullWidth
                    id="variable"
                    required
                    placeholder={
                      generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Select variable"
                      ) || "Select variable"
                    }
                  />

                  <span
                    id={`math_plus`}
                    className={`math_${mathType?.label}`}
                    onClick={(e) => setMathEl(e.currentTarget)}
                  >
                    {mathType?.value}
                  </span>
                  <HFSelect
                    className={style.input}
                    disabledHelperText
                    options={fields}
                    id="variable_second"
                    name="attributes.to_formula"
                    control={control}
                    fullWidth
                    required
                    placeholder={
                      generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Select variable"
                      ) || "Select variable"
                    }
                  />

                  <Menu
                    open={openMath}
                    onClose={handleCloseMath}
                    anchorEl={mathEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <Box className="math">
                      {math.map((item) => {
                        return (
                          <span
                            id={`math_${item?.label}`}
                            className={`math_${item?.label}`}
                            onClick={() => {
                              setValue("attributes.math", item);
                              setMathEl(null);
                            }}
                          >
                            {item?.value}
                          </span>
                        );
                      })}
                    </Box>
                  </Menu>
                </Box>
              )}

              <Box
                mt={1}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  columnGap: "5px",
                }}
              >
                <HFSwitch
                  id="advanced_switch"
                  control={control}
                  name="attributes.advanced_type"
                />
                {generateLangaugeText(
                  tableLan,
                  i18n?.language,
                  "Advanced Editor"
                ) || "Advanced Editor"}
              </Box>
            </>
          )}
          {format === "RELATION" && !fieldData ? (
            <RelationFieldForm
              control={control}
              watch={watch}
              setValue={setValue}
              fieldWatch={fieldWatch}
              relatedTableSlug={relatedTableSlug}
            />
          ) : null}
          <Box className={style.button_group} sx={{ padding: "0 5px" }}>
            <Button variant="contained" color="error" onClick={handleClick}>
              {generateLangaugeText(tableLan, i18n?.language, "Cancel") ||
                "Cancel"}
            </Button>
            <Button variant="contained" type="submit">
              {fieldData
                ? generateLangaugeText(
                    tableLan,
                    i18n?.language,
                    "Save colmn"
                  ) || "Save column"
                : generateLangaugeText(
                    tableLan,
                    i18n?.language,
                    "Add column"
                  ) || "Add column"}
            </Button>
          </Box>
        </form>
      </div>
    </Popover>
  );
}
