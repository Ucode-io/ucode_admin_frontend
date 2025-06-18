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
}) => {
  const [isLeft, setIsLeft] = useState(true);
  const [open, setOpen] = useState(false);
  const optionsRef = useRef(null);

  const handleMouseEnter = () => {
    // setOpen(true);
    // if (optionsRef.current) {
    //   const rect = optionsRef.current.getBoundingClientRect();
    //   console.log(optionsRef.current, rect.right);
    //   if (rect.right > window.innerWidth) {
    //     optionsRef.current.style.left = "auto";
    //     optionsRef.current.style.right = "100%";
    //   } else {
    //     optionsRef.current.style.left = "100%";
    //     optionsRef.current.style.right = "auto";
    //   }
    // }
  };

  return (
    <div
      className={cls.dropdown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setOpen(false)}
    >
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
      {
        <div
          className={clsx(cls.options, optionsClassname)}
          // style={{
          //   visibility: open ? "visible" : "hidden",
          // }}
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
