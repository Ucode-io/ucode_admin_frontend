import AutorenewIcon from "@mui/icons-material/Autorenew";
import {Box, Button, CircularProgress, Typography} from "@mui/material";
import React, {useEffect} from "react";
import HFSelect from "@/components/FormElements/HFSelect";
import HFTextField from "@/components/FormElements/HFTextField";

export const KnativeLogs = ({
  knativeForm,
  loader,
  logsList,
  onSubmitKnative = () => {},
}) => {
  const timeData = [
    {label: "5 minutes", value: 300000},
    {label: "15 minutes", value: 900000},
    {label: "30 minutes", value: 1800000},
    {label: "1 hour", value: 3600000},
    {label: "6 hours", value: 21600000},
    {label: "12 hours", value: 43200000},
  ];

  const type =
    knativeForm.watch("type") === "FUNCTION"
      ? "openfass-fn"
      : knativeForm?.watch("type") === "KNATIVE"
        ? "knative-fn"
        : "";

  useEffect(() => {
    if (
      Boolean(
        knativeForm.watch("type") &&
          knativeForm.watch("path") &&
          knativeForm.watch("time_frame")
      )
    ) {
      onSubmitKnative(knativeForm.getValues());
    }
  }, []);

  return (
    <Box>
      <Box sx={{ padding: "15px 0", fontWeight: 700 }}>Label filters</Box>
      <Box sx={{ display: "flex", gap: "10px" }}>
        <Box sx={{ width: "70%", display: "flex", gap: "10px" }}>
          <HFTextField
            disabled
            name={"namespace"}
            defaultValue="namespace"
            control={knativeForm.control}
            sx={{ width: "20%" }}
            showLockWhenDisabled={false}
            inputStyleProps={{
              backgroundColor: "#f5f5f5",
            }}
          />
          <HFTextField
            disabled
            name={"type"}
            defaultValue={type}
            control={knativeForm.control}
            sx={{ width: "20%" }}
            showLockWhenDisabled={false}
            inputStyleProps={{
              backgroundColor: "#f5f5f5",
            }}
          />
          <HFTextField
            disabled
            name={"app"}
            defaultValue="app"
            control={knativeForm.control}
            sx={{ width: "20%" }}
            showLockWhenDisabled={false}
            inputStyleProps={{
              backgroundColor: "#f5f5f5",
            }}
          />
          <HFTextField
            disabled
            name={"path"}
            defaultValue={knativeForm.watch("path")}
            control={knativeForm.control}
            sx={{ width: "40%" }}
            showLockWhenDisabled={false}
            inputStyleProps={{
              backgroundColor: "#f5f5f5",
            }}
          />
        </Box>
        <Box sx={{ width: "30%", display: "flex", gap: "15px" }}>
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
              gap: "5px",
            }}
            variant="contained"
          >
            {loader ? (
              <CircularProgress style={{ color: "#fff" }} size={20} />
            ) : (
              <>
                <AutorenewIcon style={{ color: "#fff" }} />
                Show logs
              </>
            )}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          marginTop: "20px",
          borderTop: "1px solid #eee",
          padding: "10px",
          height: "calc(100vh - 230px)",
          overflowY: "auto",
          background: "#f8f9fa",
        }}
      >
        {logsList?.length > 0 ? (
          logsList.map((log, index) => {
            const isJson = log.trim().startsWith("{");
            return (
              <Box
                key={index}
                sx={{
                  background: index % 2 === 0 ? "#ffffff" : "#f1f3f5",
                  borderRadius: "6px",
                  padding: "10px",
                  marginBottom: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                {isJson ? (
                  <pre
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      fontSize: "14px",
                      fontFamily: "monospace",
                    }}
                  >
                    {JSON.stringify(JSON.parse(log), null, 2)}
                  </pre>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "14px", fontFamily: "monospace" }}
                  >
                    {log}
                  </Typography>
                )}
              </Box>
            );
          })
        ) : (
          <Typography
            sx={{ textAlign: "center", color: "#aaa", padding: "20px" }}
          >
            No logs available
          </Typography>
        )}
      </Box>
    </Box>
  );
}
