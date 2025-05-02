import React, {useEffect, useState} from "react";
import {useSettingsPopupContext} from "../../providers";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {store} from "../../../../store";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
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
} from "../../../../services/resourceService";
import {useQuery} from "react-query";
import {useEnvironmentsListQuery} from "../../../../services/environmentService";
import {
  useGithubLoginMutation,
  useGitlabLoginMutation,
} from "../../../../services/githubService";
import resourceVariableService from "../../../../services/resourceVariableService";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {
  groupedResources,
  resourceTypes,
} from "../../../../utils/resourceConstants";
import {getAllFromDB} from "../../../../utils/languageDB";
import {Box} from "@mui/material";
import {ResourcesDetail} from "./ResourcesDetail";

function NewResourceDetail({handleClose = () => {}}) {
  const {
    setSearchParams: setSettingsSearchParams,
    searchParams: settingSearchParams,
    updateSearchParam,
  } = useSettingsPopupContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const resourceId = settingSearchParams.get("resourceId");
  const resourceType = settingSearchParams.get("resourceType");
  const projectId = useSelector((state) => state?.auth?.projectId);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const company = store.getState().company;
  const authStore = store.getState().auth;

  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedGitlab, setSelectedGitlab] = useState();
  const [variables, setVariables] = useState();
  const [settingLan, setSettingLan] = useState(null);
  const [openResource, setOpenResource] = useState(null);

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
      },
    });

  const {mutate: createResourceV1, isLoading: createLoadingV1} =
    useCreateResourceMutationV1({
      onSuccess: () => {
        dispatch(showAlert("Successfully created", "success"));
        navigate("/main");
      },
    });

  const {mutate: configureResource, isLoading: configureLoading} =
    useResourceConfigureMutation({
      onSuccess: () => {
        setSelectedEnvironment(null);
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

  const onSubmit = (values) => {
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

    if (isEditPage) {
      updateResourceV2({
        name: values?.name,
        type: values?.type || undefined,
        id: values?.id,
        settings: {...values?.settings},
      });
      // resourceVariableService
      //   .updateV2({
      //     project_resource_id: variables?.id,
      //     variables: computedValues2?.variables,
      //   })
      //   .then(() => {
      //     dispatch(showAlert("Resource variable updated!", "success"));
      //   })
      //   .catch((err) => {
      //     dispatch(showAlert(err, "error"));
      //   });
    } else {
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

  const onResourceTypeChange = (value) => {
    if (value !== 5 && value !== 8) {
      setOpenResource(value);
      const tab = searchParams.get("tab");
      setSearchParams({tab: tab, resource_type: value});
    }
    if (value === 5) {
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_BASE_DOMAIN;

      const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&redirect_uri=${redirectUri}`;

      window.open(url, "_blank", "noopener,noreferrer");
    } else if (value === 8) {
      const clientId = import.meta.env.VITE_CLIENT_ID_GITLAB;
      const redirectUri = import.meta.env.VITE_BASE_DOMAIN_GITLAB;

      const url = `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=api read_api read_user read_repository write_repository read_registry write_registry admin_mode read_service_ping openid profile email`;

      window.open(url, "_blank", "noopener,noreferrer");
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
  return (
    <Box>
      {Boolean(!openResource) ? (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {groupedResources?.map((element) => (
              <Box sx={{padding: "20px 16px 16px"}}>
                <FRLabel children={<>{element?.head}</>} />
                <Box sx={{display: "flex", alignItems: "center", gap: "16px"}}>
                  {element?.items?.map((val) => (
                    <ResourceButton
                      val={val}
                      onClick={() => {
                        onResourceTypeChange(val?.value);
                      }}>
                      {getElementIcon(val?.icon)}
                      <p>{val?.label}</p>
                    </ResourceButton>
                  ))}
                </Box>
              </Box>
            ))}
          </form>
        </div>
      ) : (
        <ResourcesDetail setOpenResource={setOpenResource} />
      )}
    </Box>
  );
}

const FRLabel = ({children}) => {
  return (
    <Box sx={{color: "#344054", fontWeight: 600, fontSize: "12px"}}>
      {children}
    </Box>
  );
};

const ResourceButton = ({children, onClick = () => {}, val}) => {
  return (
    <Box className={"resourceBtnAdd"} onClick={onClick}>
      {children}
    </Box>
  );
};

const getElementIcon = (element) => {
  switch (element) {
    case "mongodb":
      return <img src="/public/img/mongodb.svg" alt="" />;
    case "postgres":
      return <img src="/public/img/postgres.svg" alt="" />;
    case "restapi":
      return <img src="/public/img/resapi.svg" alt="" />;
    case "github":
      return <img src="/public/img/github.svg" alt="" />;
    case "gitlab":
      return <img src="/public/img/gitlab.svg" alt="" />;
    case "superset":
      return <img src="/public/img/superset.svg" alt="" />;
    case "clickhouse":
      return <img src="/public/img/clickhouse.svg" alt="" />;

    default:
      return <img src="/public/img/mongodb.svg" alt="" />;
  }
};

export default NewResourceDetail;
