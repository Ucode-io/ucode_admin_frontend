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
import Filter1Icon from "@mui/icons-material/Filter1";
import { Button, Switch } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { columnIcons } from "../../../../utils/constants/columnIcons";

export default function SearchParams({
  checkedColumns,
  setCheckedColumns,
  columns,
}) {

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
          padding: "10px 14px",
          minWidth: "200px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            padding: "6px 0",
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
            <div style={{ textAlign: "end" }}>All</div>
          </div>

          <div>
            <Switch
              size="small"
              onChange={() =>
                checkedColumns.length === columns.length
                  ? deselectAll()
                  : selectAll()
              }
              checked={checkedColumns.length === columns.length ? true : false}
            />
          </div>
        </div>

        {columns.map((column, index) => (
          <div
            key={column.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 0",
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
              <div>{columnIcons(column.type)}</div>

              <div style={{ textAlign: "end" }}>{column.label}</div>
            </div>

            <div>
              <Switch
                size="small"
                onChange={() => changeHandler(column.slug)}
                checked={checkedColumns.includes(column.slug)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
