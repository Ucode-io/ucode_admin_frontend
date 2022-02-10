import React from "react"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

//components
import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icons
import AddIcon from "@material-ui/icons/Add"

export default function News() {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <div>
      <Header
        title={t("company.collection")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => history.push("/home/marketing/news/create")}
          >
            {t("add")}
          </Button>,
        ]}
      />
      <Table />
    </div>
  )
}
