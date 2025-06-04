import {Checkbox} from "@mui/material";
import {Controller} from "react-hook-form";

const HFCheckbox = ({
  control,
  isBlackBg,
  name,
  label,
  updateObject,
  isNewTableView = false,
  tabIndex,
  className,
  labelClassName,
  defaultValue = false,
  isShowLable = true,
  drawerDetail = false,
  id = "",
  newUi,
  disabled,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div
          className={className}
          style={{
            background: isBlackBg ? "#2A2D34" : "",
            color: isBlackBg ? "#fff" : "",
            paddingLeft: drawerDetail ? "3px" : "0px",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <Checkbox
            id={`checkbox${id}`}
            icon={
              <img
                src="/img/checbkox.svg"
                alt="checkbox"
                style={{ width: 20 }}
              />
            }
            checkedIcon={
              <img
                src="/img/checkbox-checked.svg"
                alt="checked"
                style={{ width: 20 }}
              />
            }
            style={{
              transform: "translatey(-1px)",
              marginRight: "8px",
              padding: newUi ? "4px" : undefined,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
            checked={
              typeof value === "string" ? value === "true" : (value ?? false)
            }
            autoFocus={tabIndex === 1}
            onChange={(_, val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            {...props}
            disabled={disabled}
            inputProps={tabIndex}
          />
          {isShowLable && (
            <label
              htmlFor={`checkbox-${id}`}
              className={`label ${labelClassName}`}
            >
              {label}
            </label>
          )}
        </div>
      )}
    ></Controller>
  );
};

export default HFCheckbox;
