import { Parser } from "hot-formula-parser";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CellElementGenerator from "./CellElementGenerator";
import { fieldTypesComponent } from "./FieldTypesComponents";

const parser = new Parser();

const CellElementGeneratorForTableView = ({
  relOptions,
  tableView,
  field,
  fields,
  isBlackBg = false,
  row,
  relationfields,
  isWrapField,
  updateObject,
  control,
  setFormValue,
  index,
  data,
  isNewRow,
}) => {
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  const { i18n } = useTranslation();
  let relationTableSlug = "";
  let objectIdFromJWT = "";

  if (field?.id.includes("#")) {
    relationTableSlug = field?.id.split("#")[0];
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
  }, [field, i18n?.language, index, isNewRow]);

  const isDisabled = field.attributes?.disabled || !field.attributes?.field_permission?.edit_permission;

  const defaultValue = useMemo(() => {
    const defaultValue = field.attributes?.defaultValue ?? field.attributes?.default_values;

    if (field?.attributes?.is_user_id_default === true) return userId;
    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;

    if (field.relation_type === "Many2One" || field?.type === "LOOKUP") {
      if (Array.isArray(defaultValue)) {
        return defaultValue[0];
      } else {
        return defaultValue;
      }
    }
    if (field.type === "MULTISELECT" || field.id?.includes("#")) return defaultValue;

    if (!defaultValue) return undefined;

    const { error, result } = parser.parse(defaultValue);

    return error ? undefined : result;
  }, [field, userId, objectIdFromJWT]);

  useEffect(() => {
    tables?.forEach((table) => {
      if (table.table_slug === relationTableSlug) {
        objectIdFromJWT = table.object_id;
      }
    });
  }, [tables, relationTableSlug]);

  useEffect(() => {
    if (!row?.[field.slug]) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || defaultValue);
    }
  }, [row, computedSlug, defaultValue, field, setFormValue]);

  const CellElement = fieldTypesComponent[field.type] || CellElementGenerator;

  const maskGenerator = useMemo(() => {
    if (field.type === "PHONE") {
      return "(99) 999-99-99";
    } else if (field.type === "DATE") {
      return "99.99.9999";
    } else if (field.type === "DATE_TIME") {
      return "99.99.9999 99:99";
    } else if (field.type === "TIME") {
      return "99:99";
    } else {
      return undefined;
    }
  }, [field.type]);

  return (
    <CellElement
      relOptions={relOptions}
      isNewRow={isNewRow}
      tableView={tableView}
      disabled={isDisabled}
      isFormEdit
      isBlackBg={isBlackBg}
      updateObject={updateObject}
      isNewTableView={true}
      control={control}
      name={computedSlug}
      field={field}
      row={row}
      placeholder={field.attributes?.placeholder}
      setFormValue={setFormValue}
      index={index}
      defaultValue={defaultValue}
      relationfields={relationfields}
      data={data}
      fields={fields}
      isWrapField={isWrapField}
      isDisabled={isDisabled}
      isTransparent={true}
      type={field.type === "PASSWORD" && "PASSWORD"}
      mask={maskGenerator}
      showCopyBtn={false}
      width={"100%"}
      options={field?.attributes?.options}
      computedSlug={computedSlug}
      fieldsList={fields}
      isTableView={true}
      rules={{
        pattern: {
          value: /\S+@\S+\.\S+/,
          message: "Incorrect email format",
        },
      }}
    />
  );
};

export default CellElementGeneratorForTableView;
