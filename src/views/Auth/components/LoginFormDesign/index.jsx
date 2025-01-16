import {Box, Dialog} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useDispatch} from "react-redux";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import connectionServiceV2 from "../../../../services/auth/connectionService";
import listToOptions from "../../../../utils/listToOptions";
import authService from "../../../../services/auth/authService";
import companyService from "../../../../services/companyService";
import {authActions} from "../../../../store/auth/auth.slice";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import classes from "./style.module.scss";
import LoginTab from "./LoginTab";
import {loginAction} from "../../../../store/auth/auth.thunk";
import PhoneLogin from "./PhoneLogin";
import PhoneOtpInput from "./PhoneLogin/PhoneOtpInput";
import EmailAuth from "./EmailAuth";
import RegisterFormPageDesign from "../RegisterFormPageDesign";
import LoginCompaniesList from "./LoginCompaniesList";
import EspLogin from "./EspLogin";
import ForgotPassword from "./ForgotPassword";
import {firebaseCloudMessaging} from "../../../../firebase/config";

const LoginFormDesign = ({
  setIndex,
  index,
  setFormType,
  formType,
  selectedTabIndex,
  setSelectedTabIndex,
}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [connectionCheck, setConnectionCheck] = useState(false);
  const [isUserId, setIsUserId] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [codeAppValue, setCodeAppValue] = useState({});
  const [googleAuth, setGoogleAuth] = useState(null);

  const [open, setOpen] = useState(false);

  const {control, handleSubmit, watch, setValue, reset, getValues} = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValue("username", "");
    setValue("password", "");
  };

  // const getFcmToken = async () => {
  //   const token = await firebaseCloudMessaging.init();
  //   localStorage.setItem("fcmToken", token);
  // };

  const selectedCompanyID = watch("company_id");
  const selectedProjectID = watch("project_id");
  const selectedClientTypeID = watch("client_type");
  const selectedEnvID = watch("environment_id");
  const getFormValue = watch();

  const {data: computedConnections = [], isLoading} = useQuery(
    [
      "GET_CONNECTION_LIST",
      {"project-id": selectedProjectID},
      {"environment-id": selectedEnvID},
      {"user-id": isUserId},
    ],
    () => {
      return connectionServiceV2.getList(
        {
          "project-id": selectedProjectID,
          client_type_id: selectedClientTypeID,
          "user-id": isUserId,
        },
        {"environment-id": selectedEnvID}
      );
    },
    {
      enabled: !!selectedClientTypeID,
      select: (res) => res.data.response ?? [],
      onSuccess: (res) => {
        computeConnections(res);
        setConnectionCheck(true);
        setLoading(true);
      },
      onError: () => {
        setLoading(false);
      },
    }
  );

  //=======COMPUTE COMPANIES
  const computedCompanies = useMemo(() => {
    return listToOptions(companies, "name");
  }, [companies]);

  //=======COMPUTE PROJECTS
  const computedProjects = useMemo(() => {
    const company = companies?.find(
      (company) => company.id === selectedCompanyID
    );
    return listToOptions(company?.projects, "name");
  }, [companies, selectedCompanyID]);

  //=======COMPUTE ENVIRONMENTS
  const computedEnvironments = useMemo(() => {
    const company = companies?.find(
      (company) => company.id === selectedCompanyID
    );
    const companyProject = company?.projects?.find(
      (el) => el?.id === selectedProjectID
    );

    return companyProject?.resource_environments?.map((item) => ({
      label: item?.name,
      value: item?.environment_id,
      access_type: item?.access_type,
    }));
  }, [selectedEnvID, companies, selectedProjectID]);

  //======COMPUTE CLIENTTYPES
  const computedClientTypes = useMemo(() => {
    const company = companies?.find(
      (company) => company.id === selectedCompanyID
    );
    const companyProject = company?.projects?.find(
      (el) => el?.id === selectedProjectID
    );

    const companyEnvironment = companyProject?.resource_environments?.find(
      (el) => el?.environment_id === selectedEnvID
    );

    return companyEnvironment?.client_types?.response?.map((item) => ({
      label: item?.name,
      value: item?.guid,
    }));
  }, [companies, selectedCompanyID, selectedEnvID, selectedProjectID]);

  const register = (data) => {
    authService
      .register(data)
      .then((res) => {
        setIndex(0);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSubmit = (values) => {
    if (selectedTabIndex === 0) {
      getCompany(values);
    }
    if (selectedTabIndex === 1) {
      if (codeAppValue?.sms_id) {
        getCompany({
          ...values,
          sms_id: codeAppValue?.sms_id,
          type: "phone",
        });
      } else {
        getSendCodeApp({...values, type: "PHONE"});
      }
    }
    if (selectedTabIndex === 2) {
      if (codeAppValue?.sms_id) {
        getCompany({
          ...values,
          sms_id: codeAppValue?.sms_id,
          type: "email",
        });
      } else {
        getSendCodeApp({...values, type: "EMAIL"});
      }
    }
  };

  const getCompany = (values) => {
    setGoogleAuth(values);
    const data = {
      password: values?.password ? values?.password : "",
      username: values?.username ? values?.password : "",
      [values?.type]: values?.recipient || "",
      ...values,
    };
    setLoading(true);
    companyService
      .getCompanyList(data)
      .then((res) => {
        if (res?.companies) {
          setIsUserId(res?.user_id);
          setCompanies(res?.companies);
          computeCompanyElement(res?.companies);
          localStorage.setItem("");
        } else {
          dispatch(showAlert("The company does not exist", "error"));
        }

        if (index === 1) register(values);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getSendCodeApp = (values) => {
    authService
      .sendCodeApp({
        recipient: values?.phone ?? values?.email,
        text: "You otp code is",
        type: values?.type,
      })
      .then((res) => {
        setCodeAppValue(res);
        setFormType("OTP");
      })
      .catch((err) => {
        console.log("eerrrrrrr", err);
      });
  };

  const checkConnections = useMemo(() => {
    if (getFormValue?.tables) {
      const tableKeys = Object.keys(getFormValue.tables);
      return tableKeys.every((key) => {
        const item = getFormValue.tables[key];
        return item?.object_id && item?.table_slug;
      });
    }
    return false;
  }, [getFormValue]);

  const computeConnections = (connections) => {
    const data = {
      ...getFormValue,
      ...googleAuth,
      type: googleAuth?.type ? googleAuth?.type : getFormValue?.type,
      sms_id: codeAppValue?.sms_id,
    };
    if (
      (Array.isArray(connections) && connections?.length === 0) ||
      connections === undefined
    ) {
      if (
        getFormValue?.username &&
        getFormValue?.password &&
        getFormValue?.client_type &&
        getFormValue?.project_id &&
        getFormValue?.environment_id
      ) {
        onSubmitDialog(data);
      } else if (googleAuth?.type === "google" && googleAuth?.google_token) {
        onSubmitDialog(data);
      } else if (
        !getFormValue?.username ||
        !getFormValue?.password ||
        !getFormValue?.company_id ||
        !getFormValue?.project_id ||
        !getFormValue?.environment_id ||
        !getFormValue?.client_type
      ) {
        handleClickOpen();
      }
    } else if (Array.isArray(connections) && connections?.length > 0) {
      if (
        getFormValue?.username &&
        getFormValue?.password &&
        getFormValue?.client_type &&
        getFormValue?.project_id &&
        getFormValue?.environment_id &&
        checkConnections
      ) {
        onSubmitDialog(getFormValue);
      } else {
        handleClickOpen();
      }
    }
  };

  const onSubmitDialog = (values) => {
    const data = {
      ...values,
      type: values?.phone
        ? "phone"
        : values?.email
          ? "email"
          : values?.type === "google"
            ? "google"
            : undefined,
      sms_id: codeAppValue?.sms_id,
    };
    const computedProject = companies[0]?.projects
      ?.find((item) => item?.id === selectedProjectID)
      ?.resource_environments?.map((el) => el?.environment_id);
    const computedEnv = computedEnvironments?.find(
      (item) => item?.value === selectedEnvID
    );
    const currencies = companies[0]?.projects?.find(
      (item) => item?.id === selectedProjectID
    )?.currencies;

    dispatch(authActions.setStatus(computedEnv?.access_type));
    dispatch(
      loginAction({
        ...data,
        environment_ids: computedProject,
        currencies: currencies,
      })
    );
  };

  const computeCompanyElement = (company) => {
    const validLength = company?.length === 1;
    if (validLength) {
      setValue("company_id", company?.[0]?.id);
    }
    if (validLength) {
      if (company?.[0]?.projects?.length === 1) {
        setValue("project_id", company?.[0]?.projects?.[0]?.id);
      }
    }

    if (validLength) {
      if (company?.[0]?.projects?.length === 1) {
        if (company?.[0]?.projects?.[0]?.resource_environments?.length === 1) {
          setValue(
            "environment_id",
            company?.[0]?.projects?.[0]?.resource_environments?.[0]
              ?.environment_id
          );
        }
      }
    }
    if (validLength) {
      if (company?.[0]?.projects?.length === 1) {
        if (company?.[0]?.projects?.[0]?.resource_environments?.length === 1) {
          if (
            company?.[0]?.projects?.[0]?.resource_environments?.[0]
              ?.client_types?.response?.length === 1
          ) {
            setValue(
              "client_type",
              company?.[0]?.projects?.[0]?.resource_environments?.[0]
                ?.client_types?.response?.[0]?.guid
            );
          }
        }
      }
    }
  };

  // useEffect(() => {
  //   getFcmToken();
  //   reset();
  // }, [index]);

  useEffect(() => {
    if (computedConnections?.length > 0) {
      computedConnections.forEach((connection, index) => {
        if (connection.options.length === 1) {
          setValue(`tables[${index}].object_id`, connection?.options[0]?.guid);
          setSelectedCollection(connection.options[0]?.value);
          setValue(
            `tables[${index}].table_slug`,
            connection?.options?.[0]?.[connection?.view_slug]
          );
        }
      });
    }
  }, [computedConnections]);

  useEffect(() => {
    if (computedCompanies?.length === 1) {
      setValue("company_id", computedCompanies?.[0]?.value);
    }
    if (computedProjects?.length === 1) {
      setValue("project_id", computedProjects?.[0]?.value);
    }
    if (computedEnvironments?.length === 1) {
      setValue("environment_id", computedEnvironments?.[0]?.value);
    }
    if (computedClientTypes?.length === 1) {
      setValue("client_type", computedClientTypes?.[0]?.value);
    }
  }, [
    computedCompanies,
    computedProjects,
    computedEnvironments,
    computedClientTypes,
  ]);

  useEffect(() => {
    const shouldOpen =
      computedCompanies?.length > 1 ||
      computedProjects?.length > 1 ||
      computedEnvironments?.length > 1 ||
      computedClientTypes?.length > 1;

    if (shouldOpen) {
      handleClickOpen();
    }
  }, [
    computedCompanies,
    computedProjects,
    computedEnvironments,
    computedClientTypes,
  ]);

  useEffect(() => {
    if (connectionCheck && getFormValue?.tables) {
      computeConnections(getFormValue?.tables);
    }
  }, [connectionCheck, getFormValue?.tables]);

  return (
    <Box sx={{height: "350px"}}>
      {Boolean(
        formType !== "REGISTER" &&
          formType !== "OTP" &&
          formType !== "FORGOT_PASSWORD" &&
          formType !== "EMAIL_OTP"
      ) && (
        <>
          <h1 className={classes.title}>
            {index === 0 ? t("enter.to.system") : t("register.form")}
          </h1>
          <p className={classes.subtitle}>
            {index === 0
              ? t("fill.in.your.login.info")
              : t("register.form.desc")}
          </p>
        </>
      )}
      {formType === "RESET_PASSWORD" ? (
        <RecoverPassword control={control} setFormType={setFormType} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Tabs
            selected={selectedTabIndex}
            direction={"ltr"}
            onSelect={(index) => setSelectedTabIndex(index)}>
            {formType === "OTP" ? (
              <PhoneOtpInput
                watch={watch}
                control={control}
                loading={loading}
                setFormType={setFormType}
                setCodeAppValue={setCodeAppValue}
                setValue={setValue}
              />
            ) : formType === "FORGOT_PASSWORD" || formType === "EMAIL_OTP" ? (
              <ForgotPassword setFormType={setFormType} />
            ) : formType !== "REGISTER" ? (
              <div style={{padding: "0 20px", marginTop: "20px"}}>
                <TabList>
                  <Tab
                    onClick={() => setFormType("LOGIN")}
                    style={{padding: "10px 8px 10px 8px"}}>
                    {t("Login")}
                  </Tab>
                  <Tab
                    onClick={() => setFormType("phone")}
                    style={{padding: "10px 12px 10px 12px"}}>
                    {t("Phone number")}
                  </Tab>
                  <Tab
                    onClick={() => setFormType("email")}
                    style={{padding: "10px 12px 10px 12px"}}>
                    {t("Email")}
                  </Tab>
                  {/* <Tab
                    onClick={() => setFormType("ESP")}
                    style={{padding: "10px 8px 10px 8px"}}>
                    {t("ЭЦП")}
                  </Tab> */}
                </TabList>

                <div
                  className={classes.formArea}
                  style={{marginTop: "10px", height: `calc(100vh - 400px)`}}>
                  <TabPanel>
                    <LoginTab
                      loading={loading}
                      setFormType={setFormType}
                      control={control}
                      getCompany={getCompany}
                    />
                  </TabPanel>
                  <TabPanel>
                    <PhoneLogin
                      codeAppValue={codeAppValue}
                      control={control}
                      loading={loading}
                      setFormType={setFormType}
                    />
                  </TabPanel>
                  <TabPanel>
                    <EmailAuth setFormType={setFormType} control={control} />
                  </TabPanel>
                  <TabPanel>
                    <EspLogin setFormType={setFormType} control={control} />
                  </TabPanel>
                </div>
              </div>
            ) : (
              <RegisterFormPageDesign
                setFormType={setFormType}
                formType={formType}
              />
            )}
          </Tabs>
        </form>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            padding: "30px",
            width: "550px",
            maxHeight: "70vh",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
          },
        }}>
        <LoginCompaniesList
          computedProjects={computedProjects}
          computedCompanies={computedCompanies}
          computedEnvironments={computedEnvironments}
          computedClientTypes={computedClientTypes}
          computedConnections={computedConnections}
          selectedCollection={selectedCollection}
          companies={companies}
          loading={loading}
          control={control}
          watch={watch}
          setValue={setValue}
          handleSubmit={handleSubmit(onSubmitDialog)}
          setSelectedCollection={setSelectedCollection}
        />
      </Dialog>

      {formType === "RESET_PASSWORD" && (
        <SecondaryButton
          size="large"
          style={{marginTop: "20px"}}
          type="button"
          onClick={() => {
            formType === "RESET_PASSWORD"
              ? setFormType("LOGIN")
              : setFormType("RESET_PASSWORD");
          }}>
          Back to login
        </SecondaryButton>
      )}
    </Box>
  );
};

export default LoginFormDesign;
