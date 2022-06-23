import { useLocation, useNavigate } from "react-router-dom"
import CreateButton from "../../../components/Buttons/CreateButton"
import FiltersBlock from "../../../components/FiltersBlock"
import HeaderSettings from "../../../components/HeaderSettings"
import SearchInput from "../../../components/SearchInput"
import TableCard from "../../../components/TableCard"
import TablesList from "./TablesList"

const ConstructorTablesListPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div>

      {/* <FiltersBlock>
        <SearchInput />
      </FiltersBlock> */}

      <TableCard>
        <TablesList />
      </TableCard>
    </div>
  )
}

export default ConstructorTablesListPage
