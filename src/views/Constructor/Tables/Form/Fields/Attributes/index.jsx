import { useEffect, useRef } from "react"
import CheckboxAttributes from "./CheckboxAttributes"
import DateAttributes from "./DateAttributes"
import MultiLineAttributes from "./MultiLineAttributes"
import NumberAttributes from "./NumberAttributes"
import PickListAttributes from "./PickListAttributes"
import SingleLineAttributes from "./SingleLineAttributes"

const Attributes = ({ control, watch }) => {

  const fieldType = watch('type')

  if(!fieldType) return null

  switch (fieldType) {
    case "SINGLE_LINE":
      return (
        <SingleLineAttributes
          control={control}
        />
      )

    case "MULTISELECT":
    case "PICK_LIST":
      return (
        <PickListAttributes
          control={control}
        />
      )

    case "MULTI_LINE":
      return (
        <MultiLineAttributes
          control={control}
        />
      )

    case "DATE":
      return (
        <DateAttributes
          control={control}
        />
      )

    case "NUMBER":
      return (
        <NumberAttributes
          control={control}
        />
      )

    case "SWITCH":
    case "CHECKBOX":
      return (
        <CheckboxAttributes
          control={control}
        />
      )

    default:
      return (
        <SingleLineAttributes
          control={control}
        />
      )
  }
}

export default Attributes
