import React from "react"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icon
import AddIcon from "@material-ui/icons/Add"

export default function Courier() {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <div>
      <Header
        title={t("courier")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => history.push("/home/courier/list/create")}
          >
            {t("add")}
          </Button>,
        ]}
      />
      <Table />
    </div>
  )
}
