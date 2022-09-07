import { TextField } from "@mui/material"
import { useState } from "react"
import { Controller, useWatch } from "react-hook-form"
import useDebouncedWatch from "../../hooks/useDebouncedWatch"
import { Parser } from "hot-formula-parser"

const parser = new Parser()

const HFFormulaField = ({ control, name, rules={}, setFormValue, required, disabledHelperText, fieldsList, field, ...props }) => {
  const formula = field?.attributes?.formula ?? ""

  const values = useWatch({
    control,
  })

  useDebouncedWatch(
    () => {
      let computedFormula = formula

      console.log('asdasd')
      fieldsList?.forEach((field) => {
        computedFormula = computedFormula.replaceAll(
          field.slug,
          values[field.slug]
        )
      })

      const { error, result } = parser.parse(computedFormula)

      if (error) setFormValue(name, "Error")
      else setFormValue(name, result)
    },
    [values],
    300
  )

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          size="small"
          value={value}
          name={name}
          error={error}
          fullWidth
          helperText={!disabledHelperText && error?.message}
          InputProps={{
            readOnly: true,
            style: {
              background: "#c0c0c039",
            },
          }}
          {...props}
        />
      )}
    ></Controller>
  )
}

export default HFFormulaField
