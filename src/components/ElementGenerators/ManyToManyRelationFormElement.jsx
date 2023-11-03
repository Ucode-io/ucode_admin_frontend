import {Close} from "@mui/icons-material";
import {Autocomplete, TextField} from "@mui/material";
import {useMemo, useState} from "react";
import {Controller, useWatch} from "react-hook-form";
import {useQuery} from "react-query";
import useDebounce from "../../hooks/useDebounce";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import {getRelationFieldLabel} from "../../utils/getRelationFieldLabel";
import FEditableRow from "../FormElements/FEditableRow";
import FRow from "../FormElements/FRow";
import IconGenerator from "../IconPicker/IconGenerator";
import CascadingSection from "./CascadingSection/CascadingSection";
import styles from "./style.module.scss";
import request from "../../utils/request";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import makeAnimated, {MultiValue} from "react-select/animated";
import {pageToOffset} from "../../utils/pageToOffset";

const ManyToManyRelationFormElement = ({
  control,
  field,
  isLayout,
  sectionIndex,
  fieldIndex,
  name = "",
  column,
  mainForm,
  disabledHelperText,
  autocompleteProps = {},
  disabled = false,
  checkRequiredField,
  ...props
}) => {
  const tableSlug = useMemo(() => {
    return field.id?.split("#")?.[0] ?? "";
  }, [field.id]);
  const {i18n} = useTranslation();

  if (!isLayout)
    return (
      <FRow
        label={
          field?.attributes[`title_${i18n?.language}`] ??
          field?.attributes[`name${i18n?.language}`] ??
          field?.attributes[`label${i18n?.language}`] ??
          field?.label ??
          field.title ??
          " "
        }
        required={field.required}
      >
        <Controller
          control={control}
          name={name || `${tableSlug}_ids`}
          defaultValue={null}
          {...props}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <AutoCompleteElement
              value={value}
              setValue={onChange}
              field={field}
              tableSlug={tableSlug}
              error={error}
              disabledHelperText={disabledHelperText}
              control={control}
              {...autocompleteProps}
            />
          )}
        />
      </FRow>
    );

  return (
    <Controller
      control={mainForm.control}
      name={`sections[${sectionIndex}].fields[${fieldIndex}].field_name`}
      defaultValue={field.label}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <FEditableRow
          label={value}
          onLabelChange={onChange}
          required={checkRequiredField}
        >
          <Controller
            control={control}
            name={`${tableSlug}_id`}
            defaultValue={null}
            render={({field: {onChange, value}, fieldState: {error}}) =>
              field?.attributes?.cascadings?.length > 1 ? (
                <CascadingSection
                  disabled={disabled}
                  value={value}
                  setValue={onChange}
                  field={field}
                  tableSlug={tableSlug}
                  error={error}
                  disabledHelperText={disabledHelperText}
                  control={control}
                />
              ) : (
                <AutoCompleteElement
                  disabled={disabled}
                  value={value}
                  setValue={onChange}
                  field={field}
                  tableSlug={tableSlug}
                  error={error}
                  disabledHelperText={disabledHelperText}
                  control={control}
                />
              )
            }
          />
        </FEditableRow>
      )}
    ></Controller>
  );
};

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  field,
  value,
  tableSlug,
  setValue,
  control,
  error,
  disabled,
  disabledHelperText,
}) => {
  const {navigateToForm} = useTabRouter();
  const [debouncedValue, setDebouncedValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState([]);

  const autoFilters = field?.attributes?.auto_filters;

  const autoFiltersFieldFroms = useMemo(() => {
    return autoFilters?.map((el) => el.field_from) ?? [];
  }, [autoFilters]);

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

  const {data: fromInvokeList} = useQuery(
    ["GET_OPENFAAS_LIST", tableSlug, autoFiltersValue, debouncedValue, page],
    () => {
      return request.post(
        `/invoke_function/${field?.attributes?.function_path}`,
        {
          params: {
            from_input: true,
          },
          data: {
            ...autoFiltersValue,
            view_fields:
              field?.view_fields?.map((field) => field.slug) ??
              field?.attributes?.view_fields?.map((field) => field.slug),
            additional_request: {
              additional_field: "guid",
              additional_values: value,
            },
            // additional_ids: value,
            search: debouncedValue,
            limit: 10,
            offset: pageToOffset(page, 10),
          },
        }
      );
    },
    {
      enabled: !!field?.attributes?.function_path,
      select: (res) => {
        return res?.data?.response ?? [];
      },
      onSuccess: (data) => {
        if (page > 1) {
          setAllOptions((prevOptions) => [...prevOptions, ...data]);
        } else {
          setAllOptions(data);
        }
      },
    }
  );

  const {data: fromObjectList} = useQuery(
    ["GET_OBJECT_LIST", tableSlug, autoFiltersValue, debouncedValue, page],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {
          ...autoFiltersValue,
          view_fields:
            field?.view_fields?.map((field) => field.slug) ??
            field?.attributes?.view_fields?.map((field) => field.slug),
          additional_request: {
            additional_field: "guid",
            additional_values: value,
          },
          // additional_ids: value,
          search: debouncedValue,
          limit: 10,
          offset: pageToOffset(page, 10),
        },
      });
    },
    {
      enabled: !field?.attributes?.function_path,
      select: (res) => {
        return res?.data?.response ?? [];
      },
      onSuccess: (data) => {
        if (page > 1) {
          setAllOptions((prevOptions) => [...prevOptions, ...data]);
        } else {
          setAllOptions(data);
        }
      },
    }
  );
  console.log("value", value);
  const options = useMemo(() => {
    return fromObjectList ?? fromInvokeList;
  }, [fromInvokeList, fromObjectList]);

  const computedValue = useMemo(() => {
    if (!value) return undefined;

    return value
      ?.map((id) => {
        const option = allOptions?.find((el) => el?.guid === id);

        if (!option) return null;
        return {
          ...option,
          // label: getRelationFieldLabel(field, option)
        };
      })
      ?.filter((el) => el);
  }, [value, allOptions]);

  const computedOptions = useMemo(() => {
    const uniqueObjects = Array.from(
      new Set(allOptions.map(JSON.stringify))
    ).map(JSON.parse);
    return uniqueObjects ?? [];
  }, [allOptions, options]);

  const getOptionLabel = (option) => {
    return getRelationFieldLabel(field, option);
  };

  const changeHandler = (value) => {
    if (!value) setValue(null);

    const val = value?.map((el) => el.guid);

    setValue(val ?? null);
  };

  const CustomMultiValue = (props) => {
    return (
      <MultiValue {...props}>
        {props.data.label}
        <span
          onClick={(e) => {
            e.stopPropagation();
            props.removeProps.onClick();
          }}
          style={{marginLeft: "5px", cursor: "pointer"}}
        >
          &#10006;
        </span>
      </MultiValue>
    );
  };

  const inputChangeHandler = useDebounce((val) => {
    setDebouncedValue(val);
  }, 300);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      display: "flex",
      alignItems: "center",
      outline: "none",
    }),
    input: (provided) => ({
      ...provided,
      width: "100%",
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#fff" : provided.color,
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  function loadMoreItems() {
    if (field?.attributes?.function_path) {
      setPage((prevPage) => prevPage + 1);
    } else {
      setPage((prevPage) => prevPage + 1);
    }
  }

  return (
    <div className={styles.autocompleteWrapper}>
      <div
        className={styles.createButton}
        onClick={() => navigateToForm(tableSlug)}
      >
        Создать новый
      </div>

      <Select
        options={computedOptions ?? []}
        value={computedValue}
        onChange={(event, newValue) => {
          changeHandler(event);
        }}
        onInputChange={(_, val) => {
          setInputValue(val);
          inputChangeHandler(val);
        }}
        components={{
          DropdownIndicator: null,
          // MultiValue: CustomMultiValue,
        }}
        onMenuScrollToBottom={loadMoreItems}
        isMulti
        closeMenuOnSelect={false}
        menuPortalTarget={document.body}
        getOptionLabel={(option) => getRelationFieldLabel(field, option)}
        noOptionsMessage={() => (
          <span
            onClick={() => navigateToForm(tableSlug)}
            style={{color: "#007AFF", cursor: "pointer", fontWeight: 500}}
          >
            Создать новый
          </span>
        )}
        styles={customStyles}
        onPaste={(e) => {
          console.log("eeeeeee -", e.clipboardData.getData("Text"));
        }}
        getOptionValue={(option) => option.value}
        isOptionSelected={(option, value) =>
          value.some((val) => val.value === value)
        }
      />

      {/* <Autocomplete
        disabled={disabled}
        options={options ?? []}
        value={computedValue}
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
        inputValue={inputValue}
        onInputChange={(_, val) => {
          setInputValue(val);
          inputChangeHandler(val);
        }}
        disablePortal
        blurOnSelect
        openOnFocus
        clearOnBlur={!inputValue}
        getOptionLabel={(option) => getRelationFieldLabel(field, option)}
        multiple
        isOptionEqualToValue={(option, value) => option.guid === value.guid}
        renderInput={(params) => <TextField {...params} size="small" />}
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
      /> */}
    </div>
  );
};

export default ManyToManyRelationFormElement;
