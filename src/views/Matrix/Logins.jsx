import { Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { EditIcon, FilterIcon, PlusIcon } from "../../assets/icons/icon";
import FormCard from "../../components/FormCard";
import HFSelect from "../../components/FormElements/HFSelect";
import HFTextField from "../../components/FormElements/HFTextField";
import constructorObjectService from "../../services/constructorObjectService";
import styles from "./styles.module.scss";

const Logins = ({ tables, fields, clientType, getFields = () => {} }) => {
  const { typeId, platformId } = useParams();
  const [isCreating, setIsCreating] = useState(false);
  const [logins, setLogins] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClient, setSelectedClient] = useState({});
  const loginOptions = [
    {
      value: "Login with password",
      label: "Login with Password",
      translation: "Логин с паролем",
    },
    {
      value: "Phone OTP",
      label: "Phone OTP",
      translation: "Логин с тел. номером",
    },
    {
      value: "Email OTP",
      label: "Email OTP",
      translation: "Логин с e-mail",
    },
  ];

  const getLogins = () => {
    constructorObjectService
      .getList("login_table", {
        data: {
          client_type_id: typeId,
        },
      })
      .then((res) => {
        setLogins(res?.data?.response || []);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleSubmit = (type) => {
    const data = {
      client_platform_id: platformId,
      client_type_id: clientType?.guid,
      project_id: clientType?.project_id,
      login_strategy: loginForm.getValues().login_strategy,
      object_id: loginForm.getValues().login_table.object_id,
      table_slug: tables.find(
        (item) => item.id === loginForm.getValues().login_table.object_id
      )?.slug,
      view_fields: loginForm.getValues("login_table.view_fields") || [],
      login: loginForm.getValues().login,
      password: loginForm.getValues().password || "",
      guid: loginForm.getValues().guid,
    };
    if (type === "update") {
      constructorObjectService
        .update("login_table", {
          data: {
            ...data,
          },
        })
        .then((res) => {
          getLogins();
          loginForm.reset();
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(() => {
          setIsEditing("");
        });
    } else {
      constructorObjectService
        .create("login_table", {
          data: {
            ...data,
          },
        })
        .then((res) => {
          setIsCreating(false);
          loginForm.reset();
          getLogins();
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  const loginForm = useForm({
    defaultValues: {
      client_platform_id: "",
      client_type_id: "",
      login_strategy: "Login with password",
      guid: "",
      login_table: {
        object_id: "",
        table_slug: "",
        view_fields: [],
      },
      login: "",
      password: "",
      project_id: "",
    },
  });

  const editingClient = (client) => {
    setSelectedClient(client);
    setIsEditing(client?.guid);
    loginForm.setValue("login_strategy", client?.login_strategy);
    loginForm.setValue("login_table.object_id", client?.object_id);
    loginForm.setValue("login_table.table_slug");
    loginForm.setValue("login_table.view_fields", client?.view_fields);
    loginForm.setValue("login", client?.login);
    loginForm.setValue("password", client?.password);
    loginForm.setValue("guid", client?.guid);
    getFields({ table_id: client?.object_id });
  };

  useEffect(() => {
    getLogins();
  }, []);

  const login_strategy = loginForm.watch("login_strategy");

  return (
    <FormCard title="Логин" icon="address-card.svg" maxWidth="100%">
      <div className={styles.login_card}>
        {logins.map((login) => (
          <div className={styles.card_holder} key={login?.guid}>
            <div className={styles.card_header}>
              <div className={styles.card_header_left}>
                <div className={styles.card_header_title}>
                  {/* {login?.login_strategy} */}
                  {isEditing !== login?.guid
                    ? loginOptions.find(
                        (item) => item.value === login?.login_strategy
                      )?.translation
                    : loginOptions.find(
                        (item) => item.value === login_strategy
                      )?.translation}
                </div>
                {isEditing !== login?.guid ? (
                  <>
                    <HFTextField
                      name=""
                      control={loginForm.control}
                      value={login?.login_strategy}
                      fullWidth
                      disabled
                    />
                    <HFTextField
                      name=""
                      control={loginForm.control}
                      value={
                        tables?.find((item) => item.value === login?.object_id)
                          ?.label
                      }
                      fullWidth
                      disabled
                    />
                  </>
                ) : (
                  <>
                    <HFSelect
                      options={loginOptions}
                      control={loginForm.control}
                      name="login_strategy"
                      onChange={(e) => {
                        loginForm.setValue("login_strategy", e);
                      }}
                      required
                    />
                    <HFSelect
                      options={tables}
                      control={loginForm.control}
                      onChange={(e) => {
                        getFields({ table_id: e });
                      }}
                      name="login_table.object_id"
                      required
                    />
                  </>
                )}
              </div>
              {isEditing !== login?.guid ? (
                <div
                  className={styles.card_header_right}
                  onClick={() => {
                    editingClient(login);
                  }}
                >
                  <EditIcon />
                </div>
              ) : (
                <div
                  className={styles.card_header_right}
                  onClick={() => {
                    handleSubmit("update");
                  }}
                >
                  <Save />
                </div>
              )}
            </div>
            <div className={styles.card_body}>
              <div className={styles.card_body_head}>
                <div>
                  Название
                  <FilterIcon />
                </div>
                <div>
                  View field
                  <FilterIcon />
                </div>
              </div>
              <div className={styles.card_body_items}>
                <div>
                  {isEditing !== login?.guid ? (
                    <>
                      <HFTextField
                        name=""
                        control={loginForm.control}
                        value={login?.login}
                        fullWidth
                        disabled
                      />
                      <HFTextField
                        name=""
                        control={loginForm.control}
                        fullWidth
                        value={login?.password}
                        disabled
                      />
                    </>
                  ) : (
                    <>
                      <HFTextField
                        name=""
                        value={selectedClient?.login}
                        onChange={(e) => {
                          setSelectedClient({
                            ...selectedClient,
                            login: e.target.value,
                          });
                          loginForm.setValue("login", e.target.value);
                        }}
                        control={loginForm.control}
                        fullWidth
                      />
                      <HFTextField
                        name=""
                        value={selectedClient?.password}
                        onChange={(e) => {
                          setSelectedClient({
                            ...selectedClient,
                            password: e.target.value,
                          });
                          loginForm.setValue("password", e.target.value);
                        }}
                        control={loginForm.control}
                        fullWidth
                      />
                    </>
                  )}
                </div>
                <div>
                  {isEditing !== login?.guid ? (
                    <>
                      <HFTextField
                        name=""
                        control={loginForm.control}
                        value={login?.view_fields[0]}
                        fullWidth
                        disabled
                      />
                      <HFTextField
                        name=""
                        control={loginForm.control}
                        value={login?.view_fields[1]}
                        fullWidth
                        disabled
                      />
                    </>
                  ) : (
                    <>
                      <HFSelect
                        options={fields}
                        control={loginForm.control}
                        name="login_table.view_fields[0]"
                        onChange={(e) => {
                          loginForm.setValue("login_table.view_fields[0]", e);
                          setSelectedClient({
                            ...selectedClient,
                            view_fields: [e, selectedClient?.view_fields[1]],
                          });
                        }}
                        value={selectedClient?.view_fields[0]}
                        required
                      />
                      <HFSelect
                        options={fields}
                        control={loginForm.control}
                        name="login_table.view_fields[1]"
                        onChange={(e) => {
                          loginForm.setValue("login_table.view_fields[1]", e);
                          setSelectedClient({
                            ...selectedClient,
                            view_fields: [selectedClient?.view_fields[0], e],
                          });
                        }}
                        value={selectedClient?.view_fields[1]}
                        required
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isCreating && (
          <>
            <div className={styles.card_holder}>
              <div className={styles.card_header}>
                <div
                  className={styles.card_header_left}
                  style={{ flexGrow: 1 }}
                >
                  <div className={styles.card_header_title}>
                    {loginOptions.find((item) => item.value === login_strategy)?.translation}
                  </div>
                  <HFSelect
                    options={loginOptions}
                    control={loginForm.control}
                    name="login_strategy"
                    onChange={(e) => {
                      loginForm.setValue("login_strategy", e);
                    }}
                    required
                  />
                  <HFSelect
                    options={tables}
                    control={loginForm.control}
                    onChange={(e) => {
                      getFields({ table_id: e });
                    }}
                    name="login_table.object_id"
                    required
                  />
                </div>
              </div>
              <div className={styles.card_body}>
                <div className={styles.card_body_head}>
                  <div>
                    Название
                    <FilterIcon />
                  </div>
                  <div>
                    View field
                    <FilterIcon />
                  </div>
                </div>
                <div className={styles.card_body_items}>
                  <div>
                    <HFTextField
                      name="login"
                      onChange={(e) => {
                        loginForm.setValue("login", e.target.value);
                      }}
                      control={loginForm.control}
                      fullWidth
                    />
                    <HFTextField
                      name="password"
                      onChange={(e) => {
                        loginForm.setValue("password", e.target.value);
                      }}
                      control={loginForm.control}
                      fullWidth
                    />
                  </div>
                  <div>
                    <HFSelect
                      options={fields}
                      control={loginForm.control}
                      name="login_table.view_fields[0]"
                      value={loginForm.getValues().login_table.view_fields[0]}
                      onChange={(e) => {
                        loginForm.setValue("login_table.view_fields[0]", e);
                      }}
                      required
                    />
                    <HFSelect
                      options={fields}
                      control={loginForm.control}
                      value={loginForm.getValues().login_table.view_fields[1]}
                      name="login_table.view_fields[1]"
                      onChange={(e) => {
                        loginForm.setValue("login_table.view_fields[1]", e);
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.cancel_btn}
                  onClick={() => {
                    // handleClose()
                    setIsCreating(false);
                    loginForm.reset();
                  }}
                >
                  Cancel
                </button>
                <button
                  className={styles.craete_btn}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </>
        )}

        <div>
          <button
            className={styles.add_login_btn}
            onClick={() => {
              setIsCreating(true);
              // setIsEditing(false)
            }}
          >
            <PlusIcon />
            Добавить
          </button>
        </div>
      </div>
    </FormCard>
  );
};

export default Logins;
