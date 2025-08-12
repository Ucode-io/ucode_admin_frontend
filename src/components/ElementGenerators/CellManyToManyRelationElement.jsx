import {Close} from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LaunchIcon from "@mui/icons-material/Launch";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import request from "../../utils/request";
import CascadingElement from "./CascadingElement";
import styles from "./style.module.scss";
import { pageToOffset } from "../../utils/pageToOffset";
import Select from "react-select";
import { CustomSingleValue } from "./components/CustomSingleValue";
import { CustomMultiValue } from "./components/CustomMultiValue";
import { components } from "react-select";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
    heigth: "40px",
  },
}));

const CustomMultiValueRemove = (props) => {
  console.log({ props });
  return (
    <components.MultiValueRemove {...props}>
      <span
        // className={styles.closeIcon}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        {...props.innerProps}
        onClick={(e) => {
          e.stopPropagation();
          console.log(e);
        }}
      >
        <svg
          aria-hidden="true"
          role="graphics-symbol"
          viewBox="0 0 8 8"
          class="closeThick"
          style={{
            width: "8px",
            height: "8px",
            display: "block",
            fill: "rgba(50, 48, 44, 0.5)",
            flexShrink: 0,
            opacity: "0.5",
          }}
        >
          <polygon points="8 1.01818182 6.98181818 0 4 2.98181818 1.01818182 0 0 1.01818182 2.98181818 4 0 6.98181818 1.01818182 8 4 5.01818182 6.98181818 8 8 6.98181818 5.01818182 4"></polygon>
        </svg>
      </span>
    </components.MultiValueRemove>
  );
};

