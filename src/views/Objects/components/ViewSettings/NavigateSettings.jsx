import { Box } from "@mui/material";
import React from "react";
import HFTextField from "../../../../components/FormElements/HFTextField";
import FEditableRow from "../../../../components/FormElements/FEditableRow";
import NavigateGenerator from "./NavigateGenerator";

function NavigateSettings({ form }) {
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

      <NavigateGenerator form={form} name="attributes.navigate.params" />

      <Box marginTop="16px">
        <p style={{ marginBottom: "6px" }}>Object URL</p>
        <HFTextField
          fullWidth
          control={form.control}
          name="attributes.url_object.url"
          placeholder={"/url/{{$variable}}"}
        />
      </Box>

      <NavigateGenerator form={form} name="attributes.url_object.params" />

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
