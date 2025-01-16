import React, {useMemo, useState} from "react";
import {useQuery} from "react-query";
import Select from "react-select";
import constructorObjectService from "../../../../services/constructorObjectService";
import {getRelationFieldTabsLabel} from "../../../../utils/getRelationFieldLabel";
import {Box} from "@mui/material";

const customStyles = {
  control: (provided) => ({
    ...provided,
    height: "100%",
    minHeight: "40px",
    boxSizing: "border-box",
    width: "100%",
    border: "none",
    outline: "none",
  }),
  container: (provided) => ({
    ...provided,
    height: "100%",
    width: "100%",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    height: "100%",
    outline: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
    color: "#888",
  }),
};

const LookupCellEditor = (props) => {
  const [options, setOptions] = useState([]);
  const {field, setValue, data, value} = props;
  const [localValue, setLocalValue] = useState(
    data?.[`${field?.slug}_data`] ?? null
  );
  const [inputValue, setInputValue] = useState(null);

  const {refetch} = useQuery(
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
      select: (res) => res?.data?.response ?? [],
      onSuccess: (fetchedOptions) => {
        setOptions((prevOptions) => [
          ...(prevOptions ?? []),
          ...(fetchedOptions ?? []),
        ]);
      },
    }
  );

  const computedOptions = useMemo(() => {
    const uniqueObjects = Array.from(new Set(options.map(JSON.stringify))).map(
      JSON.parse
    );
    return uniqueObjects ?? [];
  }, [options]);

  const handleChange = (selectedOption) => {
    setInputValue(selectedOption);
    setValue(selectedOption?.guid);
    setLocalValue(selectedOption);
    setValue(selectedOption?.guid || null);
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}>
      <Select
        isClearable={true}
        placeholder="Select"
        menuPortalTarget={document.body}
        styles={customStyles}
        value={inputValue ?? localValue}
        options={computedOptions}
        getOptionValue={(option) => option?.guid === value}
        getOptionLabel={(option) =>
          `${getRelationFieldTabsLabel(field, option)}`
        }
        onChange={handleChange}
        onMenuOpen={() => {
          refetch();
        }}
      />
    </Box>
  );
};

export default LookupCellEditor;
