import { FIELD_TYPES } from "@/utils/constants/fieldTypes"
import HFTextField from "@/components/FormElements/HFTextField";
import HFMultipleSelect from "@/components/FormElements/HFMultipleSelect";
import HFRelationFieldSetting from "@/components/FormElements/HFRelationFieldSetting";
import HFNumberField from "@/components/FormElements/HFNumberField";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import constructorTableService from "@/services/constructorTableService";
import { useParams } from "react-router-dom";
import { useViewContext } from "@/providers/ViewProvider";
import { useTranslation } from "react-i18next";

export const useFieldHideProps = ({ control }) => {

  const { i18n } = useTranslation();

  const { view } = useViewContext();
  const { id, appId, tableSlug: tableSlugParams } = useParams();

  const [selectedField, setSelectedField] = useState(null);

  const tableSlug = tableSlugParams || view?.table_slug;

  const computedMultiSelectOptions =
  selectedField?.options ?? selectedField?.attributes?.options;

  const getOnchangeField = (element) => {
    setSelectedField(element);
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

  const computedFilteredFields = useMemo(() => {
    return columns?.map((item) => ({
      label: item?.label || item?.attributes?.[`label_${i18n?.language}`],
      value: item?.slug,
      type: item?.type,
      options: item?.type === "MULTISELECT" ? item?.attributes?.options : [],
      table_slug: item?.table_slug,
      attributes: { ...item?.attributes },
    }));
  }, [columns]);

  const getHideField = (type) => {
    switch (type) {
      case FIELD_TYPES.MULTISELECT:
        return <HFMultipleSelect
          id="hide_multi_field"
          options={computedMultiSelectOptions}
          disabledHelperText
          name="attributes.hide_path"
          control={control}
          placeholder="Type"
        />
      case FIELD_TYPES.LOOKUP:
        return <HFRelationFieldSetting
          disabledHelperText
          id="hide_relation_field"
          name="attributes.hide_path"
          control={control}
          placeholder="Type"
          selectedField={selectedField}
        />
      case FIELD_TYPES.NUMBER:
        return <HFNumberField
          id="hide_path_field"
          type={"number"}
          disabledHelperText
          name="attributes.hide_path"
          control={control}
          placeholder="Hide "
        />
      default:
        return <HFTextField
          id="hide_field_path"
          disabledHelperText
          name="attributes.hide_path"
          control={control}
          placeholder="Type"
        />;
    }
  }

  return {
    getHideField,
    getOnchangeField,
    computedFilteredFields,
    selectedField,
  }
}
