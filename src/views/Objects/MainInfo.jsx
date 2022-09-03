import { useMemo } from 'react'
import FormElementGenerator from '../../components/ElementGenerators/FormElementGenerator'
import FormCard from './components/FormCard'
import styles from './style.module.scss'

const MainInfo = ({ computedSections, control, setFormValue }) => {
  
  const fieldsList = useMemo(() => {
    const fields = []

    computedSections?.forEach(section => {
      section.fields?.forEach(field => {
        fields.push(field)
      })
    })
    return fields
  }, [ computedSections ])


  return (
    
      <div className={styles.mainCardSide}>
        {computedSections.map((section) => (
          <FormCard
            key={section.id}
            title={section.label}
            className={styles.formCard}
            icon={section.icon}
          >
            
            <div className={styles.formColumn}>
              {section.fields?.map((field) => (
                <FormElementGenerator
                  key={field.id}
                  field={field}
                  control={control}
                  setFormValue={setFormValue}
                  fieldsList={fieldsList}
                />
              ))}
            </div>

          </FormCard>
        ))}
        
      </div>
  )
}

export default MainInfo
