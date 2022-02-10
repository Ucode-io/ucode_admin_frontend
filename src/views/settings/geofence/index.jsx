import React from "react"
import Header from "../../../components/Header"
import Table from "./Table"
import { useTranslation } from "react-i18next"
import Button from "../../../components/Button"
import { useHistory } from "react-router-dom"
import AddIcon from "@material-ui/icons/Add"
import "./style.scss"

export default function Geofence() {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <>
      <Header
        title={t("menu.regions")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => history.push("/home/settings/geofence/create")}
          >
            {t("add")}
          </Button>,
        ]}
      />
      <Table />
    </>
  )
}
