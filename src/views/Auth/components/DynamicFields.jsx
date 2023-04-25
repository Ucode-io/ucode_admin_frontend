import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import HFSelect from "../../../components/FormElements/HFSelect";
import classes from "../style.module.scss";

const DynamicFields = ({
  control,
  setValue,
  connection,
  table = {},
  index,
  watch,
  companies
}) => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const selectedProjectID = watch("project_id");
  const selectedClientTypeID = watch("client_type");
  const selectedEnvID = watch("environment_id");
  const field_slug = connection?.field_slug; 
  
  
  const url = `${import.meta.env.VITE_AUTH_BASE_URL_V2}/object/get-list/${
    connection?.table_slug
  }`;
  const data = {
    data: {
      "project-id": selectedProjectID,
      [field_slug]: companies?.owner_id
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
    [
      "GET_CONNECTION_OPTIONS",
      { table_slug: connection?.table_slug },
      { "environment-id": selectedEnvID },
    ],
    () => {
      return axios.post(url, data, config);
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
