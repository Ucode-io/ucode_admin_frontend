import { FilterDropdown } from "../FilterDropdown"
import { useQuery } from "react-query";
import { constructorObjectService } from "@/services/objectService/object.service";
import { useState } from "react";
import { getRelationFieldTabsLabel } from "@/utils/getRelationFieldLabel";
import { useTranslation } from "react-i18next";
import useDebounce from "@/hooks/useDebounce";

export const DefaultFilterRelation = ({
  defaultValue,
  handleChange,
  field,
}) => {

  const { i18n } = useTranslation();

  const [debouncedValue, setDebouncedValue] = useState("");

  const handleSearch = useDebounce((value) => {
    setDebouncedValue(value);
  }, 500);

  const {
    data: { data: options = [] } = {
      data: [],
    },
  } = useQuery({
    queryKey: [
      "GET_OBJECTS_LIST",
      {
        field,
        debouncedValue,
      },
    ],
    queryFn: () => {
      return constructorObjectService.getListV2(field?.table_slug, {
        data: {
          view_fields: field?.view_fields?.map((field) => field.slug),
          search: debouncedValue,
          limit: 10,
          additional_ids: defaultValue,
          additional_request: {
            additional_field: "guid",
            additional_values: defaultValue,
          },
        },
      });
    },
    enabled: Boolean(field?.table_slug),
    select: (res) => {
      return {
        data:
          res.data?.response?.map((el) => ({
            label: getRelationFieldTabsLabel(field, el, i18n?.language),
            value: el.guid,
          })) ?? [],
      };
    },
  });

  const defaultValueOption = options.filter((option) => defaultValue?.includes(option?.value));  

  return <FilterDropdown 
    defaultValue={defaultValueOption}
    onChange={(value) => handleChange(value, field.slug)}
    options={options}
    placeholder={"Filter by"}
    onSearch={handleSearch}
    searchable
    multiple
  />
}