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
}) => {

  const SETTING_TYPES = {
    VALIDATION: "Validation",
    AUTO_FILL: "Autofill",
    AUTO_FILTER: "Auto Filter",
    FIELD_HIDE: "Field Hide",
    TYPE: "Type",
  }

  const { id, appId, tableSlug: tableSlugParams } = useParams();

  const { view } = useViewContext();

  const menuItemStore = useSelector((state) => state.menu.menuItem);

  const tableLan = useGetLang("Table");
  const tableSlug = tableSlugParams || view?.table_slug;

  const queryClient = useQueryClient();

  const { i18n } = useTranslation();

  const languages = useSelector((state) => state.languages.list);
  const { handleSubmit, control, reset, watch, setValue, register } = useForm();

  const tableName = useWatch({
    control,
    name: "label",
  });

  const activeType = newFieldTypes?.find(item => item?.value === watch("type"))

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
    if (formType === "CREATE") createField(data);
    else updateField(data);
  }

  const handleSelectSetting = (type) => {
    setSelectedSettings(type)
  };

  const getSelectedSettings = (type) => {
    switch(type) {
      case SETTING_TYPES.TYPE:
        return <FieldTypeList onSelect={() => handleSelectSetting("")} activeType={activeType} setValue={setValue} />
      case SETTING_TYPES.AUTO_FILL:
        return <></>
      case SETTING_TYPES.AUTO_FILTER:
        return <></>
      case SETTING_TYPES.VALIDATION:
        return <Validation
          control={control}
          watch={watch}
          tableLan={tableLan}
          register={register}
          setValue={setValue}
        />
      case SETTING_TYPES.FIELD_HIDE:
        return <></>
      default:
        return null
    }
  }

  useEffect(() => {
    const values = {
      attributes: {},
      default: "",
      index: "string",
      label: "",
      required: false,
      slug: "",
      table_id: tableSlug,
      type: "",
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
  }
}
