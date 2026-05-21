import {get} from "@ngard/tiny-get";
import {format} from "date-fns";
import {useMemo} from "react";
import { getRelationFieldTableCellLabel } from "@/utils/getRelationFieldLabel";
import MultiselectCellColoredElement from "../MultiselectCellColoredElement";
import styles from "./style.module.scss";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getColumnIcon } from "@/views/table-redesign/icons";
import clsx from "clsx";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";

const BoardCardRowGenerator = ({
  field,
  el,
  isStatus,
  fieldsMap,
  slug,
  columnIndex,
  view,
  showFieldLabel,
  hintPosition = "",
}) => {
  let statusTypeOptions = [];
  if (isStatus) {
    statusTypeOptions = [
      ...(field?.attributes?.complete?.options ?? []),
      ...(field?.attributes?.todo?.options ?? []),
      ...(field?.attributes?.progress?.options ?? []),
    ];
  }

  const { i18n } = useTranslation();
  const value = useMemo(() => {
    if (field.type !== FIELD_TYPES.LOOKUP) return get(el, field.slug, "");
    return getBoardRelationFieldLabel(field, el);
  }, [field, el]);

  switch (field?.type) {
    case FIELD_TYPES.PHOTO:
      return <></>;

    case FIELD_TYPES.LOOKUP:
      return (
        <FieldContainer
          field={field}
          showFieldLabel={false}
          hintPosition={hintPosition}
          isEmpty={!value?.length}
        >
          {/* <span style={{ width: "16px", height: "16px" }}>
            {getColumnIcon({ column: field })}
          </span> */}
          <Box>
            {/* {field?.attributes?.[`label_${i18n?.language}`]} */}
            <Box>{value}</Box>
          </Box>
          {showFieldLabel && (
            <span className={clsx(styles.rowHint, styles[hintPosition])}>
              {field?.attributes?.[`label_${i18n?.language}`]}
            </span>
          )}
        </FieldContainer>
      );

    case FIELD_TYPES.MULTISELECT:
      return (
        <FieldContainer
          field={field}
          showFieldLabel={showFieldLabel}
          hintPosition={hintPosition}
          isEmpty={!value?.length}
        >
          <MultiselectCellColoredElement
            value={value}
            field={field}
            style={{ padding: "0 6px", fontsize: "12px", lineHeight: "18px" }}
            fieldsMap={fieldsMap}
            columnIndex={columnIndex}
            view={view}
            className={styles.coloredElement}
          />
        </FieldContainer>
      );

    case FIELD_TYPES.STATUS:
      return (
        <FieldContainer
          field={field}
          showFieldLabel={showFieldLabel}
          hintPosition={hintPosition}
          isEmpty={!value?.length}
        >
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
            className={styles.coloredElement}
          />
        </FieldContainer>
      );

    case FIELD_TYPES.DATE:
      return (
        <FieldContainer
          field={field}
          showFieldLabel={showFieldLabel}
          hintPosition={hintPosition}
        >
          {value ? format(new Date(value), "dd.MM.yyyy") : "---"}
        </FieldContainer>
      );

    case FIELD_TYPES.DATE_TIME:
      return (
        <FieldContainer
          field={field}
          showFieldLabel={showFieldLabel}
          hintPosition={hintPosition}
        >
          {value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "---"}
        </FieldContainer>
      );

    case FIELD_TYPES.CHECKBOX:
      return (
        <FieldContainer
          field={field}
          showFieldLabel={showFieldLabel}
          hintPosition={hintPosition}
        >
          {value ? "Да" : "Нет"}
        </FieldContainer>
      );

    case FIELD_TYPES.SWITCH:
      return (
        <FieldContainer
          field={field}
          showFieldLabel={showFieldLabel}
          hintPosition={hintPosition}
        >
          {value ? "Да" : "Нет"}
        </FieldContainer>
      );

    case FIELD_TYPES.MULTI_IMAGE:
      return (
        <FieldContainer
          field={field}
          showFieldLabel={showFieldLabel}
          hintPosition={hintPosition}
          isEmpty={!value?.length}
        >
          <Box display="flex" gap="3px">
            {value &&
              value?.map((photo) => (
                <img
                  key={photo}
                  className={styles.miniImage}
                  src={photo}
                  alt=""
                />
              ))}
          </Box>
        </FieldContainer>
      );

    // case FIELD_TYPES.FILE:
    //   return (
    //     <FieldContainer
    //       field={field}
    //       showFieldLabel={showFieldLabel}
    //       hintPosition={hintPosition}
    //     ></FieldContainer>
    //   );

    default: {
      return (
        <FieldContainer
          field={field}
          showFieldLabel={showFieldLabel}
          hintPosition={hintPosition}
        >
          {value}
        </FieldContainer>
      );
    }
  }
};

const FieldContainer = ({
  children,
  field,
  showFieldLabel,
  hintPosition,
  isEmpty,
}) => {
  return (
    <div
      key={field.id}
      className={clsx(styles.row, { [styles.isEmpty]: !children || isEmpty })}
    >
      {/* <div className={styles.label}>{field.label}:</div> */}
      <div className={styles.rowWrapper}>
        <span style={{ width: "16px", height: "16px", flexShrink: "0" }}>
          {getColumnIcon({ column: field })}
        </span>
        <div className={styles.value}>
          {/* {value ? format(new Date(value), "dd.MM.yyyy") : "---"} */}
          {children}
        </div>
      </div>
      {showFieldLabel && (
        <span className={clsx(styles.rowHint, styles[hintPosition])}>
          {field?.label}
        </span>
      )}
    </div>
  );
};

const getBoardRelationFieldLabel = (field, row) => {
  const relationKeys = [
    `${field.slug}_data`,
    field?.table_slug ? `${field.table_slug}_id_data` : undefined,
    field?.table_slug ? `${field.table_slug}_ids_data` : undefined,
    field?.table_slug ? `${field.table_slug}_data` : undefined,
  ].filter(Boolean);

  return (
    relationKeys
      .map((key) => {
        return (
          getRelationLabelFromData(field, get(row, key)) ||
          getRelationFieldTableCellLabel(field, row, key)
        );
      })
      .find((label) => label?.trim?.()) ?? ""
  );
};

const getRelationLabelFromData = (field, relationData) => {
  if (!relationData) return "";

  const rows = Array.isArray(relationData) ? relationData : [relationData];
  const viewFields = field?.view_fields ?? field?.attributes?.view_fields ?? [];

  return rows
    .map((row) => {
      return viewFields
        .map((viewField) => row?.[viewField?.slug])
        .filter((value) => value !== undefined && value !== null && value !== "")
        .join(" ");
    })
    .filter((label) => label)
    .join(", ");
};

export default BoardCardRowGenerator;
