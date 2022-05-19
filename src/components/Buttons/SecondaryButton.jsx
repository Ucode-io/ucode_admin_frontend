import styles from "./style.module.scss"

const SecondaryButton = ({ children, className, size, ...props }) => {
  return (
    <button
      className={`${styles.button} ${styles.secondary} ${styles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default SecondaryButton
