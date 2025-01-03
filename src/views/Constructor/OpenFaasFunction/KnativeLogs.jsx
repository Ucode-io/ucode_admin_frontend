import {Box, Button} from "@mui/material";
import React from "react";
import HFSelect from "../../../components/FormElements/HFSelect";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import HFTextField from "../../../components/FormElements/HFTextField";

function KnativeLogs({knativeForm}) {
  const data = [
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.701Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"42ab0799-deff-4f8c-bf3f-64bf9665d304\\" environment_id:\\"768fdf6e-f88d-459b-86ad-9e4e7808148e\\" service_type:FUNCTION_SERVICE"}',
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.166Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"342fba37-fc7d-4b6f-b02f-57b21beb0218\\" environment_id:\\"559e2057-95b3-4d0c-acda-d055a7edfbc0\\" service_type:BUILDER_SERVICE"}',
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.156Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"342fba37-fc7d-4b6f-b02f-57b21beb0218\\" environment_id:\\"559e2057-95b3-4d0c-acda-d055a7edfbc0\\" service_type:BUILDER_SERVICE"}',
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.149Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"342fba37-fc7d-4b6f-b02f-57b21beb0218\\" environment_id:\\"559e2057-95b3-4d0c-acda-d055a7edfbc0\\" service_type:BUILDER_SERVICE"}',
    "invalid UUID length: 0",
    "invalid UUID length: 0",
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.701Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"42ab0799-deff-4f8c-bf3f-64bf9665d304\\" environment_id:\\"768fdf6e-f88d-459b-86ad-9e4e7808148e\\" service_type:FUNCTION_SERVICE"}',
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.166Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"342fba37-fc7d-4b6f-b02f-57b21beb0218\\" environment_id:\\"559e2057-95b3-4d0c-acda-d055a7edfbc0\\" service_type:BUILDER_SERVICE"}',
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.156Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"342fba37-fc7d-4b6f-b02f-57b21beb0218\\" environment_id:\\"559e2057-95b3-4d0c-acda-d055a7edfbc0\\" service_type:BUILDER_SERVICE"}',
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.149Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"342fba37-fc7d-4b6f-b02f-57b21beb0218\\" environment_id:\\"559e2057-95b3-4d0c-acda-d055a7edfbc0\\" service_type:BUILDER_SERVICE"}',
    "invalid UUID length: 0",
    "invalid UUID length: 0",
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.701Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"42ab0799-deff-4f8c-bf3f-64bf9665d304\\" environment_id:\\"768fdf6e-f88d-459b-86ad-9e4e7808148e\\" service_type:FUNCTION_SERVICE"}',
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.166Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"342fba37-fc7d-4b6f-b02f-57b21beb0218\\" environment_id:\\"559e2057-95b3-4d0c-acda-d055a7edfbc0\\" service_type:BUILDER_SERVICE"}',
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.156Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"342fba37-fc7d-4b6f-b02f-57b21beb0218\\" environment_id:\\"559e2057-95b3-4d0c-acda-d055a7edfbc0\\" service_type:BUILDER_SERVICE"}',
    "invalid UUID length: 0",
    '2025-01-03T09:09:44.149Z INFO (debug.ucode_go_company_service) --GetSingle-- (service/service_resource.go:70) {"req": "project_id:\\"342fba37-fc7d-4b6f-b02f-57b21beb0218\\" environment_id:\\"559e2057-95b3-4d0c-acda-d055a7edfbc0\\" service_type:BUILDER_SERVICE"}',
    "invalid UUID length: 0",
    "invalid UUID length: 0",
  ];

  const timeData = [
    {
      label: "5 minutes",
      value: 5 * 60 * 1000,
    },
    {
      label: "15 minutes",
      value: 15 * 60 * 1000,
    },
    {
      label: "30 minutes",
      value: 30 * 60 * 1000,
    },
    {
      label: "1 hour",
      value: 60 * 60 * 1000,
    },
    {
      label: "6 minutes",
      value: 6 * 60 * 1000,
    },
    {
      label: "12 minutes",
      value: 12 * 60 * 1000,
    },
  ];

  console.log("knativeFormknativeForm", knativeForm.watch("type"));

  const type =
    knativeForm.watch("type") === "FUNCTION" ? "openfass-fn" : "knative-fn";

  return (
    <Box
      sx={{
        height: "calc(100vh - 112px)",
        background: "#fff",
      }}>
      <Box>
        <Box sx={{padding: "15px 20px 0px 20px", fontWeight: 700}}>
          Label filters
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "10px",
            width: "100%",
            padding: "15px 20px",
          }}>
          <Box
            sx={{
              width: "70%",
              display: "flex",
              justifyContent: "space-even",
              gap: "10px",
            }}>
            <Box width={"20%"}>
              <HFTextField
                disabled={true}
                name={"namespace"}
                value="namespace"
                control={knativeForm.control}
              />
            </Box>
            <Box width={"20%"}>
              <HFTextField
                name={"type"}
                value={type ?? ""}
                disabled={true}
                control={knativeForm.control}
              />
            </Box>
            <Box width={"20%"}>
              <HFTextField
                name={"app"}
                value="app"
                disabled={true}
                control={knativeForm.control}
              />
            </Box>
            <Box width={"20%"}>
              <HFSelect
                name={"path"}
                options={[]}
                value={knativeForm.watch("path")}
                control={knativeForm.control}
              />
            </Box>
          </Box>
          <Box
            sx={{
              width: "25%",
              display: "flex",
              gap: "15px",
            }}>
            <HFSelect
              width="50%"
              name={"namespace"}
              options={timeData}
              control={knativeForm.control}
            />

            <Button width={"50%"} sx={{width: "120px"}} variant="contained">
              Show logs
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            marginTop: "20px",
            // background: "#eee",
            borderTop: "1px solid #eee",
            padding: "10px",
            height: "calc(100vh - 230px)",
            overflow: "auto",
            wordBreak: "keep-all",
            whiteSpace: "nowrap",
            overflow: "auto",
            textOverflow: "ellipsis",
            display: "block",
          }}>
          {/* {data?.map((el) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "8px 0px",
              }}>
              {el}
            </Box>
          ))} */}
        </Box>
      </Box>
    </Box>
  );
}

export default KnativeLogs;
