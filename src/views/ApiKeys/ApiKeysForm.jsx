import { Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import Footer from "../../components/Footer";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import HeaderSettings from "../../components/HeaderSettings";
import ActivityFeedTable from "../../components/LayoutSidebar/Components/ActivityFeedButton/components/ActivityFeedTable";
import PageFallback from "../../components/PageFallback";
import apiKeyService from "../../services/apiKey.service";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import roleServiceV2 from "../../services/roleServiceV2";
import { store } from "../../store";

const ApiKeysForm = () => {
  const { appId, apiKeyId } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [btnLoader, setBtnLoader] = useState();
  const [role, setRole] = useState([]);
  const [loader, setLoader] = useState(false);
  const [clientType, setClientType] = useState([]);
  const authStore = store.getState().auth;

  const mainForm = useForm({
    defaultValues: {
      environment_id: authStore.environmentId,
      project_id: authStore.projectId,
      client_type_id: authStore.clientType.id,
      role_id: authStore.roleInfo.id,
    },
  });

  const apiKey = mainForm.getValues("app_id")

  const createApp = (data) => {
    setBtnLoader(true);

    apiKeyService
      .create(authStore.projectId, data)
      .then(() => {
        navigate(-1);
        getRoleList();
      })
      .catch(() => setBtnLoader(false));
  };

  const updateApp = (data) => {
    setBtnLoader(true);

    apiKeyService
      .update(authStore.projectId, apiKeyId, {
        ...data,
      })
      .then(() => {
        navigate(-1);
        getRoleList();
      })
      .catch(() => setBtnLoader(false));
  };

  const getRoleList = () => {
    roleServiceV2
      .getList({
        clienty_type_id: mainForm.watch("client_type_id"),
      })
      .then((res) => {
        setRole(res.data);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };
  const getClientTypeList = () => {
    clientTypeServiceV2
      .getList({})
      .then((res) => {
        setClientType(res.data);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  const getById = () => {
    apiKeyService
      .getById(authStore.projectId, apiKeyId)
      .then((res) => {
        mainForm.reset(res);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };


  useEffect(() => {
    getClientTypeList();
  }, []);

  useEffect(() => {
    if (mainForm.watch("client_type_id")) {
      getRoleList();
    }
  }, [mainForm.watch("client_type_id")]);

  useEffect(() => {
    if (apiKeyId) {
      getById();
    }
  }, [apiKeyId]);


  const onSubmit = (data) => {
    if (apiKeyId) updateApp(data);
    else createApp(data);
  };

  if (loader) return <PageFallback />;

  return (
    <div>
      <Tabs
        selectedIndex={selectedTab} direction={"ltr"}
      >
        <HeaderSettings
          title="Приложение"
          backButtonLink={-1}
          subtitle={appId ? mainForm.watch("name") : "Новый"}
        >
          <TabList>
            <Tab onClick={() => setSelectedTab(0)}>Api Key</Tab>
            <Tab onClick={() => setSelectedTab(1)}>Log</Tab>
          </TabList>
        </HeaderSettings>
        <TabPanel>
          <form
            onSubmit={mainForm.handleSubmit(onSubmit)}
            className="p-2"
            style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
          >
            <FormCard title="Детали" maxWidth={500}>
              <FRow
                label={"Названия"}
                componentClassName="flex gap-2 align-center"
                required
              >
                <HFTextField
                  disabledHelperText
                  name="name"
                  control={mainForm.control}
                  fullWidth
                  required
                />
              </FRow>
              {apiKeyId && (
                <>
                  <FRow
                    label={"App ID"}
                    componentClassName="flex gap-2 align-center"
                    required
                  >
                    <HFTextField
                      disabledHelperText
                      name="app_id"
                      control={mainForm.control}
                      fullWidth
                      required
                      disabled
                    />
                  </FRow>
                  <FRow
                    label="Monthly limit"
                    componentClassName="flex gap-2 align-center"
                    required
                  >
                    <HFTextField
                      disabledHelperText
                      name="monthly_request_limit"
                      control={mainForm.control}
                      fullWidth
                      required
                      disabled
                    />
                  </FRow>
                  <FRow
                    label="RPS limit"
                    componentClassName="flex gap-2 align-center"
                    required
                  >
                    <HFTextField
                      disabledHelperText
                      name="rps_limit"
                      control={mainForm.control}
                      fullWidth
                      required
                      disabled
                    />
                  </FRow>
                  <FRow
                    label="Used count"
                    componentClassName="flex gap-2 align-center"
                    required
                  >
                    <HFTextField
                      disabledHelperText
                      name="used_count"
                      control={mainForm.control}
                      fullWidth
                      required
                      disabled
                    />
                  </FRow>
                </>
              )}

            </FormCard>
          </form>
          <Footer
            extra={
              <>
                <SecondaryButton onClick={() => navigate(-1)} color="error">
                  Close
                </SecondaryButton>

                <PrimaryButton
                  loader={btnLoader}
                  onClick={mainForm.handleSubmit(onSubmit)}
                >
                  <Save /> Save
                </PrimaryButton>
              </>
            }
          />
        </TabPanel>
        <TabPanel >
          <ActivityFeedTable type="padding" requestType="API_KEY" apiKey={apiKey} actionByVisible={false} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ApiKeysForm;
