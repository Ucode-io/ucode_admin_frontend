import {Box} from "@mui/material";
import React, {useMemo} from "react";
import {useMutation} from "react-query";
import constructorObjectService from "../../services/constructorObjectService";
import CellElementGeneratorForTable from "./CellElementGeneratorForTable";
import CellElementGeneratorForTableView from "./CellElementGeneratorForTableView";
import CellElementGeneratorForRelation from "./CellElementGeneratorForRelation";

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
}) => {
  const {mutate: updateObject} = useMutation(() =>
    constructorObjectService.update(tableSlug, {
      data: {...getValues(`multi.${index}`)},
    })
  );

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

  return (
    <Box
      style={{
        position: "relative",
        minWidth: "150px",
        boxSizing: "border-box",
      }}>
      {view?.attributes?.table_editable ? (
        <CellElementGeneratorForTable field={field} row={row} />
      ) : field?.type === "LOOKUP" || field?.type === "LOOKUPS" ? (
        <CellElementGeneratorForRelation
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
          newUi={newUi}
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
