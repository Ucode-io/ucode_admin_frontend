import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { FieldTypeList } from "../FieldTypeList";
import { newFieldTypes } from "@/utils/constants/fieldTypes";
import { Validation } from "../Validation";
import { useGetLang } from "@/hooks/useGetLang";
import { generateGUID } from "@/utils/generateID";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useFieldCreateMutation } from "@/services/constructorFieldService";
import constructorViewService from "@/services/constructorViewService";
import { useQuery, useQueryClient } from "react-query";
import constructorTableService from "@/services/constructorTableService";
import { useFieldUpdateMutation } from "@/services/constructorFieldService";
import { useViewContext } from "@/providers/ViewProvider";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { AutoFill } from "../AutoFill";
import { AutoFilter } from "../AutoFilter";
import { FieldHide } from "../FieldHide";
import { Field } from "../Field";
import { FormulaField } from "../FormulaField";
import { Box } from "@mui/material";

export const useFieldPopoverProps = ({
  mainForm,
  onClose,
  getRelationFields,
  slug,
  isTableView = false,
  selectedTabIndex,
  menuItem,
  formType,
  selectedAutofillFieldSlug,
  field,
  setFolder = () => {},
  submitCallback = () => {},
}) => {
  const SETTING_TYPES = {
    VALIDATION: "Validation",
    AUTO_FILL: "Autofill",
    AUTO_FILTER: "Auto Filter",
    FIELD_HIDE: "Field Hide",
    FIELD: "Field",
    TYPE: "Type",
  };

  const { id, appId, tableSlug: tableSlugParams } = useParams();

  const { view } = useViewContext();

  const menuItemStore = useSelector((state) => state.menu.menuItem);

  const tableLan = useGetLang("Table");
  const tableSlug = tableSlugParams || view?.table_slug;

  const queryClient = useQueryClient();

  const { i18n } = useTranslation();

  const defaultOptions = {
    todo: {
      options: [
        {
          label: "In process",
          color: "#EAECF0",
          colorName: "Gray",
        },
      ],
    },
    progress: {
      options: [
        {
          label: "Ready for test",
          color: "#FFD6AE",
          colorName: "Orange",
        },
      ],
    },
    complete: {
      options: [
        {
          label: "Done",
          color: "#AAF0C4",
          colorName: "Green",
        },
      ],
    },
  };

  const languages = useSelector((state) => state.languages.list);
  const { handleSubmit, control, reset, watch, setValue, register } = useForm();

  const tableName = useWatch({
    control,
    name: "label",
  });

  const activeType = newFieldTypes?.find(
    (item) => item?.value === watch("type")
  );

  const [selectedSettings, setSelectedSettings] = useState("");

  const prependFieldInForm = (field) => {
    const fields = mainForm.getValues("fields") ?? [];
    mainForm.setValue(`fields`, [field, ...fields]);
  };

  const updateFieldInform = (field) => {
    const fields = mainForm.getValues("fields");
    const index = fields.findIndex((el) => el.id === field.id);

    mainForm.setValue(`fields[${index}]`, field);
    onSubmit(index, field);
  };

  const { mutate: updateOldField, isLoading: updateLoading } =
    useFieldUpdateMutation({
      onSuccess: (res) => {
        // updateFieldInform(field);
        onClose();
        getRelationFields();
      },
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
      if (!tableSlug) return false;
      return constructorTableService.getTableInfo(tableSlug, {
        data: { limit: 10, offset: 0, app_id: appId },
      });
    },
    {
      enabled: Boolean(!!tableSlug),
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

  const { mutate: createNewField, isLoading: createLoading } =
    useFieldCreateMutation({
      onSuccess: (res) => {
        prependFieldInForm(res);
        onClose();
        getRelationFields();
        addColumnToView(res);
      },
    });

  const createField = (field) => {
    const data = {
      ...field,
      id: generateGUID(),
      label: field?.attributes?.[`label_${i18n?.language}`] ?? field?.label,
      show_label: true,
    };
    if (tableSlug) {
      createNewField({ data, tableSlug: slug || tableSlug });
    } else {
      prependFieldInForm(data);
      onClose();
    }
  };

  const updateField = (field) => {
    if (id || menuItem?.table_id || menuItemStore.table_id) {
      updateOldField({ data: field, tableSlug: tableSlug });
    } else {
      updateFieldInform(field);
      onClose();
    }
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
      attributes: {
        ...values?.attributes,
        number_of_rounds: parseInt(values?.attributes?.number_of_rounds),
      },
    };

    console.log({ data });

    // if (formType === "CREATE") createField(data);
    // else updateField(data);
    // submitCallback();
  };

  const handleSelectSetting = (type) => {
    setSelectedSettings(type);
  };

  const getSelectedSettings = (type) => {
    switch (type) {
      case SETTING_TYPES.TYPE:
        return (
          <Box padding="0 8px 0">
            <FieldTypeList
              onSelect={() => handleSelectSetting("")}
              activeType={activeType}
              setValue={setValue}
            />
          </Box>
        );
      case SETTING_TYPES.AUTO_FILL:
        return (
          <Box padding="12px 8px">
            <AutoFill
              register={register}
              watch={watch}
              setValue={setValue}
              control={control}
              mainForm={mainForm}
            />
          </Box>
        );
      case SETTING_TYPES.AUTO_FILTER:
        return (
          <Box padding="12px 8px">
            <AutoFilter
              register={register}
              watch={watch}
              setValue={setValue}
              control={control}
              mainForm={mainForm}
            />
          </Box>
        );
      case SETTING_TYPES.VALIDATION:
        return (
          <Box padding="12px 8px">
            <Validation
              control={control}
              watch={watch}
              tableLan={tableLan}
              register={register}
              setValue={setValue}
            />
          </Box>
        );
      case SETTING_TYPES.FIELD_HIDE:
        return (
          <Box padding="12px 8px">
            <FieldHide control={control} />
          </Box>
        );
      case SETTING_TYPES.FIELD:
        if (
          activeType?.value === FIELD_TYPES.FORMULA ||
          activeType?.value === FIELD_TYPES.FORMULA_FRONTEND
        ) {
          return (
            <Box padding="12px 0px">
              <FormulaField
                control={control}
                mainForm={mainForm}
                fieldType={activeType?.value}
                menuItem={menuItem}
                tableSlug={tableSlug}
                setValue={setValue}
                watch={watch}
              />
            </Box>
          );
        } else {
          return (
            <Box padding="12px 8px">
              <Field control={control} />
            </Box>
          );
        }
      default:
        return null;
    }
  };

  useEffect(() => {
    const values = {
      attributes: {
        label: "",
        label_en: "",
        label_ru: "",
        label_uz: "",
        math: { label: "plus", value: "+" },
        ...defaultOptions,
      },
      default: "",
      index: "string",
      label: "",
      required: false,
      slug: "",
      table_id: tableSlug,
      type: FIELD_TYPES.SINGLE_LINE,
      relation_field: selectedAutofillFieldSlug,
    };
    if (formType !== "CREATE") {
      reset({
        ...values,
        ...field,
      });
      setFolder(field?.attributes?.path);
    } else {
      reset(values);
    }
  }, [field]);

  return {
    SETTING_TYPES,
    selectedSettings,
    handleSelectSetting,
    languages,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    register,
    tableName,
    getSelectedSettings,
    tableLan,
    onSubmit,
  };
};
