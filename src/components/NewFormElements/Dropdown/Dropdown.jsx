import cls from "./styles.module.scss";
import { Check, KeyboardArrowRight } from "@mui/icons-material";
import clsx from "clsx";
import { useRef, useState } from "react";
import { iconsComponents } from "../../../views/table-redesign/icons";

const Dropdown = ({
  label,
  options,
  onClick = () => {},
  selectedValue,
  content,
  optionsClassname,
  icon,
  openedDropdown,
  name,
}) => {
  const optionsRef = useRef(null);
  return (
    <div className={cls.dropdown}>
      <div
        className={clsx(cls.dropdownBtn, {
          [cls.active]: openedDropdown === name,
        })}
      >
        {icon && <span className={cls.icon}>{icon}</span>}
        <span className={cls.label}>{label}</span>
        <span className={cls.arrow}>
          <KeyboardArrowRight
            htmlColor="rgba(71, 70, 68, 0.6)"
            width={16}
            height={16}
          />
        </span>
      </div>
      {
        <div
          className={clsx(cls.options, optionsClassname)}
          style={{
            display: openedDropdown === name ? "flex" : "none",
          }}
          ref={optionsRef}
        >
          {content
            ? content
            : options.map((option) => (
                <div
                  className={clsx(cls.option, {
                    [cls.selected]: option.value === selectedValue,
                  })}
                  key={option.value}
                  onClick={() => onClick(option)}
                >
                  {iconsComponents[option?.value]}
                  <span className={cls.optionLabel}>{option.label}</span>
                  <span className={cls.optionIcon}>
                    <span>
                      <Check htmlColor="rgb(50, 48, 44)" />
                    </span>
                  </span>
                </div>
              ))}
        </div>
      }
    </div>
  );
};

export default Dropdown;
