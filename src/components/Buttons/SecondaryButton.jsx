import styles from "./style.module.scss"

const SecondaryButton = ({ children, ...props }) => {
  return ( <button className={`${styles.button} ${styles.secondary}`} {...props} >{ children }</button> );
}
 
export default SecondaryButton;