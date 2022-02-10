import React from "react"
import EntityDraftTable from "./tables/EntityDraftTable"
import TypesOfEntity from "./tables/TypesOfEntity"
import CitizenSuggestions from "./tables/CitizenSuggestions"

export default function LimitedDashboard() {
  return (
    <>
      <TypesOfEntity />
      <EntityDraftTable />
      <CitizenSuggestions />
    </>
  )
}
