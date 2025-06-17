import cls from "./styles.module.scss";
import { Check, KeyboardArrowRight } from "@mui/icons-material";
import { columnIcons } from "../../../utils/constants/columnIcons";
import clsx from "clsx";
import { useRef, useState } from "react";

const Dropdown = ({
  label,
  options,
  onClick = () => {},
  selectedValue,
  content,
  optionsClassname,
  icon,
}) => {
  const [isLeft, setIsLeft] = useState(true);
  const optionsRef = useRef(null);

  const handleMouseEnter = () => {
    if (optionsRef.current) {
      const rect = optionsRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        setIsLeft(false);
      }
    }
  };

  return (
    <div className={cls.dropdown} onMouseEnter={handleMouseEnter}>
      <div className={cls.dropdownBtn}>
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
      <div
        className={clsx(cls.options, optionsClassname)}
        style={{
          left: isLeft ? "100%" : "auto",
          right: !isLeft ? "100%" : "auto",
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
                {columnIcons(option?.value)}
                <span className={cls.optionLabel}>{option.label}</span>
                <span className={cls.optionIcon}>
                  <Check htmlColor="rgb(50, 48, 44)" />
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Dropdown;
