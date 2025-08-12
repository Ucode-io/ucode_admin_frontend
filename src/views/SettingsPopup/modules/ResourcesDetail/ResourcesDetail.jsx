import {useEffect} from "react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {Box, Button, CircularProgress} from "@mui/material";
import {useEnvironmentsListQuery} from "@/services/environmentService";
import resourceService, {
  useCreateResourceMutationV1,
  useResourceConfigureMutation,
  useResourceCreateMutation,
  useResourceCreateMutationV2,
  useResourceEnvironmentGetByIdQuery,
  useResourceGetByIdClickHouse,
  useResourceGetByIdQueryV2,
  useResourceReconnectMutation,
  useResourceUpdateMutation,
  useResourceUpdateMutationV2,
} from "@/services/resourceService";
import {store} from "@/store";
import ResourceeEnvironments from "./ResourceEnvironment";
import Form from "./Form";
import {resourceTypes} from "@/utils/resourceConstants";
import resourceVariableService from "@/services/resourceVariableService";
import {useDispatch, useSelector} from "react-redux";
import {showAlert} from "@/store/alert/alert.thunk";
import {useGithubLoginMutation} from "@/services/githubService";
import GitForm from "./GitForm";
import ClickHouseForm from "./ClickHouseForm";
import {useQuery, useQueryClient} from "react-query";
import {useGitlabLoginMutation} from "@/services/githubService";
import GitLabForm from "./GitlabForm";
import {useTranslation} from "react-i18next";
import {getAllFromDB} from "@/utils/languageDB";
import {generateLangaugeText} from "@/utils/generateLanguageText";
import {ContentTitle} from "../../components/ContentTitle";
import {useSettingsPopupContext} from "../../providers";
import {GreyLoader} from "../../../../components/Loaders/GreyLoader";
import {SMSType} from "./SMSType";
import PostgresCreate from "./PostgresCreate";
import {settingsModalActions} from "../../../../store/settingsModal/settingsModal.slice";
import TransCoder from "./TransCoder";

