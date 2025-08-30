import {useEffect, useMemo} from "react";
import HFReactSelect from "../FormElements/HFReactSelect";
import classes from "./style.module.scss";
import {useQuery} from "react-query";
import constructorObjectService from "../../services/constructorObjectService";

const InviteDynamicFields = ({
  control,
  setValue,
  connection,
  table = {},
  index,
  watch,
  userId,
  // options,
}) => {
  const selectedProjectID = watch("project_id");
  const selectedClientTypeID = watch("client_type");
  const selectedEnvID = watch("environment_id");

  const {data: options = []} = useQuery(
    ["GET_OBJECT_LIST", connection?.table_slug],
    () => {
      return constructorObjectService.getListV2(connection?.table_slug, {
        data: {},
      });
    },
    {
      select: (res) => res?.data?.response ?? [],
    }
  );

  const computedConnections = useMemo(() => {
    return (
      options?.map((item) => ({
        value: item?.guid,
        label: item?.[connection?.view_slug],
      })) ?? []
    );
  }, [options, connection]);

  const url = `${
    import.meta.env.VITE_AUTH_BASE_URL_V2
  }/get-connection-options/${connection?.guid}/${userId}`;

  const data = {
    data: {
      "project-id": selectedProjectID,
      user_ids: userId,
    },
  };

  const config = {
    headers: {
      "environment-id": selectedEnvID,
    },
    params: {
      "project-id": selectedProjectID,
    },
  };

  useEffect(() => {
    if (computedConnections?.length === 1) {
      setValue(`tables.${index}.object_id`, computedConnections[0]?.value);
      //   setSelectedCollection(computedConnections[0]?.value);
    }
  }, [computedConnections]);

  useEffect(() => {
    setValue(`tables.${index}.table_slug`, connection?.table_slug);
  }, [watch(`tables.${index}.object_id`)]);

  return (
    <div className={classes.formRow}>
      <p className={classes.label}>{table.label}</p>
      <HFReactSelect
        control={control}
        name={`tables.${index}.object_id`}
        size="large"
        fullWidth
        isClearable={true}
        options={computedConnections}
        placeholder={connection?.view_slug}
        required
        onChange={(e, val) => {
          console.log("e", e);
          //   setSelectedCollection(e);
          setValue(`tables[${index}].table_slug`, connection?.table_slug);
        }}
      />
    </div>
  );
};

export default InviteDynamicFields;
