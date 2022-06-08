import styles from "./style.module.scss"

const SecondaryButton = ({ children, className, color="primary", size, ...props }) => {
  return (
    <button
      className={`${styles.button} ${styles.secondary} ${styles[size]} ${styles[color]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default SecondaryButton
