import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Box } from "@mui/material";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useWatch } from "react-hook-form";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

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
    <div className={styles.collapseCon}>
    <Box
      sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', padding: '15px'}}
      onClick={handleCollapseConToggle}
    >
      <h2>Связи</h2>
      {isCollapsedCon ? <ExpandMoreIcon /> : <KeyboardArrowRightIcon />}
    </Box>

    {isCollapsedCon &&
      viewPermissions?.map((item, index) => (
        <Box>
          <div className={styles.permissionList}>
            <h2 className={styles.permissionListTitle}>{item?.label}</h2>

            <div className={styles.permissionListContent}>
              <div className={styles.permissionListItem}>
              <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.view_permission`}
                        disabled={
                          isConPermissionsMatched ||
                          getUserPermission?.current_user_permission
                        }
                      />
                <div>Viewer</div>
              </div>
              <div className={styles.permissionListItem}>
              <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.create_permission`}
                        disabled={
                          isConPermissionsMatched ||
                          getUserPermission?.current_user_permission
                        }
                      />
                <div>Creator</div>
              </div>
              <div className={styles.permissionListItem}>
              <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.edit_permission`}
                        disabled={getUserPermission?.current_user_permission}
                      />
                <div>Editor</div>
              </div>
              <div className={styles.permissionListItem}>
              <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.delete_permission`}
                        disabled={getUserPermission?.current_user_permission}
                      />
                <div>Delete</div>
              </div>
              <div className={styles.permissionListItem}>
              <HFCheckbox control={control} name="is_public" disabled={getUserPermission?.current_user_permission} />
                <div>is_public</div>
              </div>
            </div>
          </div>
        </Box>
      ))}
  </div>
  );
}

export default ConnectionPermission;


  