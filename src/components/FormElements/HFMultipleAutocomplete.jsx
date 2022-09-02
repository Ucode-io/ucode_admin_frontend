import { Close } from "@mui/icons-material"
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
} from "@mui/material"
import { Controller } from "react-hook-form"
import CAutoCompleteSelect from "../CAutoCompleteSelect"
import IconGenerator from "../IconPicker/IconGenerator"
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
  ...props
}) => {
  const options = field.attributes.options ?? []

  const hasColor = field.attributes?.has_color
  const hasIcon = field.attributes?.has_icon

  const computedValue = () => {}

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({
        field: { onChange: onFormChange, value },
        fieldState: { error },
      }) => {
        const computedValue = Array.isArray(value)
          ? value?.map((el) => options?.find((option) => option.value === el))
          : []

        return (
          <FormControl style={{ width }}>
            <InputLabel size="small">{label}</InputLabel>
            <Autocomplete
              multiple
              value={computedValue}
              options={options}
              getOptionLabel={(option) => option?.value}
              isOptionEqualToValue={(option, value) =>
                option?.value === value.value
              }
              onChange={(e, values) => {
                onFormChange(values?.map((el) => el.value))
              }}
              renderInput={(params) => <TextField {...params} size="small" />}
              renderTags={(values, getTagProps) => (
                <div className={styles.valuesWrapper} >
                  {values?.map((el, index) => (
                    <div
                      key={el.value}
                      className={styles.multipleAutocompleteTags}
                      onClick={getTagProps({ index })?.onDelete}
                      style={hasColor ? { color: el?.color, background: `${el?.color}30` } : {}}
                    >
                      {hasIcon && <IconGenerator icon={el?.icon} />}
                      <p className={styles.value} >{el?.value}</p>
                      <Close fontSize="10" />

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
      }}
    ></Controller>
  )
}

export default HFMultipleAutocomplete