export const ResourcesDetail = ({
  setOpenResource = () => {},
  openResource,
  resourceVal,
  setResourceVal = () => {},
}) => {
  const {
    setSearchParams: setSettingsSearchParams,
    searchParams: settingSearchParams,
    updateSearchParam,
  } = useSettingsPopupContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // const resourceId = settingSearchParams.get("resourceId");
  // const resourceType = settingSearchParams.get("resourceType");
  const projectId = useSelector((state) => state?.auth?.projectId);

  const resourceType = useSelector((state) => state.settingsModal.resourceType);
  const resourceId = useSelector((state) => state.settingsModal.resourceId);
  const edit = useSelector((state) => state.settingsModal.edit);

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedGitlab, setSelectedGitlab] = useState();
  const queryClient = useQueryClient();
  const [variables, setVariables] = useState();
  const navigate = useNavigate();
  const company = store.getState().company;
  const authStore = store.getState().auth;
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const [settingLan, setSettingLan] = useState(null);

  const isEditPage = !!resourceId;

  const {control, reset, handleSubmit, setValue, watch} = useForm({
    defaultValues: {
      name: "",
      variables: variables?.variables,
      resource_type: Boolean(searchParams.get("code"))
        ? searchParams.get("code")?.length === 20
          ? 5
          : searchParams.get("code")
            ? 8
            : 0
        : 0,
    },
  });

  const {isLoading} = useResourceGetByIdQueryV2({
    id: resourceId,
    params: {
      type: resourceType,
    },
    queryParams: {
      cacheTime: false,
      enabled:
        isEditPage &&
        location?.state?.type !== "REST" &&
        location?.state?.type !== "CLICK_HOUSE",
      onSuccess: (res) => {
        reset(res);
        setSelectedEnvironment(
          res.environments?.filter((env) => env.is_configured)
        );
      },
    },
  });

  const {data: clickHouseList} = useQuery(
    ["GET_OBJECT_LIST"],
    () => {
      return resourceService.getListClickHouse({
        data: {
          environment_id: authStore.environmentId,
          limit: 0,
          offset: 0,
          project_id: company?.projectId,
        },
      });
    },
    {
      enabled: true,
      select: (res) => {
        return (
          res?.airbytes?.map((item) => ({
            ...item,
            type: "CLICK_HOUSE",
            name: "Click house",
          })) ?? []
        );
      },
    }
  );

  const {isLoadingClickH} = useResourceGetByIdClickHouse({
    id: resourceId,
    params: {
      type: resourceType,
    },
    queryParams: {
      cacheTime: false,
      enabled: isEditPage && location?.state?.type === "CLICK_HOUSE",
      onSuccess: (res) => {
        reset(res);
      },
    },
  });

  const {data: projectEnvironments} = useEnvironmentsListQuery({
    params: {
      project_id: projectId,
    },
    queryParams: {
      select: (res) =>
        res.data?.map((env) => ({
          ...env,
          is_configured: false,
        })) ?? [],
    },
  });

  const {isLoading: formLoading} = useResourceEnvironmentGetByIdQuery({
    id: selectedEnvironment?.[0]?.resource_environment_id,
    queryParams: {
      cacheTime: false,
      enabled: Boolean(selectedEnvironment?.[0]?.resource_environment_id),
      onSuccess: (res) => {
        const isDefault = Boolean(
          res.environments?.find(
            (env) => env.id === selectedEnvironment?.[0].id
          )?.default
        );
        reset({
          ...res,
          default: isDefault,
        });
      },
    },
  });

  const {mutate: createResource, isLoading: createLoading} =
    useResourceCreateMutation({
      onSuccess: () => {
        navigate(-1);
      },
    });

  const {mutate: createResourceV2, isLoading: createLoadingV2} =
    useResourceCreateMutationV2({
      onSuccess: () => {
        dispatch(showAlert("Successfully created", "success"));
        navigate("/main");
        setLoading(false);
        backBtn();
      },
    });

  const createResourcePostgreV2 = (values) => {
    if (!!loading) {
      resourceService
        .resourceCreate(values)
        .then((res) => {
          dispatch(showAlert("Successfully created", "success"));
          backBtn();
          setLoading(false);
        })
        .onError((er) => setLoading(false));
    }
  };

  const {mutate: createResourceV1, isLoading: createLoadingV1} =
    useCreateResourceMutationV1({
      onSuccess: () => {
        dispatch(showAlert("Successfully created", "success"));
        navigate("/main");
        setLoading(false);
        backBtn();
      },
    });

  const {mutate: configureResource, isLoading: configureLoading} =
    useResourceConfigureMutation({
      onSuccess: () => {
        setSelectedEnvironment(null);
        setLoading(false);
      },
    });

  const {mutate: updateResource, isLoading: updateLoading} =
    useResourceUpdateMutation({
      onSuccess: () => {
        setSelectedEnvironment(null);
      },
    });

  const {mutate: updateResourceV2, isLoading: updateLoadingV2} =
    useResourceUpdateMutationV2({
      onSuccess: () => {
        dispatch(showAlert("Resources are updated!", "success"));
        setSelectedEnvironment(null);
        setLoading(false);
      },
    });

  const {mutate: reconnectResource, isLoading: reconnectLoading} =
    useResourceReconnectMutation(
      {projectId: projectId},
      {
        onSuccess: () => {},
      }
    );

  const {mutate: githubLogin, isLoading: githubLoginIsLoading} =
    useGithubLoginMutation({
      onSuccess: (res) => {
        setSearchParams({access_token: res.access_token});
      },
      onError: () => {},
    });

  const {mutate: gitlabLogin, isLoading: gitlabLoginIsLoading} =
    useGitlabLoginMutation({
      onSuccess: (res) => {
        setSearchParams({access_token: res.access_token});
        setSelectedGitlab(res);
      },
      onError: () => {},
    });

  useEffect(() => {
    const code = searchParams.get("code");
    if (Boolean(code)) {
      if (code?.length <= 20) githubLogin({code});
      else if (code?.length > 20) gitlabLogin({code});
    }
  }, [searchParams.get("code")]);

  const resource_type = watch("resource_type");

  const onSubmit = (values) => {
    setLoading(true);
    const computedValues2 = {
      ...values,
      type: values?.resource_type,
      company_id: company?.companyId,
      project_id: projectId,
      resource_id: resourceId,
      user_id: authStore.userId,
      is_configured: true,
      id:
        selectedEnvironment?.[0].resource_environment_id ??
        variables?.environment_id,

      integration_resource: {
        username: values.integration_resource?.username,
        token:
          searchParams.get("access_token") ??
          values.integration_resource?.token,
      },
    };

    const computedValues2Github = {
      ...values,
      type: values?.resource_type,
      company_id: company?.companyId,
      project_id: projectId,
      resource_id: resourceId,
      user_id: authStore.userId,
      is_configured: true,
      settings: {
        github: {
          username: values?.integration_resource?.username,
          token: values?.token,
        },
      },
      id:
        selectedEnvironment?.[0].resource_environment_id ??
        variables?.environment_id,

      integration_resource: {
        username: values.integration_resource?.username,
        token:
          searchParams.get("access_token") ??
          values.integration_resource?.token,
      },
    };

    const computedValues2Gitlab = {
      ...values,
      project_id: authStore?.projectId,
      type: values?.resource_type,
      company_id: company?.companyId,
      project_id: projectId,
      resource_id: resourceId,
      user_id: authStore.userId,
      is_configured: true,
      settings: {
        gitlab: {
          username: values?.integration_resource?.username,
          token: values?.token,
          refresh_token: selectedGitlab?.refresh_token,
          expires_in: selectedGitlab?.expires_in,
          created_at: selectedGitlab?.created_at,
        },
      },

      id:
        selectedEnvironment?.[0].resource_environment_id ??
        variables?.environment_id,

      integration_resource: {
        username: values.integration_resource?.username,
        token:
          searchParams.get("access_token") ??
          values.integration_resource?.token,
      },
    };

    const computedValuesClickHouse = {
      ...values,
      client_type_id: authStore?.clientType?.id,
      company_id: company?.companyId,
      node_type: "LOW",
      project_id: authStore?.projectId,
      resource: {
        is_configured: true,
        node_type: "LOW",
        project_id: authStore?.projectId,
        resource_type: 2,
        title: "Light",
      },
      role_id: authStore?.roleInfo?.id,
      user_id: authStore?.userId,
    };

    const computedPostgre = {
      ...values,
      default: false,
      type: 3,
      company_id: company?.companyId,
      user_id: authStore?.userId,
      environment_id: authStore.environmentId,
      is_configured: true,
    };
    if (edit) {
      updateResourceV2({
        name: values?.name,
        type: values?.type || undefined,
        id: values?.id,
        settings: {...values?.settings},
      });
      resourceVariableService
        .updateV2({
          project_resource_id: variables?.id,
          variables: computedValues2?.variables,
        })
        .then(() => {
          backBtn();
          dispatch(showAlert("Resource variable updated!", "success"));
        })
        .catch((err) => {
          dispatch(showAlert(err, "error"));
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (values?.resource_type === 3) {
        createResourcePostgreV2(computedPostgre);
      }
      if (values?.resource_type === 4) {
        createResourceV2(computedValues2);
      } else if (values?.resource_type === 5) {
        createResourceV2(computedValues2Github);
      } else if (values?.resource_type === 2) {
        createResourceV1(computedValuesClickHouse);
      } else if (values?.resource_type === 8) {
        createResourceV2(computedValues2Gitlab);
      } else if (!isEditPage) createResourceV2(computedValues2);
      else {
        if (!selectedEnvironment?.[0].is_configured) {
          configureResource(computedValues2);
        } else {
          updateResourceV2(computedValues2);
        }
      }
    }
  };

  useEffect(() => {
    if (!selectedEnvironment?.length) return;

    if (selectedEnvironment?.[0].is_configured) return;

    setValue("credentials", {
      host: "",
      port: "",
      username: "",
      database: "",
    });
    setValue("default", false);
  }, [selectedEnvironment]);

  useEffect(() => {
    if (variables?.type !== "REST") return;
    const matchingResource = resourceTypes.find(
      (type) => type?.label?.toLowerCase() === variables?.type?.toLowerCase()
    );

    if (matchingResource) {
      setValue("resource_type", matchingResource.value);
      setValue(
        "variables",
        variables?.variables?.filter((item) => item?.id)
      );
    }
  }, [variables]);

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        setSettingLan(formattedData?.find((item) => item?.key === "Setting"));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const setNum = Number(resourceType) || location?.state?.id;

    if (setNum) {
      setValue("resource_type", setNum);
    }
  }, []);

  useEffect(() => {
    if (resourceVal?.id) {
      reset({
        ...resourceVal,
        resource_type: resourceType,
      });
    }
  }, []);

  function backBtn() {
    // setSearchParams({ tab: "resources" });
    dispatch(settingsModalActions.resetParams());
    setOpenResource(null);
    setResourceVal(null);
    queryClient.refetchQueries(["RESOURCESV2"]);
  }

  return (
    <Box className="scrollbarNone" sx={{height: "670px", overflow: "hidden"}}>
      <form style={{height: "100%"}} flex={1} onSubmit={handleSubmit(onSubmit)}>
        {resourceType === "SMS" ? (
          <SMSType
            settingLan={settingLan}
            i18n={i18n}
            control={control}
            selectedEnvironment={selectedEnvironment}
            setSelectedEnvironment={setSelectedEnvironment}
            projectEnvironments={projectEnvironments}
            isEditPage={isEditPage}
            configureLoading={configureLoading}
            updateLoading={updateLoading}
            watch={watch}
            setValue={setValue}
            setSettingsSearchParams={setSettingsSearchParams}
            resourceType={resourceType}
            resource_type={resource_type}
            clickHouseList={clickHouseList}
            createLoading={createLoading}
            reconnectResource={reconnectResource}
            resourceId={resourceId}
            reconnectLoading={reconnectLoading}
            variables={variables}
          />
        ) : (
          <>
            <ContentTitle
              withBackBtn
              onBackClick={() => {
                backBtn();
              }}
              style={{marginBottom: 0}}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <span>
                  {generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Resource settings"
                  ) || "Resource settings"}
                </span>
                <Box>
                  {(resourceType === "CLICK_HOUSE"
                    ? !isEditPage
                    : resource_type !== 2 ||
                      (resource_type === 2 &&
                        !isEditPage &&
                        clickHouseList?.length === 0)) && (
                    <Button
                      loading={loading}
                      type="submit"
                      sx={{
                        fontSize: "14px",
                        margin: "0 10px",
                        background: "#007aff",
                        color: "#fff",
                        "&:hover": {
                          background: "#007aff",
                        },
                      }}
                      isLoading={createLoading}>
                      {loading ? (
                        <CircularProgress
                          style={{
                            color: "#fff",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      ) : (
                        generateLangaugeText(
                          settingLan,
                          i18n?.language,
                          "Save"
                        ) || "Save"
                      )}
                    </Button>
                  )}

                  {(isEditPage && variables?.type !== "REST") ||
                    (resource_type !== 13 && (
                      <Button
                        sx={{
                          color: "#fff",
                          background: "#38A169",
                          marginRight: "10px",
                        }}
                        hidden={!isEditPage}
                        color={"success"}
                        variant="contained"
                        onClick={() => reconnectResource({id: resourceId})}
                        isLoading={reconnectLoading}>
                        {generateLangaugeText(
                          settingLan,
                          i18n?.language,
                          "Reconnect"
                        ) || "Reconnect"}
                      </Button>
                    ))}
                </Box>
              </Box>
            </ContentTitle>

            <Box sx={{display: "flex"}}>
              {/* {isEditPage && (
                <ResourceeEnvironments
                  control={control}
                  selectedEnvironment={selectedEnvironment}
                  setSelectedEnvironment={setSelectedEnvironment}
                />
              )} */}
              {formLoading || isLoading ? (
                <Box sx={{maxWidth: "289px", width: "100%"}}>
                  <GreyLoader />
                </Box>
              ) : resourceType === "GITHUB" ? (
                <GitForm
                  settingLan={settingLan}
                  control={control}
                  selectedEnvironment={selectedEnvironment}
                  btnLoading={configureLoading || updateLoading}
                  setSelectedEnvironment={setSelectedEnvironment}
                  projectEnvironments={projectEnvironments}
                  isEditPage={isEditPage}
                  watch={watch}
                />
              ) : resourceType === "CLICK_HOUSE" ? (
                <ClickHouseForm
                  settingLan={settingLan}
                  control={control}
                  selectedEnvironment={selectedEnvironment}
                  btnLoading={configureLoading || updateLoading}
                  setSelectedEnvironment={setSelectedEnvironment}
                  projectEnvironments={projectEnvironments}
                  isEditPage={isEditPage}
                />
              ) : resourceType === "GITLAB" ? (
                <GitLabForm
                  settingLan={settingLan}
                  control={control}
                  selectedEnvironment={selectedEnvironment}
                  btnLoading={configureLoading || updateLoading}
                  setSelectedEnvironment={setSelectedEnvironment}
                  projectEnvironments={projectEnvironments}
                  isEditPage={isEditPage}
                  watch={watch}
                />
              ) : Number(resourceType) === 3 ? (
                <PostgresCreate
                  settingLan={settingLan}
                  control={control}
                  selectedEnvironment={selectedEnvironment}
                  btnLoading={configureLoading || updateLoading}
                  setSelectedEnvironment={setSelectedEnvironment}
                  projectEnvironments={projectEnvironments}
                  isEditPage={isEditPage}
                  watch={watch}
                />
              ) : Number(resourceType) === 11 ? (
                <TransCoder
                  settingLan={settingLan}
                  control={control}
                  selectedEnvironment={selectedEnvironment}
                  btnLoading={configureLoading || updateLoading}
                  setSelectedEnvironment={setSelectedEnvironment}
                  projectEnvironments={projectEnvironments}
                  isEditPage={isEditPage}
                  watch={watch}
                />
              ) : (
                <Form
                  settingLan={settingLan}
                  control={control}
                  selectedEnvironment={selectedEnvironment}
                  btnLoading={configureLoading || updateLoading}
                  setSelectedEnvironment={setSelectedEnvironment}
                  projectEnvironments={projectEnvironments}
                  isEditPage={isEditPage}
                  watch={watch}
                  setValue={setValue}
                />
              )}
            </Box>
          </>
        )}
      </form>
    </Box>
  );
};
