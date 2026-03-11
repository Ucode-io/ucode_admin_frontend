import LoginTab from "./LoginTab";
import EspLogin from "./EspLogin";
import EmailAuth from "./EmailAuth";
import {useQuery} from "react-query";
import PhoneLogin from "./PhoneLogin";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import { Box, Button, Dialog } from "@mui/material";
import classes from "./style.module.scss";
import {useTranslation} from "react-i18next";
import ForgotPassword from "./ForgotPassword";
import {useEffect, useMemo, useState} from "react";
import LoginCompaniesList from "./LoginCompaniesList";
import PhoneOtpInput from "./PhoneLogin/PhoneOtpInput";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import listToOptions from "../../../../utils/listToOptions";
import {loginAction} from "../../../../store/auth/auth.thunk";
import {authActions} from "../../../../store/auth/auth.slice";
import RegisterFormPageDesign from "../RegisterFormPageDesign";
import authService from "../../../../services/auth/authService";
import companyService from "../../../../services/companyService";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import connectionServiceV2 from "../../../../services/auth/connectionService";
import {showAlert} from "../../../../store/alert/alert.thunk";
import RecoverPassword from "../RecoverPassword";
import { companyActions } from "../../../../store/company/company.slice";
import DynamicFields from "../DynamicFields";

// const firebaseConfig = {
//   apiKey: "AIzaSyAI2P6BcpeVdkt7G_xRe3mYiQ4Ek0cU2pM",
//   authDomain: "ucode-c166d.firebaseapp.com",
//   projectId: "ucode-c166d",
//   storageBucket: "ucode-c166d.firebasestorage.app",
//   messagingSenderId: "195504606938",
//   appId: "1:195504606938:web:1f01f882f66e1b52339fe3",
// };

