import React, { useEffect, useState } from "react";
import { numberWithSpaces } from "../../../utils/formatNumbers";
import { parseBoolean } from "../../../utils/parseBoolean";
import { formatDate } from "../../../utils/dateFormatter";
import TableTag from "../../../components/TableTag";
import MultiselectCellColoredElement from "../../../components/ElementGenerators/MultiselectCellColoredElement.jsx";
import IconGenerator from "../../../components/IconPicker";
import LogoDisplay from "../../../components/LogoDisplay";
import { useWatch } from "react-hook-form";
import constructorObjectService from "../../../services/constructorObjectService";

function ValueGenerator({ field, control }) {
  const [data, setData] = useState();

  const value = useWatch({
    control,
    name: field.slug,
  });

  useEffect(() => {
    if (field?.id.includes("#")) {
      constructorObjectService
        .getById(field?.id.split("#")[0], value)
        .then((res) => {
          setData(res?.data?.response);
        });
    }
  }, [value]);

  const view = field?.attributes?.view_fields;

  const computedSlug = view?.find((item) => item).slug;
  console.log('eeeeeeeee', field)
  switch (field.type) {
    case "DATE":
      return <span className="text-nowrap">{formatDate(value)}</span>;

    case "NUMBER":
      return numberWithSpaces(value);

    case "DATE_TIME":
      return (
        <span className="text-nowrap">
          {formatDate(value, "DATE_TIME")}
          {/* {value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "---"} */}
        </span>
      );

      case "FORMULA":
      return (
        <span className="text-nowrap">
          {value ?? 0}
        </span>
      );

    case "MULTISELECT":
      return (
        <MultiselectCellColoredElement
          resize={true}
          field={field}
          value={value}
        />
      );

    case "MULTI_LINE":
      return <span dangerouslySetInnerHTML={{ __html: value }}></span>;

    case "CHECKBOX":
    case "SWITCH":
      return parseBoolean(value) ? (
        <TableTag color="success">
          {field.attributes?.text_true ?? "Да"}
        </TableTag>
      ) : (
        <TableTag color="error">
          {field.attributes?.text_false ?? "Нет"}
        </TableTag>
      );

    case "DYNAMIC":
      return null;

    case "FORMULA":
      return value ? numberWithSpaces(value) : "";

    // case "FORMULA_FRONTEND":
    //   return <FormulaCell field={field} row={row} />;

    case "ICO":
      return <IconGenerator icon={value} />;

    case "PHOTO":
      return (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LogoDisplay url={value} />
        </span>
      );

    default:
      if (typeof value === "object") return JSON.stringify(value);
      return data?.[computedSlug] || value;
  }
}

export default ValueGenerator;
