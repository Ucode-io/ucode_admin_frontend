import { Autocomplete, TextField } from "@mui/material"
import { useMemo, useState } from "react"
import { Controller } from "react-hook-form"
import { useQuery } from "react-query"
import useTabRouter from "../../hooks/useTabRouter"
import constructorObjectService from "../../services/constructorObjectService"
import { getRelationFieldLabel } from "../../utils/getRelationFieldLabel"
import FEditableRow from "../FormElements/FEditableRow"
import FRow from "../FormElements/FRow"
import IconGenerator from "../IconPicker/IconGenerator"

const RelationFormElement = ({
  control,
  field,
  isLayout,
  sectionIndex,
  fieldIndex,
  column,
  mainForm,
  disabledHelperText,
  ...props
}) => {
  const tableSlug = useMemo(() => {
    return field.id.split("#")?.[0] ?? ""
  }, [field.id])

  if (!isLayout)
    return (
      <FRow label={field.label} required={field.required}>
        <Controller
          control={control}
          name={`${tableSlug}_id`}
          defaultValue={null}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AutoCompleteElement
              value={value}
              setValue={onChange}
              field={field}
              tableSlug={tableSlug}
              error={error}
              disabledHelperText={disabledHelperText}
            />
          )}
        />
      </FRow>
    )

  return (
    <Controller
      control={mainForm.control}
      name={`sections[${sectionIndex}].fields[${fieldIndex}].field_name`}
      defaultValue={field.label}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FEditableRow
          label={value}
          onLabelChange={onChange}
          required={field.required}
        >
          <Controller
            control={control}
            name={`${tableSlug}_id`}
            defaultValue={null}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <AutoCompleteElement
                value={value}
                setValue={onChange}
                field={field}
                tableSlug={tableSlug}
                error={error}
                disabledHelperText={disabledHelperText}
              />
            )}
          />
        </FEditableRow>
      )}
    ></Controller>
  )
}

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  field,
  value,
  tableSlug,
  setValue,
  error,
  disabledHelperText,
}) => {
  const { navigateToForm } = useTabRouter()

  const { data: options } = useQuery(
    ["GET_OBJECT_LIST", tableSlug],
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
    return getRelationFieldLabel(field, option)
  }

  return (
    <Autocomplete
      options={options ?? []}
      value={computedValue}
      onChange={(event, newValue) => {
        setValue(newValue?.[newValue?.length - 1]?.guid ?? null)
      }}
      blurOnSelect
      openOnFocus
      getOptionLabel={(option) => getRelationFieldLabel(field, option)}
      multiple
      isOptionEqualToValue={(option, value) => option.value === value}
      renderInput={(params) => <TextField {...params} size="small" />}
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

      // renderOption={(props, option, { inputValue }) => {
      //   const matches = match(option.title, inputValue);
      //   const parts = parse(option.title, matches);

      //   return (
      //     <li {...props}>
      //       <div>
      //         {parts.map((part, index) => (
      //           <span
      //             key={index}
      //             style={{
      //               fontWeight: part.highlight ? 700 : 400,
      //             }}
      //           >
      //             {part.text}
      //           </span>
      //         ))}
      //       </div>
      //     </li>
      //   );
      // }}
    />
  )
}

export default RelationFormElement
