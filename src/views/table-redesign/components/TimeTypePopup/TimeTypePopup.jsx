import FRow from "../../../../components/FormElements/FRow"
import HFSelect from "../../../../components/FormElements/HFSelect"
import MaterialUIProvider from "../../../../providers/MaterialUIProvider"
import { VIEW_TYPES_MAP } from "../../../../utils/constants/viewTypes"

export const TimeTypePopup = ({control, viewType, computedColumns}) => {

  return  <MaterialUIProvider>
  <FRow
    label={
      viewType === VIEW_TYPES_MAP.CALENDAR ? "Date from" : "Time from"
    }
    required
  >
    <HFSelect
      options={computedColumns}
      control={control}
      name="calendar_from_slug"
      MenuProps={{ disablePortal: true }}
      required={true}
    />
  </FRow>
  <FRow
    label={viewType === "CALENDAR" ? "Date to" : "Time to"}
    required
  >
    <HFSelect
      options={computedColumns}
      control={control}
      name="calendar_to_slug"
      MenuProps={{ disablePortal: true }}
      required={true}
    />
  </FRow>
</MaterialUIProvider>
}