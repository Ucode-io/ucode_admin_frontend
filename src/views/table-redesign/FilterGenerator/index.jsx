import {useMemo, useState} from "react";
import BooleanFilter from "./BooleanFilter";
import DateFilter from "./DateFilter";
import DefaultFilter from "./DefaultFilter";
import FilterAutoComplete from "./FilterAutocomplete";
import RelationFilter from "./RelationFilter";
import TableOrderingButton from "@/components/TableOrderingButton";
import {FIELD_TYPES} from "../../../utils/constants/fieldTypes";
import YDateFilter from "./YDateFilter";
import { useTranslation } from "react-i18next";

const FilterGenerator = ({
  field,
  name,
  filters = {},
  onChange = () => {},
  tableSlug,
}) => {
  const orderingType = useMemo(
    () => filters.order?.[name],
    [filters.order, name],
  );

  const onOrderingChange = (value) => {
    if (!value) return onChange(value, "order");
    const data = {
      [name]: value,
    };
    onChange(data, "order");
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <TableOrderingButton value={orderingType} onChange={onOrderingChange} />
    </div>
  );
};

export default FilterGenerator;

export const Filter = ({
  field = {},
  name,
  filters = {},
  onChange,
  tableSlug,
}) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const { i18n } = useTranslation();
  const computedOptions = useMemo(() => {
    if (field.type === FIELD_TYPES.STATUS) {
      const { todo, complete, progress } = field.attributes;
      const options = [
        ...todo?.options,
        ...complete?.options,
        ...progress?.options,
      ];
      return options?.map((item) => ({
        label: item?.[`label_${i18n.language}`] || item.label,
        value: item.value || item.label,
      }));
    }
    if (!field.attributes?.options) return [];
    return field.attributes.options.map((option) => {
      if (field.type === "PICK_LIST")
        return {
          value: option.value,
          label: option.value,
        };
      if (field.type === "MULTISELECT")
        return {
          value: option.slug || option.value,
          label:
            option?.[`label_${i18n.language}`] || option.label || option.value,
          ...option,
        };
    });
  }, [field.attributes?.options, field.type]);
  console.log(filters[name]);
  switch (field.type) {
    case "LOOKUP":
    case "LOOKUPS":
      return (
        <RelationFilter
          field={field}
          filters={filters}
          onChange={onChange}
          name={name}
          tableSlug={tableSlug}
        />
      );

    case "PICK_LIST":
    case "MULTISELECT":
    case "STATUS":
      return (
        <FilterAutoComplete
          searchText={debouncedValue}
          setSearchText={setDebouncedValue}
          options={computedOptions}
          value={filters[name] ?? []}
          onChange={(val) => onChange(val?.length ? val : undefined, name)}
          label={field?.[`label_${i18n?.language}`] ?? field?.label}
          field={field}
        />
      );

    case "PHOTO":
      return null;

    case "DATE":
      return (
        <YDateFilter
          field={field}
          placeholder={field?.label}
          value={filters[name]}
          onChange={(val) => onChange(val, name)}
        />
      );

    case "DATE_TIME":
    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return (
        <YDateFilter
          field={field}
          placeholder={field?.label}
          value={filters[name]}
          name={name}
          onChange={(val) => onChange(val, name)}
        />
      );

    // case "NUMBER":
    //   return (
    //     <TextField
    //       size="small"
    //       placeholder={field.label}
    //       type="number"
    //       value={filters[name] ?? ""}
    //       onChange={(e) => onChange(Number(e.target.value) || undefined, name)}
    //       inputProps={{
    //         style: {height: "23px", padding: "0 14px"},
    //       }}
    //       // InputProps={{
    //       //   startAdornment: (
    //       //     <InputAdornment position="start">
    //       //       {getColumnIcon({
    //       //         column: {type: "NUMBER", table_slug: field?.table_slug},
    //       //       })}
    //       //     </InputAdornment>
    //       //   ),
    //       // }}
    //     />
    //   );

    case "SWITCH":
      return (
        <BooleanFilter
          filters={filters}
          onChange={onChange}
          name={name}
          field={field}
        />
      );

    default:
      return (
        <DefaultFilter
          field={field}
          filters={filters}
          onChange={onChange}
          name={name}
          tableSlug={tableSlug}
        />
      );
  }
};
