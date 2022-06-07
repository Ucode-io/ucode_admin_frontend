

export const addOrderNumberToSections = (sections = []) => {
  const sectionsWithOrderNumber = sections.map((section, index) => ({
    ...section,
    order_number: index + 1,
    fields: section.fields?.map((field, fieldIndex) => ({
      ...field,
      order_number: fieldIndex + 1,
    })) ?? []
  })) ?? [];

  return sectionsWithOrderNumber;
}