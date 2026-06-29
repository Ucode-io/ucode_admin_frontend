import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import constructorTableService from "../../../../../../../services/constructorTableService";
import { relationTyes as relationTypes } from "../../../../../../../utils/constants/relationTypes";
import constructorObjectService from "../../../../../../../services/constructorObjectService";
import useDebounce from "../../../../../../../hooks/useDebounce";

const TABLES_LIMIT = 10;

const getTablesFromResponse = (response) => {
  return (
    response?.tables ??
    response?.response ??
    (Array.isArray(response) ? response : [])
  );
};

const getTablesCountFromResponse = (response) => {
  return response?.count ?? response?.total ?? response?.tables_count;
};

const mergeTableOptions = (options = []) => {
  return Array.from(
    new Map(
      options.filter(Boolean).map((option) => [option.value, option]),
    ).values(),
  );
};

export const useRelationFieldParamsProps = ({ watch, setValue }) => {
  const languages = useSelector((state) => state.languages.list);
  const { i18n } = useTranslation();
  const [tablePage, setTablePage] = useState(1);
  const [tableSearch, setTableSearch] = useState("");
  const [tableOptions, setTableOptions] = useState([]);
  const [hasMoreTables, setHasMoreTables] = useState(false);

  const params = {
    language_setting: i18n?.language,
  };

  const table_from = watch("table_from");
  const table_from_id = watch("table_from_id");
  const table_to_id = watch("table_to_id");
  const values = watch();

  const selectedTableIds = useMemo(
    () => [table_from_id, table_to_id].filter(Boolean),
    [table_from_id, table_to_id],
  );

  const selectedTableOptions = useMemo(
    () =>
      mergeTableOptions([
        values?.table_from
          ? {
              value: values.table_from,
              label: values.table_from_label || values.table_from,
            }
          : null,
        values?.table_to
          ? {
              value: values.table_to,
              label: values.table_to_label || values.table_to,
            }
          : null,
      ]),
    [
      values?.table_from,
      values?.table_from_label,
      values?.table_to,
      values?.table_to_label,
    ],
  );

  const { isFetching: tablesLoading } = useQuery(
    ["GET_TABLE_LIST", tablePage, tableSearch, selectedTableIds.join(",")],
    () => {
      return constructorTableService.getTableList({
        limit: TABLES_LIMIT,
        offset: (tablePage - 1) * TABLES_LIMIT,
        search: tableSearch?.trim() || undefined,
        ...(selectedTableIds.length
          ? {
              additional_request: JSON.stringify({
                additional_field: "id",
                additional_values: selectedTableIds,
              }),
            }
          : {}),
      });
    },
    {
      keepPreviousData: true,
      onSuccess: (response) => {
        const count = getTablesCountFromResponse(response);
        const nextOptions = getTablesFromResponse(response)?.map((table) => ({
          value: table.slug,
          label: table.label || table.slug,
        }));

        setTableOptions((prev) => {
          const mergedOptions =
            tablePage === 1
              ? mergeTableOptions(nextOptions)
              : mergeTableOptions([...prev, ...nextOptions]);

          setHasMoreTables(
            typeof count === "number"
              ? mergedOptions.length < count
              : nextOptions.length >= TABLES_LIMIT,
          );

          return mergedOptions;
        });
      },
    },
  );

  const { isLoading: fieldsLoading } = useQuery(
    ["GET_VIEWS_AND_FIELDS", values?.table_to, i18n?.language],
    () => {
      if (!values?.table_to) return [];
      return constructorObjectService.getList(
        values?.table_to,
        {
          data: { limit: 0, offset: 0 },
        },
        params,
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
          (field) => !values.columns?.includes(field.id),
        );

        const checkedFilters =
          values.quick_filters
            ?.map((filter) => {
              const field = fields.find(
                (field) => field.id === filter.field_id,
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
              (filter) => filter.field_id === field.id,
            ),
        );
        setValue("filtersList", [...checkedFilters, ...unCheckedFilters]);
        setValue("columnsList", [...checkedColumns, ...unCheckedColumns]);
      },
    },
  );

  const computedTablesList = useMemo(
    () => mergeTableOptions([...selectedTableOptions, ...tableOptions]),
    [selectedTableOptions, tableOptions],
  );

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

  const handleTableSearch = useDebounce((value) => {
    setTableSearch(value);
    setTablePage(1);
    setTableOptions([]);
  }, 300);

  const handleTableInputChange = (_, value, reason) => {
    if (reason === "input" || reason === "clear") {
      handleTableSearch(value);
    }
  };

  const handleTablesScroll = (event) => {
    const target = event.currentTarget;
    const isBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 5;

    if (isBottom && hasMoreTables && !tablesLoading) {
      setTablePage((prev) => prev + 1);
    }
  };

  return {
    languages,
    i18n,
    computedTablesList,
    handleTableInputChange,
    handleTablesScroll,
    tablesLoading,
    values,
    isRecursiveRelation,
    computedRelationsTypesList,
    computedFieldsListOptions,
  };
};
