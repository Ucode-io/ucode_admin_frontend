import {Box, Button, CircularProgress} from "@mui/material";
import React, {useEffect, useState} from "react";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import functionService from "../../../services/functionService";
import {useQuery} from "react-query";

function KnativeLogs({knativeForm, loader, logsList}) {
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

  const [functionList, setFunctionList] = useState([
    {label: knativeForm.watch("path"), value: knativeForm.watch("path")},
  ]);

  const timeData = [
    {
      label: "5 minutes",
      value: 300000,
    },
    {
      label: "15 minutes",
      value: 900000,
    },
    {
      label: "30 minutes",
      value: 1800000,
    },
    {
      label: "1 hour",
      value: 3600000,
    },
    {
      label: "6 hours",
      value: 21600000,
    },
    {
      label: "12 hours",
      value: 43200000,
    },
  ];

  const type =
    knativeForm.watch("type") === "FUNCTION"
      ? "openfass-fn"
      : knativeForm?.watch("type") === "KNATIVE"
        ? "knative-fn"
        : "";

  const startDateTimeStap = (time = 0) => {
    const date = new Date();
    const timestamp = date.getTime();

    return (timestamp - time) * 1_000_000;
  };

  //==========OPTIONS REQUEST===========
  // const {data: options} = useQuery(
  //   ["GET_FUNCTION_LIST"],
  //   () => {
  //     return functionService.getFunctionList({
  //       namespace: knativeForm.watch("type"),
  //       start: startDateTimeStap(knativeForm.watch("time_frame")),
  //       end: startDateTimeStap(),
  //     });
  //   },
  //   {
  //     enabled: knativeForm.watch("type") === "knative-fn",
  //     select: (res) => {
  //       const uniqueOptions = new Map();
  //       res?.data?.forEach((el) => {
  //         const key = el?.app + ".";
  //         if (!uniqueOptions.has(key)) {
  //           uniqueOptions.set(key, {label: key, value: el?.app});
  //         }
  //       });
  //       return Array.from(uniqueOptions.values());
  //     },
  //   }
  // );

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
                defaultValue="namespace"
                control={knativeForm.control}
              />
            </Box>
            <Box width={"20%"}>
              <HFTextField
                name={"type"}
                defaultValue={type}
                disabled={true}
                control={knativeForm.control}
              />
            </Box>
            <Box width={"20%"}>
              <HFTextField
                name={"app"}
                defaultValue="app"
                disabled={true}
                control={knativeForm.control}
              />
            </Box>
            <Box width={"35%"}>
              <HFTextField
                disabled={true}
                style={{padding: "0 50px 0 0px"}}
                name={"path"}
                // options={options}
                defaultValue={knativeForm.watch("path")}
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
              name={"time_frame"}
              options={timeData}
              control={knativeForm.control}
              defaultValue={3600000}
            />

            <Button
              disabled={loader}
              type="submit"
              sx={{
                width: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-even",
                gap: "5px",
              }}
              variant="contained">
              {loader ? (
                <CircularProgress style={{color: "#fff"}} size={20} />
              ) : (
                <>
                  <AutorenewIcon style={{color: "#fff"}} />
                  Show logs
                </>
              )}
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
          {logsList?.map((el) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "8px 0px",
              }}>
              {el}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default KnativeLogs;
