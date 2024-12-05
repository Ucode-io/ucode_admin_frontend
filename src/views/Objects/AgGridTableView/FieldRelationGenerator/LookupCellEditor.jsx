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
  const [localValue, setLocalValue] = useState();

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

  useEffect(() => {
    setLocalValue(data);
  }, [data]);

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
