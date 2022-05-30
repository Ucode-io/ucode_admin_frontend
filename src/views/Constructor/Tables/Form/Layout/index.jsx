
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import FieldsBlock from "./FieldsBlock";
import SectionsBlock from "./SectionsBlock";
import styles from "./style.module.scss"

const Layout = ({ mainForm }) => {

  const sections = useWatch({
    control: mainForm.control,
    name: `sections`
  })

  console.log("SECTIONS ===>", sections)

  const usedFields = useMemo(() => {
    const list = []

    sections?.forEach(section => {
      section.fields?.forEach(field => { list.push(field.id) })
    })

    return list
  }, [sections])

  const layoutForm = useForm({ mode: 'onChange' })

  return ( <div className={styles.page} >

    <FieldsBlock usedFields={usedFields} mainForm={mainForm} layoutForm={layoutForm} />
    
    <SectionsBlock mainForm={mainForm} layoutForm={layoutForm} />

    
  </div> );
}
 
export default Layout;