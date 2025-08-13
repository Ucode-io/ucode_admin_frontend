import {get} from "@ngard/tiny-get";
import {format, isValid} from "date-fns";
import {numberWithSpaces} from "@/utils/formatNumbers";

export const getRelationFieldLabel = (field, option) => {
  if (!option) return "";
  let label = "";

  field.attributes?.view_fields?.forEach((el) => {
    let result = "";
    if (el?.type === "DATE")
      result = format(new Date(option[el?.slug]), "dd.MM.yyyy");
    else if (el?.type === "DATE_TIME")
      result = format(new Date(option[el?.slug]), "dd.MM.yyyy HH:mm");
    else if (el?.type === "NUMBER") result = numberWithSpaces(option?.[el?.slug]);
    else result = option[el?.slug];

    label += `${result ?? ""} `;
  });

  return label;
};

export const getRelationFieldTabsLabel = (field, option, lang) => {
  if (!Array.isArray(field?.view_fields ?? field?.attributes?.view_fields))
    return "";

  let label = "";

  let langLabel = "";

  (field?.view_fields ?? field?.attributes?.view_fields)?.forEach((el) => {
    let result = "";
    if (el?.type === "DATE")
      result = isValid(new Date(option?.[el?.slug]))
        ? format(new Date(option?.[el?.slug]), "dd.MM.yyyy")
        : "";
    else if (el?.type === "DATE_TIME")
      result = isValid(new Date(option?.[el?.slug]))
        ? format(new Date(option?.[el?.slug]), "dd.MM.yyyy HH:mm")
        : "";
    else if (el?.type === "NUMBER") result = numberWithSpaces(option?.[el?.slug]);
    else {
      const pattern = new RegExp(`_${lang}`);

      if (lang && pattern.test(el?.slug)) {
        langLabel = option?.[el?.slug] ?? " ";
      }

      result = option?.[el?.slug];
    }

    label += `${result ?? ""} `;
  });

  return langLabel ? langLabel : label;
};

export const getRelationFieldTabsLabelLang = (
  field,
  option,
  lang,
  languages = []
) => {
  if (!Array.isArray(field?.view_fields ?? field?.attributes?.view_fields))
    return "";

  let label = "";
  let langLabel = "";

  const filteredViewFields = (
    field?.view_fields ?? field?.attributes?.view_fields
  ).filter((el) => {
    if (["DATE", "DATE_TIME", "NUMBER"].includes(el?.type)) return true;

    const langMatch = languages?.find((lng) => el?.slug?.endsWith(`_${lng}`));
    return !langMatch || el?.slug?.endsWith(`_${lang}`);
  });

  filteredViewFields.forEach((el) => {
    let result = "";

    if (el?.type === "DATE") {
      result = isValid(new Date(option?.[el?.slug]))
        ? format(new Date(option[el?.slug]), "dd.MM.yyyy")
        : "";
    } else if (el?.type === "DATE_TIME") {
      result = isValid(format(new Date(option[el?.slug]), "dd.MM.yyyy HH:mm"))
        ? format(new Date(option[el?.slug]), "dd.MM.yyyy HH:mm")
        : "";
    } else if (el?.type === "NUMBER") {
      result = numberWithSpaces(option[el?.slug]);
    } else {
      if (el?.slug?.endsWith(`_${lang}`)) {
        langLabel = option?.[el?.slug] ?? " ";
      }
      if(!el?.slug?.endsWith(`_id`)) {
        result = option?.[el?.slug];
      }
    }

    label += `${result ?? ""} `;
  });

  return langLabel ? langLabel : label.trim();
};

export const getRelationFieldTableCellLabel = (field, option, tableSlug) => {
  let label = "";

  field.view_fields?.forEach((el) => {
    let result = "";

    let value = get(option, `${tableSlug}.${el?.slug}`);

    if (el?.type === "DATE")
      result = value ? format(new Date(value), "dd.MM.yyyy") : "";
    else if (el?.type === "DATE_TIME")
      result = value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "";
    else if (el?.type === "NUMBER") result = numberWithSpaces(value);
    else result = value;

    label += ` ${result ?? " "}`;
  });

  return label;
};

export const getLabelWithViewFields = (viewFields, option) => {
  let label = "";

  viewFields?.forEach((field) => {
    let result = "";
    const value = get(option, field.slug);

    if (field?.type === "DATE")
      result = value ? format(new Date(value), "dd.MM.yyyy") : "";
    else if (field?.type === "DATE_TIME")
      result = value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "";
    else if (field?.type === "NUMBER") result = numberWithSpaces(value);
    else result = value;

    label += `${result ?? ""} `;
  });

  return label;
};
