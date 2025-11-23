import { Checkbox } from "@mui/material";

const HFCheckbox = ({
  isBlackBg,
  label,
  tabIndex,
  className,
  labelClassName,
  isShowLabel = true,
  id = "",
  row,
  handleChange,
  ...props
}) => {
  const value = row?.value;

  const onChange = (value) => {
    handleChange({
      value,
      rowId: row?.guid,
      name: row?.slug,
    });
  };

  return (
    <div
      className={className}
      style={{
        background: isBlackBg ? "#2A2D34" : "",
        color: isBlackBg ? "#fff" : "",
      }}
    >
      <Checkbox
        id={`checkbox${id}`}
        icon={
          <img src="/img/checbkox.svg" alt="checkbox" style={{ width: 20 }} />
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
          padding: "4px",
        }}
        checked={
          typeof value === "string" ? value === "true" : (value ?? false)
        }
        autoFocus={tabIndex === 1}
        onChange={(_, val) => {
          onChange(val);
        }}
        {...props}
        inputProps={tabIndex}
      />
      {isShowLabel && (
        <label htmlFor={`checkbox-${id}`} className={`label ${labelClassName}`}>
          {label}
        </label>
      )}
    </div>
  );
};

export default HFCheckbox;
