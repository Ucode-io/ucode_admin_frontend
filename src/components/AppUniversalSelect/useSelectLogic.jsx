import { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import constructorObjectService from "@/services/constructorObjectService";
import request from "@/utils/request";
import { pageToOffset } from "@/utils/pageToOffset";
import useDebounce from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";

export const useSelectLogic = ({
  field,
  value,
  autoFiltersValue,
  type,
}) => {
  const { i18n } = useTranslation();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState([]);

  // Selectors for special logic
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  const clientTypeID = useSelector((state) => state?.auth?.clientType?.id);

  const handleSearch = useDebounce((val) => {
    setDebouncedSearch(val);
    setPage(1);
  }, 300);

  // Determine if we should fetch data
  const isRelation = type === "relation" || field?.type === "LOOKUP" || field?.type === "RELATION" || field?.type === "Many2One" || field?.type === "Many2Many" || field?.type === "LOOKUPS";
  const tableSlug = field?.table_slug || field?.id?.split("#")?.[0];
  const functionPath = field?.attributes?.function_path;

  // Compute objectIdFromJWT
  const objectIdFromJWT = useMemo(() => {
    if (field?.attributes?.object_id_from_jwt) {
      if (tableSlug === "client_type") return clientTypeID;
      const table = tables?.find(t => t.table_slug === tableSlug);
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

  const queryFn = async () => {
    if ((!tableSlug && !functionPath) || !isRelation) return { options: [], count: 0 };

    const requestData = {
      ...autoFiltersValue,
      search: debouncedSearch,
      limit: 10,
      offset: pageToOffset(page, 10),
      view_fields: field?.attributes?.view_fields?.map(f => f.slug) || field?.view_fields?.map(f => f.slug) || [],
      additional_request: {
        additional_field: "guid"
      },
      ...searchedMap,
      with_relations: false
    };

    if (value) {
      requestData.additional_request.additional_values = (Array.isArray(value) ? value : [value]).map(v => v?.guid || v);
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
        count: res?.data?.count || 0
      };
    } else {
      const res = await constructorObjectService.getListV2(tableSlug, {
        data: requestData
      }, { language_setting: i18n?.language });
      return {
        options: res?.data?.response || [],
        count: res?.data?.count || 0
      };
    }
  };

  const { isFetching, refetch } = useQuery(
    ["SELECT_DATA", tableSlug, functionPath, debouncedSearch, page, autoFiltersValue, value],
    queryFn,
    {
      enabled: isRelation && (!!tableSlug || !!functionPath),
      keepPreviousData: true,
      onSuccess: (data) => {
        if (!data) return;
        setOptions(prev => {
          if (page === 1) return data.options;
          // Filter duplicates just in case
          const newOptions = data.options.filter(
            newOpt => !prev.some(prevOpt => prevOpt.guid === newOpt.guid)
          );
          return [...prev, ...newOptions];
        });
      }
    }
  );

  // Filter options based on objectIdFromJWT if applicable
  const filteredOptions = useMemo(() => {
    if (!objectIdFromJWT) return options;
    return options.filter(opt => opt.guid === objectIdFromJWT);
  }, [options, objectIdFromJWT]);

  // Static options for Status/Multiselect
  const staticOptions = useMemo(() => {
    if (type === "status") {
      return [
        ...(field?.attributes?.todo?.options || []),
        ...(field?.attributes?.progress?.options || []),
        ...(field?.attributes?.complete?.options || [])
      ];
    }
    if (type === "multiselect" || type === "MULTISELECT") {
      return field?.attributes?.options || [];
    }
    return [];
  }, [field, type]);


  return {
    options: isRelation ? filteredOptions : staticOptions,
    isFetching,
    handleSearch,
    setPage,
    refetch,
    debouncedSearch
  };
};
