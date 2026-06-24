import { FIELD_TYPES } from "./constants/fieldTypes";

const getFieldOptions = (field) => {
  if (field?.type === FIELD_TYPES.STATUS) {
    return [
      ...(field?.attributes?.todo?.options ?? []),
      ...(field?.attributes?.progress?.options ?? []),
      ...(field?.attributes?.complete?.options ?? []),
    ];
  }

  return field?.attributes?.options ?? [];
};

export const findBoardGroupOption = (field, groupName) =>
  getFieldOptions(field).find((option) =>
    [option?.value, option?.slug, option?.label].includes(groupName),
  );

export const getBoardGroupLabel = (field, groupName, language) => {
  const option = findBoardGroupOption(field, groupName);

  return option?.[`label_${language}`] || option?.label || groupName;
};
