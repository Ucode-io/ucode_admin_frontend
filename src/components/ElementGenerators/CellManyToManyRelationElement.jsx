import { Autocomplete, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { get } from "@ngard/tiny-get";
import { useMemo, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import IconGenerator from "../IconPicker/IconGenerator";
import styles from "./style.module.scss";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CascadingElement from "./CascadingElement";
import { Close } from "@mui/icons-material";
import useDebounce from "../../hooks/useDebounce";
import request from "../../utils/request";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const CellManyToManyRelationElement = ({
  isBlackBg,
  isFormEdit,
  control,
  name,
  disabled,
  placeholder,
  field,
  isLayout,
  disabledHelperText,
  setFormValue,
  index,
  defaultValue,
  row,
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
              setValue={onChange}
              value={value}
              setFormValue={setFormValue}
              row={row}
              index={index}
            />
          ) : (
            <AutoCompleteElement
              disabled={disabled}
              isFormEdit={isFormEdit}
              placeholder={placeholder}
              isBlackBg={isBlackBg}
              value={value}
              classes={classes}
              name={name}
              defaultValue={defaultValue}
              setValue={onChange}
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              setFormValue={setFormValue}
              control={control}
              index={index}
            />
          );
        }}
      />
    );
};

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  field,
  value,
  isFormEdit,
  placeholder,
  tableSlug,
  name,
  disabled,
  defaultValue,
  classes,
  isBlackBg,
  setValue,
  index,
  control,
  setFormValue = () => {},
}) => {
  const { navigateToForm } = useTabRouter();
  const [debouncedValue, setDebouncedValue] = useState("");
  const getOptionLabel = (option) => {
    return getRelationFieldTabsLabel(field, option);
  };
  const { id } = useParams();
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);


  const autoFilters = field?.attributes?.auto_filters;

  const autoFiltersFieldFroms = useMemo(() => {
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

  const { data: optionsFromFunctions } = useQuery(
    ["GET_OPENFAAS_LIST", tableSlug, autoFiltersValue, debouncedValue],
    () => {
      return request.post(
        `/invoke_function/${field?.attributes?.function_path}`,
        {
          data: {
            table_slug: tableSlug,
            ...autoFiltersValue,
            search: debouncedValue,
            limit: 10,
            offset: 0,
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
    }
  );

  const { data: optionsFromLocale } = useQuery(
    ["GET_OBJECT_LIST", tableSlug, debouncedValue, autoFiltersValue],
    () => {
      if (!tableSlug) return null;
      return constructorObjectService.getList(tableSlug, {
        data: {
          ...autoFiltersValue,
          additional_request: {
            additional_field: "guid",
            additional_values: [defaultValue ?? id],
          },
          view_fields: field.attributes?.view_fields?.map((f) => f.slug),
          search: debouncedValue.trim(),
          limit: 10,
        },
      });
    },
    {
      enabled: !field?.attributes?.function_path,
      select: (res) => {
        const options = res?.data?.response ?? [];
        const slugOptions =
          res?.table_slug === tableSlug ? res?.data?.response : [];
        return {
          options,
          slugOptions,
        };
      },
    }
  );

  const options = useMemo(() => {
    if (field?.attributes?.function_path) {
      return optionsFromFunctions ?? [];
    }
    return optionsFromLocale ?? [];
  }, [optionsFromFunctions, optionsFromLocale]);


  const computedValue = useMemo(() => {
    if (!value) return [];

    return value
      ?.map((id) => {
        const option = options?.find((el) => el?.guid === id);

        if (!option) return null;
        return {
          ...option,
          // label: getRelationFieldLabel(field, option)
        };
      })
      ?.filter((el) => el);
  }, [options, value]);

  const changeHandler = (value) => {
    if (!value) setValue(null);
    const val = value?.map((el) => el.guid);

    setValue(val ?? null);

    // if (!field?.attributes?.autofill) return;

    // field.attributes.autofill.forEach(({ field_from, field_to }) => {
    //   const setName = name.split(".");
    //   setName.pop();
    //   setName.push(field_to);
    //   setFormValue(setName.join("."), get(val, field_from));
    // });
  };
  
  return (
    <div className={styles.autocompleteWrapper}>
      <Autocomplete
        disabled={disabled}
        options={options ?? []}
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
            onClick={() => navigateToForm(tableSlug)}
            style={{ color: "#007AFF", cursor: "pointer", fontWeight: 500 }}
          >
            Создать новый
          </span>
        }
        blurOnSelect
        openOnFocus
        getOptionLabel={(option) =>
          getRelationFieldTabsLabel(field, option, true)
        }
        multiple
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
                background: isBlackBg ? "#2A2D34" : "",
                color: isBlackBg ? "#fff" : "",
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
                    <IconGenerator
                      icon="arrow-up-right-from-square.svg"
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      size={15}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigateToForm(tableSlug, "EDIT", values[index]);
                      }}
                    />

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
