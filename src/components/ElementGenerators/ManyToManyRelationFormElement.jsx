import { Close } from "@mui/icons-material"
import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"
import { Controller } from "react-hook-form"
import { useQuery } from "react-query"
import useTabRouter from "../../hooks/useTabRouter"
import constructorObjectService from "../../services/constructorObjectService"
import { getRelationFieldLabel } from "../../utils/getRelationFieldLabel"
import FEditableRow from "../FormElements/FEditableRow"
import FRow from "../FormElements/FRow"
import IconGenerator from "../IconPicker/IconGenerator"
import styles from "./style.module.scss"

const ManyToManyRelationFormElement = ({
  control,
  field,
  isLayout,
  sectionIndex,
  fieldIndex,
  column,
  mainForm,
  disabledHelperText,
  setFormValue,
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
          name={`${tableSlug}_ids`}
          defaultValue={null}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AutoCompleteElement
              value={value}
              setValue={onChange}
              field={field}
              tableSlug={tableSlug}
              error={error}
              disabledHelperText={disabledHelperText}
              setFormValue={setFormValue}
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
  setFormValue = () => {},
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
    if (!value) return []

    return value?.map((id) => {
      const option = options?.find((el) => el?.guid === id)
      
      if(!option) return null
      return {
        ...option,
        // label: getRelationFieldLabel(field, option)
      }
    })?.filter(el => el)
  }, [options, value])

  const getOptionLabel = (option) => {
    // return ''
    return getRelationFieldLabel(field, option)
  }

  const changeHandler = (value) => {
    if (!value) setValue(null)

    const val = value?.map((el) => el.guid)

    setValue(val ?? null)

    // if (!field?.attributes?.autofill) return

    // field.attributes.autofill.forEach(({ field_from, field_to }) => {
    //   setFormValue(field_to, val?.[field_from])
    // })
  }

  return (
    <div className={styles.autocompleteWrapper}>
      <div
        className={styles.createButton}
        onClick={() => navigateToForm(tableSlug)}
      >
        Создать новый
      </div>

      <Autocomplete
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
        disablePortal
        blurOnSelect
        openOnFocus
        getOptionLabel={(option) => getRelationFieldLabel(field, option)}
        multiple
        isOptionEqualToValue={(option, value) => option.guid === value.guid}
        renderInput={(params) => <TextField {...params} size="small" />}
        renderTags={(values, getTagProps) => {
          console.log("VLAUEs--->", values)
          return (
            <>
              <div className={styles.valuesWrapper}>
                {values?.map((el, index) => (
                  <div key={el.value} className={styles.multipleAutocompleteTags}>
                    <p className={styles.value}>{getOptionLabel(values[index])}</p>
                    <Close
                      fontSize="10"
                      onClick={getTagProps({ index })?.onDelete}
                    />
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
                  </div>
                ))}
              </div>
  
            </>
          )
        }}
      />
    </div>
  )
}

export default ManyToManyRelationFormElement
