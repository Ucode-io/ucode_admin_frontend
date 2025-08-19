import { Box } from "@mui/material";
import { useFieldProps } from "./useFieldProps";
import HFTextField from "@/components/FormElements/HFTextField";

export const Field = ({ control }) => {

  const {} = useFieldProps();

  return <Box display="flex" flexDirection="column" rowGap="8px">
    <HFTextField name="attributes.lat" control={control} fullWidth placeholder="Lattitude" />
    <HFTextField name="attributes.long" control={control} fullWidth placeholder="Longitude" />
    <HFTextField name="attributes.apiKey" control={control} fullWidth placeholder="Api key" />
  </Box>;
};
