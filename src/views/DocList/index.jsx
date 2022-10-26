import { Button, Card } from "@mui/material"
import CreateButton from "../../components/Buttons/CreateButton"
import FiltersBlock from "../../components/FiltersBlock"
import Header from "../../components/Header"
import SearchInput from "../../components/SearchInput"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { useState } from "react"
import TabCounter from "../../components/TabCounter"
import DocsTable from "./Table"
import { useTranslation } from "react-i18next"

const DocListPage = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const { t } = useTranslation()

  return (
    <div>
      <Header
        title={t("incoming.docs")}
        extra={<CreateButton title={t("create")} />}
      />
      <FiltersBlock>
        <SearchInput />
        <Button
          startIcon={<FilterAltIcon />}
          variant="contained"
          color="primary"
        >
          {t("filter")}
        </Button>
      </FiltersBlock>

      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
      >
        <div className="table-block">
          <Card style={{ padding: "10px" }}>
            <TabList>
              <Tab>
                {t("invoices")} <TabCounter count={20} />
              </Tab>
              <Tab>
                {t("powers.of.attorney")} <TabCounter count={45} />
              </Tab>
              <Tab>
                {t("ttn")}
                <TabCounter count={59} />
              </Tab>
              <Tab>
                {t("acts")} <TabCounter count={12} />
              </Tab>
              <Tab>
                {t("contracts")} <TabCounter count={34} />
              </Tab>
              <Tab>
                {t("reconciliation.acts")} <TabCounter count={12} />
              </Tab>
            </TabList>

            <TabPanel>
              <DocsTable />
            </TabPanel>
            <TabPanel>
              <DocsTable />
            </TabPanel>
            <TabPanel>
              <DocsTable />
            </TabPanel>
            <TabPanel>
              <DocsTable />
            </TabPanel>
            <TabPanel>
              <DocsTable />
            </TabPanel>
            <TabPanel>
              <DocsTable />
            </TabPanel>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}

export default DocListPage
