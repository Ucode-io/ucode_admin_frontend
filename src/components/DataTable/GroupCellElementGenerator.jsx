import { useMemo } from "react";
import { get } from "@ngard/tiny-get";
import { getRelationFieldTableCellLabel } from "../../utils/getRelationFieldLabel";

const GroupCellElementGenerator = ({ field = {}, row }) => {
  const value = useMemo(() => {
    if (field.type !== "LOOKUP") return get(row, field.slug, "");

    const result = getRelationFieldTableCellLabel(
      field,
      row,
      field.slug + "_data"
    );

    return result;
  }, [row, field]);

  if (typeof value === "object") return JSON.stringify(value);
  return value;
};

export default GroupCellElementGenerator;
