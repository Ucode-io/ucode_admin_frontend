import { darken, lighten } from "@mui/material";
import cls from "./styles.module.scss";

export const FieldChip = ({ value, color }) => {
  return (
    <span
      className={cls.chip}
      style={{
        backgroundColor: color ? lighten(color, 0.85) : "#F9FAFB",
        color: color ? darken(color, 0.2) : "#8F8E8B",
      }}
    >
      {value}{" "}
      <span
        style={{ backgroundColor: color ? darken(color, 0.2) : "#8F8E8B" }}
      />
    </span>
  );
};
