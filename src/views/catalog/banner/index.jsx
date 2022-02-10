import React from 'react'
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Table from './Table'
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icon
import AddIcon from "@material-ui/icons/Add"

export default function CompanyCategory () {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <div>
      <Header
        title={t("banner")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="large"
            onClick={() => history.push("/home/catalog/banner/create")}
          >
            {t("add")}
          </Button>,
        ]} />
      <Table />
    </div>
  )
}