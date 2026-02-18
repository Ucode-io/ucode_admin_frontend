import { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import constructorObjectService from "@/services/constructorObjectService";
import request from "@/utils/request";
import { pageToOffset } from "@/utils/pageToOffset";
import useDebounce from "@/hooks/useDebounce";
import { useViewContext } from "@/providers/ViewProvider";

export const useSelectLogic = ({
  field,
  value,
  autoFiltersValue: externalAutoFiltersValue,
  type,
  rowData,
}) => {
  const { view } = useViewContext();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState([]);
  const [count, setCount] = useState(0);

  // Auto filters (matches CellRelationFormElementNew logic)
  const autoFilters = field?.attributes?.auto_filters;

  const computedAutoFiltersValue = useMemo(() => {
    const result = {};
    autoFilters?.forEach((item) => {
      const autoFilterFromCellValue = rowData?.find(
        (rowItem) => rowItem?.slug === item?.field_from,
      )?.value;

      const key = item?.field_to;
      if (key) result[key] = autoFilterFromCellValue;
    });
    return result;
  }, [autoFilters, rowData, value]);

  // Use rowData-based autoFilters when rowData is available, otherwise use externally passed value
  const autoFiltersValue = rowData?.length
    ? computedAutoFiltersValue
    : externalAutoFiltersValue || {};

  // Selectors for special logic
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  const clientTypeID = useSelector((state) => state?.auth?.clientType?.id);

  const handleSearch = useDebounce((val) => {
    setDebouncedSearch(val);
    setPage(1);
    setOptions([]);
    setCount(0);
  }, 300);

  // Determine if we should fetch data
  const isRelation =
    type === "relation" ||
    field?.type === "LOOKUP" ||
    field?.type === "RELATION" ||
    field?.type === "Many2One" ||
    field?.type === "Many2Many" ||
    field?.type === "LOOKUPS";
  const tableSlug = field?.table_slug || field?.id?.split("#")?.[0];
  const functionPath = field?.attributes?.function_path;

  // Compute objectIdFromJWT
  const objectIdFromJWT = useMemo(() => {
    if (field?.attributes?.object_id_from_jwt) {
      if (tableSlug === "client_type") return clientTypeID;
      const table = tables?.find((t) => t.table_slug === tableSlug);
      return table?.object_id;
    }
    if (field?.attributes?.is_user_id_default) return userId;
    return null;
  }, [field, tables, tableSlug, clientTypeID, userId]);

  const searchedMap = useMemo(() => {
    if (!field?.view_fields && !field?.attributes?.view_fields) return {};

    const result = {};
    (field?.attributes?.view_fields || field?.view_fields)?.forEach((item) => {
      const key = item?.slug;
      if (key) result[key] = debouncedSearch?.trim();
    });
    return result;
  }, [field, debouncedSearch]);

  const queryFn = async (pageProp) => {
    if ((!tableSlug && !functionPath) || !isRelation)
      return { options: [], count: 0 };

    const requestData = {
      ...autoFiltersValue,
      additional_request: {
        additional_field: "guid",
      },
      view_fields:
        field?.view_fields?.map((f) => f.slug) ||
        field?.attributes?.view_fields?.map((f) => f.slug),
      ...searchedMap,
      limit: 10,
      offset: pageToOffset(pageProp || page, 10),
      with_relations: false,
    };

    if (value) {
      const additionalValues = Array.isArray(value) ? value : [value];
      requestData.additional_request.additional_values =
        additionalValues?.flat();
    }

    if (functionPath) {
      const res = await request.post(`/invoke_function/${functionPath}`, {
        params: { from_input: true },
        data: {
          table_slug: tableSlug,
          ...requestData,
        },
      });
      return {
        options: res?.data?.response || [],
        count: res?.data?.count || 0,
      };
    } else {
      // const res = await constructorObjectService.getListV2(
      //   tableSlug,
      //   {
      //     data: requestData,
      //   },
      //   {
      //     language_setting: i18n?.language,
      //   },
      // );

      const res = await constructorObjectService.getItems(tableSlug);

      return {
        options: res?.data?.response || [],
        count: res?.data?.count || 0,
      };
    }
  };

  const { isFetching, refetch } = useQuery(
    ["SELECT_DATA", debouncedSearch, autoFiltersValue, value, tableSlug],
    () => queryFn(1),
    {
      enabled: isRelation && (!!tableSlug || !!functionPath),
      onSuccess: (data) => {
        if (!data) return;
        setOptions(data.options ?? []);
        setCount(data.count || data.options?.length || 0);
        setPage(1);
      },
    },
  );

  // Computed options for relation (matches CellRelationFormElementNew logic)
  const computedOptions = useMemo(() => {
    if (!isRelation) return [];
    const uniqueObjects = Array.from(new Set(options?.map(JSON.stringify))).map(
      JSON.parse,
    );

    if (tableSlug === "client_type") {
      return uniqueObjects?.filter(
        (item) => item?.table_slug === view?.table_slug,
      );
    }

    if (field?.attributes?.object_id_from_jwt && objectIdFromJWT) {
      return uniqueObjects?.filter((item) => {
        return item?.guid === objectIdFromJWT;
      });
    }
    return uniqueObjects ?? [];
  }, [options, field?.attributes?.auto_filters, isFetching]);

  // Static options for Status/Multiselect
  const staticOptions = useMemo(() => {
    if (type === "status") {
      return [
        ...(field?.attributes?.todo?.options || []),
        ...(field?.attributes?.progress?.options || []),
        ...(field?.attributes?.complete?.options || []),
      ];
    }
    if (type === "multiselect" || type === "MULTISELECT") {
      return field?.attributes?.options || [];
    }
    return [];
  }, [field, type]);

  const [loadingMore, setLoadingMore] = useState(false);

  async function loadMoreItems() {
    if (
      count <= computedOptions?.length ||
      Object.keys(autoFiltersValue)?.filter((item) => !!item)?.length ||
      loadingMore
    )
      return;

    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const data = await queryFn(nextPage);
      if (data?.options?.length) {
        setOptions((prev) => [...(prev ?? []), ...(data.options ?? [])]);
        setPage(nextPage);
      }
      setCount(data?.count || data?.options?.length || count);
    } catch (e) {
      console.error("loadMoreItems error", e);
    } finally {
      setLoadingMore(false);
    }
  }

  return {
    options: isRelation ? computedOptions : staticOptions,
    isFetching,
    handleSearch,
    loadMoreItems,
    refetch,
    debouncedSearch,
    count,
  };
};
