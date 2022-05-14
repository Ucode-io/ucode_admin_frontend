import { sortByOrder } from "../../../utils/sortByOrder"

export const computeSections = (sections) => {
  return sections
    .map((section) => ({
      ...section,
      column1: section.fields
        ?.filter((field) => field.column !== 2)
        .map(field => ({...field, field_name: field.label}))
        .sort(sortByOrder),
      column2: section.fields
        ?.filter((field) => field.column === 2)
        .map(field => ({...field, field_name: field.label}))
        .sort(sortByOrder),
    }))
    ?.sort(sortByOrder)
}

export const computeSectionsOnSubmit = (sections) => {
  return sections.map((section, sectionIndex) => ({
    ...section,
    order: sectionIndex + 1,
    fields: [
      ...section.column1?.map((field, fieldIndex) => ({
        ...field,
        order: fieldIndex + 1,
        column: 1,
      })),
      ...section.column2?.map((field, fieldIndex) => ({
        ...field,
        order: fieldIndex + 1,
        column: 2,
      })),
    ],
  }))
}
