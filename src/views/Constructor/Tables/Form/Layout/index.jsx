
import FieldsBlock from "./FieldsBlock";
import SectionsBlock from "./SectionsBlock";
import styles from "./style.module.scss"

const Layout = ({ control }) => {
  return ( <div className={styles.page} >

    <FieldsBlock control={control} />
    
    <SectionsBlock />



  </div> );
}
 
export default Layout;