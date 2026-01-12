import { FilterDropdown } from "../FilterDropdown";
import { useQuery } from "react-query";
import { constructorObjectService } from "@/services/objectService/object.service";
import { useEffect, useMemo, useState } from "react";
import { getRelationFieldTabsLabel } from "@/utils/getRelationFieldLabel";
import { useTranslation } from "react-i18next";
import useDebounce from "@/hooks/useDebounce";
import { pageToOffset } from "@/utils/pageToOffset";

export const DefaultFilterRelation = ({
  defaultValue,
  handleChange = () => {},
  field,
}) => {
  const { i18n } = useTranslation();

  const [debouncedValue, setDebouncedValue] = useState("");
  const [enabled, setEnabled] = useState(false);

  const handleSearch = useDebounce((value) => {
    setDebouncedValue(value);
  }, 500);

  const queryFn = (page = 1) => {
    return constructorObjectService.getListV2(field?.table_slug, {
      data: {
        view_fields: field?.view_fields?.map((field) => field.slug),
        search: debouncedValue,
        limit: 10,
        offset: pageToOffset(page, 10),
        additional_ids: defaultValue,
        additional_request: {
          additional_field: "guid",
          additional_values: defaultValue,
        },
      },
    });
  };

  const {
    data: { data: options = [] } = {
      data: [],
    },
  } = useQuery({
    queryKey: [
      "GET_OBJECTS_LIST_RELATION_DEFAULT_FILTER",
      {
        field,
        debouncedValue,
      },
    ],
    queryFn,
    enabled,
    select: (res) => {
      return {
        data:
          res.data?.response?.map((el) => ({
            label: getRelationFieldTabsLabel(field, el, i18n?.language),
            value: el.guid,
          })) ?? [],
        count: res?.data?.count,
      };
    },
  });

  const defaultValueOption = useMemo(() => {
    return options.filter((option) => defaultValue?.includes(option?.value));
  }, [options]);

  const handleOpen = () => {
    setEnabled(true);
  };

  useEffect(() => {
    if (defaultValue?.length) setEnabled(true);
  }, [defaultValue]);

  return (
    <FilterDropdown
      defaultValue={defaultValueOption}
      onChange={(value) => handleChange(value, field.slug)}
      options={options}
      placeholder={"Filter by"}
      onClick={handleOpen}
      onSearch={handleSearch}
      searchable
      multiple
    />
  );
};
