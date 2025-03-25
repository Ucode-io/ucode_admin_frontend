import clsx from "clsx";
import styles from "./style.module.scss";

export const CustomCheckbox = ({ children, defaultChecked, onChange, ...props }) => {
  return (
    <label className={styles.custom_checkbox}>
      <input
        className={clsx(styles.checkbox_input, styles.visuallyHidden)}
        type="checkbox"
        onChange={onChange}
        defaultChecked={defaultChecked}
        {...props}
      />
      <span className={styles.checkmark}>
        <span className={styles.checkmark_inner}>
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
