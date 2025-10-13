import { Box, Popover } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import constructorTableService from "../../services/constructorTableService";

import { useRelationGetByIdQuery } from "../../services/relationService";
import { applyDrag } from "../../utils/applyDrag";
import {
  FIELD_TYPES,
  FormatOptionType,
  FormatTypes,
  ValueTypes,
  fieldFormats,
  formatIncludes,
  newFieldTypes,
} from "../../utils/constants/fieldTypes";
import { colorList } from "../ColorPicker/colorList";
import FRow from "../FormElements/FRow";
import RelationFieldForm from "./RelationFieldForm";
import style from "./field.module.scss";
import "./style.scss";
import constructorFieldService, {
  useFieldsListQuery,
  useFieldUpdateMutation,
} from "../../services/constructorFieldService";
import { generateLangaugeText } from "../../utils/generateLanguageText";
import FormulaFilters from "../../views/Constructor/Tables/Form/Fields/Attributes/FormulaFilters";
import constructorRelationService from "../../services/constructorRelationService";
import { listToMap } from "../../utils/listToMap";
import MaterialUIProvider from "../../providers/MaterialUIProvider";
import TextFieldWithMultiLanguage from "../NewFormElements/TextFieldWithMultiLanguage/TextFieldWithMultiLanguage";
import Dropdown from "../NewFormElements/Dropdown/Dropdown";
import MultiselectSettings from "./MultiselectSettings";
import { FieldFormatIcon, FieldPropertyIcon, FieldTypeIcon } from "../icons";
import { paginationActions } from "../../store/pagination/pagination.slice";
import constructorViewService from "../../services/constructorViewService";
import DropdownSelect from "../NewFormElements/DropdownSelect";
import TextField from "../NewFormElements/TextField/TextField";
import clsx from "clsx";
import { useViewContext } from "../../providers/ViewProvider";
import { FieldPopover } from "../../views/Constructor/Tables/Form/Fields/components/FieldPopover/FieldPopover";
import { RelationPopover } from "../../views/Constructor/Tables/Form/Relations/components/RelationPopover";
import { FieldCheckbox } from "../../views/Constructor/Tables/Form/components/FieldCheckbox/FieldCheckbox";
import constructorFunctionService from "../../services/constructorFunctionService";
import listToOptions from "../../utils/listToOptions";
import {
  EyeOffIcon,
  fieldTypeIcons,
  PinIcon,
  SettingsIcon,
  SortIcon,
  TrashIcon,
} from "../../utils/constants/icons";
import { KeyboardArrowRight } from "@mui/icons-material";
import useDebounce from "../../hooks/useDebounce";
import {
  getColumnIconPath,
  iconsComponents,
} from "../../views/table-redesign/icons";
import SVG from "react-inlinesvg";
import { North, South } from "@mui/icons-material";
import FormElementButton from "../NewFormElements/FormElementButton";
import deleteField from "../../utils/deleteField";

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
  setAnchorEl = () => {},
  watch = () => {},
  control,
  setValue = () => {},
  handleSubmit = () => {},
  onSubmit = () => {},
  setFieldOptionAnchor = () => {},
  target,
  reset = () => {},
  fieldData,
  handleOpenFieldDrawer = () => {},
  visibleColumns,
  menuItem,
  mainForm,
  view,
  sortedDatas,
  setSortedDatas = () => {},
  setFieldData = () => {},
  register = () => {},
  handleCloseFieldDrawer = () => {},
  setIsUpdatedField = () => {},
  formType,
  renderColumns = [],
}) {
  const { id, tableSlug: tableSlugParam } = useParams();
  const { view: viewFromContext } = useViewContext();
  const tableSlug =
    tableSlugParam || view?.table_slug || viewFromContext?.table_slug;
  const tableRelations = useWatch({
    control: mainForm.control,
    name: "tableRelations",
  });

  const [relationFieldAnchorEl, setRelationFieldAnchorEl] = useState(null);

  const [fieldAnchorEl, setFieldAnchorEl] = useState(null);
  const [drawerState, setDrawerState] = useState(null);

  const openField = Boolean(fieldAnchorEl);

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const fieldHandleOpen = (fieldData) => {
    const anchorElField = anchorEl;
    if (
      fieldData?.type === FIELD_TYPES.LOOKUP ||
      fieldData?.type === FIELD_TYPES.LOOKUPS
    ) {
      setFieldOptionAnchor(null);
      setRelationFieldAnchorEl(anchorElField);
      setDrawerState(fieldData);
    } else {
      setFieldOptionAnchor(null);
      setFieldAnchorEl(anchorElField);
      setDrawerState(fieldData);
    }
  };

  useEffect(() => {
    if (format === FIELD_TYPES.FORMULA_FRONTEND && formType === "CREATE") {
      setFieldOptionAnchor(null);
      setFieldAnchorEl(anchorEl);
      setDrawerState(fieldData || { type: format });
    }
  }, [anchorEl, formType]);

  const fieldHandleClose = () => {
    setFieldAnchorEl(null);
    setAnchorEl(null);
  };

  const relationFieldHandleClose = () => {
    setRelationFieldAnchorEl(null);
    setAnchorEl(null);
  };

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
        {},
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

  const [fields, setFields] = useState(visibleColumns ?? []);
  const type = useWatch({
    control,
    name: "attributes.type",
  });

  const selectedTableSlug = useWatch({
    control,
    name: "attributes.table_from",
  });

  const [colorEl, setColorEl] = useState(null);
  const [mathEl, setMathEl] = useState(null);
  const [idx, setIdx] = useState(null);
  const languages = useSelector((state) => state.languages.list);
  const mathType = watch("attributes.math");
  const values = watch();
  const { i18n } = useTranslation();

  const [openedDropdown, setOpenedDropdown] = useState(null);

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
    replace: dropdownReplace,
  } = useFieldArray({
    control,
    name: "attributes.options",
  });

  const open = Boolean(anchorEl && !fieldAnchorEl && !relationFieldAnchorEl);
  const openColor = Boolean(colorEl);
  const openMath = Boolean(mathEl);

  const {
    control: formulaControl,
    watch: formulaWatch,
    setValue: formulaSetValue,
  } = useForm({
    defaultValues: {
      formulaFormat: "FORMULA_FRONTEND",
    },
  });

  const formulaFormat = useWatch({
    control: formulaControl,
    name: "formulaFormat",
  });

  const onDrop = (dropResult) => {
    const result = applyDrag(watch("attributes.options"), dropResult);
    if (result) {
      handleUpdateField({
        ...fieldData,
        attributes: {
          ...fieldData.attributes,
          options: result,
        },
      });
      setValue("attributes.options", result);
    }
  };

  const { isLoading: fieldLoading } = useFieldsListQuery({
    params: {
      table_id: menuItem?.table_id,
      tableSlug: tableSlug,
      table_slug: tableSlug,
    },
    tableSlug,
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

  const { data: functions = [] } = useQuery(
    ["GET_FUNCTIONS_LIST"],
    () => {
      return constructorFunctionService.getListV2({});
    },
    {
      enabled: format === FIELD_TYPES.BUTTON,
      onError: (err) => {
        console.log("ERR =>", err);
      },
      select: (res) => {
        return listToOptions(res.functions, "name", "id");
      },
    }
  );

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
    setFieldData(null);
    handleCloseFieldDrawer();
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

      setValue("attributes.options", []);
      setValue("attributes.todo.options", []);
      setValue("attributes.complete.options", []);
      setValue("attributes.progress.options", []);

      languages?.forEach((lang) => {
        setValue(`attributes.label_${lang}`, "");
      });

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

  useEffect(() => {
    if (formulaFormat !== "FORMULA") {
      setValue("attributes.type", null);
      setValue("attributes.table_from", null);
      setValue("attributes.sum_field", null);
      setValue("attributes.number_of_rounds", null);
    } else {
      setValue("attributes.advanced_type", null);
      setValue("attributes.from_formula", null);
      setValue("attributes.to_formula", null);
    }
  }, [formulaFormat]);

  const innerOnsubmit = (data) => {
    const innerData = {
      ...data,
      attributes: {
        ...data?.attributes,
        format: formulaFormat,
      },
      type: formulaFormat,
    };

    onSubmit(innerData);
  };

  const popoverAnchorProps = {};
  if (!fieldData) {
    // popoverAnchorProps.anchorReference = "anchorPosition";

    // if (format.includes("FORMULA")) {
    //   popoverAnchorProps.anchorReference = "anchorPosition";
    //   popoverAnchorProps.anchorPosition = {
    //     top: 370,
    //     left: window.innerWidth - 300,
    //   };
    // } else {
    //   popoverAnchorProps.anchorPosition = {
    //     top: 270,
    //     left: window.innerWidth - 300,
    //   };
    // }

    // popoverAnchorProps.anchorOrigin = {
    //   vertical: "bottom",
    //   horizontal: "center",
    // };
    // popoverAnchorProps.transformOrigin = {
    //   vertical: "bottom",
    //   horizontal: "left",
    // };

    if(!renderColumns.length) {
      popoverAnchorProps.anchorOrigin = {
        vertical: "bottom",
        horizontal: "right",
      };
    } else {
      popoverAnchorProps.anchorOrigin = {
        vertical: "bottom",
        horizontal: "left",
      };
    }

  } else {
    popoverAnchorProps.anchorOrigin = {
      vertical: "bottom",
      horizontal: "left",
    };
  }

  const handleSortField = (order) => {
    // const field = fieldData.id;
    // const order =
    //   sortedDatas?.find((item) => item.field === fieldData.id)?.order === "ASC"
    //     ? "DESC"
    //     : "ASC";

    const field =
      fieldData?.type === (FIELD_TYPES.LOOKUP || FIELD_TYPES.LOOKUPS)
        ? fieldData?.relation_id
        : fieldData.id;

    if (!field) {
      handleClose();
      return;
    }

    dispatch(paginationActions.setSortValues({ tableSlug, field, order }));

    setSortedDatas((prev) => {
      let newSortedDatas = [...prev];
      const index = newSortedDatas.findIndex((item) => item.field === field);
      if (index !== -1) {
        newSortedDatas[index].order = order;
      } else {
        newSortedDatas = [
          {
            field: field,
            order,
          },
        ];
      }
      return newSortedDatas;
    });

    setAnchorEl(null);

    // dispatch(
    //   paginationActions.setSortValues({
    //     tableSlug,
    //     field,
    //     order,
    //   })
    // );
    // setSortedDatas((prev) => {
    //   const newSortedDatas = [...prev];
    //   const index = newSortedDatas.findIndex(
    //     (item) => item.field === fieldData.id
    //   );
    //   if (index !== -1) {
    //     newSortedDatas[index].order =
    //       newSortedDatas[index].order === "ASC" ? "DESC" : "ASC";
    //   } else {
    //     newSortedDatas.push({
    //       field: fieldData.id,
    //       order: "ASC",
    //     });
    //   }
    //   return newSortedDatas;
    // });
    // setAnchorEl(null);
  };

  const fixColumnChangeHandler = (column, e) => {
    const computedData = {
      ...view,
      attributes: {
        ...view?.attributes,
        fixedColumns: {
          ...view?.attributes?.fixedColumns,
          [column.id]: e,
        },
      },
    };

    constructorViewService.update(tableSlug, computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const updateView = (column) => {
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: view?.columns?.filter((item) => item !== column),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries("GET_VIEWS_AND_FIELDS", { tableSlug });
        setAnchorEl(null);
      });
  };

  const handleDeleteField = (column) => {
    deleteField({
      column,
      tableSlug,
      callback: () => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries("GET_OBJECTS_LIST", { tableSlug });
      },
    });
    handleClose();
  };

  const dropdownTypes = {
    editProperty: "editProperty",
    changeFormat: "changeFormat",
    changeType: "changeType",
    sortData: "sortData",
  };

  const { mutate: updateField } = useFieldUpdateMutation({});

  const handleUpdateField = useDebounce((data) => {
    if (fieldData) {
      updateField({ data, tableSlug });
    } else {
      return;
    }
  }, 1000);

  const handleChangeLabel = (e, lang) => {
    if (fieldData) {
      const value = e.target.value;
      setIsUpdatedField(true);

      const data = {
        ...fieldData,
        attributes: {
          ...fieldData?.attributes,
          [`label_${lang}`]: value,
        },
        label: value,
      };

      handleUpdateField(data);
    } else return;
  };

  return (
    <MaterialUIProvider>
      {(formType !== "CREATE" ||
        (formType === "CREATE" && format !== FIELD_TYPES.FORMULA_FRONTEND)) && (
        <Popover
          {...popoverAnchorProps}
          id="menu-appbar"
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          background="red"
          PaperProps={{
            style: {
              overflowY: "visible",
              overflowX: "visible",
            },
          }}
        >
          <div className={style.field}>
            <div className={style.form}>
              <Box className={style.header}>
                <p className={style.headerTitle}>
                  {formType === "CREATE" ? "Create field" : "Edit fields"}
                </p>
                <button
                  className={style.closeButton}
                  onClick={handleClose}
                  type="button"
                >
                  <span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.75 1.25L1.25 8.75M1.25 1.25L8.75 8.75"
                        stroke="#8F8E8B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </Box>
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
                    <TextFieldWithMultiLanguage
                      control={control}
                      name="attributes.label"
                      fullWidth
                      placeholder="Name"
                      defaultValue={tableName}
                      languages={languages}
                      id={"text_field_label"}
                      customOnChange={handleChangeLabel}
                      watch={watch}
                      leftContent={
                        <Box>
                          {
                            <SVG
                              src={getColumnIconPath({
                                column: { type: [watch("type")] },
                              })}
                              width="16"
                              height="16"
                            />
                          }
                        </Box>
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSubmit(
                            format?.includes("FORMULA")
                              ? innerOnsubmit
                              : onSubmit
                          )();
                        }
                      }}
                    />
                  ) : null}
                </Box>
                {fieldData && (
                  <Box width={"100%"}>
                    <Box borderBottom="1px solid #e5e9eb" paddingY="6px">
                      <Box
                        width={"100%"}
                        onMouseEnter={() => {
                          setOpenedDropdown(dropdownTypes.sortData);
                        }}
                      >
                        <Dropdown
                          optionsClassname={style.sortDropdown}
                          openedDropdown={openedDropdown}
                          name={dropdownTypes.sortData}
                          content={
                            <div>
                              <button
                                className={style.sortOptions}
                                onClick={() => handleSortField("ASC")}
                              >
                                {" "}
                                <span>
                                  <North />
                                </span>{" "}
                                <span>Sort ascending</span>
                              </button>
                              <button
                                className={style.sortOptions}
                                onClick={() => handleSortField("DESC")}
                              >
                                {" "}
                                <span>
                                  <South />
                                </span>{" "}
                                <span>Sort descending</span>
                              </button>
                            </div>
                          }
                          label={"Sort"}
                          icon={<SortIcon />}
                        />
                      </Box>
                      <Box width={"100%"}>
                        <button
                          className={style.btn}
                          type="button"
                          onClick={() =>
                            fixColumnChangeHandler(
                              fieldData,
                              !view?.attributes?.fixedColumns?.[fieldData?.id]
                                ? true
                                : false
                            )
                          }
                          onMouseEnter={() => {
                            setOpenedDropdown(null);
                          }}
                        >
                          <PinIcon />
                          <span>
                            {view?.attributes?.fixedColumns?.[fieldData?.id]
                              ? "Unfix"
                              : "Fix"}{" "}
                            column
                          </span>
                        </button>
                      </Box>
                      {(format === FIELD_TYPES.SINGLE_LINE ||
                        format === FIELD_TYPES.MULTI_LINE) && (
                        <Box>
                          <FieldCheckbox
                            watch={watch}
                            setValue={setValue}
                            register={register}
                            name={"enable_multilanguage"}
                            label={"Multiple language"}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
                {!fieldData && (
                  <Box
                    width={"100%"}
                    paddingY={"6px"}
                    onMouseEnter={() => {
                      setOpenedDropdown(dropdownTypes.changeType);
                    }}
                  >
                    <Dropdown
                      openedDropdown={openedDropdown}
                      name={dropdownTypes.changeType}
                      options={fieldData ? fieldFormats : newFieldTypes}
                      selectedValue={watch("attributes.format")}
                      onClick={(option) => {
                        setValue("attributes.format", option?.value);
                        if (option?.value === "NUMBER") {
                          setValue("type", "NUMBER");
                        } else if (option?.value === "DATE") {
                          setValue("type", "DATE");
                        } else if (option?.value === "INCREMENT") {
                          setValue("type", "INCREMENT_ID");
                        } else if (option?.value === "SINGLE_LINE") {
                          setValue("type", "SINGLE_LINE");
                        } else {
                          setValue("type", option?.value);
                        }
                      }}
                      label={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Change Type"
                        ) || "Change type"
                      }
                      icon={<FieldTypeIcon />}
                    />
                  </Box>
                )}
                {formatIncludes?.includes(format) && !fieldData && (
                  <>
                    <Box
                      width={"100%"}
                      onMouseEnter={() => {
                        setOpenedDropdown(dropdownTypes.changeFormat);
                      }}
                    >
                      <Dropdown
                        openedDropdown={openedDropdown}
                        name={dropdownTypes.changeFormat}
                        options={FormatOptionType(format)}
                        selectedValue={
                          format?.startsWith("FORMULA")
                            ? formulaWatch("formulaFormat")
                            : watch("type")
                        }
                        onClick={(option) => {
                          if (format?.startsWith("FORMULA")) {
                            formulaSetValue("formulaFormat", option?.value);
                          } else {
                            setValue("type", option?.value);
                          }
                        }}
                        label={
                          generateLangaugeText(
                            tableLan,
                            i18n?.language,
                            "Change format"
                          ) || "Change format"
                        }
                        icon={<FieldFormatIcon />}
                      />
                    </Box>
                    {(format === FIELD_TYPES.SINGLE_LINE ||
                      format === FIELD_TYPES.MULTI_LINE) && (
                      <Box width="100%">
                        <FieldCheckbox
                          watch={watch}
                          setValue={setValue}
                          register={register}
                          name={"enable_multilanguage"}
                          label={"Multiple language"}
                        />
                      </Box>
                    )}
                  </>
                )}
                {format === FIELD_TYPES.MULTISELECT && (
                  <Box
                    width={"100%"}
                    paddingY={"6px"}
                    borderBottom="1px solid #e5e9eb"
                    onMouseEnter={() => {
                      setOpenedDropdown(dropdownTypes.editProperty);
                    }}
                  >
                    <Dropdown
                      openedDropdown={openedDropdown}
                      name={dropdownTypes.editProperty}
                      content={
                        <MultiselectSettings
                          dropdownFields={dropdownFields}
                          dropdownReplace={dropdownReplace}
                          onDrop={onDrop}
                          watch={watch}
                          control={control}
                          setValue={setValue}
                          handleOpenColor={handleOpenColor}
                          dropdownRemove={dropdownRemove}
                          tableLan={tableLan}
                          i18n={i18n}
                          openColor={openColor}
                          colorEl={colorEl}
                          handleCloseColor={handleCloseColor}
                          colorList={colorList}
                          idx={idx}
                          dropdownAppend={dropdownAppend}
                          handleUpdateField={handleUpdateField}
                          fieldData={fieldData}
                          languages={languages}
                        />
                      }
                      label={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Edit property"
                        ) || "Edit property"
                      }
                      optionsClassname={style.editProperty}
                      icon={<FieldPropertyIcon />}
                    />
                  </Box>
                )}
                {fieldData && (
                  <Box
                    width="100%"
                    marginTop="4px"
                    // borderTop="1px solid #e5e9eb"
                  >
                    <Box width={"100%"}>
                      <button
                        className={style.btn}
                        type="button"
                        onClick={() => updateView(fieldData.id)}
                        onMouseEnter={() => {
                          setOpenedDropdown(null);
                        }}
                      >
                        <EyeOffIcon />
                        <span>Hide field</span>
                      </button>
                    </Box>
                  </Box>
                )}
                {(format === FIELD_TYPES.FORMULA_FRONTEND || fieldData) && (
                  <button
                    className={clsx(style.btn, style.settings)}
                    onClick={() => {
                      fieldHandleOpen(
                        fieldData ?? {
                          type: FIELD_TYPES.FORMULA_FRONTEND,
                        }
                      );
                    }}
                    onMouseEnter={() => {
                      setOpenedDropdown(null);
                    }}
                  >
                    <SettingsIcon />
                    {generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Settings"
                    ) || "Settings"}
                    <span className={style.btnIcon}>
                      <KeyboardArrowRight
                        htmlColor="rgba(71, 70, 68, 0.6)"
                        width={16}
                        height={16}
                      />
                    </span>
                  </button>
                )}
                {fieldData && (
                  <Box
                    width="100%"
                    // marginTop="4px"
                    borderTop="1px solid #e5e9eb"
                    paddingTop="4px"
                  >
                    <Box width={"100%"}>
                      <button
                        className={style.btn}
                        type="button"
                        onClick={() => handleDeleteField(fieldData)}
                        onMouseEnter={() => {
                          setOpenedDropdown(null);
                        }}
                      >
                        <TrashIcon />
                        <span>Delete field</span>
                      </button>
                    </Box>
                  </Box>
                )}
              </Box>
              {formulaFormat === "FORMULA" && format.startsWith("FORMULA") && (
                <Box padding="5px" overflow="auto" maxHeight="300px">
                  <FRow label="Formula type">
                    <DropdownSelect
                      name="attributes.type"
                      control={control}
                      options={formulaTypes}
                      onOpen={() => {
                        setOpenedDropdown(null);
                      }}
                    />
                  </FRow>
                  {(type === "SUMM" || type === "MAX" || type === "AVG") && (
                    <>
                      <FRow label="Table from">
                        <DropdownSelect
                          name="attributes.table_from"
                          control={control}
                          options={computedTables}
                          onOpen={() => {
                            setOpenedDropdown(null);
                          }}
                        />
                      </FRow>

                      <FRow label="Field from">
                        <DropdownSelect
                          name="attributes.sum_field"
                          control={control}
                          options={fields}
                          onOpen={() => {
                            setOpenedDropdown(null);
                          }}
                        />
                      </FRow>

                      <FRow label="Rounds">
                        <TextField
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
                </Box>
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
              {!fieldData && (
                <Box className={style.button_group} sx={{ padding: "0 5px" }}>
                  <FormElementButton onClick={handleClick}>
                    {generateLangaugeText(tableLan, i18n?.language, "Cancel") ||
                      "Cancel"}
                  </FormElementButton>
                  <FormElementButton
                    onClick={handleSubmit(
                      format?.includes("FORMULA") ? innerOnsubmit : onSubmit
                    )}
                    primary
                    type="button"
                  >
                    {generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Add column"
                    ) || "Add column"}
                  </FormElementButton>
                </Box>
              )}
            </div>
          </div>
        </Popover>
      )}
      <FieldPopover
        open={openField}
        anchorEl={fieldAnchorEl}
        onClose={fieldHandleClose}
        formType={formType}
        getRelationFields={getRelationFields}
        mainForm={mainForm}
        tableLan={tableLan}
        submitCallback={() => {
          setTimeout(() => {
            queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
            queryClient.refetchQueries("GET_VIEWS_AND_FIELDS", { tableSlug });
          }, 100);
        }}
        slug={tableSlug}
        field={drawerState}
        selectedField={drawerState}
        handleUpdateField={handleUpdateField}
        // menuItem={menuItem}
      />
      {fieldData?.type === FIELD_TYPES.LOOKUP ||
      fieldData?.type === FIELD_TYPES.LOOKUPS ? (
        <RelationPopover
          anchorEl={relationFieldAnchorEl}
          onClose={relationFieldHandleClose}
          tableLan={tableLan}
          relation={drawerState}
          closeSettingsBlock={() => closeAllDrawer()}
          getRelationFields={getRelationFields}
          formType={drawerState}
          open={Boolean(relationFieldAnchorEl)}
          submitCallback={() => {
            setTimeout(() => {
              queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
              queryClient.refetchQueries("GET_VIEWS_AND_FIELDS", {
                tableSlug,
              });
            }, 200);
          }}
        />
      ) : null}
    </MaterialUIProvider>
  );
}
