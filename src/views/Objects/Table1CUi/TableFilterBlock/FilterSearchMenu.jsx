import React, {useMemo, useState} from "react";
import {TextField} from "@mui/material";
import NewFiltersAutoComplete from "./FastFilter/NewFiltersAutoComplete";
import NewDefaultFilter from "./FastFilter/NewDefaultFilter";
import NewRelationFilter from "./FastFilter/NewRelationFilter";

function FilterSearchMenu({
  field = {},
  name,
  filters = {},
  onChange = () => {},
  tableSlug,
}) {
  const [debouncedValue, setDebouncedValue] = useState("");
  const computedOptions = useMemo(() => {
    if (!field.attributes?.options) return [];
    return field.attributes.options.map((option) => {
      if (field.type === "PICK_LIST")
        return {
          value: option.value,
          label: option.value,
        };
      if (field.type === "MULTISELECT")
        return {
          value: option.value,
          label: option.label ?? option.value,
        };
    });
  }, [field.attributes?.options, field.type]);

  switch (field.type) {
    case "LOOKUP":
    case "LOOKUPS":
      return (
        <NewRelationFilter
          field={field}
          filters={filters}
          onChange={onChange}
          name={name}
          tableSlug={tableSlug}
        />
      );

    case "PICK_LIST":
    case "MULTISELECT":
      return (
        <NewFiltersAutoComplete
          searchText={debouncedValue}
          setSearchText={setDebouncedValue}
          options={computedOptions}
          value={filters[name] ?? []}
          onChange={(val) => onChange(val?.length ? val : undefined, name)}
          label={field.label}
          field={field}
        />
      );

    case "PHOTO":
      return null;

    // case "DATE_TIME_WITHOUT_TIME_ZONE":
    // case "DATE":
    // case "DATE_TIME":
    //   return (
    //     <DateFilter
    //       field={field}
    //       placeholder={field?.label}
    //       value={filters[name]}
    //       onChange={(val) => onChange(val, name)}
    //     />
    //   );

    case "NUMBER":
      return (
        <TextField
          fullWidth
          size="small"
          placeholder={field.label}
          type="number"
          value={filters[name] ?? ""}
          onChange={(e) => onChange(Number(e.target.value) || undefined, name)}
        />
      );

    // case "SWITCH":
    //   return (
    //     <BooleanFilter
    //       filters={filters}
    //       onChange={onChange}
    //       name={name}
    //       field={field}
    //     />
    //   );

    default:
      return (
        <NewDefaultFilter
          field={field}
          filters={filters}
          onChange={onChange}
          name={name}
          tableSlug={tableSlug}
        />
      );
  }
}

export default FilterSearchMenu;
