import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Box } from "@mui/material";
import FRow from "../../../components/FormElements/FRow";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableRow,
} from "../../../components/CTable";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWatch } from "react-hook-form";

function ConnectionPermission({ control, getUserPermission, getTablePermission }) {
  const [isCollapsedCon, setIsCollapsedCon] = useState(false);
  const [isConPermissionsMatched, setIsConPermissionsMatched] = useState(false);
  const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;
  const viewPermissions = useWatch({
    control,
    name: "table.view_permissions",
  });

  useEffect(() => {
    if (grantAccess && viewPermissions && getUserPermission?.table?.view_permissions) {
      setIsConPermissionsMatched(
        viewPermissions.every((item, index) => {
          const permissionsInGetTable = getUserPermission.table.view_permissions[index];
          return (
            item.view_permission === permissionsInGetTable.view_permission &&
            item.edit_permission === permissionsInGetTable.edit_permission &&
            item.create_permission === permissionsInGetTable.create_permission &&
            item.delete_permission === permissionsInGetTable.delete_permission &&
            item.is_public === permissionsInGetTable.is_public
          );
        })
      );
    }
  }, [viewPermissions, getTablePermission]);
  
  const handleCollapseConToggle = () => {
    setIsCollapsedCon(!isCollapsedCon);
  };
  
  return (
    <div className={styles.collapse}>
      <Box
        sx={{ display: "flex", justifyContent: "center", width: "200px" }}
        onClick={handleCollapseConToggle}
      >
        <FRow style={{ marginBottom: "0px" }} label="- Связи" />{" "}
        <ExpandMoreIcon />
      </Box>

      {isCollapsedCon && (
        <CTable removableHeight={null} disablePagination>
          <CTableBody loader={false} columnsCount={2} dataLength={1}>
            {viewPermissions?.map((item, index) => (
              <CTableRow>
                <CTableCell width={250}>{item?.label}</CTableCell>
                <CTableCell width={250}>
                  <Box sx={{ padding: "10px" }}>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Viewer" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.view_permission`}
                        disabled={
                          isConPermissionsMatched ||
                          getUserPermission?.current_user_permission
                        }
                      />
                    </div>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Creator" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.create_permission`}
                        disabled={
                          isConPermissionsMatched ||
                          getUserPermission?.current_user_permission
                        }
                      />
                    </div>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Editor" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.edit_permission`}
                        disabled={getUserPermission?.current_user_permission}
                      />
                    </div>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Delete" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.delete_permission`}
                        disabled={getUserPermission?.current_user_permission}
                      />
                    </div>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Is_public" />{" "}
                      <HFCheckbox control={control} name="is_public" disabled={getUserPermission?.current_user_permission} />
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

export default ConnectionPermission;
