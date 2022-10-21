import { Autocomplete, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { get } from "@ngard/tiny-get"
import { useMemo } from "react"
import { Controller } from "react-hook-form"
import { useQuery } from "react-query"
import useTabRouter from "../../hooks/useTabRouter"
import constructorObjectService from "../../services/constructorObjectService"
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel"
import IconGenerator from "../IconPicker/IconGenerator"
import styles from "./style.module.scss"

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}))

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
}) => {
  const classes = useStyles()

  if (!isLayout)
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={null}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
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
            tableSlug={field.table_slug}
            error={error}
            disabledHelperText={disabledHelperText}
            setFormValue={setFormValue}
          />
        )}
      />
    )
}

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  field,
  value,
  isFormEdit,
  placeholder,
  tableSlug,
  name,
  disabled,
  classes,
  isBlackBg,
  setValue,
  setFormValue = () => {},
}) => {
  const { navigateToForm } = useTabRouter()

  const { data: options } = useQuery(
    ["GET_OBJECT_LIST", tableSlug.includes("doctors_") ? "doctors" : tableSlug],
    () => {
      return constructorObjectService.getList(tableSlug, { data: {} })
    },
    {
      select: (res) => {
        return res?.data?.response ?? []
      },
    }
  )

  const computedValue = useMemo(() => {
    const findedOption = options?.find((el) => el?.guid === value)
    return findedOption ? [findedOption] : []
  }, [options, value])

  const getOptionLabel = (option) => {
    return getRelationFieldTabsLabel(field, option)
  }

  const changeHandler = (value) => {
    const val = value?.[value?.length - 1]

    setValue(val?.guid ?? null)

    if (!field?.attributes?.autofill) return

    field.attributes.autofill.forEach(({ field_from, field_to }) => {
      const setName = name.split(".")
      setName.pop()
      setName.push(field_to)
      setFormValue(setName.join("."), get(val, field_from))
    })
  }

  return (
    <div className={styles.autocompleteWrapper}>
      <Autocomplete
        disabled={disabled}
        options={options ?? []}
        value={computedValue}
        onChange={(event, newValue) => {
          changeHandler(newValue)
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
                e.stopPropagation()
                e.preventDefault()
                navigateToForm(tableSlug, "EDIT", value[0])
              }}
            />
          </>
        )}
      />
    </div>
  )
}

export default CellRelationFormElement
