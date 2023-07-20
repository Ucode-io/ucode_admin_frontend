import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import FRow from "../../../components/FormElements/FRow";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
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

function ShareContent({
  handleClose,
  control,
  watch,
  handleSubmit,
  reset,
  setValue,
}) {
  const { tableSlug, appId } = useParams();
  const projectId = useSelector((state) => state.auth.projectId);

  const data = watch();

  const client_type = useWatch({
    control,
    name: "client_type",
  });
  const role_id = useWatch({
    control,
    name: "role_id",
  });

  const params = {
    role_id: role_id,
    table_slug: tableSlug,
    project_id: projectId,
  };

  //============   TABLE GET LIST
  const { data: tablesList = [] } = useQuery(
    ["GET_TABLES_LIST"],
    () => {
      return constructorTableService.getList(projectId);
    },
    {
      select: (data) => listToOptions(data?.tables, "label", "slug"),
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
      return tablePermissionService.getList({
        ...params,
      });
    },
    {
      enable: !params,
      select: (res) => {
        return res?.selected_user_permission ?? [];
      },
    }
  );

  const onSubmit = (values) => {
    console.log("ssssss", values);
    
    tablePermissionService.update(values).then(() => {
      handleClose()
    });
  };

  useEffect(() => {
    if (getTablePermission) {
      reset({
        ...data,
        table: {
          record_permissions: getTablePermission?.table?.record_permissions,
          field_permissions: getTablePermission?.table?.field_permissions,
          view_permissions: getTablePermission?.table?.view_permissions,
          action_permissions: getTablePermission?.table?.action_permissions,
        }
      });
    }
  }, [getTablePermission, reset]);

  return (
    <Box sx={{ padding: "15px", position: "relative" }}>
      <CommonPermission
        control={control}
        tablesList={tablesList}
        clientTypeList={clientTypeList}
        getRoleList={getRoleList}
      />
      <TablePermission control={control} />
      <FieldPermission control={control} />
      <ConnectionPermission control={control} />
      <ActionPermission control={control} />
      <DefaultPermission
        control={control}
        clientTypeList={clientTypeList}
        getRoleList={getRoleList}
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
