import React from "react";
import FRow from "../../../components/FormElements/FRow";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import { Box } from "@mui/material";

function DefaultPermission({ control, clientTypeList, getRoleList, getUserPermission }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "250px",
          justifyContent: "space-between",
          marginTop: "20px",
          alignItems: " center",
        }}
      >
        <FRow style={{ marginBottom: "0px" }} label="- Дават другим доступ" />
        <HFCheckbox control={control} name={"grant_access"} disabled={getUserPermission?.current_user_permission} />
      </Box>

      <Box
        sx={{
          display: "flex",
          width: "500px",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <FRow style={{ marginBottom: "0px" }} label="">
          <HFSelect
            control={control}
            name={"table.client_type_default"}
            disabled
            options={clientTypeList}
          />
        </FRow>
        <FRow style={{ marginBottom: "0px" }} label="">
          <HFSelect
            control={control}
            name={"table.role_id_default"}
            disabled
            options={getRoleList}
          />
        </FRow>
      </Box>
    </>
  );
}

export default DefaultPermission;
