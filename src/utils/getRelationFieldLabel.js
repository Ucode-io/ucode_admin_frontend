import { format } from "date-fns"


export const getRelationFieldLabel = (field, option) => {
  let label = ""

    field.attributes?.fields?.forEach((el) => {
      let value = ""
      if (el?.type === "DATE")
        value = format(new Date(option[el?.slug]), "dd.MM.yyyy")
      else if (el?.type === "DATE_TIME")
        value = format(new Date(option[el?.slug]), "dd.MM.yyyy HH:mm")
      else value = option[el?.slug]

      label += `${value ?? ""} `
    })

    return label
}

export const getRelationFieldTabsLabel = (field, option) => {
  let label = ""

    field.attributes?.forEach((el) => {
      let value = ""
      if (el?.type === "DATE")
        value = format(new Date(option[el?.slug]), "dd.MM.yyyy")
      else if (el?.type === "DATE_TIME")
        value = format(new Date(option[el?.slug]), "dd.MM.yyyy HH:mm")
      else value = option[el?.slug]

      label += `${value ?? ""} `
    })

    return label
}

