
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import FieldsBlock from "./FieldsBlock";
import SectionsBlock from "./SectionsBlock";
import styles from "./style.module.scss"

const Layout = ({ control, setValue, getValues }) => {

  const sections = useWatch({
    control,
    name: `sections`
  })

  const usedFields = useMemo(() => {
    const list = []

    sections?.forEach(section => {
      section.column1?.forEach(field => { list.push(field.id) })
      section.column2?.forEach(field => { list.push(field.id) })
    })

    return list
  }, [sections])

  const { control: layoutControl } = useForm({ mode: 'onChange' })

  return ( <div className={styles.page} >

    <FieldsBlock usedFields={usedFields} control={control} layoutControl={layoutControl} />
    
    <SectionsBlock control={control} layoutControl={layoutControl} setValue={setValue} getValues={getValues} />

    
  </div> );
}
 
export default Layout;