import ClearIcon from "@mui/icons-material/Clear";
import {Box, Card, Checkbox, Modal, Typography} from "@mui/material";
import TableCard from "../../../../../../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
} from "../../../../../../../components/CTable";
import PermissionCheckbox from "../PermissionCheckbox";
import {generateLangaugeText} from "../../../../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import { CustomCheckbox } from "../../../../../components/CustomCheckbox";
import cls from "./styles.module.scss";

const CustomPermissionModal = ({
  closeModal,
  control,
  tableIndex,
  setValue,
  watch,
  permissionLan,
}) => {
  const basePath = `data.tables.${tableIndex}.custom_permission`;
  const { i18n } = useTranslation();
  const fields = [
    {
      guid: "1",
      name: "View create",
      controlName: "view_create",
    },
    // {
    //   guid: "2",
    //   name: "Share modal",
    //   controlName: "share_modal",
    // },
    // {
    //   guid: "3",
    //   name: "Automation",
    //   controlName: "automation",
    // },
    // {
    //   guid: "4",
    //   name: "Language",
    //   controlName: "language_btn",
    // },
    {
      guid: "5",
      name: "Settings",
      controlName: "settings",
    },
    // {
    //   guid: "6",
    //   name: "Pdf action",
    //   controlName: "pdf_action",
    // },
    {
      guid: "7",
      name: "Add field",
      controlName: "add_field",
    },
    // {
    //   guid: "8",
    //   name: "Delete All",
    //   controlName: "delete_all",
    // },
    // {
    //   guid: "9",
    //   name: "Add filter",
    //   controlName: "add_filter",
    // },
    // {
    //   guid: "10",
    //   name: "Field filter",
    //   controlName: "field_filter",
    // },
    // {
    //   guid: "11",
    //   name: "Fix column",
    //   controlName: "fix_column",
    // },
    // {
    //   guid: "12",
    //   name: "columns",
    //   controlName: "columns",
    // },
    // {
    //   guid: "13",
    //   name: "Group",
    //   controlName: "group",
    // },
    // {
    //   guid: "14",
    //   name: "Excel menu",
    //   controlName: "excel_menu",
    // },
    // {
    //   guid: "15",
    //   name: "Tab group",
    //   controlName: "tab_group",
    // },
    // {
    //   guid: "16",
    //   name: "Search button",
    //   controlName: "search_button",
    // },
  ];

  const updateView = (val) => {
    const computedValue = {
      view_create: val ? "Yes" : "No",
      share_modal: val ? "Yes" : "No",
      automation: val ? "Yes" : "No",
      language_btn: val ? "Yes" : "No",
      settings: val ? "Yes" : "No",
      pdf_action: val ? "Yes" : "No",
      // delete_all: val ? "Yes" : "No",
      add_filter: val ? "Yes" : "No",
      field_filter: val ? "Yes" : "No",
      fix_column: val ? "Yes" : "No",
      columns: val ? "Yes" : "No",
      group: val ? "Yes" : "No",
      excel_menu: val ? "Yes" : "No",
      tab_group: val ? "Yes" : "No",
      search_button: val ? "Yes" : "No",
      add_field: val ? "Yes" : "No",
    };
    setValue(basePath, computedValue);
  };

  const allYes = Object?.values(watch(basePath)).every(
    (value) => value === "Yes"
  );

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Table view permissions</Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <Box>
            <TableCard disablePagination withBorder borderRadius="md">
              <CTable
                disablePagination
                tableStyle={{
                  height: "auto",
                }}
              >
                <CTableHead>
                  <CTableHeadRow>
                    <CTableCell w={2}>
                      <Box className={cls.headCellBox}>No</Box>
                    </CTableCell>
                    <CTableCell w={250}>
                      <Box className={cls.headCellBox}>
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Label"
                        ) || "Label"}
                      </Box>
                    </CTableCell>
                    <CTableCell w={150}>
                      <Box
                        className={cls.headCellBox}
                        display="flex"
                        alignItems="center"
                      >
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Permission"
                        ) || "Permission"}
                        <CustomCheckbox
                          checked={allYes ? true : false}
                          onChange={(e) => updateView(e.target.checked)}
                        />
                      </Box>
                    </CTableCell>
                  </CTableHeadRow>
                </CTableHead>
                <CTableBody columnsCount={3} dataLength={fields?.length}>
                  {fields?.map((field, fieldIndex) => (
                    <CTableHeadRow key={field.guid}>
                      <CTableCell>
                        <Box className={cls.bodyCellBox}>{fieldIndex + 1}</Box>
                      </CTableCell>
                      <CTableCell>
                        <Box className={cls.bodyCellBox}>{field.name}</Box>
                      </CTableCell>
                      <CTableCell>
                        <PermissionCheckbox
                          name={`${basePath}.${field.controlName}`}
                          control={control}
                        />
                      </CTableCell>
                    </CTableHeadRow>
                  ))}
                </CTableBody>
              </CTable>
            </TableCard>
          </Box>
        </Card>
      </Modal>
    </div>
  );
};

export default CustomPermissionModal;
