import {get} from "@ngard/tiny-get";
import {useEffect, useMemo, useState} from "react";
import {Controller, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import request from "@/utils/request";
import constructorObjectService from "@/services/constructorObjectService";
import { pageToOffset } from "@/utils/pageToOffset";
import useTabRouter from "@/hooks/useTabRouter";
import useDebounce from "@/hooks/useDebounce";
// import {Select} from "@chakra-ui/react";
import Select from "react-select";
import { Box, Tooltip } from "@mui/material";
import IconGenerator from "@/components/IconPicker/IconGenerator";
import { getRelationFieldTabsLabel } from "@/utils/getRelationFieldLabel";
import { showAlert } from "@/store/alert/alert.thunk";

const RelationField = ({
  control,
  field,
  name,
  setFormValue,
  formTableSlug,
  defaultValue,
  disabled,
  key,
  activeLang,
  checkRequiredField,
  errors,
  isLayout = false,
  isMulti,
  isRequired,
  placeholder = "",
  updateObject = () => {},
  ...props
}) => {
  const tableSlug = useMemo(() => {
    if (field?.relation_type === "Recursive") return formTableSlug;
    return field?.id.split("#")?.[0] ?? "";
  }, [field?.id, formTableSlug, field.relation_type]);

  const required = useMemo(() => {
    if (window.location.pathname?.includes("settings")) {
      return false;
    } else return field?.required;
  }, [window.location.pathname]);

  if (!isLayout)
    return (
      <Controller
        control={control}
        name={(name || field.slug) ?? `${tableSlug}_id`}
        defaultValue={defaultValue}
        rules={{
          required: required || isRequired ? "This field is required!" : "",
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Box>
            <AutoCompleteElement
              value={isMulti ? value : Array.isArray(value) ? value[0] : value}
              setValue={onChange}
              field={field}
              placeholder={placeholder}
              disabled={disabled}
              tableSlug={tableSlug}
              error={error}
              setFormValue={setFormValue}
              control={control}
              name={name}
              errors={errors}
              isMulti={isMulti}
              required={required}
              activeLang={activeLang}
              updateObject={updateObject}
            />
          </Box>
        )}
      />
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
  errors,
  required = false,
  activeLang,
  isMulti,
  placeholder = "",
  updateObject = () => {},
  watch = () => {},
}) => {
  const [inputValue, setInputValue] = useState("");
  const [localValue, setLocalValue] = useState([]);

  const isUserId = useSelector((state) => state?.auth?.userId);
  const clientTypeID = useSelector((state) => state?.auth?.clientType?.id);

  const ids = field?.attributes?.is_user_id_default ? isUserId : undefined;
  const [debouncedValue, setDebouncedValue] = useState("");
  const { navigateToForm } = useTabRouter();
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);
  const autoFilters = field?.attributes?.auto_filters;
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState([]);
  const { i18n } = useTranslation();
  const { state } = useLocation();
  const languages = useSelector((state) => state.languages.list);
  const isSettings = window.location.pathname?.includes("settings/constructor");
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

  const queryClient = useQueryClient();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "32px",
      minHeight: "32px",
      border: "none",
      boxShadow: "none",
      color: "#787774",
      backgroundColor: "none",
      "&:hover": {
        border: "none",
        backgroundColor: "#F7F7F7",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "32px",
      padding: "0 8px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
      padding: "0px",
      fontSize: "13px",
      color: "#787774",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "13px",
      color: "#adb5bd",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "4px",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "4px",
      zIndex: 999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const queryFn = () => {
    if (!tableSlug) return null;
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

    if (
      (computedIds || value) &&
      autoFiltersFirstValues === autoFiltersNewValues
    ) {
      const additionalValues = [computedIds ?? value];
      requestData.additional_request.additional_values =
        additionalValues?.flat();
    } else if (
      (computedIds || value) &&
      autoFiltersFirstValues !== autoFiltersNewValues
    ) {
      setLocalValue([]);
      delete requestData.additional_request.additional_field;
    }

    return constructorObjectService.getListV2(
      tableSlug,
      {
        data: requestData,
      },
      {
        language_setting: i18n?.language,
      },
    );
  };

  const computedIds = useMemo(() => {
    if (
      field?.attributes?.object_id_from_jwt &&
      field?.id?.split("#")?.[0] === "client_type"
    ) {
      return clientTypeID;
    } else {
      return ids;
    }
  }, [field]);

  const autoFiltersFieldFroms = useMemo(() => {
    setPage(1);
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
            limit: 10,
            offset: pageToOffset(page, 10),
            view_fields:
              field?.view_fields?.map((field) => field.slug) ??
              field?.attributes?.view_fields?.map((field) => field.slug),
          },
        },
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
    },
  );

  const autoFiltersFirstValues = useMemo(() => {
    if (!autoFiltersValue) return "";
    return Object.values(autoFiltersValue).join(",");
  }, []);

  const autoFiltersNewValues = useMemo(() => {
    if (!autoFiltersValue) return "";
    return Object.values(autoFiltersValue).join(",");
  }, [autoFiltersValue]);

  // if (field?.slug === "metrics_category_values_id") {
  //   console.log({ autoFiltersFirstValues, autoFiltersNewValues });
  // }

  const { data: optionsFromLocale } = useQuery(
    ["GET_OBJECT_LIST", page, tableSlug, debouncedValue, autoFiltersValue],
    queryFn,
    {
      enabled: !field?.attributes?.function_path && !isSettings,
      select: (res) => {
        const count = res?.data?.count;
        const options = res?.data?.response ?? [];
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
    },
  );

  const options = useMemo(() => {
    if (field?.attributes?.function_path) {
      return optionsFromFunctions?.options ?? [];
    } else {
      return optionsFromLocale?.options ?? [];
    }
  }, [
    optionsFromFunctions?.options,
    optionsFromLocale?.options,
    field?.attributes?.function_path,
  ]);

  const getValueData = async () => {
    try {
      const id = state?.[`${tableSlug}_id`] || value;
      const res = await constructorObjectService.getById(tableSlug, id);
      const data = res?.data?.response;

      if (data && data.prepayment_balance) {
        setFormValue("prepayment_balance", data.prepayment_balance || 0);
      }
      setLocalValue(res?.data?.response ? [res?.data?.response] : []);

      if (window.location.pathname?.includes("create")) {
        setFormValue(name, data?.guid);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

      setValue(isMulti ? val?.map((el) => el.guid) : (val?.guid ?? null));
      updateObject();
      setLocalValue(isMulti ? val : val?.guid ? [val] : null);
      if (!field?.attributes?.autofill) return;

      field.attributes.autofill.forEach(({ field_from, field_to }) => {
        setFormValue(field_to, get(val, field_from));
        updateObject();
      });
      setPage(1);
    }
  };

  // const inputUpdateObject = useDebounce(() => updateObject(), 500);

  const setClientTypeValue = () => {
    const value = options?.find((item) => item?.guid === clientTypeID);

    if (
      field?.attributes?.object_id_from_jwt &&
      field?.id?.split("#")?.[0] === "client_type"
    ) {
      setValue(value?.guid ?? value?.guid);
      setLocalValue(value);
    }
  };

  const computedValue = useMemo(() => {
    const findedOption = options?.find((el) => el?.guid === value || state?.id);
    return findedOption ? findedOption : [];
  }, [options, value, state?.id]);

  const computedOptions = useMemo(() => {
    const uniqueObjects = Array.from(
      new Set(allOptions?.map(JSON.stringify)),
    ).map(JSON.parse);

    return uniqueObjects ?? [];
  }, [allOptions]);

  const computedValueMulti = useMemo(() => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        ?.map((id) => {
          const option = optionsFromLocale?.options?.find(
            (el) => el?.guid === id,
          );

          if (!option) return null;
          return {
            ...option,
          };
        })
        .filter((el) => el !== null);
    } else {
      const option = optionsFromLocale?.options?.find(
        (el) => el?.guid === value,
      );

      if (!option) return [];

      return [
        {
          ...option,
        },
      ];
    }
  }, [optionsFromLocale?.options, value]);

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
  }, [computedValue, field, value, computedValueMulti]);

  useEffect(() => {
    if ((Boolean(value) || Boolean(state?.[`${tableSlug}_id`])) && !isMulti)
      getValueData();
  }, [value]);

  useEffect(() => {
    if (
      computedValueMulti?.length &&
      isMulti &&
      computedValueMulti?.length > localValue?.length
    ) {
      setLocalValue(computedValueMulti);
      updateObject();
    }
  }, [computedValueMulti]);

  useEffect(() => {
    setClientTypeValue();
  }, []);

  useEffect(() => {
    if (autoFiltersValue) {
      setPage(1);
    }
  }, [autoFiltersValue]);

  function loadMoreItems() {
    if (optionsFromLocale?.count <= computedOptions?.length) return;
    // queryClient.prefetchQuery(
    //   [
    //     "GET_OBJECT_LIST",
    //     page + 1,
    //     tableSlug,
    //     debouncedValue,
    //     autoFiltersValue,
    //   ],
    //   () => queryFn(page + 1),
    // );
    setPage((prevPage) => prevPage + 1);
  }

  const computedViewFields = useMemo(() => {
    if (field?.attributes?.enable_multi_language) {
      const viewFields = field?.attributes?.view_fields?.map((el) => el?.slug);
      const computedLanguages = languages?.map((item) => item?.slug);

      const activeLangView = viewFields?.filter((el) =>
        el?.includes(activeLang ?? i18n?.language),
      );

      const filteredData = viewFields?.filter((key) => {
        return !computedLanguages.some((lang) => key.includes(lang));
      });

      return [...(activeLangView ?? []), ...(filteredData ?? [])] ?? [];
    } else {
      return field?.attributes?.view_fields?.map((el) => el?.slug);
    }
  }, [field, activeLang, i18n?.language]);

  useEffect(() => {
    if (field?.attributes?.object_id_from_jwt === true) {
      const foundOption = allOptions?.find((el) => el?.guid === isUserId);

      if (foundOption) {
        setLocalValue([foundOption]);
      }
    }
  }, [allOptions?.length, field]);

  useEffect(() => {
    if (localValue?.length === 0 && computedValue?.guid) {
      setLocalValue([computedValue]);
      setValue(computedValue?.guid);
    }
  }, [state?.id, computedValue]);

  const deleteHandler = async (row) => {
    setLocalValue((prev) => prev.filter((el) => el.guid !== row.guid));
    setValue((prev) => prev.filter((el) => el !== row.guid));
  };

  const dispatch = useDispatch();

  return (
    <Tooltip
      title={
        localValue?.length
          ? localValue?.map((option) => {
              const value = computedViewFields?.map((el, index) => {
                if (field?.attributes?.enable_multi_language) {
                  return getRelationFieldTabsLabel(
                    field,
                    option,
                    activeLang ?? i18n?.language,
                  );
                  // return (
                  //   option?.[`${el}_${activeLang ?? i18n?.language}`] ??
                  //   option?.[`${el}`]
                  // );
                } else {
                  return isMulti ? el : option?.[el];
                }
              });

              if (Array.isArray(value) && value?.length > 0) {
                return value.join(",");
              }
              return "";
            })
          : ""
      }
    >
      <Box
        sx={{
          width: "330px",
          height: "32px",
          cursor: disabled ? "not-allowed" : "pointer",
          border: errors?.[field?.slug] ? "1px solid red" : "none",
          borderRadius: "4px",
        }}
      >
        <Select
          placeholder="Empty"
          id={`relationField`}
          isDisabled={disabled}
          options={computedOptions ?? []}
          isClearable={true}
          styles={customStyles}
          value={localValue ?? []}
          required={required}
          defaultValue={value ?? ""}
          className=""
          isMulti={isMulti}
          onChange={(e) => {
            if (e === null && required) {
              dispatch(showAlert("This field is required"));
            } else {
              changeHandler(e);
            }
          }}
          onMenuScrollToBottom={loadMoreItems}
          // inputChangeHandler={(e) => inputChangeHandler(e)}
          onInputChange={(e, newValue) => {
            setInputValue(e ?? null);
            inputChangeHandler(e);
          }}
          getOptionLabel={(option) =>
            computedViewFields?.map((el) => {
              if (field?.attributes?.enable_multi_language) {
                return `${option[`${el}_${activeLang ?? i18n?.language}`] ?? option[`${el}`]} `;
              } else {
                return `${option[el]} `;
              }
            })
          }
          getOptionValue={(option) =>
            option?.guid ?? option?.id ?? option?.client_type_id
          }
          components={{
            DropdownIndicator: () => null,
            MultiValue: (option) => {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>
                    {computedViewFields?.map((el, index) => {
                      if (field?.attributes?.enable_multi_language) {
                        return getRelationFieldTabsLabel(
                          field,
                          option.data,
                          activeLang ?? i18n?.language,
                        );
                        // return (
                        //   option?.[`${el}_${activeLang ?? i18n?.language}`] ??
                        //   option?.[`${el}`]
                        // );
                      } else {
                        return isMulti ? el : option?.[el];
                      }
                    })}
                  </span>
                  <Box display="flex" alignItems="center">
                    <IconGenerator
                      icon="arrow-up-right-from-square.svg"
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      size={15}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigateToForm(tableSlug, "EDIT", option.data);
                      }}
                    />
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        deleteHandler(option.data);
                      }}
                    >
                      <svg
                        height="16"
                        width="16"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        focusable="false"
                        className="css-tj5bde-Svg"
                      >
                        <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                      </svg>
                    </span>
                  </Box>
                  {/* <IconGenerator
                  icon="delete.svg"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  size={15}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    deleteHandler(option.data);
                  }}
                /> */}
                </div>
              );
            },
          }}
        />
        {errors?.[field?.slug] && (
          <div
            style={{
              color: "red",
              fontSize: "10px",
              // textAlign: "center",
              marginTop: "5px",
            }}
          >
            {errors?.[field?.slug]?.message ?? "This field is required!"}
          </div>
        )}
      </Box>
    </Tooltip>
  );
};

export default RelationField;
