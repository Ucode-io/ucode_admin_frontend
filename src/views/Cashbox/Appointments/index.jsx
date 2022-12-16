import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import TableCard from "../../../components/TableCard"
import CashboxAppointMentsTable from "./Table"

const CashboxAppointments = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const navigateToClosingPage = () => {
    navigate("/cashbox/closing")
  }

  return (
    <div>
      {/* <Tabs
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
          <TabPanel> */}
      <TableCard
        extra={
          <SecondaryButton onClick={navigateToClosingPage}>
            {t("close.cash.desk")}
          </SecondaryButton>
        }
      >
        <CashboxAppointMentsTable
          tableSlug="offline_appointments"
          type={"offline"}
        />
      </TableCard>
      {/* </TabPanel>
        </TableCard>
      </Tabs> */}
    </div>
  )
}

export default CashboxAppointments
