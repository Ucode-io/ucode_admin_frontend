import { Parser } from "hot-formula-parser";
import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useDebounce from "@/hooks/useDebounce";
import { getFieldByType } from "./getFieldByType";

const parser = new Parser();

const CellElementGeneratorForTableView = ({
  row,
  data,
  field,
  index,
  fields,
  control,
  isWrapField,
  isNewRow = false,
  newColumn = false,
  isTableView = false,
  setFormValue = () => {},
  updateObject = () => {},
  handleChange = () => {},
  newUi = false,
  rowData = [],
  errors = {},
  setErrors = () => {},
}) => {
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  const [objectIdFromJWT, setObjectIdFromJWT] = useState();
  const { i18n } = useTranslation();

  const debouncedUpdateObject = useDebounce(updateObject, 1000);

  let relationTableSlug = "";

  if (field?.id.includes("#")) {
    relationTableSlug = field?.id.split("#")[0];
  } else if (field?.type === "LOOKUP") {
    relationTableSlug = field?.table_slug;
  }

  const computedSlug = useMemo(() => {
    if (!isNewRow) {
      if (field?.enable_multilanguage) {
        return `multi.${index}.${field.slug}`;
      } else if (field.id?.includes("@")) {
        return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
      }

      return `multi.${index}.${field.slug}`;
    } else {
      if (field?.enable_multilanguage) {
        return `${field.slug}`;
      } else if (field.id?.includes("@")) {
        return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
      }

      return `${field.slug}`;
    }
  }, [field, i18n?.language]);

  const isDisabled =
    (field.attributes?.disabled ||
      !field.attributes?.field_permission?.edit_permission) &&
    !isNewRow;

  const defaultValue = useMemo(() => {
    const defaultValue =
      field.attributes?.defaultValue || field.attributes?.default_values;

    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;
    if (field?.attributes?.is_user_id_default === true) return userId;

    if (field.type === "MULTISELECT" || field.id?.includes("#"))
      return defaultValue;

    if (field.relation_type === "Many2One" || field?.type === "LOOKUP") {
      if (Array.isArray(defaultValue)) {
        return defaultValue[0];
      } else {
        return defaultValue;
      }
    }
    if (field?.type === "SWITCH") {
      return false;
    }
    if (field.relation_type !== "Many2One" || field?.type !== "LOOKUP") {
      if (Array.isArray(defaultValue)) {
        return defaultValue[0];
      } else {
        return defaultValue;
      }
    }

    if (!defaultValue) return undefined;

    const { error, result } = parser.parse(defaultValue);

    return error ? undefined : result;
  }, [field, objectIdFromJWT]);

  useEffect(() => {
    tables?.forEach((table) => {
      if (table.table_slug === relationTableSlug) {
        setObjectIdFromJWT(table?.object_id);
      }
    });
  }, [tables, relationTableSlug, field]);

  useEffect(() => {
    if (!row?.[field.slug] && (defaultValue || row?.[field.table_slug]?.guid)) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || defaultValue);
    }
  }, [row, computedSlug, defaultValue]);

  return getFieldByType({
    isDisabled,
    control,
    updateObject,
    computedSlug,
    field,
    defaultValue,
    row,
    newUi,
    index,
    setFormValue,
    newColumn,
    data,
    isTableView,
    fields,
    isWrapField,
    debouncedUpdateObject,
    handleChange,
    rowData,
    errors,
    setErrors,
  });
};

export default memo(CellElementGeneratorForTableView, (prev, next) => {
  return (
    prev.field === next.field &&
    prev.row === next.row &&
    prev.isNewRow === next.isNewRow &&
    prev.isBlackBg === next.isBlackBg
  );
});
