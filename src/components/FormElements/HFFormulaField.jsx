import { TextField } from "@mui/material"
import { useState } from "react"
import { Controller, useWatch } from "react-hook-form"
import useDebouncedWatch from "../../hooks/useDebouncedWatch"
import { Parser } from "hot-formula-parser"
import { useEffect } from "react"

const parser = new Parser()

const HFFormulaField = ({ control, name, rules={}, setFormValue, required, disabledHelperText, fieldsList, field, ...props }) => {
  const formula = field?.attributes?.formula ?? ""

  const values = useWatch({
    control,
  })

  const updateValue = () => {
    let computedFormula = formula

    const fieldsListSorted = fieldsList?.sort((a, b) => b.slug?.length - a.slug?.length)
    fieldsListSorted?.forEach((field) => {
      computedFormula = computedFormula.replaceAll(
        `${field.slug}`,
        values[field.slug]
      )
    })

    const { error, result } = parser.parse(computedFormula)

    let value = 0
    if (error) value = error
    else value = result
    const prevValue = values[name]
    if(value !== prevValue) setFormValue(name, value)
  }

  useDebouncedWatch(
    updateValue,
    [values],
    300
  )

  useEffect(() => {
    updateValue()
  }, [])

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
