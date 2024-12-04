import React, {useEffect, useMemo, useState} from "react";
import Select from "react-select";
import constructorObjectService from "../../../../services/constructorObjectService";
import {getRelationFieldTabsLabel} from "../../../../utils/getRelationFieldLabel";
import {useQuery} from "react-query";
import {useTranslation} from "react-i18next";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    // background: isBlackBg ? "#2A2D34" : disabled ? "#FFF" : "transparent",
    color: "#fff",
    width: "100%",
    display: "flex",
    alignItems: "center",
    border: "0px solid #fff",
    outline: "none",
    height: "100%",
  }),
  input: (provided) => ({
    ...provided,
    width: "100%",
    border: "none",
    height: "40px",
  }),
  placeholder: (provided) => ({
    ...provided,
    display: "flex",
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected ? "#007AFF" : provided.background,
    color: state.isSelected ? "#fff" : provided.color,
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const LookupCellEditor = (props) => {
  const [options, setOptions] = useState([]);
  const {i18n} = useTranslation();
  const {field, api, data, setValue} = props;
  const [localValue, setLocalValue] = useState(data?.[`${field?.slug}_data`]);

  const {data: optionsFromLocale, refetch} = useQuery(
    // ["GET_OBJECT_LIST", debouncedValue, autoFiltersValue, value, page],
    ["GET_OBJECT_LIST", field?.table_slug],
    () => {
      if (!field?.table_slug) return null;
      return constructorObjectService.getListV2(
        field?.table_slug,
        {
          data: {
            // ...autoFiltersValue,
            // additional_request: {
            //   additional_field: "guid",
            //   additional_values: [value],
            // },
            view_fields: field?.view_fields?.map((f) => f.slug),
            // search: debouncedValue.trim(),
            limit: 10,
            offset: 0,
            // offset: pageToOffset(page, 10),
            with_relations: false,
          },
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      // enabled: !field?.attributes?.function_path && Boolean(page > 1),
      // (!field?.attributes?.function_path && Boolean(debouncedValue)),
      enabled: Boolean(!options?.length),
      select: (res) => {
        const options = res?.data?.response ?? [];

        return {
          options,
        };
      },
      onSuccess: (data) => {
        // if (Object.keys(autoFiltersValue)?.length) {
        //   setOptions(data?.options);
        // } else if (data?.options?.length) {
        setOptions((prevOptions) => [
          ...(prevOptions ?? []),
          ...(data.options ?? []),
        ]);
        // }
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
    setValue(selectedOption?.guid);
    setLocalValue(selectedOption);
  };

  return (
    <Select
      id="aggrid_select"
      menuPortalTarget={document.body}
      styles={customStyles}
      value={localValue}
      options={computedOptions}
      getOptionLabel={(option) => `${getRelationFieldTabsLabel(field, option)}`}
      onChange={handleChange}
      isOptionSelected={(option, value) =>
        value.some((val) => val.guid === value)
      }
    />
  );
};

export default LookupCellEditor;
