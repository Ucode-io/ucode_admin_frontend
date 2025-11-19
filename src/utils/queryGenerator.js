import constructorObjectService from "../services/constructorObjectService";
import {getRelationFieldTabsLabel} from "./getRelationFieldLabel";

export const queryGenerator = (groupField, filters = {}, lang) => {
  if (!groupField)
    return {
      queryFn: () => {},
    };

  const filterValue = filters[groupField.slug];
  const computedFilters = filterValue ? { [groupField.slug]: filterValue } : {};

  if (groupField?.type === "PICK_LIST" || groupField?.type === "MULTISELECT") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id, lang],
      queryFn: () =>
        groupField?.attributes?.options?.map((el) => ({
          label: el?.[`label_${lang}`] ?? el?.label ?? el.value,
          value: el?.slug || el?.value,
          slug: groupField?.slug,
        })),
    };
  }

  if (groupField?.type === "LOOKUP" || groupField?.type === "LOOKUPS") {
    const queryFn = () =>
      constructorObjectService.getListV2(groupField.table_slug, {
        data: computedFilters ?? {},
      });

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        {tableSlug: groupField.table_slug, filters: computedFilters},
      ],
      queryFn,
      select: (res) => {
        return res?.data?.response?.map((el) => ({
          label: getRelationFieldTabsLabel(groupField, el, lang),
          value: el.guid,
          slug: groupField?.slug,
        }))
      }
    };
  }
};
