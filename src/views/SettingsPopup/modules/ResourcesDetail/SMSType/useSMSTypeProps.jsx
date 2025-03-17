import { useQuery } from "react-query";
import { listToMap } from "../../../../../utils/listToMap";
import constructorTableService from "../../../../../services/constructorTableService";
import { useGetLang } from "../../../../../hooks/useGetLang";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import useFilters from "../../../../../hooks/useFilters";

export const useSMSTypeProps = ({ i18n }) => {
  const tableLan = useGetLang("Table");

  const tableSlug = "sms_template";

  const params = {
    language_setting: i18n?.language,
  };

  const visibleForm = useForm();

  const {
    control,
    reset,
    setValue: setFormValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      multi: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "multi",
  });

  const paginationCount = useSelector(
    (state) => state?.pagination?.paginationCount
  );

  const paginiationCount = useMemo(() => {
    const getObject = paginationCount.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageCount ?? 1;
  }, [paginationCount, tableSlug]);

  const [currentPage, setCurrentPage] = useState(paginiationCount);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortedDatas, setSortedDatas] = useState([]);
  const [menuItem, setMenuItem] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [checkedColumns, setCheckedColumns] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [selectedView, setSelectedView] = useState(null);

  const {
    data: { views, fieldsMap, visibleColumns, visibleRelationColumns } = {
      views: [],
      fieldsMap: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isLoading,
    refetch,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", tableSlug, i18n?.language],
    () => {
      if (Boolean(!tableSlug)) return [];
      return constructorTableService.getTableInfo(
        tableSlug,
        {
          data: {},
        },
        params
      );
    },
    {
      enabled: Boolean(tableSlug),

      select: ({ data }) => {
        return {
          views:
            data?.views?.filter(
              (view) => view?.attributes?.view_permission?.view === true
            ) ?? [],
          fieldsMap: listToMap(data?.fields),
          visibleColumns: data?.fields ?? [],
          visibleRelationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  const { filters } = useFilters(tableSlug, views[0]?.id);

  return {
    visibleColumns,
    visibleRelationColumns,
    views,
    fieldsMap,
    refetch,
    tableLan,
    currentPage,
    setCurrentPage,
    filterVisible,
    setFilterVisible,
    control,
    reset,
    setFormValue,
    getValues,
    watch,
    visibleForm,
    sortedDatas,
    setSortedDatas,
    menuItem,
    fields,
    formVisible,
    setFormVisible,
    filters,
    checkedColumns,
    searchText,
    selectedObjects,
    setSelectedObjects,
    selectedView,
  };
}