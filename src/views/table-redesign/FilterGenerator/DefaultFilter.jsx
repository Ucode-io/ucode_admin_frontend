import {useMemo} from "react";
import {useState} from "react";

import FilterAutoComplete from "./FilterAutocomplete";
import useObjectsQuery from "@/queries/hooks/useObjectsQuery";

const DefaultFilter = ({field, filters, onChange, name, tableSlug}) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [data, setData] = useState([]);

  const value = filters[name];

  const options = useMemo(() => {
    const result = [...new Set(data.map((el) => el[field.slug]) ?? [])]
      .filter((el) => el)
      ?.map((el) => ({
        label: el,
        value: el,
      }));
    return result;
  }, [field.slug, data]);

  const {query} = useObjectsQuery({
    tableSlug: tableSlug,
    queryPayload: {
      [name || field?.slug]: debouncedValue,
      limit: 10,
      additional_ids: value,
    },
    queryParams: {
      enabled: !!debouncedValue,
      onSuccess: (res) => {
        setData(res?.data?.response ?? []);
      },
    },
  });

  return (
    <FilterAutoComplete
      searchText={debouncedValue}
      setSearchText={setDebouncedValue}
      options={options}
      value={filters[name] ?? []}
      onChange={(val) => onChange(val?.length ? val : undefined, name)}
      field={field}
      label={field.label}
    />
  );
};

export default DefaultFilter;
