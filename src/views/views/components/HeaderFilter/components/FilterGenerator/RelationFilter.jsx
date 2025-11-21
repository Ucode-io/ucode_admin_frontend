import { useState } from "react";
import FilterAutoComplete from "./FilterAutocomplete";
import { useTranslation } from "react-i18next";
import { getRelationFieldTabsLabel } from "@/utils/getRelationFieldLabel";
import { constructorObjectService } from "@/services/objectService/object.service";
import { useQuery } from "react-query";

const RelationFilter = ({ field = {}, filters, name, onChange }) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [chosenField, setChosenField] = useState(null);
  const { i18n } = useTranslation();
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
        chosenField,
      },
    ],
    queryFn: () => {
      return constructorObjectService.getListV2(chosenField?.table_slug, {
        data: {
          view_fields: field?.view_fields?.map((field) => field.slug),
          search: debouncedValue,
          limit: 10,
          additional_ids: filters[name],
          additional_request: {
            additional_field: "guid",
            additional_values: filters[name],
          },
        },
      });
    },
    enabled: Boolean(chosenField?.table_slug),
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

  return (
    <FilterAutoComplete
      field={field}
      searchText={debouncedValue}
      setSearchText={setDebouncedValue}
      value={filters[name] ?? []}
      onChange={(val) => {
        onChange(val?.length ? val : undefined, name);
      }}
      options={options}
      setChosenField={setChosenField}
      label={field.label || field?.attributes?.[`label_${i18n?.language}`]}
    />
  );
};

export default RelationFilter;
