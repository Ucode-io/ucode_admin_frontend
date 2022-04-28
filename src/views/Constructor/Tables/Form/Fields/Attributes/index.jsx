import { useEffect, useRef } from "react"
import CheckboxAttributes from "./CheckboxAttributes"
import DateAttributes from "./DateAttributes"
import MultiLineAttributes from "./MultiLineAttributes"
import NumberAttributes from "./NumberAttributes"
import PickListAttributes from "./PickListAttributes"
import SingleLineAttributes from "./SingleLineAttributes"

const Attributes = ({ control, closeModal, reset, getValues, type }) => {
  const initialValues = useRef()

  const undoChanges = () => {
    reset(initialValues.current)
    closeModal()
  }

  useEffect(() => {
    const values = getValues()
    initialValues.current = values
  }, [getValues])

  switch (getValues("type")) {
    case "SINGLE_LINE":
      return (
        <SingleLineAttributes
          control={control}
          onClose={undoChanges}
          onSaveButtonClick={closeModal}
        />
      )

    case "PICK_LIST":
      return (
        <PickListAttributes
          control={control}
          onClose={undoChanges}
          onSaveButtonClick={closeModal}
        />
      )

    case "MULTI_LINE":
      return (
        <MultiLineAttributes
          control={control}
          onClose={undoChanges}
          onSaveButtonClick={closeModal}
        />
      )

    case "DATE":
      return (
        <DateAttributes
          control={control}
          onClose={undoChanges}
          onSaveButtonClick={closeModal}
        />
      )

    case "NUMBER":
      return (
        <NumberAttributes
          control={control}
          onClose={undoChanges}
          onSaveButtonClick={closeModal}
        />
      )

    case "CHECKBOX":
      return (
        <CheckboxAttributes
          control={control}
          onClose={undoChanges}
          onSaveButtonClick={closeModal}
        />
      )

    default:
      return (
        <SingleLineAttributes
          control={control}
          onClose={undoChanges}
          onSaveButtonClick={closeModal}
        />
      )
  }
}

export default Attributes
