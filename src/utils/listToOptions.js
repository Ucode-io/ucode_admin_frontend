

const listToOptions = (list, labelFieldName = 'title', valueFieldName = 'id', type = 'type', relation_id ='relation_id') => {
  return list?.map(el => ({ value: valueFieldName !== 'all' ? el[valueFieldName] : el, label: el[labelFieldName], type: el[type], relation_id: el[relation_id] })) ?? []
}

export default listToOptions