import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from '../styles.module.scss'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWatch } from "react-hook-form";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import HFCheckbox from "../../../../components/FormElements/HFCheckbox";

function FieldPermission({ control, getUserPermission, getTablePermission }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isViewPermissionsMatched, setIsViewPermissionsMatched] = useState();
  const [isEditPermissionsMatched, setIsEditPermissionsMatched] = useState();
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
      const viewPermissionsMatched = fieldPermissions.map((item, index) => {
        const permissionsInGetTable =
        getTablePermission?.current_user_permission?.table.field_permissions[index];
        return permissionsInGetTable?.view_permission;
      });

      const editPermissionsMatched = fieldPermissions.map((item, index) => {
        const permissionsInGetTable =
        getTablePermission?.current_user_permission?.table.field_permissions[index];
        return permissionsInGetTable?.edit_permission;
      });

      setIsViewPermissionsMatched(viewPermissionsMatched);
      setIsEditPermissionsMatched(editPermissionsMatched);
    }
  }, [fieldPermissions, getTablePermission]);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={styles.collapse}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px",
        }}
        onClick={handleCollapseToggle}
      >
        <h2>Поля</h2>
        {isCollapsed ? <ExpandMoreIcon /> : <KeyboardArrowRightIcon />}
      </Box>

      {isCollapsed &&
        fieldPermissions?.map((item, index) => {
          return (
            <Box key={index}>
              <div className={styles.permissionList}>
                <h2 className={styles.permissionListTitle}>{item?.label}</h2>

                <div className={styles.permissionListContent}>
                  <div className={styles.permissionListItem}>
                    <HFCheckbox
                      control={control}
                      name={`table.field_permissions.${index}.view_permission`}
                      disabled={
                        !isViewPermissionsMatched?.[index] || 
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
                        !isEditPermissionsMatched?.[index] ||
                        getUserPermission?.current_user_permission
                      }
                    />
                    <div>Editor</div>
                  </div>
                </div>
              </div>
            </Box>
          );
        })}
    </div>
  );
}

export default FieldPermission;
