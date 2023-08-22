import { AccountCircle, Lock } from "@mui/icons-material";
import { Button, Dialog, InputAdornment } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import { firebaseCloudMessaging } from "../../../firebase/config";
import authService from "../../../services/auth/authService";
import clientTypeServiceV2 from "../../../services/auth/clientTypeServiceV2";
import connectionServiceV2 from "../../../services/auth/connectionService";
import environmentService from "../../../services/environmentService";
import { store } from "../../../store";
import { showAlert } from "../../../store/alert/alert.thunk";
import { loginAction } from "../../../store/auth/auth.thunk";
import { companyActions } from "../../../store/company/company.slice";
import listToOptions from "../../../utils/listToOptions";
import classes from "../style.module.scss";
import DynamicFields from "./DynamicFields";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import RecoverPassword from "./RecoverPassword";
import { useRoleListQuery } from "../../../services/roleServiceV2";
import RegisterFormPage from "./RegisterFormPage";

const LoginForm = ({ setIndex, index, setFormType, formType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setValue("username", "");
    setValue("password", "");
  };

  useEffect(() => {
    getFcmToken();
  }, []);

  const getFcmToken = async () => {
    const token = await firebaseCloudMessaging.init();
    localStorage.setItem("fcmToken", token);
  };

  const { control, handleSubmit, watch, setValue, reset, getValues } =
    useForm();

  const selectedCompanyID = watch("company_id");
  const selectedProjectID = watch("project_id");
  const selectedClientTypeID = watch("client_type");
  const selectedEnvID = watch("environment_id");
  const getFormValue = getValues();

  const computedCompanies = useMemo(() => {
    return listToOptions(companies, "name");
  }, [companies]);

  const computedProjects = useMemo(() => {
    const company = companies?.find(
      (company) => company.id === selectedCompanyID
    );
    return listToOptions(company?.projects, "name");
  }, [companies, selectedCompanyID]);

  const { data: computedEnvironments } = useQuery(
    ["GET_ENVIRONMENT_LIST", { "project-id": selectedProjectID }],
    () => {
      return environmentService.getList({ "project-id": selectedProjectID });
    },
    {
      enabled: !!selectedProjectID,
      select: (res) =>
        res.data?.map((row) => ({
          label: row.name,
          value: row.environment_id,
        })),
    }
  );

  const { data: computedRoles } = useRoleListQuery({
    headers: { "environment-id": selectedEnvID },
    params: {
      "client-type-id": selectedClientTypeID,
      "project-id": selectedProjectID,
    },
    queryParams: {
      enabled: !!selectedClientTypeID,
      select: (res) => {
        return res?.data?.response?.map((row) => ({
          label: row.name,
          value: row.guid,
        }));
      },
    },
  });

  const { data: computedClientTypes = [] } = useQuery(
    [
      "GET_CLIENT_TYPE_LIST",
      { "project-id": selectedProjectID },
      { "environment-id": selectedEnvID },
    ],
    () => {
      return clientTypeServiceV2.getList(
        { "project-id": selectedProjectID },
        { "environment-id": selectedEnvID }
      );
    },
    {
      enabled: !!selectedEnvID,
      select: (res) =>
        res.data.response?.map((row) => ({
          label: row.name,
          value: row.guid,
        })),
    }
  );

  const { data: computedConnections = [] } = useQuery(
    [
      "GET_CONNECTION_LIST",
      { "project-id": selectedProjectID },
      { "environment-id": selectedEnvID },
    ],
    () => {
      return connectionServiceV2.getList(
        {
          "project-id": selectedProjectID,
          client_type_id: selectedClientTypeID,
        },
        { "environment-id": selectedEnvID }
      );
    },
    {
      enabled: !!selectedClientTypeID,

      select: (res) => res.data.response ?? [],
    }
  );

  useEffect(() => {
    if (computedCompanies?.length === 1) {
      setValue("company_id", computedCompanies[0]?.value);
    }
  }, [computedCompanies]);

  useEffect(() => {
    if (computedProjects?.length === 1) {
      setValue("project_id", computedProjects[0]?.value);
    }
  }, [computedProjects]);

  useEffect(() => {
    if (computedEnvironments?.length === 1) {
      setValue("environment_id", computedEnvironments[0]?.value);
    }
  }, [computedEnvironments]);
  useEffect(() => {
    if (computedRoles?.length === 1) {
      setValue("role_id", computedRoles[0]?.value);
    }
  }, [computedRoles]);

  useEffect(() => {
    if (computedClientTypes?.length === 1) {
      setValue("client_type", computedClientTypes[0]?.value);
    }
  }, [computedClientTypes]);

  useEffect(() => {
    getFcmToken();
    reset();
  }, [index]);

  const multiCompanyLogin = (data) => {
    setLoading(true);
    authService
      .multiCompanyLogin(data)
      .then((res) => {
        setCompanies(res.companies);
        dispatch(companyActions.setCompanies(res.companies));
      })
      .catch(() => setLoading(false));
  };

  const register = (data) => {
    setLoading(true);

    authService
      .register(data)
      .then((res) => {
        setIndex(0);
        store.dispatch(showAlert("Успешно", "success"));
      })
      .catch(() => setLoading(false));
  };

  const onSubmit = (values) => {
    setLoading(true);
    if (formType === "LOGIN" && index === 0) multiCompanyLogin(values);
    else if (index === 1) register(values);
    else dispatch(loginAction(values)).then(() => console.log(""));
  };

  const onSubmitDialog = (values) => {
    setLoading(true);
    multiCompanyLogin(values);
    dispatch(loginAction(values)).then(() => console.log(""));
  };

  useEffect(() => {
    let handleClickTimeout;

    const formValues =
      selectedClientTypeID &&
      selectedCompanyID &&
      selectedEnvID &&
      selectedProjectID &&
      getFormValue?.username &&
      getFormValue?.password;

    const hasValidCredentials =
      getFormValue?.password && getFormValue?.username && !formValues;

    if (formValues && !open) {
      clearTimeout(handleClickTimeout);
      onSubmitDialog(getFormValue);
    } else if (hasValidCredentials && formType !== "register") {
      handleClickTimeout = setTimeout(() => {
        handleClickOpen();
      }, 2000);
    }
    return () => {
      clearTimeout(handleClickTimeout);
    };
  }, [
    selectedClientTypeID,
    selectedCompanyID,
    selectedEnvID,
    selectedProjectID,
    getFormValue,
  ]);

  return (
    <>
      {formType === "RESET_PASSWORD" ? (
        <RecoverPassword setFormType={setFormType} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Tabs direction={"ltr"}>
            {formType === "LOGIN" ? (
              <div style={{ padding: "0 20px" }}>
                <TabList>
                  <Tab>{t("login")}</Tab>
                  <Tab>{t("phone")}</Tab>
                  <Tab>{t("E-mail")}</Tab>
                </TabList>

                <div
                  className={classes.formArea}
                  style={{ marginTop: "10px", height: `calc(100vh - 400px)` }}
                >
                  <TabPanel>
                    <div className={classes.formRow}>
                      <p className={classes.label}>{t("login")}</p>
                      <HFTextField
                        required
                        control={control}
                        name="username"
                        size="large"
                        fullWidth
                        placeholder={t("enter.login")}
                        autoFocus
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle style={{ fontSize: "30px" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <div className={classes.formRow}>
                      <p className={classes.label}>{t("password")}</p>
                      <HFTextField
                        required
                        control={control}
                        name="password"
                        type="password"
                        size="large"
                        fullWidth
                        placeholder={t("enter.password")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock style={{ fontSize: "30px" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>

                    {
                      <Button
                        variant="text"
                        type="button"
                        onClick={() => {
                          formType === "RESET_PASSWORD"
                            ? setFormType("LOGIN")
                            : setFormType("RESET_PASSWORD");
                        }}
                      >
                        Forgot password?
                      </Button>
                    }
                  </TabPanel>
                </div>
              </div>
            ) : (
              <RegisterFormPage setFormType={setFormType} formType={formType} />
            )}
          </Tabs>
          {formType !== "register" && (
            <>
              <div className={classes.buttonsArea}>
                <PrimaryButton size="large" loader={loading}>
                  {t("enter")}
                </PrimaryButton>
              </div>
              <div className={classes.buttonsArea}>
                <PrimaryButton
                  onClick={() => setFormType("register")}
                  size="large"
                  type="button"
                  loader={true}
                  className={`${
                    formType === "register"
                      ? classes.registerBtnPage
                      : classes.registerBtn
                  }`}
                >
                  {t("Зарегистрироваться")}
                </PrimaryButton>
              </div>
            </>
          )}
        </form>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          style={{
            padding: "0 20px",
            width: "500px",
            height: `calc(100vh - 150px)`,
          }}
        >
          <h2 className={classes.headerContent}>Multi Company</h2>
          <div className={classes.formArea}>
            <div className={classes.formRow}>
              <p className={classes.label}>{t("company")}</p>
              <HFSelect
                required
                control={control}
                name="company_id"
                size="large"
                fullWidth
                placeholder={t("enter.company")}
                options={computedCompanies}
              />
            </div>
            <div className={classes.formRow}>
              <p className={classes.label}>{t("project")}</p>
              <HFSelect
                required
                control={control}
                name="project_id"
                size="large"
                placeholder={t("enter.project")}
                options={computedProjects}
              />
            </div>
            <div className={classes.formRow}>
              <p className={classes.label}>{t("environment")}</p>
              <HFSelect
                required
                control={control}
                name="environment_id"
                size="large"
                placeholder={t("select.environment")}
                options={computedEnvironments}
              />
            </div>
            <div className={classes.formRow}>
              <p className={classes.label}>{t("client_type")}</p>
              <HFSelect
                required
                control={control}
                name="client_type"
                size="large"
                placeholder={t("enter.client_type")}
                options={computedClientTypes}
              />
            </div>
            {computedConnections.length
              ? computedConnections?.map((connection, idx) => (
                  <DynamicFields
                    key={connection?.guid}
                    table={computedConnections}
                    connection={connection}
                    index={idx}
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    companies={companies}
                  />
                ))
              : null}
          </div>
          <div className={classes.footerContent}>
            <Button
              sx={{ marginRight: "10px" }}
              variant="contained"
              color="error"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <div className={classes.buttonsArea}>
              <PrimaryButton
                onClick={handleSubmit(onSubmitDialog)}
                size="small"
                loader={loading}
              >
                {t("enter")}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Dialog>

      {formType === "RESET_PASSWORD" && (
        <SecondaryButton
          size="large"
          style={{ marginTop: "20px" }}
          type="button"
          onClick={() => {
            formType === "RESET_PASSWORD"
              ? setFormType("LOGIN")
              : setFormType("RESET_PASSWORD");
          }}
        >
          Back to login
        </SecondaryButton>
      )}
    </>
  );
};

export default LoginForm;
