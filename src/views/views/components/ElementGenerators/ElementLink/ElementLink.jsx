import LaunchIcon from "@mui/icons-material/Launch";

import cls from "./styles.module.scss";

import { useState } from "react";

export const ElementLink = ({
  value,
  disabled = true,
  required,
  placeholder="",
  onBlur = () => {}
}) => {

  const [innerValue, setInnerValue] = useState(value);

  return <label className={cls.elementLink}>
    <input
      className={cls.linkInput}
      defaultValue={innerValue}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      onBlur={(e) => {
        onBlur(e);
        setInnerValue(e.target.value);
      }}
    />
    <a
      href={innerValue}
      disabled={Boolean(!innerValue)}
      className={cls.linkBtn}
      style={{ pointerEvents: Boolean(!innerValue) ? "none" : "auto" }}
      target="_blank" rel="noreferrer"
    >
      <LaunchIcon
        htmlColor="rgb(99, 115, 129)"
        style={{ fontSize: "20px" }}
      />
    </a>
  </label>
}