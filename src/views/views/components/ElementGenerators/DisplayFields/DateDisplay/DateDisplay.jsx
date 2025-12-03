import cls from "./styles.module.scss";

import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { format } from "date-fns";

export const DateDisplay = ({ value, type, placeholder, ...props }) => {
  const formatting = {
    [FIELD_TYPES.DATE]: "dd.MM.yyyy",
    [FIELD_TYPES.DATE_TIME]: "dd.MM.yyyy HH:mm",
    [FIELD_TYPES.DATE_TIME_WITHOUT_TIME_ZONE]: "dd.MM.yyyy HH:mm",
    [FIELD_TYPES.TIME]: "HH:mm",
  };

  const date =
    value && !isNaN(Date.parse(value))
      ? format(new Date(value), formatting[type])
      : value || placeholder || <span style={{ color: "#989ea0" }}>{formatting[type].toUpperCase()}</span>;

  return (
    <div className={cls.dateWrapper} {...props}>
      <span className={cls.date}>{date}</span>
      <img
        className={cls.dateIcon}
        src={`/table-icons/${type === "TIME" ? "time" : "date-time"}.svg`}
        alt=""
        width="16"
        height="16"
      />
    </div>
  );
};
