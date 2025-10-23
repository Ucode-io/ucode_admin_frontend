import { Box } from "@mui/material";
import React from "react";
import HFTextField from "@/components/FormElements/HFTextField";
import NavigateGenerator from "../NavigateGenerator/NavigateGenerator";

export const NavigateSettings = ({ form }) => {
  return (
    <Box>
      <Box marginTop="16px">
        <p style={{ marginBottom: "6px" }}>Navigate URL</p>
        <HFTextField
          fullWidth
          control={form.control}
          name="attributes.navigate.url"
          placeholder={"/url/{{$variable}}"}
        />
      </Box>

      <NavigateGenerator form={form} />

      <Box marginTop="16px">
        <p style={{ marginBottom: "6px" }}>Object URL</p>
        <HFTextField
          fullWidth
          control={form.control}
          name="attributes.url_object"
          placeholder={"/url/{{$variable}}"}
        />
      </Box>

      <Box marginTop="16px">
        <p style={{ marginBottom: "6px" }}>PDF URL</p>
        <HFTextField
          fullWidth
          control={form.control}
          name="attributes.pdf_url"
          placeholder={"/url/{{$variable}}"}
        />
      </Box>
    </Box>
  );
}

export default NavigateSettings;
