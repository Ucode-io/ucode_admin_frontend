import { CircularProgress } from "@mui/material"
import styles from "./style.module.scss"
import clsx from "clsx";

const PrimaryButton = ({
  disabled,
  children,
  className,
  size,
  color,
  error,
  loader,
  fullWidth,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={clsx(styles.button, className, {
        [styles.disabled]: disabled,
        [styles.primary]: !error,
        [styles.error]: error,
        [styles[size]]: size,
        [styles[color]]: color,
        [styles.fullWidth]: fullWidth,
      })}
      // className={`${styles.button} ${disabled ? styles.disabled : styles.primary} ${styles[color]} ${styles[size]} ${className}`}
      {...props}
    >
      {loader && <CircularProgress size={13} color="secondary" />}
      {children}
    </button>
  );
};

export default PrimaryButton
