import {Box, Switch, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import styles from "./style.module.scss";
import {useTranslation} from "react-i18next";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import ColorizeIcon from "@mui/icons-material/Colorize";
import EmailIcon from "@mui/icons-material/Email";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FunctionsIcon from "@mui/icons-material/Functions";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import PasswordIcon from "@mui/icons-material/Password";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ChecklistIcon from "@mui/icons-material/Checklist";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import MapIcon from "@mui/icons-material/Map";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import LinkIcon from "@mui/icons-material/Link";

const FiltersTab = ({form, updateView, views, computedColumns}) => {
  const {i18n} = useTranslation();
  const checkedColumns = useMemo(() => {
    return (
      views?.attributes?.quick_filters?.map((checkedField) => {
        return computedColumns?.find(
          (column) => column?.id === checkedField?.id
        );
      }) ?? []
    );
  }, [computedColumns, form, views]);

  const unCheckedColumns = useMemo(() => {
    if (
      views?.attributes?.quick_filters?.length === 0 ||
      views?.attributes?.quick_filters?.length === undefined
    )
      return computedColumns ?? [];
    return (
      computedColumns?.filter((column) => {
        return views?.attributes?.quick_filters?.find(
          (item) => item.id !== column.id
        );
      }) ?? []
    );
  }, [computedColumns, form, views]);

  const allColumns = useMemo(() => {
    return {
      checked_columns: checkedColumns,
      unchecked_columns: unCheckedColumns,
    };
  }, [checkedColumns, unCheckedColumns]);

  const changeHandler = (val, field) => {
    let computedData = [];

    if (!val) {
      computedData = views?.attributes?.quick_filters?.filter(
        (el) => el?.id !== field?.id
      );
    } else {
      computedData = [...views?.attributes?.quick_filters, field];
    }

    updateView(computedData);
  };

  const columnIcons = useMemo(() => {
    return {
      SINGLE_LINE: <TextFieldsIcon />,
      MULTI_LINE: <FormatAlignJustifyIcon />,
      NUMBER: <LooksOneIcon />,
      MULTISELECT: <ArrowDropDownCircleIcon />,
      PHOTO: <PhotoSizeSelectActualIcon />,
      VIDEO: <PlayCircleIcon />,
      FILE: <InsertDriveFileIcon />,
      FORMULA: <FunctionsIcon />,
      PHONE: <LocalPhoneIcon />,
      INTERNATION_PHONE: <LocalPhoneIcon />,
      EMAIL: <EmailIcon />,
      ICON: <AppsIcon />,
      BARCODE: <QrCodeScannerIcon />,
      QRCODE: <QrCode2Icon />,
      COLOR: <ColorizeIcon />,
      PASSWORD: <PasswordIcon />,
      PICK_LIST: <ChecklistIcon />,
      DATE: <DateRangeIcon />,
      TIME: <AccessTimeIcon />,
      DATE_TIME: <InsertInvitationIcon />,
      CHECKBOX: <CheckBoxIcon />,
      MAP: <MapIcon />,
      SWITCH: <ToggleOffIcon />,
      FLOAT_NOLIMIT: <LooksOneIcon />,
      DATE_TIME_WITHOUT_TIME_ZONE: <InsertInvitationIcon />,
    };
  }, []);

  return (
    <div
      style={{
        minWidth: 200,
        maxHeight: 300,
        overflowY: "auto",
        padding: "10px 14px",
      }}
    >
      <div className={styles.table}>
        <div
          className={styles.row}
          style={{
            borderBottom: "1px solid #eee",
          }}
        ></div>

        {computedColumns?.map((column, index) => (
          <div className={styles.row}>
            <div
              className={styles.cell}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                border: 0,
                borderBottom: "1px solid #eee",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {columnIcons[column.type] ?? <LinkIcon />}
              </div>
              {column?.attributes?.[`label_${i18n.language}`] ?? column.label}
            </div>
            <div
              className={styles.cell}
              style={{
                width: 70,
                border: 0,
                borderBottom: "1px solid #eee",
                paddingLeft: 0,
                paddingRight: 0,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Switch
                size="small"
                checked={views?.attributes?.quick_filters?.find(
                  (filtered) => filtered?.id === column.id
                )}
                onChange={(e, val) => {
                  changeHandler(e.target.checked, column);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiltersTab;
