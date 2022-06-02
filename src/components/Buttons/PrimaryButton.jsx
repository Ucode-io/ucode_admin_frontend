import { CircularProgress } from "@mui/material"
import styles from "./style.module.scss"

const PrimaryButton = ({ children, className, size, error, loader, ...props }) => {
  return (
    <button
      className={`${styles.button} ${styles.primary} ${styles.error} ${styles[size]} ${className}`}
      {...props}
    >
      {loader && <CircularProgress size={13} color="secondary"  />}
      {children}
    </button>
  )
}

export default PrimaryButton
