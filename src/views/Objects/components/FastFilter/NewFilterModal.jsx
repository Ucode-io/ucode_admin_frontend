import { useMemo } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { useFieldArray, useForm } from "react-hook-form"
import { Popover } from "@mui/material"
import { Clear } from "@mui/icons-material"
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined"

import { PinFilled, PlusIcon } from "../../../../assets/icons/icon"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import HFSelect from "../../../../components/FormElements/HFSelect"
import useFilters from "../../../../hooks/useFilters"
import { Filter } from "../FilterGenerator"
import styles from "./style.module.scss"
import { filterActions } from "../../../../store/filter/filter.slice"
import HFCheckbox from "../../../../components/FormElements/HFCheckbox"

const NewFilterModal = ({ anchorEl, handleClose, fieldsMap, view }) => {
  const { tableSlug } = useParams()
  const dispatch = useDispatch()
  const { filters } = useFilters(tableSlug, view.id)
  const { control, watch, reset } = useForm({
    defaultValues: {
      new: [
        {
          checked: false,
          left_field: "",
          right_field: "",
        },
      ],
    },
  })

  const onChange = (value, name) => {
    dispatch(
      filterActions.setFilter({
        tableSlug: tableSlug,
        viewId: view.id,
        name,
        value,
      })
    )
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: "new",
  })

  const computedOptions = useMemo(() => {
    return Object.values(fieldsMap)?.map((i) => ({ ...i, value: i.id }))
  }, [])

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const selectedField = useMemo(
    () => fieldsMap[watch(`new.${0}.left_field`)],
    [watch(`new.${0}.left_field`), fieldsMap]
  )

  console.log("watch", selectedField)

  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          handleClose()
          reset({ new: [{ checked: false, left_field: "", right_field: "" }] })
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className={styles.new_modal}>
          {fields.map((field, index) => (
            <div key={field.id} className={styles.new_modal_item}>
              <HFCheckbox
                checkedIcon={<PinFilled />}
                icon={<PushPinOutlinedIcon />}
                control={control}
                name={`new.${index}.checked`}
              />
              <HFSelect
                control={control}
                options={computedOptions}
                onChange={(e) => dispatch(filterActions.setNewFilter({}))}
                name={`new.${index}.left_field`}
              />
              <Filter
                dispabled
                field={
                  watch(`new.${index}.left_field`)
                    ? fieldsMap[watch(`new.${index}.left_field`)]
                    : ""
                }
                name={selectedField?.path_slug ?? selectedField?.slug}
                onChange={onChange}
                filters={filters}
                tableSlug={tableSlug}
              />
              <RectangleIconButton color="white" onClick={() => remove(index)}>
                <Clear />
              </RectangleIconButton>
            </div>
          ))}
          <div
            className={styles.add_btn}
            onClick={() =>
              append({ checked: false, left_field: "", right_field: "" })
            }
          >
            <PlusIcon />
            Добавить
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default NewFilterModal
