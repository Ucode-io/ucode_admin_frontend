import AttachFileIcon from "@mui/icons-material/AttachFile";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {get} from "@ngard/tiny-get";
import {useMemo} from "react";
import {formatDate} from "../../utils/dateFormatter";
import {numberWithSpaces} from "../../utils/formatNumbers";
import {generateLink} from "../../utils/generateYandexLink";
import {
  getRelationCellLabel,
  getRelationFieldTableCellLabel,
} from "../../utils/getRelationFieldLabel";
import i18next from "../../i18next";
import {store} from "../../store";
import {getColumnIconPath} from "../../utils/constants/tableIcons";
import {parseBoolean} from "../../utils/parseBoolean";
import IconGenerator from "../IconPicker/IconGenerator";
import LogoDisplay from "../LogoDisplay";
import TableTag from "../TableTag";
import Many2ManyValue from "./Many2ManyValue";
import MultiselectCellColoredElement from "./MultiselectCellColoredElement";
import {Box} from "@mui/material";

import PhotoIcon from "@mui/icons-material/Photo";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {makeStyles} from "@mui/styles";
import FunctionsIcon from "@mui/icons-material/Functions";
import SingleLine from "./SingleLine";
import Many2OneValue from "./Many2OneValue";
import IconGeneratorIconjs from "../IconPicker/IconGeneratorIconjs";

const useStyles = makeStyles(() => ({
  box: {
    padding: "0 10px",
  },
  formula_box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px",
  },
}));

// ponytail: та же иконка, что редактор рисует в rightSection своего инпута.
// Карта тип -> иконка уже есть в tableIcons, свой набор не заводим.
const TypeIcon = ({field}) => {
  const src = getColumnIconPath({column: field});
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      width="16"
      height="16"
      style={{flexShrink: 0, opacity: 0.6}}
    />
  );
};

const TYPE_HINT = {
  DATE: "DD.MM.YYYY",
  DATE_TIME: "DD.MM.YYYY HH:MM",
  DATE_TIME_WITHOUT_TIME_ZONE: "DD.MM.YYYY HH:MM",
  TIME: "HH:MM",
};

// ponytail: типы, которые сами рисуют осмысленную «пустоту» (тег Нет),
// подменять плейсхолдером нельзя — иначе потеряется значение false.
const HAS_OWN_EMPTY_STATE = new Set(["CHECKBOX", "SWITCH", "BUTTON"]);

const CellPlaceholder = ({field}) => (
  <Box
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "6px",
      padding: "0 10px",
      width: "100%",
      color: "#989ea0",
    }}>
    <span className="text-nowrap">
      {field?.attributes?.placeholder || TYPE_HINT[field?.type] || ""}
    </span>
    <TypeIcon field={field} />
  </Box>
);

