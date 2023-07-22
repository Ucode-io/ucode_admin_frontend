import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import FRow from "../../../components/FormElements/FRow";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableRow,
} from "../../../components/CTable";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import styles from "./styles.module.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWatch } from "react-hook-form";

function FieldPermission({ control, getUserPermission, getTablePermission }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFieldPermissionsMatched, setIsFieldPermissionsMatched] = useState(false);
  const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;
  const fieldPermissions = useWatch({
    control,
    name: "table.field_permissions",
  });

  useEffect(() => {
    if (grantAccess && fieldPermissions && getUserPermission?.table?.field_permissions) {
      setIsFieldPermissionsMatched(
        fieldPermissions.every((item, index) => {
          const permissionsInGetTable = getUserPermission.table.field_permissions[index];
          return (
            item.view_permission === permissionsInGetTable.view_permission &&
            item.edit_permission === permissionsInGetTable.edit_permission
          );
        })
      );
    }
  }, [fieldPermissions, getTablePermission]);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={styles.collapse}>
      <Box
        sx={{ display: "flex", justifyContent: "center", width: "200px" }}
        onClick={handleCollapseToggle}
      >
        <FRow style={{ marginBottom: "0px" }} label="-  Поля" />{" "}
        <ExpandMoreIcon />
      </Box>

      {isCollapsed && (
        <CTable removableHeight={null} disablePagination>
          <CTableBody loader={false} columnsCount={2} dataLength={1}>
            {fieldPermissions?.map((item, index) => (
              <CTableRow key={index}>
                <CTableCell width={250}>{item?.label}</CTableCell>
                <CTableCell width={250}>
                  <Box sx={{ padding: "10px" }}>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Viewer" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.field_permissions.${index}.view_permission`}
                        disabled={
                          isFieldPermissionsMatched ||
                          getUserPermission?.current_user_permission
                        }
                      />
                    </div>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Editor" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.field_permissions.${index}.edit_permission`}
                        disabled={
                          isFieldPermissionsMatched ||
                          getUserPermission?.current_user_permission
                        }
                      />
                    </div>
                  </Box>
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </div>
  );
}

export default FieldPermission;

