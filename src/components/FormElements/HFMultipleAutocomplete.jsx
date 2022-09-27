import { Close, Create } from "@mui/icons-material"
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
} from "@mui/material"
import { useEffect } from "react"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import CreateButton from "../Buttons/CreateButton"
import SaveButton from "../Buttons/SaveButton"
import IconGenerator from "../IconPicker/IconGenerator"
import HFColorPicker from "./HFColorPicker"
import HFIconPicker from "./HFIconPicker"
import styles from "./style.module.scss"

const HFMultipleAutocomplete = ({
  control,
  name,
  label,
  width = "100%",
  disabledHelperText,
  placeholder,
  required = false,
  onChange = () => {},
  field,
  rules = {},
  defaultValue="",
  ...props
}) => {
  const options = field.attributes?.options ?? []

  const hasColor = field.attributes?.has_color
  const hasIcon = field.attributes?.has_icon
  const isMultiSelect = field.attributes?.is_multiselect

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({
        field: { onChange: onFormChange, value },
        fieldState: { error },
      }) => {
        return (
          <AutoCompleteElement
            value={value}
            options={options}
            width={width}
            label={label}
            hasColor={hasColor}
            hasIcon={hasIcon}
            onFormChange={onFormChange}
            disabledHelperText={disabledHelperText}
            error={error}
            isMultiSelect={isMultiSelect}
          />
        )
      }}
    ></Controller>
  )
}

const AutoCompleteElement = ({
  value,
  options,
  width,
  label,
  hasColor,
  hasIcon,
  onFormChange,
  disabledHelperText,
  error,
  isMultiSelect
}) => {
  const computedValue = useMemo(() => {
    if(!Array.isArray(value) || !value?.length) return []

    if(isMultiSelect) return value?.map((el) => options?.find((option) => option.value === el)) ?? []
    else return [options?.find(option => option.value === value[0])] ?? []

  }, [value, options, isMultiSelect])

  const changeHandler = (e, values) => {
    if(!values?.length) {
      onFormChange([])
      return
    }
    if(isMultiSelect) onFormChange(values?.map((el) => el.value))
    else onFormChange([values[values?.length - 1]?.value] ?? [])
  }

  return (
    <FormControl style={{ width }}>
      <InputLabel size="small">{label}</InputLabel>
      <Autocomplete
        multiple
        value={computedValue}
        options={options}
        getOptionLabel={(option) => option?.label ?? option?.value}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        onChange={changeHandler}
        renderInput={(params) => <TextField {...params} size="small" />}
        noOptionsText={<AddOptionBlock />}
        renderTags={(values, getTagProps) => (
          <div className={styles.valuesWrapper}>
            {values?.map((el, index) => (
              <div
                key={el?.value}
                className={styles.multipleAutocompleteTags}
                style={
                  hasColor
                    ? { color: el?.color, background: `${el?.color}30` }
                    : {}
                }
              >
                {hasIcon && <IconGenerator icon={el?.icon} />}
                <p className={styles.value}>{el?.label ?? el?.value}</p>
                <Close
                  fontSize="10"
                  onClick={getTagProps({ index })?.onDelete}
                />
              </div>
            ))}
          </div>
        )}
      />
      {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )}
    </FormControl>
  )
}

const AddOptionBlock = () => {
  
  const { control } = useForm()

  useEffect(() => {
    console.log("MOUNTERDDD ==>")
  }, [])
  
  return <div className="flex align-center gap-2" >
    <HFColorPicker control={control} name="color" onClick={(e) => {
      e.stopPropagation()
      e.preventDefault()
    }}  />
    <HFIconPicker shape="rectangle" control={control} name="icon" />
    <CreateButton />
  </div>
}

export default HFMultipleAutocomplete
