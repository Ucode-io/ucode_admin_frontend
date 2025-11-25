import { makeStyles } from "@mui/styles";
import RelationGroupCascading from "@/components/ElementGenerators/RelationGroupCascading";
import CascadingElement from "@/components/ElementGenerators/CascadingElement";
import { Controller } from "react-hook-form";
import { AutoCompleteElement } from "../AutoCompleteElement";

const useStyles = makeStyles(() => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

export const RelationElement = ({
  relOptions,
  isBlackBg,
  control,
  name,
  updateObject,
  disabled,
  field,
  isLayout,
  disabledHelperText,
  setFormValue,
  index,
  defaultValue = null,
  isTableView = false,
  row,
  newUi,
  objectIdFromJWT,
  relationView,
  newColumn,
}) => {
  const classes = useStyles();

  if (!isLayout)
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return field?.attributes?.cascading_tree_table_slug ? (
            <RelationGroupCascading
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              value={value ?? ""}
              setFormValue={setFormValue}
              classes={classes}
              name={name}
              control={control}
              index={index}
              setValue={(e) => {
                onChange(e);
                updateObject();
              }}
            />
          ) : field?.attributes?.cascadings?.length > 1 ? (
            <CascadingElement
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              value={value ?? ""}
              setFormValue={setFormValue}
              classes={classes}
              name={name}
              control={control}
              index={index}
              setValue={(e) => {
                onChange(e);
                updateObject();
              }}
            />
          ) : (
            <AutoCompleteElement
              row={row}
              relOptions={relOptions}
              disabled={disabled}
              isBlackBg={isBlackBg}
              value={value}
              name={name}
              setValue={(e) => {
                onChange(e);
                isTableView && updateObject();
              }}
              field={field}
              tableSlug={field.table_slug}
              setFormValue={setFormValue}
              control={control}
              index={index}
              newUi={newUi}
              objectIdFromJWT={objectIdFromJWT}
              relationView={relationView}
              newColumn={newColumn}
            />
          );
        }}
      />
    );
};
