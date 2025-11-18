import React, {useEffect, useMemo, useState} from "react";
import {useQuery} from "react-query";
import constructorObjectService from "@/services/constructorObjectService";
import {getRelationFieldTabsLabel} from "@/utils/getRelationFieldLabel";
import {Box} from "@mui/material";
import Select, {components} from "react-select";
import LaunchIcon from "@mui/icons-material/Launch";
import useTabRouter from "@/hooks/useTabRouter";
import {useParams, useSearchParams} from "react-router-dom";
import RowClickButton from "../RowClickButton";
import {pageToOffset} from "@/utils/pageToOffset";
import useDebounce from "@/hooks/useDebounce";

const customStyles = {
  control: (provided) => ({
    ...provided,
    height: "32px",
    minHeight: "25px",
    background: "transparent",
    boxSizing: "border-box",
    width: "100%",
    border: "none",
    outline: "none",
  }),
  container: (provided) => ({
    ...provided,
    height: "32px",
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
    height: "30px",
    outline: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "13px",
    color: "#888",
    fontWeight: "300",
  }),
};

const LookupCellEditor = (props) => {
  const [options, setOptions] = useState([]);
  const {field, setValue, data, value} = props;
  const [page, setPage] = useState(1);
  const [localValue, setLocalValue] = useState(
    data?.[`${field?.slug}_data`] ?? null
  );
  const disabled =
    field?.attributes?.disabled ||
    !field?.attributes?.field_permission?.edit_permission;
  const autoFilters = field?.attributes?.auto_filters;

  const {tableSlug} = useParams();
  const {navigateToForm} = useTabRouter();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const [inputValue, setInputValue] = useState(null);
  const [autoFiltersValue, setAutoFiltersValue] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [editing, setEditing] = useState(false);
  const [openOnEdit, setOpenOnEdit] = useState(false);

  function loadMoreItems() {
    if (field?.attributes?.function_path) {
      setPage((prevPage) => prevPage + 1);
    } else {
      setPage((prevPage) => prevPage + 1);
    }
  }

  const {refetch} = useQuery(
    ["GET_OBJECT_LIST", field?.table_slug, autoFiltersValue, page, searchText],
    () => {
      if (!field?.table_slug) return null;
      return constructorObjectService.getListV2(field?.table_slug, {
        data: {
          view_fields: [
            ...(field?.view_fields?.map((f) => f?.slug) ?? []),
            field?.slug,
          ],
          limit: 10,
          search: searchText,
          offset: pageToOffset(page, 10),
          with_relations: false,
          ...autoFiltersValue,
        },
      });
    },
    {
      enabled: Boolean(page > 1) || Boolean(searchText),
      select: (res) => res?.data?.response ?? [],
      onSuccess: (fetchedOptions) => {
        if (Boolean(searchText)) {
          setOptions(fetchedOptions);
        } else if (Boolean(field?.attributes?.auto_filters?.[0]?.field_from)) {
          setOptions(fetchedOptions);
        } else
          setOptions((prevOptions) => [
            ...(prevOptions ?? []),
            ...(fetchedOptions ?? []),
          ]);
      },
    }
  );

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };

  const computedOptions = useMemo(() => {
    const uniqueObjects = Array.from(new Set(options.map(JSON.stringify))).map(
      JSON.parse
    );
    return uniqueObjects ?? [];
  }, [options]);

  const handleChange = (selectedOption) => {
    setInputValue(selectedOption);
    setLocalValue(selectedOption);
    setValue(selectedOption?.guid || null);
    setEditing(false);
  };

  const calculateAutoFilter = (dataVal) => {
    const result = {};
    autoFilters?.forEach((filter) => {
      const fromValue = dataVal?.[filter.field_from];
      if (filter.field_to && fromValue !== undefined) {
        result[filter.field_to] = fromValue;
      }
    });

    setOptions([]);
    setAutoFiltersValue(result);
  };

  const onMenuOpen = () => {
    if (Boolean(autoFilters?.[0]?.field_from)) {
      calculateAutoFilter(props?.node?.data);
    } else {
      refetch();
    }
  };

  const handleClickToEdit = () => {
    if (!disabled) {
      setEditing(true);
      setOpenOnEdit(true);
      refetch();

      if (autoFilters?.[0]?.field_from) {
        calculateAutoFilter(props?.node?.data);
      }
    }
  };

  useEffect(() => {
    if (
      autoFilters?.length >= 1 &&
      autoFiltersValue &&
      Object.keys(autoFiltersValue).length > 0
    ) {
      refetch();
    }
  }, [autoFiltersValue]);

  const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
      <div
        className="select_icon"
        style={{display: "flex", alignItems: "center"}}
        onClick={() => {
          refetch();
        }}>
        {props.children}
        {!disabled && (
          <Box
            sx={{position: "relative", zIndex: 99999, height: "22px"}}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigateToForm(tableSlug, "EDIT", localValue, {}, menuId);
            }}>
            <LaunchIcon
              style={{
                fontSize: "18px",
                marginLeft: "5px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            />
          </Box>
        )}
      </div>
    </components.SingleValue>
  );

  const inputChangeHandler = useDebounce((val) => setSearchText(val), 500);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          cursor: disabled ? "default" : "pointer",
        }}
        onClick={handleClickToEdit}>
        {!editing ? (
          <Box
            sx={{
              padding: "0 5px",
              display: "flex",
              alignItems: "center",
              height: "30px",
              width: "100%",
            }}
            onClick={handleClickToEdit}>
            {getRelationFieldTabsLabel(field, localValue) || "dasdasds"}
            {Boolean(localValue) && (
              <Box
                sx={{
                  position: "relative",
                  zIndex: 99999,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToForm(tableSlug, "EDIT", localValue, {}, menuId);
                }}>
                <LaunchIcon
                  style={{
                    fontSize: "18px",
                    marginLeft: "5px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Select
            onInputChange={inputChangeHandler}
            onMenuScrollToBottom={loadMoreItems}
            disabled={disabled}
            menuIsOpen={openOnEdit}
            autoFocus
            onBlur={() => setEditing(false)}
            isClearable={true}
            placeholder="Select..."
            menuPortalTarget={document.body}
            styles={customStyles}
            value={inputValue ?? localValue}
            options={computedOptions}
            getOptionValue={(option) => option?.guid === value}
            getOptionLabel={(option) =>
              `${getRelationFieldTabsLabel(field, option)}`
            }
            components={{
              SingleValue: CustomSingleValue,
            }}
            onMenuClose={() => setOpenOnEdit(false)}
            onChange={handleChange}
            onMenuOpen={onMenuOpen}
          />
        )}
      </Box>

      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} />
      )}
    </>
  );
};

export default React.memo(LookupCellEditor);
