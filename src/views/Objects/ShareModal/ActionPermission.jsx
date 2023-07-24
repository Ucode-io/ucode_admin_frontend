import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import styles from "./styles.module.scss";
import { useWatch } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function ActionPermission({ control, getUserPermission, getTablePermission }) {
  const [isCollapsedCon, setIsCollapsedCon] = useState(false);
  const [isActionPermissionsMatched, setIsActionPermissionsMatched] =
    useState(false);
  const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;
  const actionPermissions = useWatch({
    control,
    name: "table.action_permissions",
  });
  const handleCollapseConToggle = () => {
    setIsCollapsedCon(!isCollapsedCon);
  };

  useEffect(() => {
    if (
      grantAccess &&
      actionPermissions &&
      getUserPermission?.table?.action_permissions
    ) {
      setIsActionPermissionsMatched(
        actionPermissions.every((item, index) => {
          const permissionsInGetTable =
            getUserPermission.table.action_permissions[index];
          return item.view_permission === permissionsInGetTable.permission;
        })
      );
    }
  }, [actionPermissions, getTablePermission]);

  return (
    <div className={styles.collapseCon}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px",
        }}
        onClick={handleCollapseConToggle}
      >
        <h2>Действие ( Actions )</h2>
        {isCollapsedCon ? <ExpandMoreIcon /> : <KeyboardArrowRightIcon />}
      </Box>

      {isCollapsedCon &&
        actionPermissions?.map((item, index) => (
          <Box>
            <div className={styles.permissionList}>
              <h2 className={styles.permissionListTitle}>{item?.label}</h2>

              <div className={styles.permissionListContent}>
                <div className={styles.permissionListItem}>
                  <HFCheckbox
                    control={control}
                    name={`table.action_permissions.${index}.permission`}
                    disabled={
                      isActionPermissionsMatched ||
                      getUserPermission?.current_user_permission
                    }
                  />
                  <div>Viewer</div>
                </div>
              </div>
            </div>
          </Box>
        ))}
    </div>
  );
}

export default ActionPermission;
