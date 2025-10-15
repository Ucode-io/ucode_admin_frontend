import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { useMutation } from "react-query";
import constructorObjectService from "@/services/constructorObjectService";
import CellElementGeneratorForTable from "./CellElementGeneratorForTable";
import CellElementGeneratorForTableView from "./CellElementGeneratorForTableView";
// import CellElementGeneratorForRelation from "./CellElementGeneratorForRelation";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { RelationElement } from "../FormComponents/RelationElement";
import { useTranslation } from "react-i18next";

const TableDataForm = ({
  row,
  data,
  view,
  index,
  field,
  watch,
  isWrap,
  fields,
  control,
  tableView,
  tableSlug,
  relOptions,
  isTableView,
  relationfields,
  getValues = () => {},
  setFormValue = () => {},
  newUi,
  relationView,
  isNewRow,
}) => {
  const { mutate: updateObject } = useMutation(() =>
    constructorObjectService.update(tableSlug, {
      data: { ...getValues(`multi.${index}`) },
    }),
  );

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
        <RelationElement
          row={row}
          data={data}
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
        />
      ) : (
        <CellElementGeneratorForTableView
          row={row}
          data={data}
          field={field}
          index={index}
          watch={watch}
          key={field?.id}
          fields={fields}
          control={control}
          getValues={getValues}
          tableView={tableView}
          tableSlug={tableSlug}
          relOptions={relOptions}
          isTableView={isTableView}
          isWrapField={isWrapField}
          updateObject={updateObject}
          setFormValue={setFormValue}
          relationfields={relationfields}
          newUi={newUi}
        />
      )}
    </Box>
  );
};

export default TableDataForm;
