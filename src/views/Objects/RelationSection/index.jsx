import { Add } from "@mui/icons-material"
import { Card } from "@mui/material"
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import IconGenerator from "../../../components/IconPicker/IconGenerator"
import useTabRouter from "../../../hooks/useTabRouter"
import ManyToManyRelationCreateModal from "./ManyToManyRelationCreateModal"
import RelationTable from "./RelationTable"
import styles from "./style.module.scss"

const RelationSection = ({ relations }) => {

  const { tableSlug } = useParams()
  const { navigateToForm } = useTabRouter()
  const [selectedManyToManyRelation, setSelectedManyToManyRelation] =
    useState(null)
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  )
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  useEffect(() => {
    const result = {}

    relations?.forEach((relation) => (result[relation.id] = false))

    setRelationsCreateFormVisible(result)
  }, [relations])

  const setCreateFormVisible = (relationId, value) => {
    setRelationsCreateFormVisible((prev) => ({
      ...prev,
      [relationId]: value,
    }))
  }

  const { id } = useParams()

  const navigateToCreatePage = () => {
    const relation = relations[selectedTabIndex]
    if (relation.type === "Many2Many") setSelectedManyToManyRelation(relation)
    else {
      if(relation.is_editable) setCreateFormVisible(relation.id, true)

      else navigateToForm(relation.relatedTable, "CREATE", null, {
        [`${tableSlug}_id`]: id,
      })
    }
      
  }

  if (!relations?.length) return null

  return (
    <>
      {selectedManyToManyRelation && (
        <ManyToManyRelationCreateModal
          relation={selectedManyToManyRelation}
          closeModal={() => setSelectedManyToManyRelation(null)}
          // onCreate={refetch}
        />
      )}
      <Card className={styles.card}>
        <Tabs
          forceRenderTabPanel
          selectedIndex={selectedTabIndex}
          onSelect={setSelectedTabIndex}
        >
          <div className={styles.cardHeader}>
            <TabList className={styles.tabList}>
              {relations?.map((relation, index) => (
                <Tab key={index}>
                  <IconGenerator icon={relation?.icon} /> {relation.label}
                </Tab>
              ))}
            </TabList>

            <SecondaryButton onClick={navigateToCreatePage} disabled={!id}>
              <Add /> Добавить
            </SecondaryButton>
          </div>

          {relations?.map((relation) => (
            <TabPanel key={relation.id}>
              <RelationTable
                key={relation.id}
                relation={relation}
                createFormVisible={relationsCreateFormVisible}
                setCreateFormVisible={setCreateFormVisible}
                
              />
            </TabPanel>
          ))}
        </Tabs>
      </Card>
    </>
  )
}

export default RelationSection
