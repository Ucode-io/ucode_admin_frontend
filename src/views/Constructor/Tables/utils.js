import { sortByOrder } from "../../../utils/sortByOrder"

export const computeSections = (sections) => {
  return sections
    .map((section) => ({
      ...section,
      fields: section.fields?.map(field => ({...field, field_name: field.label}))
      .sort(sortByOrder) ?? [],
    }))
    ?.sort(sortByOrder) ?? []
}

export const computeSectionsOnSubmit = (sections) => {
  return sections.map((section, sectionIndex) => ({
    ...section,
    order: sectionIndex + 1,
    fields: section.fields
  }))
}
