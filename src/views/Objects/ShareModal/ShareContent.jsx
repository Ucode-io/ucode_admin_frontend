import { Box, Button } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { useQuery } from "react-query";
import constructorTableService from "../../../services/constructorTableService";
import listToOptions from "../../../utils/listToOptions";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import constructorObjectService from "../../../services/constructorObjectService";
import { useWatch } from "react-hook-form";
import tablePermissionService from "../../../services/tablePermission";
import TablePermission from "./TablePermission";
import FieldPermission from "./FieldPermission";
import ConnectionPermission from "./ConnectionPermission";
import ActionPermission from "./ActionPermission";
import CommonPermission from "./CommonPermission";
import DefaultPermission from "./DefaultPermission";

function ShareContent({ handleClose, control, watch, handleSubmit, reset }) {
  const { tableSlug, appId } = useParams();
  const projectId = useSelector((state) => state.auth.projectId);

  const data = watch();

  const client_type = useWatch({
    control,
    name: "client_type",
  });
  const role_id = useWatch({
    control,
    name: "guid",
  });

  const slug = useWatch({
    control,
    name: "table.slug",
  });

  const params = {
    role_id: role_id,
    table_slug: tableSlug,
    project_id: projectId,
  };

  //============   TABLE GET LIST
  const { data: tables = [] } = useQuery(
    ["GET_TABLES_LIST"],
    () => {
      return constructorTableService.getList({ projectId });
    },
    {
      select: (data) => data?.tables ?? [],
    }
  );

  //===============   CLIENT TYPE GET LIST
  const { data: clientTypeList } = useQuery(
    ["GET_OBJECT_LIST", "client_type"],
    () => {
      return constructorObjectService.getList("client_type", {
        data: {},
      });
    },
    {
      select: (res) => {
        return (
          res?.data?.response.map((item) => ({
            label: item?.name,
            value: item?.guid,
          })) ?? []
        );
      },
    }
  );

  //===============   GET ROLE GET LIST
  const { data: getRoleList } = useQuery(
    ["GET_OBJECT_LIST", client_type],
    () => {
      return constructorObjectService.getList("role", {
        data: {
          client_type_id: client_type,
        },
      });
    },
    {
      enable: !client_type,
      select: (res) => {
        return (
          res?.data?.response.map((item) => ({
            label: item?.name,
            value: item?.guid,
          })) ?? []
        );
      },
    }
  );

  const { data: getTablePermission } = useQuery(
    ["GET_TABLE_PERMISSONS", role_id],
    () => {
      return tablePermissionService.getList(params);
    },
    {
      enable: !params,
      select: (res) => res ?? {},
    }
  );

  const getUserPermission = useMemo(() => {
    if (getTablePermission?.selected_user_permission) {
      return getTablePermission?.selected_user_permission;
    } else {
      return {
        ...getTablePermission?.current_user_permission,
        current_user_permission: true,
      };
    }
  }, [getTablePermission]);

  const tablesList = useMemo(() => {
    let getObjects = [];
    getObjects = listToOptions(tables, "label", "slug");
    return getObjects;
  }, [tables]);

  const tableId = useMemo(() => {
    if (slug) {
      return tables.find((item) => item?.slug === slug);
    } else {
      return tables.find((item) => item?.slug === tableSlug);
    }
  }, [slug, tableSlug, tables]);

  const onSubmit = (values) => {
    tablePermissionService.update(values).then(() => {
      handleClose();
    });
  };

  useEffect(() => {
    if (getUserPermission) {
      reset({
        ...data,
        table: {
          record_permissions: getUserPermission?.table?.record_permissions,
          field_permissions: getUserPermission?.table?.field_permissions,
          view_permissions: getUserPermission?.table?.view_permissions,
          action_permissions: getUserPermission?.table?.action_permissions,
          id: tableId?.id,
        },
      });
    }
  }, [getUserPermission, reset]);

  return (
    <Box sx={{ padding: "15px", position: "relative" }}>
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
      <DefaultPermission
        control={control}
        clientTypeList={clientTypeList}
        getRoleList={getRoleList}
        getUserPermission={getUserPermission}
      />

      <div className={styles.submitBtn}>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </div>
    </Box>
  );
}

export default ShareContent;
