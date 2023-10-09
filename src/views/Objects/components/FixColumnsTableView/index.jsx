import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import { Badge, Button, Checkbox, Menu, Switch } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../../../services/constructorObjectService";
import constructorViewService from "../../../../services/constructorViewService";
import style from "./style.module.scss";
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
import LinkIcon from "@mui/icons-material/Link";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function FixColumnsTableView({ selectedTabIndex }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedView, setSelectedView] = useState({});
  const { tableSlug } = useParams();
  const queryClient = useQueryClient();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    data: { views, columns } = {
      views: [],
      columns: [],
    },
    refetch,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", { tableSlug }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { limit: 10, offset: 0 },
      });
    },
    {
      cacheTime: 0,
      select: ({ data }) => {
        return {
          views: data?.views ?? [],
          columns: data?.fields ?? [],
        };
      },
    }
  );

  useEffect(() => {
    setSelectedView(views?.[selectedTabIndex] ?? {});
  }, [views, selectedTabIndex]);

  const changeHandler = (column, e) => {
    setIsLoading(true);
    const computedData = {
      ...selectedView,
      attributes: {
        ...selectedView.attributes,
        fixedColumns: {
          ...selectedView.attributes?.fixedColumns,
          [column.id]: e,
        },
      },
    };

    setSelectedView(computedData);

    constructorViewService.update(computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]).finally(() => {
        setIsLoading(false);
      });
    });
  };

  const updateView = () => {
    setSelectedView({
      ...selectedView,
      attributes: {
        ...selectedView.attributes,
        fixedColumns: {},
      },
    });

    const computedData = {
      ...selectedView,
      attributes: {
        ...selectedView.attributes,
        fixedColumns: {},
      },
    };

    constructorViewService.update(computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]).finally(() => {
        setIsLoading(false);
      });
    });
  };

  const visibleColumns = useMemo(() => {
    refetch();
    return columns.filter((column) => {
      return views?.[selectedTabIndex]?.columns?.find((el) => el === column?.id);
    });
  }, [views, columns, selectedTabIndex, anchorEl]);

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

  const badgeCount = useMemo(() => {
    return Object.keys(selectedView?.attributes?.fixedColumns ?? {}).filter((key) => selectedView?.attributes?.fixedColumns?.[key]).length;
  }, [selectedView?.attributes?.fixedColumns]);

  return (
    <>
      {/* <Badge badgeContent={badgeCount} color="primary"> */}
      <Button
        // className={style.moreButton}
        onClick={handleClick}
        variant={badgeCount > 0 ? "outlined" : "text"}
        style={{
          gap: "5px",
          color: "#A8A8A8",
          borderColor: "#A8A8A8",
        }}
      >
        <ViewColumnOutlinedIcon
          style={{
            color: "#A8A8A8",
          }}
        />
        Fix col's
        {badgeCount > 0 && <span>{badgeCount}</span>}
        {badgeCount > 0 && (
          <button
            style={{
              border: "none",
              background: "none",
              outline: "none",
              cursor: "pointer",
              padding: "0",
              margin: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#A8A8A8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              updateView();
            }}
          >
            <CloseRoundedIcon />
          </button>
        )}
      </Button>
      {/* </Badge> */}

      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              // width: 100,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        <div
          className={style.menuItems}
          style={{
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {visibleColumns.map((column) => (
            <div className={style.menuItem}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {columnIcons[column.type] ?? <LinkIcon />}
                </div>

                <span>{column.label}</span>
              </div>

              {/* <Checkbox
                onChange={(e) => {
                  changeHandler(column, e.target.checked);
                }}
                disabled={isLoading}
                checked={selectedView?.attributes?.fixedColumns?.[column.id]}
              /> */}

              <Switch
                size="small"
                onChange={(e) => {
                  changeHandler(column, e.target.checked);
                }}
                // disabled={isLoading}
                checked={selectedView?.attributes?.fixedColumns?.[column.id]}
              />
            </div>
          ))}
        </div>
      </Menu>
    </>
  );
}
