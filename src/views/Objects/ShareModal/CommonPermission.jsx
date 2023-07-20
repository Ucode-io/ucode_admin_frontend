import { Box } from "@mui/material";
import React from "react";
import FRow from "../../../components/FormElements/FRow";
import HFSelect from "../../../components/FormElements/HFSelect";

function CommonPermission({
  control,
  tablesList,
  clientTypeList,
  getRoleList,
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "500px",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <FRow style={{ marginBottom: "0px" }}>Таблица:</FRow>
        <FRow>
          <HFSelect
            control={control}
            name={"table.slug"}
            options={tablesList}
          />
        </FRow>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: "10px" }}
      >
        <FRow>Доступы</FRow>
        <FRow></FRow>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: "10px" }}
      >
        <FRow>Тип ползователя</FRow>
        <FRow>Роль</FRow>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: "10px" }}
      >
        <FRow style={{ marginBottom: "0px" }}>
          <HFSelect
            control={control}
            name={"client_type"}
            options={clientTypeList}
          />
        </FRow>
        <FRow style={{ marginBottom: "0px" }}>
          <HFSelect control={control} name={"role_id"} options={getRoleList} />
        </FRow>
      </Box>
    </>
  );
}

export default CommonPermission;
