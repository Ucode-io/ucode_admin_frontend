
import { useForm } from "react-hook-form";
import FieldsBlock from "./FieldsBlock";
import SectionsBlock from "./SectionsBlock";
import styles from "./style.module.scss"

const Layout = ({ control, setValue, getValues }) => {

  const { control: layoutControl } = useForm({ mode: 'onChange' })

  console.log('getValues2 ==>', getValues)


  return ( <div className={styles.page} >

    <FieldsBlock control={control} layoutControl={layoutControl} />
    
    <SectionsBlock control={control} layoutControl={layoutControl} setValue={setValue} getValues={getValues} />

    
  </div> );
}
 
export default Layout;