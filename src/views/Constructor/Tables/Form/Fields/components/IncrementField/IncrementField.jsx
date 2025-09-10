import { Box } from "@mui/material"
import HFNumberField from "../../../../../../../components/FormElements/HFNumberField"
import HFTextField from "../../../../../../../components/FormElements/HFTextField"

export const IncrementField = ({control}) => {

  return <Box display="flex" flexDirection="column" rowGap="8px">
    <HFTextField name="attributes.prefix" control={control} placeholder="Prefix" fullWidth />
    <HFNumberField
      name="attributes.digit_number"
      control={control}
      fullWidth
      placeholder="Digit number"
    />
</Box>
}