const CellManyToManyRelationElement = ({
  relOptions,
  isBlackBg,
  isFormEdit,
  control,
  name,
  updateObject,
  isNewTableView = false,
  disabled,
  placeholder,
  field,
  isLayout,
  disabledHelperText,
  setFormValue,
  index,
  defaultValue,
  row,
  newUi = false,
}) => {
  const classes = useStyles();
  if (!isLayout)
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return field?.attributes?.cascadings?.length === 4 ? (
            <CascadingElement
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              control={control}
              setValue={(value) => {
                onChange(value);
                !isNewTableView && updateObject();
              }}
              value={value}
              setFormValue={setFormValue}
              row={row}
              index={index}
            />
          ) : (
            <AutoCompleteElement
              relOptions={relOptions}
              disabled={disabled}
              isFormEdit={isFormEdit}
              placeholder={placeholder}
              isBlackBg={isBlackBg}
              value={value}
              classes={classes}
              name={name}
              defaultValue={defaultValue}
              setValue={(value) => {
                onChange(value);
                updateObject();
              }}
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              setFormValue={setFormValue}
              control={control}
              index={index}
              newUi={newUi}
            />
          );
        }}
      />
    );
};

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  relOptions,
  field,
  value,
  isFormEdit,
  placeholder,
  tableSlug,
  disabled,
  defaultValue,
  classes,
  isBlackBg,
  setValue = () => {},
  index,
  control,
  newUi,
  setFormValue = () => {},
}) => {
  const { navigateToForm } = useTabRouter();
  const [debouncedValue, setDebouncedValue] = useState("");
  const { i18n, t } = useTranslation();
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState([]);
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const { state } = useLocation();
  const isNewRouter = localStorage.getItem("new_router") === "true";

  const getOptionLabel = (option) => {
    return getRelationFieldTabsLabel(field, option, i18n.language);
  };
  function findMatchingProperty(obj, desiredLanguage) {
    const matchingProperty = Object.keys(obj).reduce((result, key) => {
      if (!result && key.includes(`_${desiredLanguage}`)) {
        result = obj[key];
      }
      return result;
    }, null);
    return matchingProperty;
  }
  const { id } = useParams();
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);

  const autoFilters = field?.attributes?.auto_filters;

  const autoFiltersFieldFroms = useMemo(() => {
    setPage(1);
    return autoFilters?.map((el) => `multi.${index}.${el.field_from}`) ?? [];
  }, [autoFilters, index]);

  const filtersHandler = useWatch({
    control,
    name: autoFiltersFieldFroms,
  });

  const autoFiltersValue = useMemo(() => {
    const result = {};
    filtersHandler?.forEach((value, index) => {
      const key = autoFilters?.[index]?.field_to;
      if (key) result[key] = value;
    });

    return result?.guid ? result : value;
  }, [autoFilters, filtersHandler, value]);

  // const { data: optionsFromFunctions } = useQuery(
  //   ["GET_OPENFAAS_LIST", tableSlug, autoFiltersValue, debouncedValue],
  //   () => {
  //     return request.post(
  //       `/invoke_function/${field?.attributes?.function_path}`,
  //       {
  //         params: {
  //           from_input: true,
  //         },
  //         data: {
  //           table_slug: tableSlug,
  //           ...autoFiltersValue,
  //           search: debouncedValue,
  //           limit: 10,
  //           offset: 0,
  //           view_fields:
  //             field?.view_fields?.map((field) => field.slug) ??
  //             field?.attributes?.view_fields?.map((field) => field.slug),
  //         },
  //       }
  //     );
  //   },
  //   {
  //     enabled: !!field?.attributes?.function_path,
  //     select: (res) => {
  //       const options = res?.data?.response ?? [];
  //       const slugOptions =
  //         res?.table_slug === tableSlug ? res?.data?.response : [];

  //       return {
  //         options,
  //         slugOptions,
  //       };
  //     },
  //   }
  // );
  const { data: optionsFromLocale } = useQuery(
    ["GET_OBJECT_LIST", debouncedValue, autoFiltersValue, field, page],
    () => {
      if (!field?.table_slug) return null;
      const additionalValues = [defaultValue || value || id];

      const requestData = {
        ...autoFiltersValue,
        additional_request: {
          additional_field: "guid",
        },
        view_fields: field.attributes?.view_fields?.map((f) => f.slug),
        search: debouncedValue.trim(),
        limit: 10,
        offset: pageToOffset(page, 10),
      };

      if (defaultValue || value || id) {
        requestData.additional_request.additional_values =
          additionalValues?.flat();
      }

      return constructorObjectService.getListV2(
        field?.table_slug,
        {
          data: requestData,
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      enabled: !field?.attributes?.function_path,
      select: (res) => {
        const options = res?.data?.response ?? [];
        const count = res?.data?.count;
        const slugOptions =
          res?.table_slug === tableSlug ? res?.data?.response : [];
        return {
          options,
          slugOptions,
          count,
        };
      },
      onSuccess: (data) => {
        if (page > 1) {
          setAllOptions((prevOptions) => [...prevOptions, ...data.options]);
        } else {
          setAllOptions(data?.options);
        }
      },
    }
  );

  const { data: optionsFromFunctions } = useQuery(
    ["GET_OPENFAAS_LIST", tableSlug, autoFiltersValue, debouncedValue, page],
    () => {
      return request.post(
        `/invoke_function/${field?.attributes?.function_path}`,
        {
          params: {
            from_input: true,
          },
          data: {
            table_slug: tableSlug,
            ...autoFiltersValue,
            search: debouncedValue,
            limit: 10,
            offset: pageToOffset(page, 10),
            view_fields:
              field?.view_fields?.map((field) => field.slug) ??
              field?.attributes?.view_fields?.map((field) => field.slug),
          },
        }
      );
    },
    {
      enabled: !!field?.attributes?.function_path,
      select: (res) => {
        const options = res?.data?.response ?? [];
        const slugOptions =
          res?.table_slug === tableSlug ? res?.data?.response : [];

        return {
          options,
          slugOptions,
        };
      },
      onSuccess: (data) => {
        if (page > 1) {
          setAllOptions((prevOptions) => [...prevOptions, ...data.options]);
        } else {
          setAllOptions(data?.options);
        }
      },
    }
  );

  const loadMoreItems = useDebounce(function () {
    if (field?.attributes?.function_path) {
      setPage((prevPage) => prevPage + 1);
    } else {
      setPage((prevPage) => prevPage + 1);
    }
  }, 500);

  const computedValue = useMemo(() => {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      const foundedValue = value
        ?.map((id) => {
          const option = allOptions?.find((el) => el?.guid === id);

          if (!option) return null;
          return {
            ...option,
          };
        })
        .filter((el) => el !== null);

      if (foundedValue?.length) {
        return foundedValue;
      }
      return [];
    } else {
      const option = allOptions?.find((el) => el?.guid === value);

      if (!option) return [];

      return [
        {
          ...option,
        },
      ];
    }
  }, [allOptions, optionsFromLocale?.options, value]);

  const changeHandler = (value) => {
    if (!value) setValue(null);
    const val = value?.map((el) => el.guid);

    setValue(val ?? null);
  };

  // useEffect(() => {
  //   const matchingOption = relOptions?.find(
  //     (item) => item?.table_slug === field?.table_slug
  //   );

  //   if (matchingOption) {
  //     setAllOptions(matchingOption.response);
  //   }
  // }, [relOptions, field]);
  let lastScrollTop = 0;

  const handleListOnScroll = (e) => {
    const target = e.target;
    const count = optionsFromLocale?.count;

    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    if (
      scrollTop + clientHeight >= scrollHeight - 50 &&
      allOptions?.length < count
    ) {
      loadMoreItems();
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      background: isBlackBg
        ? "#2A2D34"
        : disabled
          ? "rgb(248, 248, 248)"
          : "transparent",
      color: isBlackBg ? "#fff" : "",
      width: "100%",
      display: "flex",
      alignItems: "center",
      boxShadow: "none",
      border: "0px solid #fff",
      outline: "none",
      minHeight: newUi ? "25px" : undefined,
      height: newUi ? "25px" : undefined,
    }),
    // input: (provided, state) => {
    //   return {
    //     ...provided,
    //     // position: "absolute",
    //     // left: "0",
    //     // height: "100%",
    //     width: "100%",
    //     border: "none",
    //     // backgroundColor: "rgba(242, 241, 238, 0.6)",
    //   };
    // },
    placeholder: (provided) => ({
      ...provided,
      display: "flex",
    }),
    option: (provided, state) => ({
      ...provided,
      background: "#fff",
      color: provided.color === "hsl(0, 0%, 100%)" ? "#222" : provided.color,
      cursor: "pointer",
      height: "28px",
      fontSize: "12px",
      lineHeigh: "20px",
      fontWeight: "400",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0",
      paddingLeft: "8px",
      paddingRight: "8px",
      borderRadius: "6px",
      "&:hover": {
        backgroundColor: "rgba(242, 241, 238, 0.6)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      width: "calc(100% + 10px)",
      left: "-5px",
      top: "-3px",
      zIndex: 9999,
      borderRadius: "6px",
      borderTopRightRadius: "0px",
      borderTopLeftRadius: "0px",
      // boxShadow: "rgba(55, 53, 47, 0.16) 0px -1px inset",
      padding: "4px",
      height: "auto",
      boxShadow:
        "rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    clearIndicator: (provided) => ({
      ...provided,
      cursor: "pointer",
      marginRight: "20px",
      padding: "0",
    }),
  };

  const [inputValue, setInputValue] = useState("");

  return (
    <div className={styles.autocompleteWrapper}>
      {/* <Select
        className={styles.select}
        id="relation-lookup"
        inputValue={inputValue}
        onInputChange={(newInputValue, { action }) => {
          if (action !== "reset") {
            setInputValue(newInputValue);
            inputChangeHandler(newInputValue);
          }
        }}
        isDisabled={disabled}
        onMenuScrollToBottom={loadMoreItems}
        options={allOptions ?? []}
        value={computedValue}
        menuPortalTarget={document.body}
        // onMenuOpen={(e) => {
        //   refetch();
        // }}
        components={{
          // ClearIndicator: (props) => {
          //   console.log({ props });
          //   return (
          //     ((Array.isArray(localValue) && localValue?.length) ||
          //       Boolean(localValue)) && (
          //       <div
          //         style={{
          //           marginRight: "20px",
          //           cursor: "pointer",
          //         }}
          //         onClick={(e) => {
          //           e.stopPropagation();
          //           setLocalValue([]);
          //         }}
          //       >
          //         <ClearIcon />
          //       </div>
          //     )
          //   );
          // },
          SingleValue: (props) => (
            <CustomSingleValue
              tableSlug={tableSlug}
              disabled={disabled}
              field={field}
              isNewRouter={isNewRouter}
              localValue={computedValue}
              menuId={menuId}
              refetch={() => {}}
              {...props}
            />
          ),
          MultiValue: (props) => (
            <CustomMultiValue
              tableSlug={tableSlug}
              disabled={disabled}
              field={field}
              isNewRouter={isNewRouter}
              localValue={computedValue}
              menuId={menuId}
              refetch={() => {}}
              {...props}
            />
          ),
          DropdownIndicator: null,
          ClearIndicator: null,
          MultiValueRemove: (props) => <CustomMultiValueRemove {...props} />,
        }}
        onChange={(newValue, { action }) => {
          changeHandler(newValue);
        }}
        noOptionsMessage={() => (
          <span
            onClick={() => navigateToForm(tableSlug, "CREATE", {}, {}, menuId)}
            className={styles.noOptionText}
          >
            + Create one
          </span>
        )}
        menuShouldScrollIntoView
        styles={customStyles}
        getOptionLabel={(option) =>
          getRelationFieldTabsLabel(field, option, i18n.language)
        }
        getOptionValue={(option) => option.value}
        isOptionSelected={(option, value) =>
          value.some((val) => val.guid === value)
        }
        blurInputOnSelect
        isMulti
      /> */}
      <Autocomplete
        disabled={disabled}
        options={allOptions ?? []}
        value={computedValue}
        popupIcon={
          isBlackBg ? (
            <ArrowDropDownIcon style={{ color: "#fff" }} />
          ) : (
            <ArrowDropDownIcon />
          )
        }
        onChange={(event, newValue) => {
          changeHandler(newValue);
        }}
        noOptionsText={
          <span
            onClick={() => navigateToForm(tableSlug, "CREATE", {}, {}, menuId)}
            style={{ color: "#007AFF", cursor: "pointer", fontWeight: 500 }}
          >
            Create new
          </span>
        }
        blurOnSelect
        openOnFocus
        getOptionLabel={(option) =>
          getRelationFieldTabsLabel(field, option, i18n.language)
        }
        multiple
        ListboxProps={{
          onScroll: handleListOnScroll,
        }}
        isOptionEqualToValue={(option, value) => option.guid === value.guid}
        renderInput={(params) => (
          <TextField
            className={`${isFormEdit ? "custom_textfield" : ""}`}
            placeholder={!computedValue.length ? placeholder : ""}
            {...params}
            InputProps={{
              ...params.InputProps,
              classes: {
                input: isBlackBg ? classes.input : "",
              },
              style: {
                background: isBlackBg ? "#2A2D34" : disabled ? "#FFF" : "",
                color: isBlackBg ? "#fff" : "",
                height: "32px",
                overflow: "auto",
              },
            }}
            size="small"
          />
        )}
        renderTags={(values, getTagProps) => {
          return (
            <>
              <div className={styles.valuesWrapper}>
                {values?.map((el, index) => (
                  <div
                    key={el.value}
                    className={styles.multipleAutocompleteTags}
                  >
                    <p className={styles.value}>
                      {getOptionLabel(values[index])}
                    </p>

                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigateToForm(tableSlug, "EDIT", values[index]);
                      }}
                    >
                      <LaunchIcon
                        style={{
                          fontSize: "15px",
                          marginLeft: "0px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      />
                    </span>

                    <Close
                      fontSize="12"
                      onClick={getTagProps({ index })?.onDelete}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ))}
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default CellManyToManyRelationElement;
