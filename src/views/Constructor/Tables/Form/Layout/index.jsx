
import { useForm } from "react-hook-form";
import FieldsBlock from "./FieldsBlock";
import SectionsBlock from "./SectionsBlock";
import styles from "./style.module.scss"

const Layout = ({ control }) => {

  const { control: layoutControl } = useForm({ mode: 'onChange' })

  return ( <div className={styles.page} >

    <FieldsBlock control={control} layoutControl={layoutControl} />
    
    <SectionsBlock control={control} layoutControl={layoutControl} />

    
  </div> );
}
 
export default Layout;