import { useSelector } from "react-redux";
import { Parser } from "hot-formula-parser";
import { useTranslation } from "react-i18next";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@mui/material";
import CellRelationFormElementNew from "./CellRelationFormElementNew";

const CellManyToManyRelationElement = lazy(
  () => import("./CellManyToManyRelationElement"),
);
const CellRelationFormElementForNewColumn = lazy(
  () => import("./CellRelationFormElementForNewColumn"),
);

const parser = new Parser();

const CellElementGeneratorForRelation = ({
  row,
  data,
  index,
  field,
  control,
  mainForm,
  tableView,
  relationfields,
  isNewRow = false,
  newColumn = false,
  isBlackBg = false,
  isTableView = false,
  updateObject = () => {},
  setFormValue = () => {},
  newUi,
  relationView,
  fieldsMap,
}) => {
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  const [objectIdFromJWT, setObjectIdFromJWT] = useState();
  const { i18n } = useTranslation();
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
      field.attributes?.defaultValue ?? field.attributes?.default_values;

    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;
    if (field?.attributes?.is_user_id_default === true) return userId;

    if (field.relation_type === "Many2One" || field?.type === "LOOKUP") {
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
    if (!row?.[field.slug]) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || defaultValue);
    }
  }, [row, computedSlug, defaultValue]);

  const renderInputValues = {
    LOOKUP: () => {
      return newColumn ? (
        <Suspense
          fallback={
            <Skeleton
              variant="rectangular"
              style={{ borderRadius: "6px" }}
              width={"100%"}
              height={20}
            />
          }
        >
          <CellRelationFormElementForNewColumn
            isFormEdit
            row={row}
            data={data}
            field={field}
            index={index}
            control={control}
            name={computedSlug}
            mainForm={mainForm}
            isNewRow={isNewRow}
            tableView={tableView}
            disabled={isDisabled}
            isBlackBg={isBlackBg}
            isNewTableView={true}
            updateObject={updateObject}
            setFormValue={setFormValue}
            defaultValue={defaultValue}
            relationfields={relationfields}
            placeholder={field.attributes?.placeholder}
            objectIdFromJWT={objectIdFromJWT}
            relationView={relationView}
            fieldsMap={fieldsMap}
            newColumn={true}
          />
        </Suspense>
      ) : (
        <CellRelationFormElementNew
          row={row}
          isFormEdit
          data={data}
          index={index}
          field={field}
          control={control}
          isTableView={isTableView}
          name={computedSlug}
          tableView={tableView}
          disabled={isDisabled}
          isBlackBg={isBlackBg}
          isNewTableView={true}
          setFormValue={setFormValue}
          updateObject={updateObject}
          defaultValue={defaultValue}
          relationfields={relationfields}
          placeholder={field.attributes?.placeholder}
          newUi={newUi}
          objectIdFromJWT={objectIdFromJWT}
          relationView={relationView}
        />
      );
    },
    LOOKUPS: () => (
      <Suspense
        fallback={
          <Skeleton
            variant="rectangular"
            style={{ borderRadius: "6px" }}
            width={"100%"}
            height={20}
          />
        }
      >
        <CellManyToManyRelationElement
          newUi={newUi}
          row={row}
          isFormEdit
          field={field}
          index={index}
          control={control}
          name={computedSlug}
          disabled={isDisabled}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          setFormValue={setFormValue}
          defaultValue={defaultValue}
          updateObject={updateObject}
          placeholder={field.attributes?.placeholder}
        />
      </Suspense>
    ),
  };

  return renderInputValues[field?.type] ? renderInputValues[field?.type]() : "";
};

export default CellElementGeneratorForRelation;
