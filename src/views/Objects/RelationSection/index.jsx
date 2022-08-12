import { Add } from "@mui/icons-material"
import { Card } from "@mui/material"
import { useParams } from "react-router-dom"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import IconGenerator from "../../../components/IconPicker/IconGenerator"
import RelationTable from "./RelationTable"
import styles from "./style.module.scss"

const RelationSection = ({ relations }) => {
  const {id} = useParams()

  return (
    <Card className={styles.card}>
      <Tabs forceRenderTabPanel>
        <div className={styles.cardHeader}>
          <TabList className={styles.tabList} >
            {relations?.map((relation) => (
              <Tab key={relation.id}> <IconGenerator icon={relation.relatedTable?.icon} /> {relation.relatedTable?.label}</Tab>
            ))}
          </TabList>

          <SecondaryButton disabled={!id} > <Add /> Добавить</SecondaryButton>


        </div>

        {relations?.map((relation) => (
          <TabPanel key={relation.id}>
            <RelationTable key={relation.id} relation={relation} />
          </TabPanel>
        ))}
      </Tabs>
    </Card>
  )
}

export default RelationSection
