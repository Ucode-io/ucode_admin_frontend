import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ColorizeIcon from "@mui/icons-material/Colorize";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EmailIcon from "@mui/icons-material/Email";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FunctionsIcon from "@mui/icons-material/Functions";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import LinkIcon from "@mui/icons-material/Link";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import MapIcon from "@mui/icons-material/Map";
import PasswordIcon from "@mui/icons-material/Password";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {Box, CircularProgress, Switch} from "@mui/material";
import {useEffect, useMemo} from "react";
import {useFieldArray, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Container, Draggable} from "react-smooth-dnd";
import {applyDrag} from "../../../../utils/applyDrag";
import styles from "./style.module.scss";

const ColumnsTab = ({
  form,
  updateView,
  loading,
  isMenu,
  views,
  selectedTabIndex,
  computedColumns,
  currentView,
  visibleFields,
  unVisibleFields,
}) => {
  const {i18n} = useTranslation();

  const {fields: columns, move} = useFieldArray({
    control: form.control,
    name: "columns",
    keyName: "key",
  });

  const computeColumns = (checkedColumnsIds = [], columns) => {
    const selectedColumns =
      checkedColumnsIds
        ?.filter((id) => columns.find((el) => el.id === id))
        ?.map((id) => ({
          ...columns.find((el) => el.id === id),
          is_checked: true,
        })) ?? [];
    const unselectedColumns =
      columns?.filter((el) => !checkedColumnsIds?.includes(el.id)) ?? [];
    return [...selectedColumns, ...unselectedColumns];
  };

  useEffect(() => {
    if (views?.[selectedTabIndex]?.columns) {
      form.reset({
        ...form.getValues(),
        columns: computeColumns(
          views?.[selectedTabIndex]?.columns,
          computedColumns
        ),
      });
    }
  }, [views, selectedTabIndex, computedColumns]);

  const onDrop = (dropResult) => {
    const result = applyDrag(columns, dropResult);
    if (result) {
      move(dropResult.removedIndex, dropResult.addedIndex);
      groupMove(dropResult.removedIndex, dropResult.addedIndex);
    }
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
        height: "300px",
        overflowY: loading ? "hidden" : "auto",
        padding: "10px 14px",
        position: "relative",
      }}>
      <div className={styles.table}>
        <div
          className={styles.row}
          style={{
            borderBottom: "1px solid #eee",
          }}>
          <div
            className={styles.cell}
            style={{flex: 1, border: 0, paddingLeft: 0, paddingRight: 0}}>
            <b>All</b>
          </div>
          <div
            className={styles.cell}
            style={{
              width: 70,
              border: 0,
              paddingLeft: 0,
              paddingRight: 0,
              display: "flex",
              justifyContent: "flex-end",
            }}>
            <Switch
              id="columns_all"
              size="small"
              checked={visibleFields.length === columns.length}
              onChange={(e) => {
                updateView(
                  e.target.checked
                    ? columns?.map((el) => {
                        if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
                          return el.relation_id;
                        } else {
                          return el.id;
                        }
                      })
                    : []
                );
              }}
            />
          </div>
        </div>
        <Container
          onDrop={onDrop}
          dropPlaceholder={{className: "drag-row-drop-preview"}}>
          {visibleFields?.map((column, index) => (
            <Draggable key={column.id}>
              <div key={column.id} className={styles.row}>
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
                  }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    {columnIcons[column.type] ?? <LinkIcon />}
                  </div>
                  {column?.attributes?.[`label_${i18n.language}`] ??
                    column?.attributes?.[`label_from_${i18n.language}`] ??
                    column?.label}
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
                  }}>
                  {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
                    <Switch
                      size="small"
                      checked={currentView?.columns?.includes(
                        column?.relation_id
                      )}
                      onChange={(e) => {
                        updateView(
                          e.target.checked
                            ? [...currentView?.columns, column?.relation_id]
                            : currentView?.columns?.filter(
                                (el) => el !== column?.relation_id
                              )
                        );
                      }}
                    />
                  ) : (
                    <Switch
                      size="small"
                      checked={currentView?.columns?.includes(column?.id)}
                      onChange={(e) => {
                        updateView(
                          e.target.checked
                            ? [...currentView?.columns, column?.id]
                            : currentView?.columns?.filter(
                                (el) => el !== column?.id
                              )
                        );
                      }}
                    />
                  )}
                </div>
              </div>
            </Draggable>
          ))}
          {unVisibleFields?.map((column, index) => (
            <Draggable key={column.id}>
              <div key={column.id} className={styles.row}>
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
                  }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    {columnIcons[column.type] ?? <LinkIcon />}
                  </div>
                  {column?.attributes?.[`label_${i18n.language}`] ??
                    column?.attributes?.[`label_from_${i18n.language}`] ??
                    column?.label}
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
                  }}>
                  {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
                    <Switch
                      size="small"
                      checked={currentView?.columns?.includes(
                        column?.relation_id
                      )}
                      onChange={(e) => {
                        updateView(
                          e.target.checked
                            ? [...currentView?.columns, column?.relation_id]
                            : currentView?.columns?.filter(
                                (el) => el !== column?.relation_id
                              )
                        );
                      }}
                    />
                  ) : (
                    <Switch
                      size="small"
                      checked={currentView?.columns?.includes(column?.id)}
                      onChange={(e) => {
                        updateView(
                          e.target.checked
                            ? [...currentView?.columns, column?.id]
                            : currentView?.columns?.filter(
                                (el) => el !== column?.id
                              )
                        );
                      }}
                    />
                  )}
                </div>
              </div>
            </Draggable>
          ))}
        </Container>
      </div>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "#eee",
            overflow: "hidden",
            opacity: "0.3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <CircularProgress style={{color: "#007aff"}} />
        </Box>
      )}
    </div>
  );
};

export default ColumnsTab;
