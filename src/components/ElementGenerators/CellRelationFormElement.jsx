import { Autocomplete, TextField } from "@mui/material";
import { get } from "@ngard/tiny-get";
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useQuery } from "react-query";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import IconGenerator from "../IconPicker/IconGenerator";
import styles from "./style.module.scss";

const CellRelationFormElement = ({
  isBlackBg,
  control,
  name,
  field,
  isLayout,
  disabledHelperText,
  setFormValue,
}) => {
  if (!isLayout)
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={null}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <AutoCompleteElement
            isBlackBg={isBlackBg}
            value={value}
            setValue={onChange}
            field={field}
            tableSlug={field.table_slug}
            error={error}
            disabledHelperText={disabledHelperText}
            setFormValue={setFormValue}
          />
        )}
      />
    );
};

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  field,
  value,
  tableSlug,
  isBlackBg,
  setValue,
  setFormValue = () => {},
}) => {
  const { navigateToForm } = useTabRouter();

  const { data: options } = useQuery(
    ["GET_OBJECT_LIST", tableSlug.includes("doctors_") ? "doctors" : tableSlug],
    () => {
      return constructorObjectService.getList(tableSlug, { data: {} });
    },
    {
      select: (res) => {
        return res?.data?.response ?? [];
      },
    }
  );

  const computedValue = useMemo(() => {
    const findedOption = options?.find((el) => el?.guid === value);
    return findedOption ? [findedOption] : [];
  }, [options, value]);

  const getOptionLabel = (option) => {
    return getRelationFieldTabsLabel(field, option);
  };

  const changeHandler = (value) => {
    const val = value?.[value?.length - 1];

    setValue(val?.guid ?? null);

    if (!field?.attributes?.autofill) return;

    field.attributes.autofill.forEach(({ field_from, field_to }) => {
      setFormValue(field_to, get(val, field_from));
    });
  };

  return (
    <div className={styles.autocompleteWrapper}>
      <Autocomplete
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
        blurOnSelect
        openOnFocus
        getOptionLabel={(option) => getRelationFieldTabsLabel(field, option)}
        multiple
        isOptionEqualToValue={(option, value) => option.guid === value.guid}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
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
