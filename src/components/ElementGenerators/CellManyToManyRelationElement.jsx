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

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
    heigth: "40px",
  },
}));

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

  return (
    <div className={styles.autocompleteWrapper}>
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
