// HFCustomSwitch.jsx
import React, { useId, useState } from "react";
import PropTypes from "prop-types";
import cls from "./styles.module.scss";
import clsx from "clsx";

export const HFCustomSwitch = ({
  tabIndex,
  isBlackBg = false,
  drawerDetail = false,
  handleChange = () => {},
  size = "sm", // "sm" | "md" | "lg"
  disabled = false,
  value = false,
  ...props
}) => {
  const id = useId();
  const inputId = `switch-${id}`;

  const initial = Boolean(value);
  const [checked, setChecked] = useState(initial);

  const onChange = (e) => {
    const value = e.target.checked;
    setChecked(value);

    handleChange(value);
  };

  return (
    <div
      className={
        clsx(cls["hf-switch"], {
          [cls["hf-switch--black"]]: isBlackBg,
          [cls["hf-switch--drawer"]]: drawerDetail,
        })
      }
      style={{
        background: isBlackBg ? "#2A2D34" : undefined,
        color: isBlackBg ? "#fff" : undefined,
        paddingLeft: drawerDetail ? "10px" : undefined,
      }}
    >
      <label className={cls["hf-switch__container"]} role="presentation">
        <input
          id={inputId}
          className={cls["hf-switch__input"]}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          tabIndex={typeof tabIndex !== "undefined" ? tabIndex : 0}
          aria-checked={checked}
          disabled={disabled}
          {...props}
        />
        <span className={clsx(cls["hf-switch__track"], {[cls["hf-switch__track--lg"]]: size === "lg", [cls["hf-switch__track--sm"]]: size === "sm"})}>
          <span className={clsx(cls["hf-switch__thumb"], {[cls["hf-switch__thumb--lg"]]: size === "lg", [cls["hf-switch__thumb--sm"]]: size === "sm"})} aria-hidden="true" />
        </span>
      </label>

      {/* {isShowLabel && (
        <label
          htmlFor={inputId}
          className={
            clsx(cls["hf-switch__label"], {
              [cls["hf-switch__label--sm"]]: size === "sm",
            })
          }
          {...labelProps}
        >
          {label}
        </label>
      )} */}
    </div>
  );
};

HFCustomSwitch.propTypes = {
  label: PropTypes.node,
  tabIndex: PropTypes.number,
  isBlackBg: PropTypes.bool,
  labelProps: PropTypes.object,
  isShowLabel: PropTypes.bool,
  drawerDetail: PropTypes.bool,
  handleChange: PropTypes.func,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
};
