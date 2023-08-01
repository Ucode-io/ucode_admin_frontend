import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import HFSelect from "../../../components/FormElements/HFSelect";
import classes from "../style.module.scss";

const DynamicFields = ({ control, setValue, connection, table = {}, index, watch, companies }) => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const selectedProjectID = watch("project_id");
  const selectedClientTypeID = watch("client_type");
  const selectedEnvID = watch("environment_id");
  // const field_slug = connection?.field_slug;
  const userId = Array.isArray(companies) ? companies?.[0]?.user_id : companies?.user_id;

  const url = `${import.meta.env.VITE_AUTH_BASE_URL_V2}/get-connection-options/${connection?.guid}/${userId}`;

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

  const { data: computedConnections = [] } = useQuery(
    ["GET_CONNECTION_OPTIONS", { table_slug: connection?.table_slug }, { "environment-id": selectedEnvID }],
    () => {
      return axios.get(url, config);
    },
    {
      enabled: !!selectedClientTypeID,
      select: (res) => {
        return (
          res?.data?.data?.data?.response?.map((item) => ({
            value: item?.guid,
            label: item?.[connection?.view_slug],
          })) ?? []
        );
      },
    }
  );

  useEffect(() => {
    if (computedConnections?.length === 1) {
      setValue(`tables[${index}].object_id`, computedConnections[0]?.value);
      setSelectedCollection(computedConnections[0]?.value);
    }
  }, [computedConnections]);

  // const computedOptions = useMemo(() => {
  //   return table?.map((field) => ({
  //     value: field.table_slug,
  //     label: field.name,
  //   }));
  // }, [table]);

  return (
    <div className={classes.formRow}>
      <p className={classes.label}>{table.label}</p>
      <HFSelect
        control={control}
        name={`tables[${index}].object_id`}
        size="large"
        value={selectedCollection}
        fullWidth
        options={computedConnections}
        placeholder={connection?.view_slug}
        required
        onChange={(e, val) => {
          console.log("e", e);
          setSelectedCollection(e);
          setValue(`tables[${index}].table_slug`, connection?.table_slug);
        }}
      />
    </div>
  );
};

export default DynamicFields;
