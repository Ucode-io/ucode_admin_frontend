import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useViewContext } from "@/providers/ViewProvider";
import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import constructorTableService from "../../../../../../../services/constructorTableService";
import { relationTyes as relationTypes } from "../../../../../../../utils/constants/relationTypes";
import constructorObjectService from "../../../../../../../services/constructorObjectService";

export const useRelationFieldParamsProps = ({ watch, register, control, setValue }) => {

  const languages = useSelector((state) => state.languages.list);
  const { i18n } = useTranslation();

  const { view } = useViewContext();
  const { tableSlug: tableSlugParam } = useParams();
  const tableSlug = tableSlugParam || view?.table_slug;

  const params = {
    language_setting: i18n?.language,
  };

  const table_from = watch("table_from");
  const values = watch();

  const { data: app } = useQuery(["GET_TABLE_LIST"], () => {
    return constructorTableService.getList();
  });

  const { isLoading: fieldsLoading } = useQuery(
    ["GET_VIEWS_AND_FIELDS", values?.table_to, i18n?.language],
    () => {
      if (!values?.table_to) return [];
      return constructorObjectService.getList(
        values?.table_to,
        {
          data: { limit: 0, offset: 0 },
        },
        params
      );
    },
    {
      cacheTime: 10,
      onSuccess: ({ data }) => {
        if (!data) return;

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

  const computedTablesList = useMemo(() => {
    return app?.tables?.map((table) => ({
      value: table.slug,
      label: table.label,
    }));
  }, [app]);

  const isRecursiveRelation = useMemo(() => {
    return values.type === "Recursive";
  }, [values.type]);

  const computedRelationsTypesList = useMemo(() => {
    return relationTypes.map((type) => ({
      value: type,
      label: type,
    }));
  }, []);

  const computedFieldsListOptions = useMemo(() => {
    return values?.columnsList?.map((field) => ({
      label: field?.label || field?.view_fields?.[0]?.label,
      value: field?.id,
    }));
  }, [values.columnsList, values]);

  useEffect(() => {
    if (isRecursiveRelation) {
      setValue("table_to", table_from);
    }
  }, [isRecursiveRelation]);

  return {
    languages,
    i18n,
    computedTablesList,
    values,
    isRecursiveRelation,
    computedRelationsTypesList,
    computedFieldsListOptions,
  }

}
