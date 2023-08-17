import ClearIcon from "@mui/icons-material/Clear";
import { Box, Card, Checkbox, Modal, Typography } from "@mui/material";
import TableCard from "../../../../../../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
} from "../../../../../../../components/CTable";
import PermissionCheckbox from "../PermissionCheckbox";

const CustomPermissionModal = ({
  closeModal,
  control,
  tableIndex,
  setValue,
  watch,
}) => {
  const basePath = `data.tables.${tableIndex}.custom_permission`;

  const fields = [
    {
      guid: "1",
      name: "View create",
      controlName: "view_create",
    },
    {
      guid: "2",
      name: "Share modal",
      controlName: "share_modal",
    },
    {
      guid: "3",
      name: "Automation",
      controlName: "automation",
    },
    {
      guid: "4",
      name: "Language",
      controlName: "language_btn",
    },
    {
      guid: "5",
      name: "Settings",
      controlName: "settings",
    },
  ];

  const updateView = (val) => {
    const computedValue = {
      view_create: val ? "Yes" : "No",
      share_modal: val ? "Yes" : "No",
      automation: val ? "Yes" : "No",
      language_btn: val ? "Yes" : "No",
      settings: val ? "Yes" : "No",
    };
    setValue(basePath, computedValue);
  };

  const allYes = Object.values(watch(basePath)).every(
    (value) => value === "Yes"
  );

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Tableview permissions</Typography>
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
            <TableCard withBorder borderRadius="md">
              <CTable
                tableStyle={{
                  height: "auto",
                }}
              >
                <CTableHead>
                  <CTableHeadRow>
                    <CTableCell w={2}>No</CTableCell>
                    <CTableCell w={250}>Label</CTableCell>
                    <CTableCell w={150}>
                      Permission
                      <Checkbox
                        checked={allYes ? true : false}
                        onChange={(e) => updateView(e.target.checked)}
                      />
                    </CTableCell>
                  </CTableHeadRow>
                </CTableHead>
                <CTableBody columnsCount={3} dataLength={fields?.length}>
                  {fields?.map((field, fieldIndex) => (
                    <CTableHeadRow key={field.guid}>
                      <CTableCell>{fieldIndex + 1}</CTableCell>
                      <CTableCell>{field.name}</CTableCell>
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
