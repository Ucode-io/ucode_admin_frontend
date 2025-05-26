const getLabel = (item, slug) => {
  if (item[slug]) {
    if (Array.isArray(item[slug])) {
      return item[slug]?.[0]?.toString();
    }

    return item[slug]?.toString();
  }

  if (!item?.data) return "";

  for (const innerItem of item?.data) {
    const result = getLabel(innerItem, slug);
    if (result) return result?.toString();
  }

  return "";
};

export const viewSearch = ({ columnsForSearch, searchText, computedData}) => {

  const searchFields = columnsForSearch?.filter((item) => item?.is_search);

  const filteredData = searchText
    ? searchFields
        ?.map((searchField) => {
          return computedData.filter((item) => {
            return getLabel(item, searchField?.slug)
              ?.toLowerCase()
              .includes(searchText?.toLowerCase());
          });
        })
        ?.flat()
    : computedData;

  return filteredData

}
