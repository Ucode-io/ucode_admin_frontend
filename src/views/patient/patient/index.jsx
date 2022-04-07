import React from "react"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icon
import AddIcon from "@material-ui/icons/Add"

export default function Operator() {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <>
      <Header
        title={t("patients")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => history.push("/home/patients/create")}
          >
            {t("client.register")}
          </Button>,
        ]}
      />
      <Table />
    </>
  )
}
