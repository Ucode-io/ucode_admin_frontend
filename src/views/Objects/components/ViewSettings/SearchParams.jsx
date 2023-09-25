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
import { Button, Switch } from "@mui/material";
import React, { useEffect, useMemo } from "react";

export default function SearchParams({ checkedColumns, setCheckedColumns, columns }) {
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
    };
  }, []);

  const changeHandler = (slug) => {
    if (checkedColumns.includes(slug)) {
      setCheckedColumns(checkedColumns.filter((el) => el !== slug));
    } else {
      setCheckedColumns([...checkedColumns, slug]);
    }
  };

  const selectAll = () => {
    setCheckedColumns(columns.map((el) => el.slug));
  };

  const deselectAll = () => {
    setCheckedColumns([]);
  };

  useEffect(() => {
    selectAll();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "10px",
          gap: "10px",
        }}
      >
        <Button variant="outlined" color="success" onClick={selectAll}>
          Select all
        </Button>
        <Button variant="outlined" color="error" onClick={deselectAll}>
          Disable all
        </Button>
      </div>
      <div
        style={{
          padding: "10px",
        }}
      >
        {columns.map((column, index) => (
          <div
            key={column.id}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: index === columns.length - 1 ? "none" : "1px solid #e0e0e0",
              padding: "10px 0",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div>{columnIcons[column.type]}</div>

              <div style={{ textAlign: "end" }}>{column.label}</div>
            </div>

            <div>
              <Switch size="small" onChange={() => changeHandler(column.slug)} checked={checkedColumns.includes(column.slug)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
