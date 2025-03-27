import clsx from "clsx";
import cls from "./styles.module.scss";

export const CustomCheckbox = ({ children, defaultChecked, onChange, className, ...props }) => {
  return (
    <label className={clsx(cls.customCheckbox, className)}>
      <input
        className={clsx(cls.checkboxInput, cls.visuallyHidden)}
        type="checkbox"
        onChange={onChange}
        defaultChecked={defaultChecked}
        {...props}
      />
      <span className={cls.checkmark}>
        <span className={cls.checkmarkInner}>
          <svg
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.1667 3.5L5.75 9.91667L2.83333 7"
              stroke="#004EEB"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </span>
      {children}
    </label>
  );
};
