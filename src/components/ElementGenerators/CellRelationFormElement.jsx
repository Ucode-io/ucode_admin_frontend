import { Autocomplete, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { get } from "@ngard/tiny-get";
import { useEffect, useMemo, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import IconGenerator from "../IconPicker/IconGenerator";
import styles from "./style.module.scss";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useLocation, useParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import CascadingElement from "./CascadingElement";
import RelationGroupCascading from "./RelationGroupCascading";
import request from "../../utils/request";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const CellRelationFormElement = ({
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
  defaultValue = null,
  relationfields,
  data,
}) => {
  const classes = useStyles();

  if (!isLayout)
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          console.log('kajnwdkjanwkdjawd', value)
          return field?.attributes?.cascading_tree_table_slug ? (
            <RelationGroupCascading
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              value={value ?? ""}
              setFormValue={setFormValue}
              classes={classes}
              name={name}
              control={control}
              index={index}
              setValue={onChange}
            />
          ) : field?.attributes?.cascadings?.length > 1 ? (
            <CascadingElement
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              value={value ?? ""}
              setFormValue={setFormValue}
              classes={classes}
              name={name}
              control={control}
              index={index}
              setValue={onChange}
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
              setValue={onChange}
              field={field}
              defaultValue={defaultValue}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              setFormValue={setFormValue}
              control={control}
              index={index}
              relationfields={relationfields}
              data={data}
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
  defaultValue,
  disabled,
  classes,
  isBlackBg,
  setValue,
  index,
  control,
  relationfields,
  data,
  setFormValue = () => {},
}) => {
  const { navigateToForm } = useTabRouter();
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);
  const { id } = useParams();
  console.log('defaultValue',field?.type,  defaultValue)
  const getOptionLabel = (option) => {
    return getRelationFieldTabsLabel(field, option);
  };

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
    return result;
  }, [autoFilters, filtersHandler]);

  // const getIds = useMemo(() => {
  //   let val = [];
  //   relationfields
  //     ?.filter((item) => {
  //       return item[field?.slug];
  //     })
  //     .map((item) => {
  //       return !val.includes(item[field?.slug]) && val.push(item[field?.slug]);
  //     });
  //   return val;
  // }, [relationfields, field]);

  const getIdsFromData = useMemo(() => {
    let val = [];
    data
      ?.filter((item) => {
        return item[field?.slug];
      })
      .map((item) => {
        return !val.includes(item[field?.slug]) && val.push(item[field?.slug]);
      });
    return val;
  }, [data, field]);

  const { data: optionsFromFunctions } = useQuery(
    ["GET_OPENFAAS_LIST", tableSlug, autoFiltersValue, debouncedValue],
    () => {
      return request.post(`/invoke_function/${field?.attributes?.function_path}`, {
        data: {
          table_slug: tableSlug,
          ...autoFiltersValue,
          search: debouncedValue,
          limit: 10,
          offset: 0,
          view_fields: field?.view_fields?.map((field) => field.slug) ?? field?.attributes?.view_fields?.map((field) => field.slug),
        },
      });
    },
    {
      enabled: !!field?.attributes?.function_path,
      select: (res) => {
        const options = res?.data?.response ?? [];
        // const slugOptions = res?.table_slug === tableSlug ? res?.data?.response : [];

        return {
          options,
          // slugOptions,
        };
      },
    }
  );
  console.log('defaultValue', defaultValue)

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
        // const slugOptions = res?.table_slug === tableSlug ? res?.data?.response : [];
        return {
          options,
          // slugOptions,
        };
      },
    }
  );

  const options = useMemo(() => {
    if (field?.attributes?.function_path) {
      return optionsFromFunctions?.options ?? [];
    }
    return optionsFromLocale?.options ?? [];
  }, [optionsFromFunctions, optionsFromLocale]);

  const computedValue = useMemo(() => {
    const findedOption = options?.find((el) => el?.guid === value);
    return findedOption ? [findedOption] : [];
  }, [options?.options, value, optionsFromFunctions, optionsFromLocale]);

  // const computedOptions = useMemo(() => {
  //   let uniqueObjArray = [
  //     ...new Map(options.map((item) => [item["title"], item])).values(),
  // ]
  // return uniqueObjArray
  // }, [options])

  const changeHandler = (value) => {
    const val = value?.[value?.length - 1];

    setValue(val?.guid ?? null);
    setInputValue("");

    if (!field?.attributes?.autofill) return;

    field.attributes.autofill.forEach(({ field_from, field_to }) => {
      const setName = name.split(".");
      setName.pop();
      setName.push(field_to);
      setFormValue(setName.join("."), get(val, field_from));
    });
  };

  useEffect(() => {
    const val = computedValue[computedValue.length - 1];
    if (!field?.attributes?.autofill || !val) return;
    field.attributes.autofill.forEach(({ field_from, field_to, automatic }) => {
      const setName = name.split(".");
      setName.pop();
      setName.push(field_to);
      automatic &&
        setTimeout(() => {
          setFormValue(setName.join("."), get(val, field_from));
        }, 1);
    });
  }, [computedValue]);


  return (
    <div className={styles.autocompleteWrapper}>
      <Autocomplete
        inputValue={inputValue}
        onInputChange={(event, newInputValue, reason) => {
          if (reason !== "reset") {
            setInputValue(newInputValue);
            inputChangeHandler(newInputValue);
          }
        }}
        disabled={disabled}
        options={options ?? []}
        value={computedValue}
        popupIcon={isBlackBg ? <ArrowDropDownIcon style={{ color: "#fff" }} /> : <ArrowDropDownIcon />}
        onChange={(event, newValue) => {
          changeHandler(newValue);
        }}
        noOptionsText={
          <span onClick={() => navigateToForm(tableSlug)} style={{ color: "#007AFF", cursor: "pointer", fontWeight: 500 }}>
            Создать новый
          </span>
        }
        blurOnSelect
        openOnFocus
        getOptionLabel={(option) => getRelationFieldTabsLabel(field, option)}
        multiple
        onPaste={(e) => {
          console.log("eeeeeee -", e.clipboardData.getData("Text"));
        }}
        // isOptionEqualToValue={(option, value) => option.guid === value.guid}
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
        renderTags={(value, index) => (
          <>
            {getOptionLabel(value[0])}
            <IconGenerator
              icon="arrow-up-right-from-square.svg"
              style={{ marginLeft: "10px", cursor: "pointer" }}
              size={15}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigateToForm(tableSlug, "EDIT", value[0]);
              }}
            />
          </>
        )}
      />
    </div>
  );
};

export default CellRelationFormElement;
