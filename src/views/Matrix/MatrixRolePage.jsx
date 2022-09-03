import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  ChevronDownIcon,
  CrossPeson,
  TwoUserIcon,
} from "../../assets/icons/icon";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadCell,
  CTableRow,
} from "../../components/CTable";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import HFSelect from "../../components/FormElements/HFSelect";
import HFTextField from "../../components/FormElements/HFTextField";
import HeaderSettings from "../../components/HeaderSettings";
import applicationService from "../../services/applicationSercixe";
import constructorObjectService from "../../services/constructorObjectService";
import constructorRelationService from "../../services/constructorRelationService";
import roleServiceV2 from "../../services/roleServiceV2";

const staticTables = [
  {
    label: "APP",
    slug: "app",
    children: "true",
  },
];

const MatrixRolePage = () => {
  const { roleId, typeId } = useParams();
  const [appId, setAppId] = useState(null);
  const [tableSlug, setTableSlug] = useState(null);
  const [role, setRole] = useState({});
  const [apps, setApps] = useState([{ name: "Settings", id: "settings" }]);
  const [roles, setRoles] = useState([{ name: "Settings", id: "settings" }]);
  const [recordPermissions, setRecordPermissions] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isCustomVisible, setIsCustomVisible] = useState(false);
  const [relations, setRelations] = useState([]);
  const [automaticFilters, setAutomaticFilters] = useState([]);
  const [creatingAutoFilter, setCreatingAutoFilter] = useState(false);

  const roleForm = useForm({});

  const autoFilterForm = useForm({
    defaultValues: {
      object_field: "",
      custom_field: "",
      tabSlug: "",
    },
  });

  const getRecordPermissions = () => {
    constructorObjectService
      .getList("record_permission", {
        data: {
          role_id: roleId,
        },
      })
      .then((res) => {
        setRecordPermissions(res?.data?.response || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAutomaticFilters = (tSlug) => {
    constructorObjectService
      .getList("automatic_filter", {
        data: {
          role_id: roleId,
          table_slug: tSlug,
        },
      })
      .then((res) => {
        console.log("automatic_filter", res?.data);
        setAutomaticFilters(res?.data?.response);
      });
  };

  const handleRecordPermission = (record, type, value, tabSlug) => {
    autoFilterForm.setValue("tabSlug", tabSlug);
    if (value === "Yes") {
      setIsCustomVisible(true);
    } else {
      setIsCustomVisible(false);
    }
    const data = {
      role_id: roleId,
      update: record?.update ? record?.update : "No",
      delete: record?.delete ? record?.delete : "No",
      read: record?.read ? record?.read : "No",
      write: record?.write ? record?.write : "No",
      table_slug: tabSlug,
      guid: record?.guid ? record?.guid : "",
    };
    if (record?.guid) {
      constructorObjectService
        .update("record_permission", {
          data: {
            ...data,
            [type]: value,
          },
        })
        .then((res) => {
          setTableSlug((prev) => (value === "Yes" ? prev : null));
          if (value === "Yes") {
            console.log("11");
            getAutomaticFilters(tabSlug);
            constructorRelationService
              .getList({ table_slug: tabSlug })
              .then((res) => {
                console.log(
                  "res",
                  res?.relations
                    ?.filter((rel) => rel?.table_from?.slug === tabSlug)
                    ?.map((el) => el?.table_to)
                );
                setRelations(
                  res?.relations
                    ?.filter((rel) => rel?.table_from?.slug === tabSlug)
                    ?.map((el) => el?.table_to)
                );
              });
          }
          getRecordPermissions();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      constructorObjectService
        .create("record_permission", {
          data: {
            ...data,
            [type]: value,
          },
        })
        .then((res) => {
          setTableSlug(null);
          getRecordPermissions();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAutoFilter = () => {
    const data = {
      object_field: autoFilterForm.getValues("object_field"),
      custom_field: autoFilterForm.getValues("custom_field"),
      role_id: roleId,
      table_slug: autoFilterForm.getValues("tabSlug"),
    };
    // return console.log('ddddd', data)
    constructorObjectService
      .create("automatic_filter", {
        data: {
          ...data,
        },
      })
      .then((res) => {
        console.log("Autofilter", res);
        setTableSlug(null);
        setIsCustomVisible(false);
      });
  };

  const getRoleById = () => {
    roleServiceV2
      .getById(roleId)
      .then((res) => {
        setRole(res?.data?.response || {});
        roleForm.setValue("name", res?.data?.response?.name || "");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getApps = () => {
    applicationService
      .getList()
      .then((res) => {
        setApps((prev) => [...prev, ...(res?.apps || [])]);
        setRoles((prev) => [...prev, ...(res?.apps || [])]);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getAppChildren = (id) => {
    if (id === "settings") {
      console.log("settings");
      const result = [];
      apps?.forEach((element) => {
        if (element?.id !== id) {
          result.push(element);
        } else {
          result.push(element);
          result.push(...staticTables);
        }
      });
      setApps(result);
    } else {
      applicationService
        .getById(id)
        .then((res) => {
          const result = [];
          apps?.forEach((element) => {
            if (element?.id !== id) {
              result.push(element);
            } else {
              result.push(element);
              result.push(
                ...res?.tables.map((table) => ({ ...table, children: "true" }))
              );
            }
          });
          setApps(result);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  const getConnections = () => {
    constructorObjectService
      .getList("connections", { data: { client_type_id: typeId } })
      .then((res) => {
        console.log("222", res);
        setConnections(res?.data?.response || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const computedRelations = useMemo(() => {
    return relations?.map((el) => ({
      label: el?.label,
      value: el?.slug,
    }));
  }, [relations]);

  useEffect(() => {
    setIsCustomVisible(false);
    setAutomaticFilters([]);
  }, [tableSlug]);

  const computedCustomFields = useMemo(() => {
    const data = [
      {
        view_label: "User ID",
        table_slug: "user",
      },
      ...connections,
    ];
    return data?.map((el) => ({
      label: el?.view_label,
      value: el?.table_slug + "_id",
    }));
  }, [connections]);

  useEffect(() => {
    if (!appId) {
      setApps(roles);
    } else {
      getAppChildren(appId);
    }
  }, [appId]);

  useEffect(() => {
    getRecordPermissions();
    getRoleById();
    getApps();
    getConnections();
  }, []);

  return (
    <div>
      <HeaderSettings
        title="Роли"
        backButtonLink={`/settings/auth/matrix_v2`}
      />
      <div style={{ margin: "8px" }}>
        <FormCard title="Инфо" icon="address-card.svg" maxWidth="100%">
          <FRow label="Название">
            <HFTextField name="name" control={roleForm.control} fullWidth />
          </FRow>
        </FormCard>

        <div style={{ marginTop: "10px" }}>
          <CTable removableHeight={null} disablePagination>
            <CTableHead>
              <CTableRow>
                <CTableHeadCell>Объекты</CTableHeadCell>
                <CTableHeadCell style={{ padding: 0 }} colSpan={4}>
                  <div
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "8px 16px",
                    }}
                  >
                    <div>Record permissions</div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
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
                            setApps(roles);
                            setAppId((prev) => (prev === app.id ? "" : app.id));
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
                      e.stopPropagation();
                      setTableSlug((prev) =>
                        prev === app.slug
                          ? ""
                          : app.slug
                          ? app.slug + "read"
                          : ""
                      );
                      console.log("Read");
                    }}
                    style={{ position: "relative" }}
                  >
                    {!app?.children ? (
                      <CrossPeson />
                    ) : recordPermissions?.find(
                        (item) => item?.table_slug === app?.slug
                      )?.read === "Yes" ? (
                      <TwoUserIcon />
                    ) : recordPermissions?.find(
                        (item) => item?.table_slug === app?.slug
                      )?.read === "No" ? (
                      <CrossPeson />
                    ) : (
                      <HFIconPicker
                        name=""
                        value={
                          connections?.filter(
                            (connection) =>
                              connection?.name ===
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              )?.read
                          )[0]?.icon
                        }
                        control={roleForm.control}
                        shape="rectangle"
                        onChange={(e) => {
                          roleForm.setValue("icon", e);
                          setConnections({
                            ...connections,
                            icon: e,
                          });
                        }}
                      />
                    )}
                    {tableSlug === app?.slug + "read" ? (
                      <>
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
                              e.stopPropagation();
                              handleRecordPermission(
                                recordPermissions?.find(
                                  (item) => item?.table_slug === app?.slug
                                ),
                                "read",
                                "Yes",
                                app?.slug
                              );
                            }}
                          >
                            <TwoUserIcon />
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRecordPermission(
                                recordPermissions?.find(
                                  (item) => item?.table_slug === app?.slug
                                ),
                                "read",
                                "No",
                                app?.slug
                              );
                            }}
                          >
                            <CrossPeson />
                          </span>
                          {connections?.map((connection) => (
                            <HFIconPicker
                              name=""
                              value={connection?.icon}
                              control={roleForm.control}
                              customeClick={true}
                              clickItself={() => {
                                handleRecordPermission(
                                  recordPermissions?.find(
                                    (item) => item?.table_slug === app?.slug
                                  ),
                                  "read",
                                  connection?.name,
                                  app?.slug
                                );
                              }}
                              shape="rectangle"
                              onChange={(e) => {
                                roleForm.setValue("icon", e);
                                setConnections({
                                  ...connections,
                                  icon: e,
                                });
                              }}
                            />
                          ))}
                        </div>
                        {isCustomVisible && (
                          <div
                            style={{
                              backgroundColor: "white",
                              border: "1px solid #eee",
                              padding: "12px 16px",
                              borderRadius: "6px",
                              position: "absolute",
                              top: "120px",
                              left: "60px",
                              zIndex: "2",
                              minWidth: "400px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                // alignItems: "center",
                                gap: "8px",
                                borderBottom: "1px solid #ccc",
                                paddingBottom: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <FRow
                                  style={{ marginBottom: 0 }}
                                  label="Поля объекта:"
                                />
                                <FRow
                                  style={{ marginBottom: 0 }}
                                  label="Пользовательские поля:
"
                                />
                              </div>

                              {automaticFilters?.map((auto) => (
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <HFTextField
                                    name=""
                                    value={auto?.object_field}
                                    // disabled={isEdit !== item?.guid}
                                    disabled={true}
                                    control={autoFilterForm.control}
                                    fullWidth
                                  />
                                  <HFTextField
                                    name=""
                                    value={auto?.custom_field}
                                    // disabled={isEdit !== item?.guid}
                                    disabled={true}
                                    control={autoFilterForm.control}
                                    fullWidth
                                  />
                                </div>
                              ))}
                            </div>
                            {creatingAutoFilter && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  paddingBottom: "8px",
                                }}
                              >
                                {/* <FRow label="Поля объекта"> */}
                                <HFSelect
                                  options={computedRelations}
                                  control={autoFilterForm.control}
                                  // onChange={(e) => {
                                  //   console.log("e", e);
                                  // }}
                                  // value={auto?.object_field}
                                  name="object_field"
                                  required
                                />
                                {/* </FRow> */}
                                {/* <FRow label="Пользовательские поля"> */}
                                <HFSelect
                                  options={computedCustomFields}
                                  control={autoFilterForm.control}
                                  // onChange={(e) => {
                                  //   getFields({ table_id: e })
                                  //   connectionForm.setValue("table_slug", e)
                                  // }}
                                  // value={auto?.custom_field}
                                  name="custom_field"
                                  required
                                />
                                {/* </FRow> */}
                              </div>
                            )}
                            <div style={{ display: "flex", gap: "8px" }}>
                              {creatingAutoFilter ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCreatingAutoFilter(false);
                                      autoFilterForm.reset("object_field", "");
                                      autoFilterForm.reset("custom_field", "");
                                    }}
                                    style={{
                                      flexGrow: 1,
                                      cursor: "pointer",
                                      padding: "8px",
                                      border: "1px solid #e0e0e0",
                                      backgroundColor: "inherit",
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // setCreatingAutoFilter(
                                      //   !creatingAutoFilter
                                      // );
                                      console.log("create");
                                      handleAutoFilter();
                                    }}
                                    style={{
                                      flexGrow: 1,
                                      cursor: "pointer",
                                      padding: "8px",
                                      border: "1px solid #e0e0e0",
                                      backgroundColor: "#0067F4",
                                      color: "white",
                                    }}
                                  >
                                    Create
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCreatingAutoFilter(true);
                                  }}
                                  style={{
                                    flexGrow: 1,
                                    cursor: "pointer",
                                    padding: "8px",
                                    border: "1px solid #e0e0e0",
                                    backgroundColor: "inherit",
                                  }}
                                >
                                  Добавить новое условия
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : null}
                  </CTableCell>
                  <CTableCell
                    align="center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTableSlug((prev) =>
                        prev === app.slug
                          ? ""
                          : app.slug
                          ? app.slug + "write"
                          : ""
                      );
                      console.log("Write");
                    }}
                    style={{ position: "relative" }}
                  >
                    {!app?.children ? (
                      <CrossPeson />
                    ) : recordPermissions?.find(
                        (item) => item?.table_slug === app?.slug
                      )?.write === "Yes" ? (
                      <TwoUserIcon />
                    ) : recordPermissions?.find(
                        (item) => item?.table_slug === app?.slug
                      )?.write === "No" ? (
                      <CrossPeson />
                    ) : (
                      <HFIconPicker
                        name=""
                        value={
                          connections?.filter(
                            (connection) =>
                              connection?.name ===
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              )?.write
                          )[0]?.icon
                        }
                        control={roleForm.control}
                        shape="rectangle"
                        onChange={(e) => {
                          roleForm.setValue("icon", e);
                          setConnections({
                            ...connections,
                            icon: e,
                          });
                        }}
                      />
                    )}
                    {tableSlug === app?.slug + "write" ? (
                      <>
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
                              e.stopPropagation();
                              handleRecordPermission(
                                recordPermissions?.find(
                                  (item) => item?.table_slug === app?.slug
                                ),
                                "write",
                                "Yes",
                                app?.slug
                              );
                            }}
                          >
                            <TwoUserIcon />
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRecordPermission(
                                recordPermissions?.find(
                                  (item) => item?.table_slug === app?.slug
                                ),
                                "write",
                                "No",
                                app?.slug
                              );
                            }}
                          >
                            <CrossPeson />
                          </span>
                          {connections?.map((connection) => (
                            <HFIconPicker
                              name=""
                              value={connection?.icon}
                              control={roleForm.control}
                              customeClick={true}
                              clickItself={() => {
                                handleRecordPermission(
                                  recordPermissions?.find(
                                    (item) => item?.table_slug === app?.slug
                                  ),
                                  "write",
                                  connection?.name,
                                  app?.slug
                                );
                              }}
                              shape="rectangle"
                              onChange={(e) => {
                                roleForm.setValue("icon", e);
                                setConnections({
                                  ...connections,
                                  icon: e,
                                });
                              }}
                            />
                          ))}
                        </div>
                        {isCustomVisible && (
                          <div
                            style={{
                              backgroundColor: "white",
                              border: "1px solid #eee",
                              padding: "12px 16px",
                              borderRadius: "6px",
                              position: "absolute",
                              top: "120px",
                              left: "60px",
                              zIndex: "2",
                              minWidth: "400px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                // alignItems: "center",
                                gap: "8px",
                                borderBottom: "1px solid #ccc",
                                paddingBottom: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <FRow
                                  style={{ marginBottom: 0 }}
                                  label="Поля объекта:"
                                />
                                <FRow
                                  style={{ marginBottom: 0 }}
                                  label="Пользовательские поля:
"
                                />
                              </div>

                              {automaticFilters?.map((auto) => (
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <HFTextField
                                    name=""
                                    value={auto?.object_field}
                                    // disabled={isEdit !== item?.guid}
                                    disabled={true}
                                    control={autoFilterForm.control}
                                    fullWidth
                                  />
                                  <HFTextField
                                    name=""
                                    value={auto?.custom_field}
                                    // disabled={isEdit !== item?.guid}
                                    disabled={true}
                                    control={autoFilterForm.control}
                                    fullWidth
                                  />
                                </div>
                              ))}
                            </div>
                            {creatingAutoFilter && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  paddingBottom: "8px",
                                }}
                              >
                                {/* <FRow label="Поля объекта"> */}
                                <HFSelect
                                  options={computedRelations}
                                  control={autoFilterForm.control}
                                  // onChange={(e) => {
                                  //   console.log("e", e);
                                  // }}
                                  // value={auto?.object_field}
                                  name="object_field"
                                  required
                                />
                                {/* </FRow> */}
                                {/* <FRow label="Пользовательские поля"> */}
                                <HFSelect
                                  options={computedCustomFields}
                                  control={autoFilterForm.control}
                                  // onChange={(e) => {
                                  //   getFields({ table_id: e })
                                  //   connectionForm.setValue("table_slug", e)
                                  // }}
                                  // value={auto?.custom_field}
                                  name="custom_field"
                                  required
                                />
                                {/* </FRow> */}
                              </div>
                            )}
                            <div style={{ display: "flex", gap: "8px" }}>
                              {creatingAutoFilter ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCreatingAutoFilter(false);
                                      autoFilterForm.reset("object_field", "");
                                      autoFilterForm.reset("custom_field", "");
                                    }}
                                    style={{
                                      flexGrow: 1,
                                      cursor: "pointer",
                                      padding: "8px",
                                      border: "1px solid #e0e0e0",
                                      backgroundColor: "inherit",
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // setCreatingAutoFilter(
                                      //   !creatingAutoFilter
                                      // );
                                      console.log("create");
                                      handleAutoFilter();
                                    }}
                                    style={{
                                      flexGrow: 1,
                                      cursor: "pointer",
                                      padding: "8px",
                                      border: "1px solid #e0e0e0",
                                      backgroundColor: "#0067F4",
                                      color: "white",
                                    }}
                                  >
                                    Create
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCreatingAutoFilter(true);
                                  }}
                                  style={{
                                    flexGrow: 1,
                                    cursor: "pointer",
                                    padding: "8px",
                                    border: "1px solid #e0e0e0",
                                    backgroundColor: "inherit",
                                  }}
                                >
                                  Добавить новое условия
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : null}
                  </CTableCell>
                  <CTableCell
                    align="center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTableSlug((prev) =>
                        prev === app.slug
                          ? ""
                          : app.slug
                          ? app.slug + "update"
                          : ""
                      );
                      console.log("Update");
                    }}
                    style={{ position: "relative" }}
                  >
                    {!app?.children ? (
                      <CrossPeson />
                    ) : recordPermissions?.find(
                        (item) => item?.table_slug === app?.slug
                      )?.update === "Yes" ? (
                      <TwoUserIcon />
                    ) : recordPermissions?.find(
                        (item) => item?.table_slug === app?.slug
                      )?.update === "No" ? (
                      <CrossPeson />
                    ) : (
                      <HFIconPicker
                        name=""
                        value={
                          connections?.filter(
                            (connection) =>
                              connection?.name ===
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              )?.update
                          )[0]?.icon
                        }
                        control={roleForm.control}
                        shape="rectangle"
                        onChange={(e) => {
                          roleForm.setValue("icon", e);
                          setConnections({
                            ...connections,
                            icon: e,
                          });
                        }}
                      />
                    )}
                    {tableSlug === app?.slug + "update" ? (
                      <>
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
                              e.stopPropagation();
                              handleRecordPermission(
                                recordPermissions?.find(
                                  (item) => item?.table_slug === app?.slug
                                ),
                                "update",
                                "Yes",
                                app?.slug
                              );
                            }}
                          >
                            <TwoUserIcon />
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRecordPermission(
                                recordPermissions?.find(
                                  (item) => item?.table_slug === app?.slug
                                ),
                                "update",
                                "No",
                                app?.slug
                              );
                            }}
                          >
                            <CrossPeson />
                          </span>
                          {connections?.map((connection) => (
                            <HFIconPicker
                              name=""
                              value={connection?.icon}
                              control={roleForm.control}
                              customeClick={true}
                              clickItself={() => {
                                handleRecordPermission(
                                  recordPermissions?.find(
                                    (item) => item?.table_slug === app?.slug
                                  ),
                                  "update",
                                  connection?.name,
                                  app?.slug
                                );
                              }}
                              shape="rectangle"
                              onChange={(e) => {
                                roleForm.setValue("icon", e);
                                setConnections({
                                  ...connections,
                                  icon: e,
                                });
                              }}
                            />
                          ))}
                        </div>
                        {isCustomVisible && (
                          <div
                            style={{
                              backgroundColor: "white",
                              border: "1px solid #eee",
                              padding: "12px 16px",
                              borderRadius: "6px",
                              position: "absolute",
                              top: "120px",
                              left: "60px",
                              zIndex: "2",
                              minWidth: "400px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                // alignItems: "center",
                                gap: "8px",
                                borderBottom: "1px solid #ccc",
                                paddingBottom: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <FRow
                                  style={{ marginBottom: 0 }}
                                  label="Поля объекта:"
                                />
                                <FRow
                                  style={{ marginBottom: 0 }}
                                  label="Пользовательские поля:
"
                                />
                              </div>

                              {automaticFilters?.map((auto) => (
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <HFTextField
                                    name=""
                                    value={auto?.object_field}
                                    // disabled={isEdit !== item?.guid}
                                    disabled={true}
                                    control={autoFilterForm.control}
                                    fullWidth
                                  />
                                  <HFTextField
                                    name=""
                                    value={auto?.custom_field}
                                    // disabled={isEdit !== item?.guid}
                                    disabled={true}
                                    control={autoFilterForm.control}
                                    fullWidth
                                  />
                                </div>
                              ))}
                            </div>
                            {creatingAutoFilter && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  paddingBottom: "8px",
                                }}
                              >
                                {/* <FRow label="Поля объекта"> */}
                                <HFSelect
                                  options={computedRelations}
                                  control={autoFilterForm.control}
                                  // onChange={(e) => {
                                  //   console.log("e", e);
                                  // }}
                                  // value={auto?.object_field}
                                  name="object_field"
                                  required
                                />
                                {/* </FRow> */}
                                {/* <FRow label="Пользовательские поля"> */}
                                <HFSelect
                                  options={computedCustomFields}
                                  control={autoFilterForm.control}
                                  // onChange={(e) => {
                                  //   getFields({ table_id: e })
                                  //   connectionForm.setValue("table_slug", e)
                                  // }}
                                  // value={auto?.custom_field}
                                  name="custom_field"
                                  required
                                />
                                {/* </FRow> */}
                              </div>
                            )}
                            <div style={{ display: "flex", gap: "8px" }}>
                              {creatingAutoFilter ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCreatingAutoFilter(false);
                                      autoFilterForm.reset("object_field", "");
                                      autoFilterForm.reset("custom_field", "");
                                    }}
                                    style={{
                                      flexGrow: 1,
                                      cursor: "pointer",
                                      padding: "8px",
                                      border: "1px solid #e0e0e0",
                                      backgroundColor: "inherit",
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // setCreatingAutoFilter(
                                      //   !creatingAutoFilter
                                      // );
                                      console.log("create");
                                      handleAutoFilter();
                                    }}
                                    style={{
                                      flexGrow: 1,
                                      cursor: "pointer",
                                      padding: "8px",
                                      border: "1px solid #e0e0e0",
                                      backgroundColor: "#0067F4",
                                      color: "white",
                                    }}
                                  >
                                    Create
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCreatingAutoFilter(true);
                                  }}
                                  style={{
                                    flexGrow: 1,
                                    cursor: "pointer",
                                    padding: "8px",
                                    border: "1px solid #e0e0e0",
                                    backgroundColor: "inherit",
                                  }}
                                >
                                  Добавить новое условия
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : null}
                  </CTableCell>
                  <CTableCell
                    align="center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTableSlug((prev) =>
                        prev === app.slug
                          ? ""
                          : app.slug
                          ? app.slug + "delete"
                          : ""
                      );
                      console.log("Delete");
                    }}
                    style={{ position: "relative" }}
                  >
                    {!app?.children ? (
                      <CrossPeson />
                    ) : recordPermissions?.find(
                        (item) => item?.table_slug === app?.slug
                      )?.delete === "Yes" ? (
                      <TwoUserIcon />
                    ) : recordPermissions?.find(
                        (item) => item?.table_slug === app?.slug
                      )?.delete === "No" ? (
                      <CrossPeson />
                    ) : (
                      <HFIconPicker
                        name=""
                        value={
                          connections?.filter(
                            (connection) =>
                              connection?.name ===
                              recordPermissions?.find(
                                (item) => item?.table_slug === app?.slug
                              )?.delete
                          )[0]?.icon
                        }
                        control={roleForm.control}
                        shape="rectangle"
                        onChange={(e) => {
                          roleForm.setValue("icon", e);
                          setConnections({
                            ...connections,
                            icon: e,
                          });
                        }}
                      />
                    )}
                    {tableSlug === app?.slug + "delete" ? (
                      <>
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
                              e.stopPropagation();
                              handleRecordPermission(
                                recordPermissions?.find(
                                  (item) => item?.table_slug === app?.slug
                                ),
                                "delete",
                                "Yes",
                                app?.slug
                              );
                            }}
                          >
                            <TwoUserIcon />
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRecordPermission(
                                recordPermissions?.find(
                                  (item) => item?.table_slug === app?.slug
                                ),
                                "delete",
                                "No",
                                app?.slug
                              );
                            }}
                          >
                            <CrossPeson />
                          </span>
                          {connections?.map((connection) => (
                            <HFIconPicker
                              name=""
                              value={connection?.icon}
                              control={roleForm.control}
                              customeClick={true}
                              clickItself={() => {
                                handleRecordPermission(
                                  recordPermissions?.find(
                                    (item) => item?.table_slug === app?.slug
                                  ),
                                  "delete",
                                  connection?.name,
                                  app?.slug
                                );
                              }}
                              shape="rectangle"
                              onChange={(e) => {
                                roleForm.setValue("icon", e);
                                setConnections({
                                  ...connections,
                                  icon: e,
                                });
                              }}
                            />
                          ))}
                        </div>
                        {isCustomVisible && (
                          <div
                            style={{
                              backgroundColor: "white",
                              border: "1px solid #eee",
                              padding: "12px 16px",
                              borderRadius: "6px",
                              position: "absolute",
                              top: "120px",
                              left: "60px",
                              zIndex: "2",
                              minWidth: "400px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                // alignItems: "center",
                                gap: "8px",
                                borderBottom: "1px solid #ccc",
                                paddingBottom: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <FRow
                                  style={{ marginBottom: 0 }}
                                  label="Поля объекта:"
                                />
                                <FRow
                                  style={{ marginBottom: 0 }}
                                  label="Пользовательские поля:
"
                                />
                              </div>

                              {automaticFilters?.map((auto) => (
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <HFTextField
                                    name=""
                                    value={auto?.object_field}
                                    // disabled={isEdit !== item?.guid}
                                    disabled={true}
                                    control={autoFilterForm.control}
                                    fullWidth
                                  />
                                  <HFTextField
                                    name=""
                                    value={auto?.custom_field}
                                    // disabled={isEdit !== item?.guid}
                                    disabled={true}
                                    control={autoFilterForm.control}
                                    fullWidth
                                  />
                                </div>
                              ))}
                            </div>
                            {creatingAutoFilter && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  paddingBottom: "8px",
                                }}
                              >
                                {/* <FRow label="Поля объекта"> */}
                                <HFSelect
                                  options={computedRelations}
                                  control={autoFilterForm.control}
                                  // onChange={(e) => {
                                  //   console.log("e", e);
                                  // }}
                                  // value={auto?.object_field}
                                  name="object_field"
                                  required
                                />
                                {/* </FRow> */}
                                {/* <FRow label="Пользовательские поля"> */}
                                <HFSelect
                                  options={computedCustomFields}
                                  control={autoFilterForm.control}
                                  // onChange={(e) => {
                                  //   getFields({ table_id: e })
                                  //   connectionForm.setValue("table_slug", e)
                                  // }}
                                  // value={auto?.custom_field}
                                  name="custom_field"
                                  required
                                />
                                {/* </FRow> */}
                              </div>
                            )}
                            <div style={{ display: "flex", gap: "8px" }}>
                              {creatingAutoFilter ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCreatingAutoFilter(false);
                                      autoFilterForm.reset("object_field", "");
                                      autoFilterForm.reset("custom_field", "");
                                    }}
                                    style={{
                                      flexGrow: 1,
                                      cursor: "pointer",
                                      padding: "8px",
                                      border: "1px solid #e0e0e0",
                                      backgroundColor: "inherit",
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // setCreatingAutoFilter(
                                      //   !creatingAutoFilter
                                      // );
                                      console.log("create");
                                      handleAutoFilter();
                                    }}
                                    style={{
                                      flexGrow: 1,
                                      cursor: "pointer",
                                      padding: "8px",
                                      border: "1px solid #e0e0e0",
                                      backgroundColor: "#0067F4",
                                      color: "white",
                                    }}
                                  >
                                    Create
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCreatingAutoFilter(true);
                                  }}
                                  style={{
                                    flexGrow: 1,
                                    cursor: "pointer",
                                    padding: "8px",
                                    border: "1px solid #e0e0e0",
                                    backgroundColor: "inherit",
                                  }}
                                >
                                  Добавить новое условия
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : null}
                  </CTableCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </div>
    </div>
  );
};

export default MatrixRolePage;
