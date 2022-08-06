import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useId } from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import useDebounce from "../../../../hooks/useDebounce";
import constructorObjectService from "../../../../services/constructorObjectService";

const DefaultFilter = ({ field, onChange, name, tableSlug }) => {
  const filtersRedux = useSelector((state) => state?.filters?.filters);
  const { id } = useId();
  const [searchText, setSearchText] = useState("");

  const { data: options, isLoading } = useQuery(
    ["GET_OBJECT_LIST", tableSlug, searchText],
    () => {
      if (!tableSlug) return null;
      return constructorObjectService.getList(tableSlug, {
        data: { offset: 0, limit: 10, [field.slug]: searchText },
      });
    },
    {
      select: ({ data }) => {
        return [
          ...new Set(data.response?.map((el) => el[field.slug]) ?? []),
        ].filter((el) => el);
      },
    }
  );

  const search = useDebounce((_, searchText) => {
    setSearchText(searchText);
  }, 400);

  return (
    <Autocomplete
      id={id}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options ?? []}
      loading={isLoading}
      value={filtersRedux[name]}
      onInputChange={search}
      onChange={(e, val) => {
        onChange(val?.value ?? val, name);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={field.label}
          // label="Asynchronous"
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default DefaultFilter;
