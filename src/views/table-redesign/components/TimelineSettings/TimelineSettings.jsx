import {ChevronLeftIcon} from "@chakra-ui/icons";
import {Box, Button} from "@chakra-ui/react";
import {Button as MuiButton} from "@mui/material";
import FRow from "@/components/FormElements/FRow";
import HFSelect from "@/components/FormElements/HFSelect";
import MaterialUIProvider from "@/providers/MaterialUIProvider";

export const TimelineSettings = ({
  control = {},
  onBackClick,
  title = "",
  computedColumns = [],
  saveSettings = () => {},
  tableSlug,
}) => {
  return (
    <div>
      <Box mb="10px">
        <Button
          leftIcon={<ChevronLeftIcon fontSize={22} />}
          colorScheme="gray"
          variant="ghost"
          w="fit-content"
          onClick={onBackClick}>
          <Box color="#475467" fontSize={14} fontWeight={600}>
            {title}
          </Box>
        </Button>
      </Box>
      <MaterialUIProvider>
        <FRow label="Time from">
          <HFSelect
            options={computedColumns}
            control={control}
            name="calendar_from_slug"
            MenuProps={{disablePortal: true}}
          />
        </FRow>
        <FRow label="Time to">
          <HFSelect
            options={computedColumns}
            control={control}
            name="calendar_to_slug"
            MenuProps={{disablePortal: true}}
          />
        </FRow>
        <MuiButton fullWidth variant="contained" onClick={saveSettings}>
          Save
        </MuiButton>
      </MaterialUIProvider>
    </div>
  );
};
