import styles from "./style.module.scss"

const PrimaryButton = ({ children, className, size, ...props }) => {
  return ( <button className={`${styles.button} ${styles.primary} ${styles[size]} ${className}`} {...props} >{ children }</button> );
}
 
export default PrimaryButton;