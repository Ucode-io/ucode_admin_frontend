import FormElementGenerator from '../../components/ElementGenerators/FormElementGenerator'
import FormCard from './components/FormCard'
import styles from './style.module.scss'

const MainInfo = ({ computedSections, control }) => {
  return (
    <div className={styles.formArea}>
      <div className={styles.mainCardSide}>
        {computedSections.map((section) => (
          <FormCard
            key={section.id}
            title={section.label}
            className={styles.formCard}
          >
            
            <div className={styles.formColumn}>
              {section.column1?.map((field) => (
                <FormElementGenerator
                  key={field.id}
                  field={field}
                  control={control}
                />
              ))}
            </div>
            <div className={styles.formColumn}>
              {section.column2?.map((field) => (
                <FormElementGenerator
                  key={field.id}
                  field={field}
                  control={control}
                />
              ))}
            </div>
          </FormCard>
        ))}
      </div>

      <div className={styles.secondaryCardSide}></div>
    </div>
  )
}

export default MainInfo
