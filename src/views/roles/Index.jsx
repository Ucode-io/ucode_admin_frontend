import { useEffect, useState } from "react"
import axios from "../../utils/axios"
import Table from "@material-ui/core/Table"
import TableRow from "@material-ui/core/TableRow"

import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import Header from "../../components/Header"
import { useHistory } from "react-router-dom"
import TableContainer from "@material-ui/core/TableContainer"
import CustomButton from "../../components/Buttons/index"
import { useTranslation } from "react-i18next"
import moment from "moment"
import Pagination from "../../components/Pagination"
import TableLoader from "../../components/TableLoader"
import StatusTag from "../../components/Tag/StatusTag"
import Filters from "../../components/Filters"
import Input from "../../components/Input"
import AutoComplate from "../../components/Select/AutoComplate"

export default function OrganizationsList() {
  // **** USE-HOOKS ****
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState([])
  const [loader, setLoader] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState(null)
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null)

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, selectedOrganizationId, searchText])

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }

  const getItems = (pageNumber = 1) => {
    setLoader(true)
    clearItems()
    axios
      .get("/role", {
        params: {
          page: pageNumber,
          limit: 10,
          name: searchText,
          organization_id: selectedOrganizationId,
        },
      })
      .then((res) => {
        setItems(res)
      })
      .finally(() => setLoader(false))
  }

  return (
    <div>
      <Header
        title={t("roles")}
        endAdornment={[
          <CustomButton
            size="large"
            shape="text"
            color="text-primary-600"
            onClick={() => history.push("/home/settings/roles/create")}
          >
            {t("create")}
          </CustomButton>,
        ]}
      />

      <Filters>
        <div className="flex space-x-2 w-full">
          <Input
            placeholder={t("search") + "..."}
            style={{ width: 200 }}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <AutoComplate
            placeholder={t("organizations")}
            style={{ minWidth: "200px" }}
            url="/organization"
            isClearable
            onFetched={(res) => res.organizations}
            onChange={(val) => setSelectedOrganizationId(val?.value?.id)}
          />
        </div>
      </Filters>

      <div className="m-4 p-4 rounded-lg bg-white">
        <TableContainer className="mt-4">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>{t("#")}</TableCell>
                <TableCell>{t("name")}</TableCell>
                <TableCell>{t("organization")}</TableCell>
                <TableCell>{t("status")}</TableCell>
                <TableCell>{t("created.date")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.roles && items.roles.length ? (
                items.roles.map(
                  ({ id, name, organization, created_at, status }, index) => (
                    <TableRow
                      key={id}
                      onClick={() => history.push(`/home/settings/roles/${id}`)}
                    >
                      <TableCell>
                        <p className="text-blue-600">
                          {(currentPage - 1) * 10 + index + 1}
                        </p>
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{organization.name}</TableCell>
                      <TableCell>
                        <StatusTag status={status} />
                      </TableCell>
                      <TableCell>
                        {moment(created_at).format("YYYY-MM-DD")}
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TableLoader isVisible={loader} />

        <Pagination
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      </div>
    </div>
  )
}
