import React from "react"
import "./style.scss"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

//components
import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icons
import AddIcon from "@material-ui/icons/Add"

export default function ShipperSettings() {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <div>
      <Header
        title={t("list.restaurants")}
        endAdornment={[
          <Button
            onClick={() => history.push("/home/company/shipper-company/create")}
            icon={AddIcon}
            size="medium"
          >
            {t("add")}
          </Button>,
        ]}
      />
      <Table />
    </div>
  )
}
