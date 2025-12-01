import { Box } from "@mui/material";
import React, { memo, useMemo } from "react";
import CellElementGeneratorForTable from "./CellElementGeneratorForTable";
import CellElementGeneratorForTableView from "./CellElementGeneratorForTableView";
import CellElementGeneratorForRelation from "./CellElementGeneratorForRelation";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
// import { RelationElement } from "../FormComponents/RelationElement";
import { useTranslation } from "react-i18next";

const TableDataForm = ({
  row,
  view,
  index,
  field,
  isWrap,
  fields,
  control,
  tableView,
  tableSlug,
  relOptions,
  isTableView,
  relationfields,
  setFormValue = () => {},
  newUi,
  relationView,
  isNewRow,
  updateObject = () => {},
  handleChange = () => {},
  rowData,
  errors = {},
  setErrors = () => {},
}) => {
  const { i18n } = useTranslation();

  const isWrapField = useMemo(() => {
    if (!isWrap || !field || !field.id) {
      return null;
    }

    return Object.keys(isWrap)
      .map((key) => {
        return {
          id: key,
          status: isWrap?.[key],
        };
      })
      .find((x) => x?.id === field?.id)?.status;
  }, [isWrap, field?.id]);

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

  return (
    <Box
      style={{
        position: "relative",
        minWidth: "150px",
        boxSizing: "border-box",
      }}
    >
      {Boolean(view?.attributes?.table_editable) ? (
        <CellElementGeneratorForTable field={field} row={row} />
      ) : field?.type === FIELD_TYPES.LOOKUP ||
        field?.type === FIELD_TYPES.LOOKUPS ? (
        <CellElementGeneratorForRelation
          row={row}
          field={field}
          index={index}
          key={field?.id}
          fields={fields}
          control={control}
          tableView={tableView}
          tableSlug={tableSlug}
          relOptions={relOptions}
          isWrapField={isWrapField}
          isTableView={isTableView}
          updateObject={updateObject}
          setFormValue={setFormValue}
          relationfields={relationfields}
          relationView={relationView}
          newUi={newUi}
          name={computedSlug}
          handleChange={handleChange}
        />
      ) : (
        <CellElementGeneratorForTableView
          row={row}
          field={field}
          index={index}
          key={field?.id}
          fields={fields}
          control={control}
          isTableView={isTableView}
          isWrapField={isWrapField}
          updateObject={updateObject}
          setFormValue={setFormValue}
          newUi={newUi}
          handleChange={handleChange}
          rowData={rowData}
          errors={errors}
          setErrors={setErrors}
        />
      )}
    </Box>
  );
};

export default memo(TableDataForm, (prev, next) => {
  return (
    prev.row === next.row &&
    prev.rowData === next.rowData &&
    prev.field?.id === next.field?.id &&
    prev.isNewRow === next.isNewRow &&
    prev.isWrap === next.isWrap &&
    prev.view?.id === next.view?.id &&
    prev.i18n?.language === next.i18n?.language &&
    prev.newUi === next.newUi &&
    prev.index === next.index &&
    prev.isWrapField === next.isWrapField &&
    prev.isTableView === next.isTableView
  );
});
