import { useMemo } from "react"

import DataColumn from "./DataColumn"
import MockColumn from "./MockColumn"
import styles from "./style.module.scss"

const RecursiveBlock = ({
  date,
  data,
  fieldsMap,
  parentTab,
  view,
  tabs,
  level = 0,
  workingDays,
}) => {
  const elements = useMemo(() => {
    if (!parentTab) return tabs?.[level]?.list

    return tabs?.[level]?.list?.filter((el) => {
      return Array.isArray(el[parentTab.slug])
        ? el[parentTab.slug]?.includes(parentTab.value)
        : el[parentTab.slug] === parentTab.value
    })
  }, [parentTab, tabs, level])

  if (!elements?.length)
    return <MockColumn view={view} level={level} tabs={tabs} />

  return (
    <div className={styles.row}>
      {elements?.map((tab) => (
        <div className={styles.block}>
          <div className={styles.blockElement}>{tab.label}</div>

          {tabs?.[level + 1] ? (
            <RecursiveBlock
              date={date}
              data={data}
              tabs={tabs}
              parentTab={tab}
              fieldsMap={fieldsMap}
              view={view}
              level={level + 1}
              workingDays={workingDays}
            />
          ) : (
            <DataColumn
              date={date}
              data={data}
              parentTab={tab}
              categoriesTab={parentTab}
              fieldsMap={fieldsMap}
              view={view}
              workingDays={workingDays}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default RecursiveBlock
