import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import styles from "./styles.module.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWatch } from "react-hook-form";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function FieldPermission({ control, getUserPermission, getTablePermission }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFieldPermissionsMatched, setIsFieldPermissionsMatched] =
    useState(false);
  const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;
  const fieldPermissions = useWatch({
    control,
    name: "table.field_permissions",
  });

  useEffect(() => {
    if (
      grantAccess &&
      fieldPermissions &&
      getUserPermission?.table?.field_permissions
    ) {
      setIsFieldPermissionsMatched(
        fieldPermissions.every((item, index) => {
          const permissionsInGetTable =
            getUserPermission.table.field_permissions[index];
          return (
            item.view_permission === permissionsInGetTable?.view_permission &&
            item.edit_permission === permissionsInGetTable?.edit_permission
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
        sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center',  padding: '15px'}}
        onClick={handleCollapseToggle}
      >
        <h2>Поля</h2>
        {isCollapsed ? <ExpandMoreIcon /> : <KeyboardArrowRightIcon />}
      </Box>

      {isCollapsed &&
        fieldPermissions?.map((item, index) => (
          <Box>
            <div className={styles.permissionList}>
              <h2 className={styles.permissionListTitle}>{item?.label}</h2>

              <div className={styles.permissionListContent}>
                <div className={styles.permissionListItem}>
                  <HFCheckbox
                    control={control}
                    name={`table.field_permissions.${index}.view_permission`}
                    disabled={
                      isFieldPermissionsMatched ||
                      getUserPermission?.current_user_permission
                    }
                  />
                  <div>Viewer</div>
                </div>
                <div className={styles.permissionListItem}>
                  <HFCheckbox
                    control={control}
                    name={`table.field_permissions.${index}.edit_permission`}
                    disabled={
                      isFieldPermissionsMatched ||
                      getUserPermission?.current_user_permission
                    }
                  />
                  <div>Editor</div>
                </div>
              </div>
            </div>
          </Box>
        ))}
    </div>
  );
}

export default FieldPermission;
