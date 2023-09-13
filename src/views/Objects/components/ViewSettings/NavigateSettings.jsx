import {Box, TextField} from "@mui/material";
import React from "react";
import HFTextField from "../../../../components/FormElements/HFTextField";
import FEditableRow from "../../../../components/FormElements/FEditableRow";
import NavigateGenerator from "./NavigateGenerator";

function NavigateSettings({form}) {
  return (
    <Box p={2}>
      <FEditableRow label="URL">
        <HFTextField
          fullWidth
          control={form.control}
          name="navigate.url"
          placeholder={"/url/{{$variable}}"}
        />
      </FEditableRow>

      <NavigateGenerator form={form} />

      <FEditableRow label="URL">
        <HFTextField
          fullWidth
          control={form.control}
          name="attributes.url_object"
          placeholder={"/url/{{$variable}}"}
        />
      </FEditableRow>
    </Box>
  );
}

export default NavigateSettings;
