import { Box, Checkbox, Typography } from "@mui/material";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableRow,
} from "../../../../components/CTable";
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
import NfcIcon from "@mui/icons-material/Nfc";

const GroupsTab = ({
  columns,
  form,
  selectedView,
  updateView,
  isLoading,
  updateLoading,
}) => {
  const selectedColumns = useWatch({
    control: form.control,
    name: "group_fields",
  });
  const { i18n } = useTranslation();
  const computedColumns = useMemo(() => {
    return columns?.filter(
      (column) =>
        column.type === "LOOKUP" ||
        column.type === "PICK_LIST" ||
        column.type === "LOOKUPS" ||
        column.type === "MULTISELECT"
    );
  }, [columns]);

  const onCheckboxChange = async (val, id) => {
    const type = form.getValues("type");

    if (type !== "CALENDAR" && type !== "GANTT") {
      return form.setValue("group_fields", val ? [id] : []);
    }

    if (!val) {
      return form.setValue(
        "group_fields",
        selectedColumns.filter((el) => el !== id)
      );
    }

    if (selectedColumns?.length >= 2) return;

    return form.setValue("group_fields", [...selectedColumns, id]);
  };

  const changeHandler = async (val, id) => {
    await onCheckboxChange(val, id);
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

  return (
    <div
      style={{
        maxHeight: 300,
        overflowY: "auto",
      }}
    >
      <CTable
        removableHeight={false}
        disablePagination
        tableStyle={{ border: "none" }}
      >
        <CTableBody dataLength={1}>
          {computedColumns.length ? (
            computedColumns.map((column) => (
              <CTableRow key={column.id}>
                <CTableCell
                  style={{
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div>{columnIcons[column.type] ?? <NfcIcon />}</div>
                    <div>
                      {column?.attributes?.[`label_${i18n.language}`] ??
                        column.label}
                    </div>
                  </div>
                </CTableCell>
                <CTableCell
                  style={{ width: 20, paddingTop: "2px", paddingBottom: "2px" }}
                >
                  <Checkbox
                    disabled={isLoading || updateLoading}
                    checked={
                      selectedColumns?.includes(column?.id) ||
                      selectedView?.group_fields?.includes(column?.id)
                    }
                    onChange={(e, val) => changeHandler(val, column.id)}
                  />
                </CTableCell>
              </CTableRow>
            ))
          ) : (
            <Box style={{ padding: "10px" }}>
              <Typography>No columns to set group!</Typography>
            </Box>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default GroupsTab;
