import { get } from "@ngard/tiny-get"
import { format } from "date-fns"

export const getRelationFieldLabel = (field, option) => {
  let label = ""

  field.attributes?.view_fields?.forEach((el) => {
    let result = ""
    if (el?.type === "DATE")
      result = format(new Date(option[el?.slug]), "dd.MM.yyyy")
    else if (el?.type === "DATE_TIME")
      result = format(new Date(option[el?.slug]), "dd.MM.yyyy HH:mm")
    else result = option[el?.slug]

    label += `${result ?? ""} `
  })

  return label
}

export const getRelationFieldTabsLabel = (field, option) => {

  if(!Array.isArray(field?.view_fields)) return ""

  let label = ""

  field?.view_fields?.forEach((el) => {
    let result = ""
    if (el?.type === "DATE")
      result = format(new Date(option[el?.slug]), "dd.MM.yyyy")
    else if (el?.type === "DATE_TIME")
      result = format(new Date(option[el?.slug]), "dd.MM.yyyy HH:mm")
    else result = option[el?.slug]

    label += `${result ?? ""} `
  })

  return label
}

export const getRelationFieldTableCellLabel = (field, option, tableSlug) => {

  let label = ""

  field.view_fields?.forEach((el) => {
    let result = ""

    const value = get(option, `${tableSlug}.${el?.slug}`)

    if (el?.type === "DATE")
      result = value ? format(new Date(value), "dd.MM.yyyy") : ""
    else if (el?.type === "DATE_TIME")
      result = value ? format(new Date(value), "dd.MM.yyyy HH:mm") : ""
    else result = value

    label += `${result ?? ""} `
  })

  return label
}
