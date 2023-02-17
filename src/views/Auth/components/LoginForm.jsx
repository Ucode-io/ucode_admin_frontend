import { AccountCircle, Lock } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { useMemo } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import authService from "../../../services/auth/authService";
import clientTypeServiceV2 from "../../../services/auth/clientTypeServiceV2";
import connectionServiceV2 from "../../../services/auth/connectionService";
import environmentService from "../../../services/environmentService";
import { loginAction } from "../../../store/auth/auth.thunk";
import listToOptions from "../../../utils/listToOptions";
import classes from "../style.module.scss";
import DynamicFields from "./DynamicFields";

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const [formType, setFormType] = useState("LOGIN");
  const { control, handleSubmit, watch, setValue } = useForm();

  const selectedCompanyID = watch("company_id");
  const selectedProjectID = watch("project_id");
  const selectedClientTypeID = watch("client_type");
  const selectedEnvID = watch("environment_id");

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

  const { data: computedClientTypes = [] } = useQuery(
    [
      "GET_CLIENT_TYPE_LIST",
      { project_id: selectedProjectID },
      { "environment-id": selectedEnvID },
    ],
    () => {
      return clientTypeServiceV2.getList(
        { project_id: selectedProjectID },
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
      { project_id: selectedProjectID },
      { "environment-id": selectedEnvID },
    ],
    () => {
      return connectionServiceV2.getList(
        { project_id: selectedProjectID },
        { "environment-id": selectedEnvID },
        { client_type_id: selectedClientTypeID }
      );
    },
    {
      enabled: !!selectedClientTypeID,
      select: (res) => res.data.response ?? [],
    }
  );
  const multiCompanyLogin = (data) => {
    setLoading(true);

    authService
      .multiCompanyLogin(data)
      .then((res) => {
        setLoading(false);

        setCompanies(res.companies);
        setFormType("MULTI_COMPANY");
      })
      .catch(() => setLoading(false));
  };

  const onSubmit = (values) => {
    setLoading(true);
    if (formType === "LOGIN") multiCompanyLogin(values);
    else dispatch(loginAction(values)).then(() => setLoading(false));
  };

  return (
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
              style={{ marginTop: "10px", height: `calc(100vh - 370px)` }}
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
              </TabPanel>
            </div>
          </div>
        ) : (
          <div style={{ padding: "0 20px" }}>
            <div
              className={classes.formArea}
              style={{ marginTop: "10px", height: `calc(100vh - 350px)` }}
            >
              <div className={classes.formRow}>
                <p className={classes.label}>{t("company")}</p>
                <HFSelect
                  required
                  control={control}
                  name="company_id"
                  size="large"
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
                    />
                  ))
                : null}
            </div>
          </div>
        )}
      </Tabs>
      <div className={classes.buttonsArea}>
        <PrimaryButton size="large" loader={loading}>
          {t("enter")}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default LoginForm;
