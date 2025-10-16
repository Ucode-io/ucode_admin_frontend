import { useEffect, useMemo, useState } from "react";
import { Additional } from "../Additional";
import { AutoFilter } from "../../../components/AutoFilter/AutoFilter";
import { useForm } from "react-hook-form";
import { useViewContext } from "@/providers/ViewProvider";
import { useParams } from "react-router-dom";
import { useRelationGetByIdQuery } from "@/services/relationService";
import constructorRelationService from "@/services/constructorRelationService";

export const useRelationPopoverProps = ({
  relation,
  formType,
  getRelationFields,
  closeSettingsBlock,
  submitCallback,
}) => {
  const { view } = useViewContext();
  const { tableSlug: tableSlugParam } = useParams();
  const tableSlug = tableSlugParam || view?.table_slug;

  const [formLoader, setFormLoader] = useState(false);
  const [loader, setLoader] = useState(false);

  const { handleSubmit, control, reset, watch, setValue, register } = useForm({
    defaultValues: {
      table_from: tableSlug,
      auto_filters: [
        {
          field_from: "",
          field_to: "",
        },
      ],
      action_relations: [],
    },
  });

  const SETTING_TYPES = {
    ADDITIONAL: "Additional",
    AUTO_FILTER: "Auto Filter",
  };

  const [selectedSettings, setSelectedSettings] = useState(null);

  const handleSelectSetting = (type) => {
    setSelectedSettings(type);
  };

  const values = watch();

  const relatedTableSlug = useMemo(() => {
    if (values.type === "Recursive") return values.table_from;
    if (values.table_to === tableSlug) return values.table_from;
    else if (values.table_from === tableSlug) return values.table_to;
    return null;
  }, [values, tableSlug]);

  const updateRelations = async () => {
    setLoader(true);

    await getRelationFields();

    closeSettingsBlock(null);
    setLoader(false);
  };

  const submitHandler = (values) => {
    const data = {
      ...values,
      relation_table_slug: relatedTableSlug ?? tableSlug,

      quick_filters: values.filtersList
        ?.filter((el) => el.is_checked)
        ?.map((el) => ({
          field_id: el.id,
          default_value: "",
        })),

      default_values: values?.default_values
        ? Array.isArray(values.default_values)
          ? values.default_values
          : [values.default_values]
        : [],
    };

    delete data?.formula_name;

    setFormLoader(true);

    if (formType === "CREATE") {
      constructorRelationService
        .create(
          {
            ...data,
            label: Object.values(data?.attributes).find((item) => item),
          },
          tableSlug
        )
        .then((res) => {
          updateRelations();
        })
        .finally(() => {
          setFormLoader(false);
          reset({});
        });
    } else {
      constructorRelationService
        .update(data, tableSlug)
        .then((res) => {
          updateRelations();
        })
        .finally(() => {
          setFormLoader(false);
          reset({});
        });
    }
    submitCallback();
  };

  const getSelectedSettings = (type) => {
    switch (type) {
      case SETTING_TYPES.ADDITIONAL:
        return (
          <Additional
            control={control}
            watch={watch}
            register={register}
            setValue={setValue}
            required={relation?.required}
          />
        );
      case SETTING_TYPES.AUTO_FILTER:
        return (
          <AutoFilter
            control={control}
            watch={watch}
            register={register}
            setValue={setValue}
          />
        );
      default:
        return null;
    }
  };

  const { isLoading: relationLoading } = useRelationGetByIdQuery({
    tableSlug: tableSlug,
    id:
      relation?.attributes?.relation_data?.id ||
      relation?.relation_id ||
      relation?.id,
    queryParams: {
      enabled: Boolean(relation?.attributes?.relation_data?.id || relation?.id),
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
          auto_filters: res?.auto_filters,
          required: relation?.required,
        });
      },
    },
  });

  useEffect(() => {
    if (formType === "CREATE") {
      reset({});
    }
  }, [formType]);

  return {
    selectedSettings,
    handleSelectSetting,
    SETTING_TYPES,
    getSelectedSettings,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    register,
    submitHandler,
  };
};
