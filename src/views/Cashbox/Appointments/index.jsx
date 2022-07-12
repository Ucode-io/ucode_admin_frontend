import { useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import TableCard from "../../../components/TableCard"
import CashboxAppointMentsTable from "./Table"

const CashboxAppointments = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  

  return (
    <div>
      <Tabs
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        direction={"ltr"}
      >
        <TableCard>
          <TabList>
            <Tab>Онлайн</Tab>
            <Tab>Офлайн</Tab>
          </TabList>
          <TabPanel>
            <CashboxAppointMentsTable tableSlug="booked_appointments" type={"online"}  />
          </TabPanel>
          <TabPanel>
            <CashboxAppointMentsTable tableSlug="offline_appointments" type={"offline"} />
          </TabPanel>
        </TableCard>
      </Tabs>
    </div>
  )
}

export default CashboxAppointments
