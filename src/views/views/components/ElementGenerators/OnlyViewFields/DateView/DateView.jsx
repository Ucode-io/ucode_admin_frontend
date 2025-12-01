import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { format } from "date-fns";

export const DateView = ({row}) => {

  const formatting = {
    [FIELD_TYPES.DATE]: 'dd.MM.yyyy',
    [FIELD_TYPES.DATE_TIME]: 'dd.MM.yyyy HH:mm',
    [FIELD_TYPES.DATE_TIME_WITHOUT_TIME_ZONE]: 'dd.MM.yyyy HH:mm',
    [FIELD_TYPES.TIME]: 'HH:mm',
  }

  const value = row?.value;
  const date =
    value && !isNaN(Date.parse(value))
      ? format(new Date(value), formatting[row.type])
      : value || "";

  return <div>{date}</div>;
}