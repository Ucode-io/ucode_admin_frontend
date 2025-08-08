import React, {useEffect, useMemo} from "react";
import HFSelect from "../FormElements/HFSelect";
import classes from "./style.module.scss";
import {Box, Button} from "@mui/material";

function DynamicConnections({
  env,
  control,
  index,
  connection,
  options = [],
  setValue = () => {},
  onSelectEnvironment = () => {},
}) {
  const computedConnections = useMemo(() => {
    return (
      options?.map((item) => ({
        value: item?.guid,
        label: item?.[connection?.view_slug],
      })) ?? []
    );
  }, [options, connection]);

  useEffect(() => {
    if (computedConnections?.length === 1) {
      setValue(`tables.${index}.object_id`, computedConnections[0]?.value);
      setValue(`tables.${index}.table_slug`, connection?.table_slug);
      onSelectEnvironment(env);
    }
  }, [computedConnections, connection]);

  return (
    <div className={classes.formRow}>
      <p className={classes.label}>Multi company</p>
      <HFSelect
        control={control}
        name={`tables.${index}.object_id`}
        size="large"
        fullWidth
        options={computedConnections}
        placeholder={connection?.view_slug}
        required
        onChange={(e, val) => {
          setValue(`tables.${index}.table_slug`, connection?.table_slug);
        }}
      />

      <Box sx={{textAlign: "end"}}>
        <Button
          onClick={() => onSelectEnvironment(env)}
          className={classes.button}
          variant="contained">
          Save
        </Button>
      </Box>
    </div>
  );
}

export default DynamicConnections;
