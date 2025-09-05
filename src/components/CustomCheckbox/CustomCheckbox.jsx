import clsx from "clsx";
import cls from "./styles.module.scss";
import { Controller } from "react-hook-form";

export const CustomCheckbox = ({ children, defaultChecked, size = "md", width = 20, height = 20, className, control, name, defaultValue, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <label className={clsx(cls.customCheckbox, className)}>
            <input
              className={clsx(cls.checkboxInput, cls.visuallyHidden)}
              type="checkbox"
              onChange={onChange}
              defaultChecked={defaultChecked}
              checked={value}
              {...props}
            />
            <span
              className={cls.checkmark}
              style={{
                width: size === "sm" ? 16 : width,
                height: size === "sm" ? 16 : height,
                borderRadius: size === "sm" ? 4 : 6,
              }}
            >
              <span className={cls.checkmarkInner}>
                <svg
                  width={size === "sm" ? 12 : 15}
                  height={size === "sm" ? 12 : 14}
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.1667 3.5L5.75 9.91667L2.83333 7"
                    stroke="#007AFF"
                    stroke-width={size === "sm" ? 1.5 : 2}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </span>
            {children}
          </label>
        </div>
      )}
    />
  );
};
