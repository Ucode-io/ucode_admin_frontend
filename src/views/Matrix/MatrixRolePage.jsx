import { useState } from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import {
  ChevronDownIcon,
  CrossPeson,
  TwoUserIcon,
} from "../../assets/icons/icon"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadCell,
  CTableRow,
} from "../../components/CTable"
import FormCard from "../../components/FormCard"
import FRow from "../../components/FormElements/FRow"
import HFTextField from "../../components/FormElements/HFTextField"
import Header from "../../components/Header"
import applicationService from "../../services/applicationSercixe"
import constructorObjectService from "../../services/constructorObjectService"
import roleServiceV2 from "../../services/roleServiceV2"

const MatrixRolePage = () => {
  const { roleId } = useParams()
  const [appId, setAppId] = useState(null)
  const [tableSlug, setTableSlug] = useState(null)
  const [role, setRole] = useState({})
  const [apps, setApps] = useState([])
  const [roles, setRoles] = useState([])
  const [recordPermissions, setRecordPermissions] = useState([])

  const roleForm = useForm({})

  const getRecordPermissions = () => {
    constructorObjectService
      .getList("record_permission", {
        data: {
          role_id: roleId,
        },
      })
      .then((res) => {
        console.log("recordPermissions", res)
        setRecordPermissions(res?.data?.response || [])
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleRecordPermission = (record, type, value, tabSlug) => {
    console.log("record", record)
    const data = {
      role_id: roleId,
      update: record?.update ? record?.update : "No",
      delete: record?.delete ? record?.delete : "No",
      read: record?.read ? record?.read : "No",
      write: record?.write ? record?.write : "No",
      table_slug: tabSlug,
      guid: record?.guid ? record?.guid : "",
    }
    if (record?.guid) {
      constructorObjectService
        .update("record_permission", {
          data: {
            ...data,
            [type]: value,
          },
        })
        .then((res) => {
          console.log("res", res)
          setTableSlug(null)
          getRecordPermissions()
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      constructorObjectService
        .create("record_permission", {
          data: {
            ...data,
            [type]: value,
          },
        })
        .then((res) => {
          console.log("res", res)
          setTableSlug(null)
          getRecordPermissions()
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const getRoleById = () => {
    roleServiceV2
      .getById(roleId)
      .then((res) => {
        console.log("roleID", res)
        setRole(res?.data?.response || {})
        roleForm.setValue("name", res?.data?.response?.name || "")
      })
      .catch((err) => {
        console.log("err", err)
      })
  }

  const getApps = () => {
    applicationService
      .getList()
      .then((res) => {
        console.log("Apps", res)
        setApps(res?.apps || [])
        setRoles(res?.apps || [])
      })
      .catch((err) => {
        console.log("err", err)
      })
  }

  const getAppChildren = (id) => {
    console.log("id", id)
    applicationService
      .getById(id)
      .then((res) => {
        const result = []
        console.log("AppChildren", res)
        apps?.forEach((element) => {
          if (element?.id !== id) {
            result.push(element)
          } else {
            result.push(element)
            result.push(
              ...res?.tables.map((table) => ({ ...table, children: "true" }))
            )
          }
        })
        setApps(result)
      })
      .catch((err) => {
        console.log("err", err)
      })
  }

  useEffect(() => {
    if (!appId) {
      setApps(roles)
    } else {
      getAppChildren(appId)
    }
  }, [appId])

  useEffect(() => {
    getRecordPermissions()
    getRoleById()
    getApps()
  }, [])
  // console.log("roleForm", recordPermissions.find((item) => item.table_slug === "project").read);

  // const aaa = {tableSlug === app?.slug ? (
  //   <div
  //     style={{
  //       display: "flex",
  //       alignItems: "center",
  //       gap: "8px",
  //       backgroundColor: "white",
  //       border: "1px solid #eee",
  //       padding: "12px 16px",
  //       borderRadius: "6px",
  //       position: "absolute",
  //       top: "40px",
  //       left: "30px",
  //       zIndex: "2",
  //     }}
  //   >
  //     <span
  //       onClick={(e) => {
  //         e.stopPropagation()
  //         handleRecordPermission(
  //           recordPermissions?.find(
  //             (item) => item?.table_slug === app?.slug
  //           ),
  //           "read",
  //           "Yes",
  //           app?.slug
  //         )
  //       }}
  //     >
  //       <TwoUserIcon />
  //     </span>
  //     <span
  //       onClick={(e) => {
  //         e.stopPropagation()
  //         handleRecordPermission(
  //           recordPermissions?.find(
  //             (item) => item?.table_slug === app?.slug
  //           ),
  //           "read",
  //           "No",
  //           app?.slug
  //         )
  //       }}
  //     >
  //       <CrossPeson />
  //     </span>
  //   </div>
  // ) : null}

  return (
    <div>
      <Header title="Роли" />
      <div style={{ margin: "8px" }}>
        <FormCard title="Инфо" icon="address-card.svg" maxWidth="100%">
          <FRow label="Название">
            <HFTextField
              label="Название"
              name="name"
              control={roleForm.control}
              fullWidth
            />
          </FRow>
        </FormCard>

        <div style={{ marginTop: "10px" }}>
          <CTable removableHeight={null} disablePagination>
            <CTableHead>
              <CTableRow>
                <CTableHeadCell>Объекты</CTableHeadCell>
                <CTableHeadCell style={{ padding: 0 }} colSpan={4}>
                  <div style={{ borderBottom: "1px solid #eee" }}>
                    <div>Record permissions</div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          border: "1px solid #eee",
                          padding: "8px 16px",
                          display: "flex",
                          flexGrow: "1",
                          justifyContent: "center",
                        }}
                      >
                        Чтение
                      </div>
                      <div
                        style={{
                          border: "1px solid #eee",
                          padding: "8px 16px",
                          display: "flex",
                          flexGrow: "1",
                          justifyContent: "center",
                        }}
                      >
                        Добавление
                      </div>
                      <div
                        style={{
                          border: "1px solid #eee",
                          padding: "8px 16px",
                          display: "flex",
                          flexGrow: "1",
                          justifyContent: "center",
                        }}
                      >
                        Изменение
                      </div>
                      <div
                        style={{
                          border: "1px solid #eee",
                          padding: "8px 16px",
                          display: "flex",
                          flexGrow: "1",
                          justifyContent: "center",
                        }}
                      >
                        Удаление
                      </div>
                    </div>
                  </div>
                </CTableHeadCell>
              </CTableRow>
            </CTableHead>
            <CTableBody loader={false} columnsCount={2} dataLength={1}>
              {apps?.map((app) => (
                <CTableRow>
                  <CTableCell
                    key={app.id}
                    onClick={
                      app.children
                        ? () => {}
                        : () => {
                            setApps(roles)
                            setAppId((prev) => (prev === app.id ? "" : app.id))
                          }
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        minWidth: "200px",
                      }}
                    >
                      {app?.name || app?.label}
                      {!app?.children && <ChevronDownIcon />}
                    </div>
                  </CTableCell>
                  <CTableCell
                    align="center"
                    onClick={(e) => {
                      e.stopPropagation()
                      setTableSlug((prev) =>
                        prev === app.slug
                          ? ""
                          : app.slug
                          ? app.slug + "read"
                          : ""
                      )
                      console.log("Read")
                    }}
                    style={{ position: "relative" }}
                  >
                    {recordPermissions?.find(
                      (item) => item?.table_slug === app?.slug
                    )?.read === "Yes" ? (
                      <TwoUserIcon />
                    ) : (
                      <CrossPeson />
                    )}
                    {tableSlug === app?.slug + "read" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "white",
                          border: "1px solid #eee",
                          padding: "12px 16px",
                          borderRadius: "6px",
                          position: "absolute",
                          top: "40px",
                          left: "30px",
                          zIndex: "2",
                        }}
                      >
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRecordPermission(
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              ),
                              "read",
                              "Yes",
                              app?.slug
                            )
                          }}
                        >
                          <TwoUserIcon />
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRecordPermission(
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              ),
                              "read",
                              "No",
                              app?.slug
                            )
                          }}
                        >
                          <CrossPeson />
                        </span>
                      </div>
                    ) : null}
                  </CTableCell>
                  <CTableCell
                    align="center"
                    onClick={(e) => {
                      e.stopPropagation()
                      setTableSlug((prev) =>
                        prev === app.slug
                          ? ""
                          : app.slug
                          ? app.slug + "write"
                          : ""
                      )
                      console.log("Write")
                    }}
                    style={{ position: "relative" }}
                  >
                    {recordPermissions?.find(
                      (item) => item?.table_slug === app?.slug
                    )?.write === "Yes" ? (
                      <TwoUserIcon />
                    ) : (
                      <CrossPeson />
                    )}
                    {tableSlug === app?.slug + "write" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "white",
                          border: "1px solid #eee",
                          padding: "12px 16px",
                          borderRadius: "6px",
                          position: "absolute",
                          top: "40px",
                          left: "30px",
                          zIndex: "2",
                        }}
                      >
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRecordPermission(
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              ),
                              "write",
                              "Yes",
                              app?.slug
                            )
                          }}
                        >
                          <TwoUserIcon />
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRecordPermission(
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              ),
                              "write",
                              "No",
                              app?.slug
                            )
                          }}
                        >
                          <CrossPeson />
                        </span>
                      </div>
                    ) : null}
                  </CTableCell>
                  <CTableCell
                    align="center"
                    onClick={(e) => {
                      e.stopPropagation()
                      setTableSlug((prev) =>
                        prev === app.slug
                          ? ""
                          : app.slug
                          ? app.slug + "update"
                          : ""
                      )
                      console.log("Update")
                    }}
                    style={{ position: "relative" }}
                  >
                    {recordPermissions?.find(
                      (item) => item?.table_slug === app?.slug
                    )?.update === "Yes" ? (
                      <TwoUserIcon />
                    ) : (
                      <CrossPeson />
                    )}
                    {tableSlug === app?.slug + "update" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "white",
                          border: "1px solid #eee",
                          padding: "12px 16px",
                          borderRadius: "6px",
                          position: "absolute",
                          top: "40px",
                          left: "30px",
                          zIndex: "2",
                        }}
                      >
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRecordPermission(
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              ),
                              "update",
                              "Yes",
                              app?.slug
                            )
                          }}
                        >
                          <TwoUserIcon />
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRecordPermission(
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              ),
                              "update",
                              "No",
                              app?.slug
                            )
                          }}
                        >
                          <CrossPeson />
                        </span>
                      </div>
                    ) : null}
                  </CTableCell>
                  <CTableCell
                    align="center"
                    onClick={(e) => {
                      e.stopPropagation()
                      setTableSlug((prev) =>
                        prev === app.slug
                          ? ""
                          : app.slug
                          ? app.slug + "delete"
                          : ""
                      )
                      console.log("Delete")
                    }}
                    style={{ position: "relative" }}
                  >
                    {recordPermissions?.find(
                      (item) => item?.table_slug === app?.slug
                    )?.delete === "Yes" ? (
                      <TwoUserIcon />
                    ) : (
                      <CrossPeson />
                    )}
                    {tableSlug === app?.slug + "delete" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "white",
                          border: "1px solid #eee",
                          padding: "12px 16px",
                          borderRadius: "6px",
                          position: "absolute",
                          top: "40px",
                          left: "30px",
                          zIndex: "2",
                        }}
                      >
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRecordPermission(
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              ),
                              "delete",
                              "Yes",
                              app?.slug
                            )
                          }}
                        >
                          <TwoUserIcon />
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRecordPermission(
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              ),
                              "delete",
                              "No",
                              app?.slug
                            )
                          }}
                        >
                          <CrossPeson />
                        </span>
                      </div>
                    ) : null}
                  </CTableCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </div>
    </div>
  )
}

export default MatrixRolePage
