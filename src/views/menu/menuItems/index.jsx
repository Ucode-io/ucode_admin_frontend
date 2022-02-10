import "./style.scss"
import React, { useEffect, useState } from "react"
import Table from "./Table"
import Button from "../../../components/Button"
import Header from "../../../components/Header"
import AddIcon from "@material-ui/icons/Add"
import Filters from "../../../components/Filters"
import { Input } from "alisa-ui"
import SearchIcon from "@material-ui/icons/Search"
import { useHistory, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { StyledTab, StyledTabs } from "../../../components/StyledTabs"
import Breadcrumb from "../../../components/Breadcrumb"
import AddOptionModal from "../productCreate/modals/AddOption"
import { postIngredients } from "../../../services/ingredients"

export default function Catalog() {
  const { t } = useTranslation()
  const history = useHistory()
  const { menu_id, shipper_id } = useParams()

  const [selectedTab, setSelectedTab] = useState("category")

  const tabLabel = (text) => {
    return <span className="px-1">{text}</span>
  }

  const [optionModal, setOptionModal] = useState(false)

  const searchIcon = (
    <SearchIcon
      style={{ fontSize: 20 }}
      className="fill-current text-primary"
    />
  )
  const routes = [
    {
      title: t("restaurants"),
      link: true,
      route: "/home/company/shipper-company",
    },
    {
      title: t("menu"),
      link: false,
    },
    {
      title: t(selectedTab),
    },
  ]

  return (
    <div>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={[
          selectedTab !== "ingredients" && (
            <Input
              placeholder={t("search")}
              size="large"
              addonBefore={searchIcon}
            />
          ),
          <Button
            color="blue"
            size="medium"
            icon={AddIcon}
            onClick={() => {
              if (selectedTab === "ingredients") {
                setOptionModal((prev) => !prev)
              } else {
                history.push(
                  `/home/company/shipper-company/${shipper_id}/menu/${menu_id}/${selectedTab}/create`
                )
              }
            }}
          >
            {t("add")}
          </Button>,
        ]}
      />

      <Filters>
        <StyledTabs
          value={selectedTab}
          onChange={(_, value) => setSelectedTab(value)}
          indicatorColor="primary"
          textColor="primary"
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab label={tabLabel(t("categories"))} value="category" />
          <StyledTab label={tabLabel(t("products"))} value="product" />
          <StyledTab label={tabLabel(t("ingredients"))} value="ingredients" />
        </StyledTabs>
      </Filters>
      <Table
        tab={selectedTab}
        optionModal={optionModal}
        setOptionModal={setOptionModal}
      />
    </div>
  )
}
