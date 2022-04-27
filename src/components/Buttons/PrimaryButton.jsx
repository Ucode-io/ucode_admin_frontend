import styles from "./style.module.scss"

const PrimaryButton = ({ children }) => {
  return ( <button className={`${styles.button} ${styles.primary}`} >{ children }</button> );
}
 
export default PrimaryButton;