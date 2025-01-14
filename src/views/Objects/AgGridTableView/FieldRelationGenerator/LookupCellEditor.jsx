import React, {useMemo, useState} from "react";
import {useQuery} from "react-query";
import Select from "react-select";
import constructorObjectService from "../../../../services/constructorObjectService";
import {getRelationFieldTabsLabel} from "../../../../utils/getRelationFieldLabel";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    color: "#fff",
    border: "0px solid #fff",
    outline: "none",
  }),
  input: (provided) => ({
    ...provided,
    width: "100%",
    border: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    display: "flex",
  }),
};

const LookupCellEditor = (props) => {
  const [options, setOptions] = useState([]);
  const {field, api, data, setValue, value} = props;
  const [localValue, setLocalValue] = useState(
    data?.[`${field?.slug}_data`] ?? null
  );
  const [inputValue, setInputValue] = useState(null);

  const {data: optionsFromLocale, refetch} = useQuery(
    ["GET_OBJECT_LIST", field?.table_slug],
    () => {
      if (!field?.table_slug) return null;
      return constructorObjectService.getListV2(field?.table_slug, {
        data: {
          view_fields: field?.view_fields?.map((f) => f.slug),
          limit: 10,
          offset: 0,
          with_relations: false,
        },
      });
    },
    {
      enabled: false,
      select: (res) => {
        const options = res?.data?.response ?? [];
        return {
          options,
        };
      },
      onSuccess: (data) => {
        setOptions((prevOptions) => [
          ...(prevOptions ?? []),
          ...(data.options ?? []),
        ]);
      },
    }
  );

  const computedOptions = useMemo(() => {
    const uniqueObjects = Array.from(new Set(options?.map(JSON.stringify))).map(
      JSON.parse
    );
    return uniqueObjects ?? [];
  }, [options]);

  const handleChange = (selectedOption) => {
    setInputValue(selectedOption);
    setValue(selectedOption?.guid);
  };

  return (
    <Select
      placeholder="Select"
      id="aggrid_select"
      menuPortalTarget={document.body}
      styles={customStyles}
      value={inputValue ?? localValue}
      options={computedOptions}
      getOptionLabel={(option) => `${getRelationFieldTabsLabel(field, option)}`}
      onChange={handleChange}
      isOptionSelected={(option, value) =>
        value.some((val) => val.guid === value)
      }
      onMenuOpen={(e) => {
        refetch();
      }}
    />
  );
};

export default LookupCellEditor;
