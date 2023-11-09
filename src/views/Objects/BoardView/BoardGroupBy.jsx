// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import AppsIcon from "@mui/icons-material/Apps";
// import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import ChecklistIcon from "@mui/icons-material/Checklist";
// import ColorizeIcon from "@mui/icons-material/Colorize";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import EmailIcon from "@mui/icons-material/Email";
// import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
// import FunctionsIcon from "@mui/icons-material/Functions";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
// import LinkIcon from "@mui/icons-material/Link";
// import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
// import LooksOneIcon from "@mui/icons-material/LooksOne";
// import MapIcon from "@mui/icons-material/Map";
// import PasswordIcon from "@mui/icons-material/Password";
// import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
// import PlayCircleIcon from "@mui/icons-material/PlayCircle";
// import QrCode2Icon from "@mui/icons-material/QrCode2";
// import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
// import TextFieldsIcon from "@mui/icons-material/TextFields";
// import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import { Box, Switch, Typography } from "@mui/material";
// import React, { useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Container, Draggable } from "react-smooth-dnd";
// import { CTable, CTableBody } from "../../../components/CTable";
// import { applyDrag } from "../../../utils/applyDrag";

// export default function BoardGroupBy({
//   columns,
//   form,
//   selectedView,
//   updateView,
//   isLoading,
//   updateLoading,
// }) {
//   const [allColumns, setAllColumns] = useState([]);
//   const { i18n } = useTranslation();

//   const checkedColumns = useMemo(() => {
//     return form.getValues("group_fields")?.map((id) => {
//       return columns.find((column) => column?.id === id);
//     });
//   }, [columns, form.watch("group_fields"), form]);

//   const unCheckedColumns = useMemo(() => {
//     return columns.filter((column) => {
//       return !form.getValues("group_fields")?.includes(column?.id);
//     });
//   }, [columns, form.watch("group_fields"), form]);

//   console.log("unCheckedColumns", unCheckedColumns);
//   useEffect(() => {
//     setAllColumns({
//       checkedColumns,
//       unCheckedColumns: unCheckedColumns.filter(
//         (item) =>
//           item?.type === "LOOKUP" ||
//           item?.type === "MULTISELECT" ||
//           item?.type === "LOOKUPS" ||
//           item?.type === "SINGLE_LINE" ||
//           item?.type === "PICK_LIST"
//       ),
//     });
//   }, [columns, checkedColumns, unCheckedColumns]);

//   const changeHandler = (e, val, id) => {
//     const oldVals = form.getValues("group_fields");
//     if (!val) {
//       form.setValue(
//         "group_fields",
//         oldVals?.filter((el) => el !== id)
//       );
//     } else {
//       form.setValue("group_fields", [...oldVals, id]);
//     }

//     updateView();
//   };

//   const columnIcons = useMemo(() => {
//     return {
//       SINGLE_LINE: <TextFieldsIcon />,
//       MULTI_LINE: <FormatAlignJustifyIcon />,
//       NUMBER: <LooksOneIcon />,
//       MULTISELECT: <ArrowDropDownCircleIcon />,
//       PHOTO: <PhotoSizeSelectActualIcon />,
//       VIDEO: <PlayCircleIcon />,
//       FILE: <InsertDriveFileIcon />,
//       FORMULA: <FunctionsIcon />,
//       PHONE: <LocalPhoneIcon />,
//       INTERNATION_PHONE: <LocalPhoneIcon />,
//       EMAIL: <EmailIcon />,
//       ICON: <AppsIcon />,
//       BARCODE: <QrCodeScannerIcon />,
//       QRCODE: <QrCode2Icon />,
//       COLOR: <ColorizeIcon />,
//       PASSWORD: <PasswordIcon />,
//       PICK_LIST: <ChecklistIcon />,
//       DATE: <DateRangeIcon />,
//       TIME: <AccessTimeIcon />,
//       DATE_TIME: <InsertInvitationIcon />,
//       CHECKBOX: <CheckBoxIcon />,
//       MAP: <MapIcon />,
//       SWITCH: <ToggleOffIcon />,
//       FLOAT_NOLIMIT: <LooksOneIcon />,
//       DATE_TIME_WITHOUT_TIME_ZONE: <InsertInvitationIcon />,
//     };
//   }, []);

//   const onDrop = (dropResult) => {
//     const result = applyDrag(allColumns?.checkedColumns, dropResult);
//     if (!result) return;

//     form.setValue(
//       "group_fields",
//       result.map((item) => item.id)
//     );

//     updateView();
//   };

//   return (
//     <div
//       style={{
//         minWidth: 200,
//         maxHeight: 300,
//         overflowY: "auto",
//         padding: "10px 14px",
//       }}
//     >
//       <CTable
//         removableHeight={false}
//         disablePagination
//         tableStyle={{ border: "none" }}
//       >
//         <CTableBody dataLength={1}>
//           {checkedColumns?.length || unCheckedColumns?.length ? (
//             <Container
//               groupName="1"
//               onDrop={onDrop}
//               dropPlaceholder={{ className: "drag-row-drop-preview" }}
//               getChildPayload={(i) => ({
//                 ...allColumns?.checkedColumns[i],
//                 field_name:
//                   allColumns?.checkedColumns[i]?.label ??
//                   allColumns?.checkedColumns[i]?.title,
//               })}
//             >
//               {checkedColumns?.map((column) => (
//                 <Draggable
//                   key={column.id}
//                   style={{
//                     overflow: "visible",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     cursor: "move",
//                     borderBottom: "1px solid #e5e5e5",
//                     padding: "5px 0",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                     }}
//                   >
//                     <div>{columnIcons[column.type] ?? <LinkIcon />}</div>
//                     <div>
//                       {column?.attributes?.[`label_${i18n.language}`] ??
//                         column.label}
//                     </div>
//                   </div>

