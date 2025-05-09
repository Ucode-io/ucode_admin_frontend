import {get} from "@ngard/tiny-get";
import {format} from "date-fns";
import {useMemo} from "react";
import {getRelationFieldTableCellLabel} from "../../../utils/getRelationFieldLabel";
import MultiselectCellColoredElement from "../MultiselectCellColoredElement";
import styles from "./style.module.scss";
import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";
import { getColumnIcon } from "../../../views/table-redesign/icons";

const BoardCardRowGenerator = ({
  field,
  el,
  isStatus,
  fieldsMap,
  slug,
  columnIndex,
  view,
}) => {
  let statusTypeOptions = [];
  if (isStatus) {
    statusTypeOptions = [
      ...field?.attributes?.complete?.options,
      ...field?.attributes?.todo?.options,
      ...field?.attributes?.progress?.options,
    ];
  }

  const { i18n } = useTranslation();
  const value = useMemo(() => {
    if (field.type !== "LOOKUP") return get(el, field.slug, "");
    return getRelationFieldTableCellLabel(field, el, field.slug + "_data");
  }, [field, el]);

  switch (field?.type) {
    case "PHOTO":
      return <></>;

    case "LOOKUP":
      return (
        <Box
          sx={{
            padding: "8px 8px 0",
            display: "flex",
            alignItems: "center",
            columnGap: "8px",
          }}
        >
          <span style={{ width: "16px", height: "16px" }}>
            {getColumnIcon({ column: field })}
          </span>
          <Box>
            {field?.attributes?.[`label_${i18n?.language}`]}
            <Box>
              {getRelationFieldTableCellLabel(field, el, field.slug + "_data")}
            </Box>
          </Box>
        </Box>
      );

    case "MULTISELECT":
      return (
        <div key={field.id} className={styles.row}>
          <span style={{ width: "16px", height: "16px" }}>
            {getColumnIcon({ column: field })}
          </span>
          {/* <div className={styles.label}>{field.label}:</div> */}
          <MultiselectCellColoredElement
            value={value}
            field={field}
            style={{ padding: "0 6px", fontsize: "12px", lineHeight: "18px" }}
            fieldsMap={fieldsMap}
            columnIndex={columnIndex}
            view={view}
          />
        </div>
      );

    case "STATUS":
      return (
        <div key={field.id} className={styles.row}>
          {/* <div className={styles.label}>{field.label}:</div> */}
          <span style={{ width: "16px", height: "16px" }}>
            {getColumnIcon({ column: field })}
          </span>
          <MultiselectCellColoredElement
            value={value}
            field={field}
            style={{ padding: "0 6px", fontsize: "12px", lineHeight: "18px" }}
            statusTypeOptions={statusTypeOptions}
            el={el}
            fieldsMap={fieldsMap}
            slug={slug}
            columnIndex={columnIndex}
            view={view}
          />
        </div>
      );

    case "DATE":
      return (
        <div key={field.id} className={styles.row}>
          {/* <div className={styles.label}>{field.label}:</div> */}
          <span style={{ width: "16px", height: "16px" }}>
            {getColumnIcon({ column: field })}
          </span>
          <div className={styles.value}>
            {value ? format(new Date(value), "dd.MM.yyyy") : "---"}
          </div>
        </div>
      );

    case "DATE_TIME":
      return (
        <div key={field.id} className={styles.row}>
          <span style={{ width: "16px", height: "16px" }}>
            {getColumnIcon({ column: field })}
          </span>
          {/* <div className={styles.label}>{field.label}:</div> */}
          <div className={styles.value}>
            {value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "---"}
          </div>
        </div>
      );

    default:
      return (
        <div key={field.id} className={styles.row}>
          {/* <div className={styles.label}>{field.label}:</div> */}
          <span style={{ width: "16px", height: "16px", flexShrink: "0" }}>
            {getColumnIcon({ column: field })}
          </span>
          <div className={styles.value}>{value}</div>
        </div>
      );
  }
};

export default BoardCardRowGenerator;
