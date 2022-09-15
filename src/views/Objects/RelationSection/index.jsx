import { Add, InsertDriveFile } from "@mui/icons-material"
import { Card } from "@mui/material"
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import IconGenerator from "../../../components/IconPicker/IconGenerator"
import useTabRouter from "../../../hooks/useTabRouter"
import FilesSection from "../FilesSection"
import ManyToManyRelationCreateModal from "./ManyToManyRelationCreateModal"
import RelationTable from "./RelationTable"
import styles from "./style.module.scss"

const RelationSection = ({ relations }) => {
  const { id } = useParams()

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

  const navigateToCreatePage = () => {
    const relation = relations[selectedTabIndex]
    if (relation.type === "Many2Many") setSelectedManyToManyRelation(relation)
    else {
      if (relation.is_editable) setCreateFormVisible(relation.id, true)
      else {
        const relatedTable =
          relation.table_to?.slug === tableSlug
            ? relation.table_from
            : relation.table_to

        navigateToForm(relatedTable.slug, "CREATE", null, {
          [`${tableSlug}_id`]: id,
        })
      }
    }
  }

  if(!relations?.length) return null

  return (
    <>
      {selectedManyToManyRelation && (
        <ManyToManyRelationCreateModal
          relation={selectedManyToManyRelation}
          closeModal={() => setSelectedManyToManyRelation(null)}
          // onCreate={refetch}
        />
      )}
      {
        relations.length ?
          <Card className={styles.card}>
            <Tabs
              // forceRenderTabPanel
              selectedIndex={selectedTabIndex}
              onSelect={setSelectedTabIndex}
            >
              <div className={styles.cardHeader}>
                <TabList className={styles.tabList}>
                  {relations?.map((relation, index) => (
                    <Tab key={index}>
                      {
                        relation?.view_relation_type === 'FILE'
                          ?
                              <>
                                <InsertDriveFile /> Файлы
                              </>
                          :
                            <div className="flex align-center gap-2 text-nowrap">
                              <IconGenerator icon={relation?.icon} /> {relation.title}
                            </div>
                      }
                    </Tab>
                  ))}
                </TabList>

                <SecondaryButton onClick={navigateToCreatePage} disabled={!id}>
                  <Add /> Добавить
                </SecondaryButton>
              </div>

              {relations?.map((relation) => (
                <TabPanel key={relation.id}>
                  {
                  relation?.view_relation_type === 'FILE'
                    ?
                      <FilesSection />
                    :
                      <RelationTable
                        key={relation.id}
                        relation={relation}
                        createFormVisible={relationsCreateFormVisible}
                        setCreateFormVisible={setCreateFormVisible}
                      />
                  }
                </TabPanel>
              ))}
            </Tabs>
          </Card>
        : 
          null
      }
    </>
  )
}

export default RelationSection
