import Header from "../../components/Header"
import Table from "./Table"
import { useNavigate } from "react-router-dom"
import CreateButton from "../../components/Buttons/CreateButton"
import FiltersBlock from "../../components/FiltersBlock"
import { useState } from "react"
import SearchInput from "../../components/SearchInput"

const UsersPage = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  return (
    <div className="UsersPage">
      <Header
        title='Users'
        extra={
          <CreateButton
            onClick={() => navigate(`/settings/users/create`)}
            title="Create user"
          />
        }
      />
      <FiltersBlock>
        <SearchInput value={searchText} onChange={setSearchText} />
      </FiltersBlock>
      <div className="p-2">
        <Table searchText={searchText} />
      </div>
    </div>
  )
}

export default UsersPage
