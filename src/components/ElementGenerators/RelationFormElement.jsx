import { Autocomplete, TextField } from "@mui/material";
import { get } from "@ngard/tiny-get";
import { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import useDebounce from "../../hooks/useDebounce";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldLabel } from "../../utils/getRelationFieldLabel";
import FEditableRow from "../FormElements/FEditableRow";
import FRow from "../FormElements/FRow";
import IconGenerator from "../IconPicker/IconGenerator";
import CascadingElement from "./CascadingElement";
import CascadingSection from "./CascadingSection/CascadingSection";
import GroupCascading from "./GroupCascading/index";
import styles from "./style.module.scss";
import useDebouncedWatch from "../../hooks/useDebouncedWatch";
import constructorFunctionService from "../../services/constructorFunctionService";
import constructorFunctionServiceV2 from "../../services/constructorFunctionServiceV2";
import request from "../../utils/request";
import { useSelector } from "react-redux";
import Select from "react-select";

const RelationFormElement = ({
  control,
  field,
  isLayout,
  sectionIndex,
  fieldIndex,
  column,
  name = "",
  mainForm,
  disabledHelperText,
  setFormValue,
  formTableSlug,
  disabled = false,
  defaultValue = null,
  multipleInsertField,
  checkRequiredField,
  ...props
}) => {
  const tableSlug = useMemo(() => {
    if (field.relation_type === "Recursive") return formTableSlug;
    return field.id.split("#")?.[0] ?? "";
  }, [field.id, formTableSlug, field.relation_type]);

  if (!isLayout)
    return (
      <FRow label={field?.label ?? field?.title} required={field.required}>
        <Controller
          control={control}
          name={(name || field.slug) ?? `${tableSlug}_id`}
          defaultValue={defaultValue}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AutoCompleteElement
              value={Array.isArray(value) ? value[0] : value}
              setValue={onChange}
              field={field}
              disabled={disabled}
              tableSlug={tableSlug}
              error={error}
              disabledHelperText={disabledHelperText}
              setFormValue={setFormValue}
              control={control}
              name={name}
              multipleInsertField={multipleInsertField}
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
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FEditableRow
          label={value}
          onLabelChange={onChange}
          required={checkRequiredField}
        >
          <Controller
            control={control}
            name={`${tableSlug}_id`}
            defaultValue={defaultValue}
            render={({ field: { onChange, value }, fieldState: { error } }) =>
              field?.attributes?.cascadings?.length === 2 ? (
                <CascadingElement
                  field={field}
                  tableSlug={tableSlug}
                  error={error}
                  disabledHelperText={disabledHelperText}
                  control={control}
                  setValue={onChange}
                  value={Array.isArray(value) ? value[0] : value}
                  name={name}
                />
              ) : (
                <AutoCompleteElement
                  value={Array.isArray(value) ? value[0] : value}
                  setValue={onChange}
                  field={field}
                  disabled={disabled}
                  tableSlug={tableSlug}
                  error={error}
                  disabledHelperText={disabledHelperText}
                  control={control}
                  name={name}
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
  error,
  disabled,
  disabledHelperText,
  control,
  name,
  multipleInsertField,
  setFormValue = () => {},
}) => {
  const [inputValue, setInputValue] = useState("");
  const [localValue, setLocalValue] = useState([]);
  const { id } = useParams();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const ids = field?.attributes?.is_user_id_default ? isUserId : undefined;
  const [debouncedValue, setDebouncedValue] = useState("");
  const { navigateToForm } = useTabRouter();
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);
  const autoFilters = field?.attributes?.auto_filters;
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState([]);

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
            limit: 10 * page,
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
    ["GET_OBJECT_LIST", tableSlug, debouncedValue, autoFiltersValue, page],
    () => {
      if (!tableSlug) return null;
      return constructorObjectService.getList(tableSlug, {
        data: {
          ...autoFiltersValue,
          additional_request: {
            additional_field: "guid",
            additional_values: [ids],
          },
          view_fields: field.attributes?.view_fields?.map((f) => f.slug),
          search: debouncedValue.trim(),
          limit: 10 * page,
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
    } else {
      return optionsFromLocale ?? [];
    }
  }, [
    optionsFromFunctions,
    optionsFromLocale,
    field?.attributes?.function_path,
  ]);

  const getValueData = async () => {
    try {
      const id = value;
      const res = await constructorObjectService.getById(tableSlug, id);
      const data = res?.data?.response;
      if (data.prepayment_balance) {
        setFormValue("prepayment_balance", data.prepayment_balance || 0);
      }
      console.log("data", data);
      setLocalValue(data ? [data] : null);
    } catch (error) {}
  };

  const getOptionLabel = (option) => {
    return getRelationFieldLabel(field, option);
  };

  const setDefaultValue = () => {
    if (options?.slugOptions && multipleInsertField) {
      const val = options?.slugOptions?.find((item) => item?.guid === id);
      setValue(val?.guid ?? null);
      setLocalValue(val ? [val] : null);
    }
  };

  const changeHandler = (value, key = "") => {
    if (key === "cascading") {
      setValue(value?.guid ?? value?.guid);
      setLocalValue(value ? [value] : null);
      if (!field?.attributes?.autofill) return;

      field.attributes.autofill.forEach(({ field_from, field_to }) => {
        setFormValue(field_to, get(value, field_from));
      });
      setPage(1);
    } else {
      const val = value;

      setValue(val?.guid ?? null);
      setLocalValue(val?.guid ? [val] : null);
      console.log("value", value);
      if (!field?.attributes?.autofill) return;

      field.attributes.autofill.forEach(({ field_from, field_to }) => {
        setFormValue(field_to, get(val, field_from));
      });
      setPage(1);
    }
  };

  const computedOptions = useMemo(() => {
    const value = [];
    allOptions?.forEach((item) => {
      const label = field?.attributes?.view_fields
        ?.map((el) => item[el.slug])
        .join(" ");
      const option = { label, value: item?.guid };
      const optionExists = value?.some(
        (existingOption) => existingOption?.value === option.value
      );
      if (!optionExists) {
        value.push(option);
      }
    });

    return value;
  }, [allOptions, field]);

  const computedValue = useMemo(() => {
    const findedOption = options?.options?.find((el) => el?.guid === value);
    return findedOption ? [findedOption] : [];
  }, [options, value]);

  const computedInputValue = useMemo(() => {
    if (Array.isArray(localValue)) {
      return localValue
        ?.map((item) => ({
          label: field?.attributes?.view_fields
            ?.map((el) => item?.[el?.slug])
            .join(" "),
          value: item?.guid,
        }))
        .find((element) => element?.value === value);
    } else {
      return localValue;
    }
  }, [localValue, value]);

  // useEffect(() => {
  //   if(Array.isArray(localValue)) {
  //     setLocalValue(
  //       localValue?.filter((item) => {
  //         return item?.[autoFiltersFieldFroms] === filtersHandler[0];
  //       })
  //     );
  //   } else return localValue
  // }, [filtersHandler]);

  //=========AUTOFILL
  console.log("value", value);
  useEffect(() => {
    let val;

    if (Array.isArray(computedValue)) {
      val = computedValue[computedValue.length - 1];
    } else {
      val = computedValue;
    }

    if (!field?.attributes?.autofill || !val) {
      return;
    }

    field.attributes.autofill.forEach(({ field_from, field_to, automatic }) => {
      const setName = name?.split(".");
      setName?.pop();
      setName?.push(field_to);

      if (automatic) {
        setTimeout(() => {
          setFormValue(setName.join("."), get(val, field_from));
        }, 1);
      }
    });
  }, [computedValue, field]);

  useEffect(() => {
    if (value) getValueData();
  }, [value]);

  // useEffect(() => {
  //   setDefaultValue();
  // }, [options, multipleInsertField]);

  useEffect(() => {
    if (field?.attributes?.function_path) {
      const newOptions = optionsFromFunctions?.options ?? [];
      if (newOptions?.length && page > 1) {
        setAllOptions((prevOptions) => [...prevOptions, ...newOptions]);
      } else {
        setAllOptions(newOptions);
      }
    } else {
      const newOptions = optionsFromLocale?.options ?? [];
      if (newOptions?.length && page > 1) {
        setAllOptions((prevOptions) => [...prevOptions, ...newOptions]);
      } else {
        setAllOptions(newOptions);
      }
    }
  }, [optionsFromFunctions, optionsFromLocale]);

  function loadMoreItems() {
    if (field?.attributes?.function_path) {
      if (optionsFromFunctions?.length >= 10) {
        setPage((prevPage) => prevPage + 1);
      } else return false;
    } else {
      if (optionsFromLocale?.length >= 10) {
        setPage((prevPage) => prevPage + 1);
      } else return false;
    }
  }

  return (
    <div className={styles.autocompleteWrapper}>
      {field.attributes?.creatable && (
        <div
          className={styles.createButton}
          onClick={() => navigateToForm(tableSlug)}
        >
          Создать новый
        </div>
      )}
      {field?.attributes?.cascadings?.length === 4 ? (
        <CascadingSection
          field={field}
          tableSlug={tableSlug}
          error={error}
          disabledHelperText={disabledHelperText}
          value={localValue?.guid ?? []}
          setValue={(newValue) => {
            changeHandler(newValue, "cascading");
          }}
          onInputChange={(e, newValue) => {
            setInputValue(newValue);
            inputChangeHandler(newValue);
          }}
        />
      ) : field?.attributes?.cascading_tree_table_slug ? (
        <GroupCascading
          field={field}
          tableSlug={tableSlug}
          error={error}
          autoFiltersValue={autoFiltersValue}
          disabledHelperText={disabledHelperText}
          value={localValue ?? []}
          setFormValue={setFormValue}
          setValue={(newValue) => {
            changeHandler(newValue, "cascading");
          }}
          onInputChange={(e, newValue) => {
            setInputValue(newValue);
            inputChangeHandler(newValue);
          }}
        />
      ) : (
        <Select
          isDisabled={disabled}
          options={options?.options ?? []}
          isClearable={true}
          value={localValue ?? []}
          defaultValue={value ?? ""}
          onChange={(e) => {
            changeHandler(e);
            setLocalValue(e);
          }}
          onMenuScrollToBottom={loadMoreItems}
          inputChangeHandler={(e) => inputChangeHandler(e)}
          onInputChange={(e, newValue) => {
            setInputValue(e ?? null);
          }}
          getOptionLabel={(option) =>
            field?.attributes?.view_fields?.map((el) => option[el.slug])
          }
          getOptionValue={(option) => option?.guid}
          components={{
            DropdownIndicator: () => null,
            MultiValue: ({ data }) => (
              <IconGenerator
                icon="arrow-up-right-from-square.svg"
                style={{ marginLeft: "10px", cursor: "pointer" }}
                size={15}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigateToForm(tableSlug, "EDIT", value);
                }}
              />
            ),
          }}
        />
      )}
    </div>
  );
};

export default RelationFormElement;