//                   <Switch
//                     size="small"
//                     disabled={isLoading || updateLoading}
//                     checked={
//                       allColumns?.checkedColumns?.includes(column?.id) ||
//                       selectedView?.group_fields?.includes(column?.id)
//                     }
//                     onChange={(e, val) => changeHandler(e, val, column?.id)}
//                     // onChange={(e, val) => changeHandler(val, column.id, column)}
//                   />
//                 </Draggable>
//               ))}

//               {allColumns?.unCheckedColumns?.map((item) => (
//                 <div
//                   key={item.id}
//                   style={{
//                     overflow: "visible",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     borderBottom: "1px solid #e5e5e5",
//                     padding: "5px 0",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                     }}
//                   >
//                     <div>{columnIcons[item.type] ?? <LinkIcon />}</div>
//                     <div>
//                       {item?.attributes?.[`label_${i18n.language}`] ??
//                         item.label}
//                     </div>
//                   </div>

//                   <Switch
//                     size="small"
//                     disabled={isLoading || updateLoading}
//                     checked={
//                       allColumns?.checkedColumns?.includes(item?.id) ||
//                       selectedView?.group_fields?.includes(item?.id)
//                     }
//                     onChange={(e, val) => changeHandler(e, val, item?.id)}
//                     // onChange={(e, val) => changeHandler(val, column.id, column)}
//                   />
//                 </div>
//               ))}
//             </Container>
//           ) : (
//             <Box style={{ padding: "10px" }}>
//               <Typography>No columns to set group!</Typography>
//             </Box>
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   );
// }

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { Button, CircularProgress, Menu } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService";
import constructorViewService from "../../../services/constructorViewService";
import GroupsTab from "../components/ViewSettings/GroupsTab";

export default function BoardGroupButton({
  selectedTabIndex,
  text = "Tab group",
  width = "",
  form,
}) {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const { tableSlug } = useParams();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    data: { views, columns, relationColumns } = {
      views: [],
      columns: [],
      relationColumns: [],
    },
    isLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", { tableSlug }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { limit: 10, offset: 0 },
      });
    },
    {
      select: ({ data }) => {
        return {
          views: data?.views ?? [],
          columns: data?.fields ?? [],
          relationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  const type = views?.[selectedTabIndex]?.type;

  const computedColumns = useMemo(() => {
    if (type !== "CALENDAR" && type !== "GANTT") {
      return columns;
    } else {
      return [...columns, ...relationColumns];
    }
  }, [columns, relationColumns, type]);

  useEffect(() => {
    form.reset({
      group_fields: views?.[selectedTabIndex]?.group_fields ?? [],
    });
  }, [selectedTabIndex, views, form]);

  const [updateLoading, setUpdateLoading] = useState(false);

  const updateView = () => {
    setUpdateLoading(true);
    constructorViewService
      .update({
        ...views?.[selectedTabIndex],
        group_fields: form.watch("group_fields"),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  const selectedColumns = useWatch({
    control: form.control,
    name: "group_fields",
  });

  const disableAll = () => {
    setUpdateLoading(true);
    constructorViewService
      .update({
        ...views?.[selectedTabIndex],
        group_fields: [],
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        setUpdateLoading(false);
        form.setValue("group_fields", []);
      });
  };

  return (
    <div>
      {/* <Badge badgeContent={selectedColumns?.length} color="primary"> */}
      <Button
        variant={`${selectedColumns?.length > 0 ? "outlined" : "text"}`}
        style={{
          gap: "5px",
          color: selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
          borderColor:
            selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
        }}
        // style={{
        //   display: "flex",
        //   alignItems: "center",
        //   gap: 5,
        //   color: "#A8A8A8",
        //   cursor: "pointer",
        //   fontSize: "13px",
        //   fontWeight: 500,
        //   lineHeight: "16px",
        //   letterSpacing: "0em",
        //   textAlign: "left",
        //   padding: "0 10px",
        // }}
        onClick={handleClick}
      >
        <LayersOutlinedIcon color={"#A8A8A8"} />
        {text}
        {selectedColumns?.length > 0 && <span>{selectedColumns?.length}</span>}
        {selectedColumns?.length > 0 && (
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
              color:
                selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              disableAll();
            }}
          >
            <CloseRoundedIcon
              style={{
                color:
                  selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
              }}
            />
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
        {isLoading ? (
          <CircularProgress />
        ) : (
          <GroupsTab
            columns={computedColumns}
            isLoading={isLoading}
            updateLoading={updateLoading}
            updateView={updateView}
            selectedView={views?.[selectedTabIndex]}
            form={form}
          />
        )}
      </Menu>
    </div>
  );
}
