import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Box } from "@mui/material";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useWatch } from "react-hook-form";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function ConnectionPermission({
  control,
  getUserPermission,
  getTablePermission,
}) {
  const [isCollapsedCon, setIsCollapsedCon] = useState(false);
  const [isViewPermission, setIsViewPermission] = useState(false);
  const [isCreatePermission, setIsCreatePermission] = useState(false);
  const [isEidtPermission, setIsEditPermission] = useState(false);
  const [isDeletePermission, setIsDeletePermission] = useState(false);
  const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;
  const viewPermissions = useWatch({
    control,
    name: "table.view_permissions",
  });

  useEffect(() => {
    if (
      grantAccess &&
      viewPermissions &&
      getUserPermission?.table?.field_permissions
    ) {
      const viewPermissionsMatched = viewPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.view_permissions[
            index
          ];
        return permissionsInGetTable?.view_permission;
      });

      const editPermissionsMatched = viewPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.view_permissions[
            index
          ];
        return permissionsInGetTable?.edit_permission;
      });

      const createPermissionsMatched = viewPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.view_permissions[
            index
          ];
        return permissionsInGetTable?.create_permission;
      });
      
      const deletePermissionsMatched = viewPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.view_permissions[
            index
          ];
        return permissionsInGetTable?.delete_permission;
      });

      setIsViewPermission(viewPermissionsMatched);
      setIsCreatePermission(createPermissionsMatched);
      setIsEditPermission(editPermissionsMatched);
      setIsDeletePermission(deletePermissionsMatched);
    }
  }, [viewPermissions, getTablePermission]);

  const handleCollapseConToggle = () => {
    setIsCollapsedCon(!isCollapsedCon);
  };

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
        <h2>Связи</h2>
        {isCollapsedCon ? <ExpandMoreIcon /> : <KeyboardArrowRightIcon />}
      </Box>

      {isCollapsedCon &&
        viewPermissions?.map((item, index) => (
          <Box>
            <div className={styles.permissionList}>
              <h2 className={styles.permissionListTitle}>{item?.label}</h2>

              <div className={styles.permissionListContentCon}>
                <div className={styles.permissionListItem}>
                  <HFCheckbox
                    control={control}
                    name={`table.view_permissions.${index}.view_permission`}
                    disabled={
                      !isViewPermission?.[index] ||
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
                      !isCreatePermission?.[index] ||
                      getUserPermission?.current_user_permission
                    }
                  />
                  <div>Creator</div>
                </div>
                <div className={styles.permissionListItem}>
                  <HFCheckbox
                    control={control}
                    name={`table.view_permissions.${index}.edit_permission`}
                    disabled={
                      !isEidtPermission?.[index] ||
                      getUserPermission?.current_user_permission
                    }
                  />
                  <div>Editor</div>
                </div>
                <div className={styles.permissionListItem}>
                  <HFCheckbox
                    control={control}
                    name={`table.view_permissions.${index}.delete_permission`}
                    disabled={
                      !isDeletePermission?.[index] ||
                      getUserPermission?.current_user_permission
                    }
                  />
                  <div>Delete</div>
                </div>
                <div className={styles.permissionListItem}>
                  <HFCheckbox
                    control={control}
                    name="is_public"
                    disabled={getUserPermission?.current_user_permission}
                  />
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
