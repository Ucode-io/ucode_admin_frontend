import React from "react"
import { Box } from "@material-ui/core"
import IncomesPieChart from "./charts/IncomesPieChart"
import RejectsPieChart from "./charts/RejectsPieChart"
import ApplicantEntitiesTable from "./tables/ApplicantEntitiesTable"
import IncomesTable from "./tables/IncomesTable"
import NewFoundedTable from "./tables/NewFoundedTable"
import ExpiredEntityDraftsTable from "./tables/ExpiredEntityDraftsTable"

export default function AdminDashboard() {
  return (
    <>
      <IncomesTable />
      <Box mb={2.5} />
      <NewFoundedTable />
      <Box mb={2.5} />
      <ExpiredEntityDraftsTable />
      <Box mb={2.5} />
      <div
        className="w-full grid grid-cols-12 gap-4 box-border font-body"
        style={{ fontSize: "14px", lineHeight: "24px" }}
      >
        <div className="col-span-6">
          <IncomesPieChart />
        </div>
        <div className="col-span-6">
          <RejectsPieChart />
        </div>
      </div>
      <Box mb={2.5} />
      <ApplicantEntitiesTable />
    </>
  )
}
