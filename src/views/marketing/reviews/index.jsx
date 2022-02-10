import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"

import Header from "../../../components/Header"
import Button from "../../../components/Button"
import Filters from "../../../components/Filters"
import RestaurantTable from "./Table"

//icon
import AddIcon from "@material-ui/icons/Add"
import { StyledTab, StyledTabs } from "../../../components/StyledTabs"

export default function Reviews() {
  const { t } = useTranslation()
  const history = useHistory()
  const [selectedTab, setSelectedTab] = useState("restaurant")

  const TabBody = useCallback(
    ({ tab, children }) => {
      if (tab === selectedTab) return children
      return <></>
    },
    [selectedTab]
  )

  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>
  }

  return (
    <>
      <Header title={t("list.of.banners")} />
      <Filters className="mb-0">
        <StyledTabs
          value={selectedTab}
          onChange={(_, value) => {
            setSelectedTab(value)
          }}
          indicatorColor="primary"
          textColor="primary"
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab label={tabLabel(t("restaurant"))} value="restaurant" />
          <StyledTab label={tabLabel(t("courier"))} value="courier" />
        </StyledTabs>
      </Filters>
      {/*<TabBody tab="restaurant">*/}
      <RestaurantTable />
      {/*</TabBody>*/}
    </>
  )
}
