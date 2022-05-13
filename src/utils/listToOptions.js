

const listToOptions = (list, labelFieldName = 'title', valueFieldName = 'id') => {
  return list?.map(el => ({ value: el[valueFieldName], label: el[labelFieldName] })) ?? []
}

export default listToOptions