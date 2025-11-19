import cls from "./styles.module.scss";
import { Checkbox, FormControlLabel } from "@mui/material";

export const FieldCheckbox = ({
  label,
  watch = () => {},
  setValue = () => {},
  register = () => {},
  name,
  onChange = () => {},
}) => {
  return (
    <FormControlLabel
      style={{ marginLeft: "0", paddingLeft: "8px", height: "32px" }}
      labelPlacement="start"
      label={<span className={cls.checkboxLabel}>{label} </span>}
      control={
        <Checkbox
          icon={
            <img src="/img/checbkox.svg" alt="checkbox" style={{ width: 16 }} />
          }
          checkedIcon={
            <img
              src="/img/checkbox-checked.svg"
              alt="checked"
              style={{ width: 16 }}
            />
          }
          style={{
            transform: "translate(-1px)",
            marginRight: "8px",
            padding: "2px",
            order: 1,
            width: "18px",
            height: "18px",
          }}
          checked={watch(name)}
          onChange={() => {
            setValue(name, !watch(name));
            onChange(!watch(name));
          }}
          {...register(name)}
          color="primary"
        />
      }
    />
  );
};