const CellElementGeneratorForTable = ({field = {}, row}) => {
  const classes = useStyles();

  const value = useMemo(() => {
    if (field.type !== "LOOKUP") return get(row, field.slug, "");

    const result = getRelationFieldTableCellLabel(
      field,
      row,
      field.slug + "_data"
    );

    return result;
  }, [row, field]);

  const timeValue = useMemo(() => {
    if (typeof value === "object") return JSON.stringify(value);
    if (field?.type === "DATE_TIME_WITHOUT_TIME_ZONE") {
      if (value?.includes("Z")) {
        let dateObj = new Date(value);

        let formattedDate = dateObj.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "UTC",
        });

        return formattedDate;
      } else return value;
    }
  }, [field, value]);

  const tablesList = useMemo(() => {
    return (
      field.attributes?.dynamic_tables?.map((el) => {
        return el.table ? {...el.table, ...el} : el;
      }) ?? []
    );
  }, [field.attributes?.dynamic_tables]);

  const getValue = useMemo(() => {
    let val = tablesList?.find((table) => value?.[`${table.slug}_id`]) ?? "";
    if (!val) return "";
    return value?.[`${val?.slug}_id_data`];
  }, [value, tablesList]);

  const computedInputString = useMemo(() => {
    let val = "";
    let getVal = tablesList
      ? tablesList?.find((table) => value?.[`${table.slug}_id`])
      : [];
    let viewFields = getVal?.view_fields;

    viewFields &&
      viewFields?.map((item) => {
        val += `${getValue ? getValue?.[item?.slug] + " " : ""}`;
      });

    return val;
  }, [getValue, tablesList, value]);

  const getFileName = (item) => {
    const itemArray = item?.split("/");
    const computedName = itemArray?.[itemArray?.length - 1].split("_");
    return computedName.slice(1).join("");
  };

  const computedFileExtension = (element) => {
    const getExten = element?.split(".");
    return getExten?.[getExten?.length - 1];
  };

  const formula = field?.attributes?.formula ?? "";

  if (field.render) {
    return field.render(row);
  }

  // ponytail: пустая ячейка ничего не говорила о типе. LOOKUP считаем пустым
  // только когда нет ни объекта связи, ни guid — иначе ниже сработает фолбэк.
  const rawValue =
    field.type === "LOOKUP"
      ? row?.[`${field.slug}_data`] ?? row?.[field.slug]
      : get(row, field.slug, "");

  const isEmpty =
    rawValue === null ||
    rawValue === undefined ||
    rawValue === "" ||
    (Array.isArray(rawValue) && rawValue.length === 0);

  if (isEmpty && !HAS_OWN_EMPTY_STATE.has(field.type))
    return <CellPlaceholder field={field} />;

  switch (field.type) {
    case "LOOKUPS":
      return <Many2ManyValue field={field} value={value} />;

    // ponytail: объект связи уже приезжает в строке как `${slug}_data`.
    // Many2OneValue дозапрашивал его сам — 33 лишних запроса на таблицу.
    // Если бэк почему-то _data не отдал, оставляем старый путь с дозапросом.
    case "LOOKUP": {
      const related = row?.[`${field.slug}_data`];
      if (!related)
        return <Many2OneValue field={field} value={row?.[field?.slug]} />;
      return (
        <Box className={classes.box}>
          {getRelationCellLabel(
            field,
            related,
            i18next.language,
            store.getState()?.languages?.list?.map((el) => el.slug)
          )}
        </Box>
      );
    }

    case "SINGLE_LINE":
      return <SingleLine field={field} value={value} row={row} />;

    case "DATE":
      return (
        <Box className={classes.formula_box}>
          <span className="text-nowrap">{formatDate(value)}</span>
          <TypeIcon field={field} />
        </Box>
      );

    case "NUMBER":
      return (
        <Box className={classes.box}>
          {typeof value === "number"
            ? numberWithSpaces(value?.toFixed(1))
            : // ponytail: пустое число — пустая ячейка, а не 0
              value === undefined || value === null || value === ""
              ? ""
              : 0}
        </Box>
      );

    case "DATE_TIME":
      return (
        <Box className={classes.formula_box}>
          <span className="text-nowrap">{formatDate(value, "DATE_TIME")}</span>
          <TypeIcon field={field} />
        </Box>
      );

    case "MULTISELECT":
      return (
        <Box className={classes.box}>
          <MultiselectCellColoredElement field={field} value={value} />
        </Box>
      );

    case "MULTI_LINE":
      return (
        <Box className={classes.box}>
          <div className=" text_overflow_line">
            <span
              dangerouslySetInnerHTML={{
                __html: `${value?.slice(0, 200) ?? ""}${
                  value?.length > 200 ? "..." : ""
                }`,
              }}></span>
          </div>
        </Box>
      );

    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return (
        <Box className={classes.formula_box}>
          {timeValue} <TypeIcon field={field} />
        </Box>
      );

    // ponytail: TIME падал в default и рисовался без иконки типа
    case "TIME":
      return (
        <Box className={classes.formula_box}>
          <span className="text-nowrap">{value}</span>
          <TypeIcon field={field} />
        </Box>
      );

    case "PASSWORD":
      return (
        <Box className={classes.box}>
          <div className="text-overflow">
            <span
              dangerouslySetInnerHTML={{
                __html: "*".repeat(value?.length),
              }}></span>
          </div>
        </Box>
      );

    case "CHECKBOX":
    case "SWITCH":
      return parseBoolean(value) ? (
        <Box className={classes.box}>
          <TableTag color="success">
            {field.attributes?.text_true ?? "Да"}
          </TableTag>
        </Box>
      ) : (
        <Box className={classes.box}>
          <TableTag color="error">
            {field.attributes?.text_false ?? "Нет"}
          </TableTag>
        </Box>
      );

    case "DYNAMIC":
      return <Box className={classes.box}>{computedInputString ?? ""}</Box>;

    case "FORMULA":
      return (
        <Box className={classes.formula_box}>
          <span>{value ? numberWithSpaces(value) : 0}</span>
          <FunctionsIcon />
        </Box>
      );

    case "FORMULA_FRONTEND":
      return (
        <Box className={classes.formula_box}>
          {formula && typeof value === "number"
            ? numberWithSpaces(value)
            : value}

          <FunctionsIcon />
        </Box>
      );

    case "ICON":
      return (
        <Box className={classes.box}>
          {value?.includes(":") ? (
            <IconGeneratorIconjs icon={value} disabled={field?.disabled} />
          ) : (
            <IconGenerator icon={value} disabled={field?.disabled} />
          )}
        </Box>
      );

    case "PHOTO":
      return (
        <Box className={classes.box}>
          {value ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <LogoDisplay url={value} />
            </span>
          ) : (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <PhotoIcon />
            </span>
          )}
        </Box>
      );

    case "MAP":
      return (
        <Box className={classes.box}>
          {value ? (
            <a
              target="_blank"
              href={`${generateLink(
                value?.split(",")?.[0],
                value?.split(",")?.[1]
              )}`}
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}>
              {generateLink(value?.split(",")?.[0], value?.split(",")?.[1])}
            </a>
          ) : (
            ""
          )}
        </Box>
      );

    case "FILE":
      return value ? (
        <Box className={classes.box}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <span
                style={{
                  marginRight: "10px",
                }}>
                {computedFileExtension(getFileName(value)) === "pdf" ? (
                  <PictureAsPdfIcon style={{color: "red"}} />
                ) : computedFileExtension(getFileName(value)) === "xlsx" ? (
                  <BackupTableIcon style={{color: "green"}} />
                ) : computedFileExtension(getFileName(value)) === "png" ||
                  computedFileExtension(getFileName(value)) === "jpeg" ||
                  computedFileExtension(getFileName(value)) === "jpg" ? (
                  <PhotoLibraryIcon style={{color: "green"}} />
                ) : computedFileExtension(getFileName(value)) === "txt" ||
                  computedFileExtension(getFileName(value)) === "docx" ? (
                  <DescriptionIcon style={{color: "#007AFF"}} />
                ) : (
                  <AttachFileIcon style={{color: "blue"}} />
                )}
              </span>
              {getFileName(value)}
            </div>
            <div>
              <a
                href={value}
                className=""
                download
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                rel="noreferrer">
                <DownloadIcon
                  style={{width: "25px", height: "25px", fontSize: "30px"}}
                />
              </a>
            </div>
          </div>
        </Box>
      ) : (
        <Box className={classes.box}>
          <CloudUploadIcon />
        </Box>
      );

    // ponytail: без этих двух кейсов массивы ссылок падали в default и
    // печатались в ячейку как JSON. Показываем первый элемент и счётчик.
    case "MULTI_IMAGE": {
      const images = Array.isArray(value) ? value : [];
      return (
        <Box
          className={classes.box}
          style={{display: "flex", alignItems: "center", gap: "4px"}}>
          {images.length ? (
            <>
              <img
                src={images[0]}
                alt=""
                loading="lazy"
                decoding="async"
                style={{
                  width: "27px",
                  height: "25px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  flexShrink: 0,
                }}
              />
              {images.length > 1 && (
                <span style={{fontSize: "12px", color: "#777"}}>
                  +{images.length - 1}
                </span>
              )}
            </>
          ) : (
            <PhotoLibraryIcon style={{opacity: 0.4}} />
          )}
        </Box>
      );
    }

    case "MULTI_FILE": {
      const files = Array.isArray(value) ? value : [];
      return (
        <Box
          className={classes.box}
          style={{display: "flex", alignItems: "center", gap: "4px"}}>
          <AttachFileIcon
            style={{
              width: "18px",
              height: "18px",
              opacity: files.length ? 1 : 0.4,
            }}
          />
          {files.length > 0 && (
            <span style={{fontSize: "12px"}}>{files.length}</span>
          )}
        </Box>
      );
    }

    default:
      if (typeof value === "object")
        return <Box className={classes.box}>{JSON.stringify(value)}</Box>;
      return <Box className={classes.box}>{value}</Box>;
  }
};

export default CellElementGeneratorForTable;