const LoginFormDesign = ({
  index,
  setIndex,
  formType,
  setFormType,
  selectedTabIndex,
  setSelectedTabIndex,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [projectListDialogOpen, setProjectListDialogOpen] = useState(false);
  const [isUserId, setIsUserId] = useState();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [googleAuth, setGoogleAuth] = useState(null);
  const [codeAppValue, setCodeAppValue] = useState({});
  const [connectionCheck, setConnectionCheck] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState();
  const { control, handleSubmit, watch, setValue } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setValue("username", "");
    setValue("password", "");
  };

  const selectedCompanyID = watch("company_id");
  const selectedProjectID = watch("project_id");
  const selectedClientTypeID = watch("client_type");
  const selectedEnvID = watch("environment_id");
  const getFormValue = watch();

  const { data: computedConnections = [] } = useQuery(
    [
      "GET_CONNECTION_LIST",
      { "project-id": selectedProjectID },
      { "environment-id": selectedEnvID },
      { "user-id": isUserId },
    ],
    () => {
      return connectionServiceV2.getList(
        {
          "project-id": selectedProjectID,
          client_type_id: selectedClientTypeID,
          "user-id": isUserId,
        },
        { "environment-id": selectedEnvID },
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
    },
  );

  const [connectionOptions, setConnectionOptions] = useState([]);
  const [tempData, setTempData] = useState({});

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
      .then(() => {
        setIndex(0);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const defaultLogin = async (data) => {
    try {
      await dispatch(
        loginAction({
          ...data,
          setProjectListDialogOpen: (val) => {
            setProjectListDialogOpen(val);
            setLoading(false);
          },
          setConnectionOptions,
          setTempData,
        }),
      ).unwrap();
    } catch (e) {
      dispatch(showAlert(e?.data?.description, "error"));
      setLoading(false);
      setIsUserId(null);
      setCompanies([]);
    }
  };

  const onSubmit = (values) => {
    setLoading(true);
    if (selectedTabIndex === 0) {
      // getCompany(values);
      defaultLogin(values);
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
        getSendCodeApp({ ...values, type: "EMAIL" });
      }
    }
  };

  const getCompany = (values) => {
    setGoogleAuth(values);
    const data = {
      password: values?.password ? values?.password : "",
      username: values?.username ? values?.password : "",
      [values?.type]: values?.recipient || undefined,
      ...values,
    };

    companyService
      .getCompanyList(data)
      .then((res) => {
        setLoading(false);
        if (res?.companies) {
          setIsUserId(res?.user_id ?? "");
          setCompanies(res?.companies ?? {});
          computeCompanyElement(res?.companies ?? "");
          localStorage.setItem(
            "new_router",
            res?.companies?.[0]?.projects?.[0]?.new_router || "false",
          );
          localStorage.setItem(
            "newUi",
            res?.companies?.[0]?.projects?.[0]?.new_design || false,
          );
          res?.companies?.[0]?.projects?.[0]?.new_layout
            ? localStorage.setItem("detailPage", "SidePeek")
            : localStorage.setItem("detailPage", "");
          localStorage.setItem(
            "newLayout",
            res?.companies?.[0]?.projects?.[0]?.new_layout || false,
          );
        } else {
          dispatch(showAlert("The company does not exist", "error"));
        }

        if (index === 1) register(values);
      })
      .catch(() => {
        setLoading(false);
        setGoogleAuth(null);
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
        console.error(err);
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
        if (connections?.length > 1) {
          handleClickOpen();
        }
      }
    }
  };

  const onSubmitDialog = async (values) => {
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
    const computedEnv = computedEnvironments?.find(
      (item) => item?.value === selectedEnvID,
    );
    const currencies = companies[0]?.projects?.find(
      (item) => item?.id === selectedProjectID,
    )?.currencies;

    dispatch(authActions.setStatus(computedEnv?.access_type));

    try {
      await dispatch(
        loginAction({
          ...data,
          isSubmitDialog: true,
          currencies: currencies,
          tempData,
        }),
      ).unwrap();
    } catch (e) {
      setLoading(false);
      setIsUserId(null);
      setCompanies([]);
    }
  };

  const computeCompanyElement = (company) => {
    dispatch(companyActions.setCompanyName(company?.[0]?.name));
    const validLength = company?.length === 1;
    if (validLength) {
      setValue("company_id", company?.[0]?.id);
    } else {
      setValue("company_id", company?.[0]?.id);
    }
    if (validLength) {
      if (company?.[0]?.projects?.length === 1) {
        setValue("project_id", company?.[0]?.projects?.[0]?.id);
      }
    } else {
      setValue("project_id", company?.[0]?.projects?.[0]?.id);
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
    } else {
      setValue(
        "environment_id",
        company?.[0]?.projects?.[0]?.resource_environments?.[0]?.environment_id,
      );
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
          } else if (
            company?.[0]?.projects?.[0]?.resource_environments?.[0]
              ?.client_types?.response?.length > 1
          ) {
            setValue(
              "client_type",
              company?.[0]?.projects?.[0]?.resource_environments?.[0]
                ?.client_types?.response?.[0]?.guid
            );
          }
        }
      }
    } else {
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

  const setCompanyId = () => {
    setValue("company_id", computedCompanies?.[0]?.value);
    setValue("project_id", computedProjects?.[0]?.value);
  };

  useEffect(() => {
    if (computedConnections?.length > 0) {
      computedConnections.forEach((connection, index) => {
        if (connection?.options?.length === 1) {
          setValue(`tables[${index}].object_id`, connection?.options[0]?.guid);
          setSelectedCollection(connection.options[0]?.value);
          setValue(`tables[${index}].table_slug`, connection?.table_slug);
        } else {
          handleClickOpen();
        }
      });
    }
  }, [computedConnections]);

  useEffect(() => {
    if (computedCompanies?.length === 1) {
      setValue("company_id", computedCompanies?.[0]?.value);
    } else {
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
      if (computedEnvironments?.length > 1) {
        handleClickOpen();
      } else {
        setCompanyId();
      }
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
    <Box sx={{ height: "100%" }}>
      {Boolean(
        formType !== "REGISTER" &&
          formType !== "OTP" &&
          formType !== "FORGOT_PASSWORD" &&
          formType !== "EMAIL_OTP",
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
            style={{ height: "100%" }}
            selected={selectedTabIndex}
            direction={"ltr"}
            onSelect={(index) => setSelectedTabIndex(index)}
          >
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
              <div
                style={{
                  height: "100%",
                  padding: "0 20px",
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TabList>
                  <Tab
                    onClick={() => setFormType("LOGIN")}
                    style={{ padding: "10px 8px 10px 8px" }}
                  >
                    {t("login")}
                  </Tab>
                  <Tab
                    onClick={() => setFormType("phone")}
                    style={{ padding: "10px 12px 10px 12px" }}
                  >
                    {t("phone")}
                  </Tab>
                  <Tab
                    onClick={() => setFormType("email")}
                    style={{ padding: "10px 12px 10px 12px" }}
                  >
                    {t("email.address")}
                  </Tab>
                </TabList>

                <div className={classes.formArea} style={{ marginTop: "10px" }}>
                  <TabPanel style={{ height: "calc(100% - 50px)" }}>
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
        open={projectListDialogOpen}
        onClose={() => setProjectListDialogOpen(false)}
        aria-labelledby="multi-company-dialog-title"
        aria-describedby="multi-company-dialog-description"
        PaperProps={{
          style: {
            padding: "24px 28px 20px",
            width: "560px",
            maxHeight: "70vh",
            // height: "100%",
            borderRadius: "14px",
            boxShadow:
              "0px 18px 45px rgba(15, 23, 42, 0.18), 0px 0px 0px 1px rgba(148, 163, 184, 0.35)",
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(6px)",
          },
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Box
              id="multi-company-dialog-title"
              fontSize="18px"
              fontWeight={600}
              color="#0f172a"
            >
              Multi company
            </Box>
          </Box>

          <Box
            id="multi-company-dialog-description"
            mt={1}
            mb={1}
            fontSize="13px"
            color="#64748b"
          >
            Choose which workspace configuration you want to use for this login.
          </Box>
          <Box display="flex" flexDirection="column" gap={1.5}>
            {connectionOptions?.map((connection, idx) => (
              <DynamicFields
                key={connection?.guid}
                table={computedConnections}
                connection={connection}
                index={idx}
                control={control}
                setValue={setValue}
                watch={watch}
                options={connection?.options}
                companies={companies}
                selectedCollection={selectedCollection}
                setSelectedCollection={setSelectedCollection}
              />
            ))}
          </Box>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={1.5}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => setProjectListDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit(onSubmitDialog)}>
              Continue
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="company-dialog-title"
        aria-describedby="company-dialog-description"
        PaperProps={{
          style: {
            padding: "24px 28px 22px",
            width: "560px",
            maxHeight: "70vh",
            borderRadius: "14px",
            boxShadow:
              "0px 18px 45px rgba(15, 23, 42, 0.18), 0px 0px 0px 1px rgba(148, 163, 184, 0.35)",
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(6px)",
          },
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Box
              id="company-dialog-title"
              fontSize="18px"
              fontWeight={600}
              color="#0f172a"
            >
              Select workspace
            </Box>
          </Box>

          <Box
            id="company-dialog-description"
            mt={1}
            mb={1.5}
            fontSize="13px"
            color="#64748b"
          >
            Pick a company, project and environment to continue.
          </Box>

          <Box
            mt={1}
            sx={{
              maxHeight: "360px",
              overflowY: "auto",
            }}
          >
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
          </Box>
        </Box>
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
    </Box>
  );
};

export default LoginFormDesign;
