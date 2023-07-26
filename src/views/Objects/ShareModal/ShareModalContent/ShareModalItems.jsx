import React, { useEffect } from "react";
import CommonPermission from "./CommonPermission";
import TablePermission from "./TablePermission";
import FieldPermission from "./FieldPermission";
import ConnectionPermission from "./ConnectionPermission";
import ActionPermission from "./ActionPermission";
import { useWatch } from "react-hook-form";

function ShareModalItems({
  control,
  tablesList,
  clientTypeList,
  getRoleList,  
  getUserPermission,
  getTablePermission,
  reset,
  watch,
  tableId,
}) {
  const data = watch();
  
  const slug = useWatch({
    control,
    name: "table.slug",
  });
  
  useEffect(() => {
    if (getUserPermission) {
      reset({
        ...data,
        grant_access: getUserPermission?.grant_access,
        table: {
          record_permissions: getUserPermission?.table?.record_permissions,
          field_permissions: getUserPermission?.table?.field_permissions,
          view_permissions: getUserPermission?.table?.view_permissions,
          action_permissions: getUserPermission?.table?.action_permissions,
          id: tableId?.id,
          slug,
        },
      });
    }
  }, [getUserPermission, reset]);

  return (
    <div>
      <CommonPermission
        control={control}
        tablesList={tablesList}
        clientTypeList={clientTypeList}
        getRoleList={getRoleList}
      />
      <TablePermission
        control={control}
        getUserPermission={getUserPermission}
        getTablePermission={getTablePermission}
      />
      <FieldPermission
        control={control}
        getUserPermission={getUserPermission}
        getTablePermission={getTablePermission}
      />
      <ConnectionPermission
        control={control}
        getUserPermission={getUserPermission}
        getTablePermission={getTablePermission}
      />
      <ActionPermission
        control={control}
        getUserPermission={getUserPermission}
        getTablePermission={getTablePermission}
      />
    </div>
  );
}

export default ShareModalItems;
