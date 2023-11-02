import React, { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { CTable, CTableBody, CTableCell, CTableRow } from "../../../components/CTable";
import { Box, Switch, Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../../utils/applyDrag";

export default function TimeLineGroupBy({ columns, form, selectedView, updateView, isLoading, updateLoading }) {
  const selectedColumns = useWatch({
    control: form.control,
    name: "group_fields",
  });
  const { i18n } = useTranslation();
  const [selectedColumn, setSelectedColumn] = useState();
  const [updatedColumns, setUpdatedColumns] = useState();

  useEffect(() => {
    setUpdatedColumns(
      columns?.filter(
        (column) => column.type === "LOOKUP" || column.type === "PICK_LIST" || column.type === "LOOKUPS" || column.type === "MULTISELECT" || column.type === "SINGLE_LINE"
      )
    );
  }, [columns]);

  useEffect(() => {
    if (selectedColumn) {
      const updatedArr = [selectedColumn, ...updatedColumns.filter((item) => item !== selectedColumn)];
      setUpdatedColumns(updatedArr);
    }
  }, [selectedColumn]);

  const onCheckboxChange = async (val, id, column) => {
    setSelectedColumn(column);
    if (!val) {
      return form.setValue(
        "group_fields",
        selectedColumns.filter((el) => el !== id)
      );
    }

    if (selectedColumns?.length >= 2) return;
    return form.setValue("group_fields", [...selectedColumns, id]);
  };

  const changeHandler = async (val, id, column) => {
    await onCheckboxChange(val, id, column);
    updateView();
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

  const onDrop = (dropResult) => {
    const result = applyDrag(updatedColumns, dropResult);
    if (!result) return;
    form.setValue(
      "group_fields",
      result.filter((item) => selectedColumns?.map((el) => el?.id === item?.id)).map((el) => el?.id)
    );
    setUpdatedColumns(result);
    updateView();
    // console.log("ssssssss", result);
  };

  console.log("ssssssss", form.watch("group_fields"));

  return (
    <div
      style={{
        minWidth: 200,
        maxHeight: 300,
        overflowY: "auto",
        padding: "10px 14px",
      }}
    >
      <CTable removableHeight={false} disablePagination tableStyle={{ border: "none" }}>
        <CTableBody dataLength={1}>
          {updatedColumns?.length ? (
            <Container
              groupName="1"
              onDrop={onDrop}
              dropPlaceholder={{ className: "drag-row-drop-preview" }}
              getChildPayload={(i) => ({
                ...updatedColumns[i],
                field_name: updatedColumns[i]?.label ?? updatedColumns[i]?.title,
              })}
            >
              {updatedColumns?.map((column) => (
                <Draggable
                  key={column.id}
                  style={{
                    overflow: "visible",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "move",
                    borderBottom: "1px solid #e5e5e5",
                    padding: "5px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div>{columnIcons[column.type] ?? <LinkIcon />}</div>
                    <div>{column?.attributes?.[`label_${i18n.language}`] ?? column.label}</div>
                  </div>

                  <Switch
                    size="small"
                    disabled={isLoading || updateLoading}
                    checked={selectedColumns?.includes(column?.id) || selectedView?.group_fields?.includes(column?.id)}
                    onChange={(e, val) => changeHandler(val, column.id, column)}
                  />
                </Draggable>
              ))}
            </Container>
          ) : (
            <Box style={{ padding: "10px" }}>
              <Typography>No columns to set group!</Typography>
            </Box>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
}
