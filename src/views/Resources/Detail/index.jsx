import {useEffect} from "react";
import {useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {Box, Button} from "@mui/material";
import {useEnvironmentsListQuery} from "../../../services/environmentService";
import {
  useResourceConfigureMutation,
  useResourceCreateMutation,
  useResourceCreateMutationV2,
  useResourceEnvironmentGetByIdQuery,
  useResourceGetByIdQueryV1,
  useResourceGetByIdQueryV2,
  useResourceReconnectMutation,
  useResourceUpdateMutation,
  useResourceUpdateMutationV2,
} from "../../../services/resourceService";
import {store} from "../../../store";
import ResourceeEnvironments from "./ResourceEnvironment";
import Form from "./Form";
import AllowList from "./AllowList";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {resourceTypes} from "../../../utils/resourceConstants";
import resourceVariableService from "../../../services/resourceVariableService";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../store/alert/alert.thunk";
import {
  useGithubLoginMutation,
  useGithubUserQuery,
} from "@/services/githubService";
import GitForm from "./GitForm";

const headerStyle = {
  width: "100%",
  height: "50px",
  borderBottom: "1px solid #e5e9eb",
  display: "flex",
  alignItems: "center",
  // gap: '20px',
  padding: "15px",
  justifyContent: "space-between",
};

const ResourceDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {projectId, resourceId, resourceType} = useParams();
  const location = useLocation();
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [variables, setVariables] = useState();
  const navigate = useNavigate();
  const company = store.getState().company;
  const authStore = store.getState().auth;
  const dispatch = useDispatch();

  const isEditPage = !!resourceId;

  const {control, reset, handleSubmit, setValue, watch} = useForm({
    defaultValues: {
      name: "",
      variables: variables?.variables,
      resource_type:
        searchParams.get("code") || searchParams.get("access_token") ? 5 : 0,
    },
  });

  // const resourceType = watch("resource_type");

  // const {isLoading} = useResourceGetByIdQueryV1({
  //   id: resourceId,
  //   params: {
  //     type: resourceType,
  //   },
  //   queryParams: {
  //     cacheTime: false,
  //     enabled: isEditPage && location?.state?.type !== "REST",
  //     onSuccess: (res) => {
  //       reset(res);
  //       setSelectedEnvironment(
  //         res.environments?.filter((env) => env.is_configured)
  //       );
  //     },
  //   },
  // });

  const {isLoading} = useResourceGetByIdQueryV2({
    id: resourceId,
    params: {
      type: resourceType,
    },
    queryParams: {
      cacheTime: false,
      enabled: isEditPage && location?.state?.type !== "REST",
      onSuccess: (res) => {
        reset(res);
        setSelectedEnvironment(
          res.environments?.filter((env) => env.is_configured)
        );
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
      enabled: Boolean(selectedEnvironment?.[0].resource_environment_id),
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

  useGithubUserQuery({
    token: searchParams.get("access_token"),
    enabled: !!searchParams.get("access_token"),
    queryParams: {
      select: (res) => res?.data?.login,
      onSuccess: (username) =>
        setValue("integration_resource.username", username),
    },
  });

  const {mutate: githubLogin, isLoading: githubLoginIsLoading} =
    useGithubLoginMutation({
      onSuccess: (res) => {
        setSearchParams({access_token: res.access_token});
      },
      onError: () => {
        // navigate(microfrontendListPageLink);
      },
    });

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      githubLogin({code});
    }
  }, []);

  const onSubmit = (values) => {
    const computedValues2 = {
      ...values,
      type: values?.resource_type,
      company_id: company?.companyId,
      project_id: projectId,
      resource_id: resourceId,
      user_id: authStore.userId,
      // environment_id: selectedEnvironment?.[0].id,
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

    if (isEditPage) {
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
          dispatch(showAlert("Resource variable updated!", "success"));
        })
        .catch((err) => {
          dispatch(showAlert(err, "error"));
        });
    } else {
      if (values?.resource_type === 4 || values?.resource_type === 5) {
        // delete computedValues2.resource_type;

        createResourceV2(computedValues2);
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
    // setValue(
    //   "resource_type",
    //   resourceTypes.find((item) => item?.label === variables?.type).value
    // );
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

  return (
    <Box sx={{background: "#fff"}}>
      <form flex={1} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={headerStyle}>
          <Box sx={{display: "flex", alignItems: "center"}}>
            <Button
              onClick={() =>
                navigate("/main/c57eedc3-a954-4262-a0af-376c65b5a280")
              }
              sx={{cursor: "pointer", width: "16px", height: "30px"}}>
              <KeyboardBackspaceIcon style={{fontSize: "26px"}} />
            </Button>
            <h2>Resource settings</h2>
          </Box>
          <Box>
            <Button
              bg="primary"
              type="submit"
              sx={{fontSize: "14px", margin: "0 10px"}}
              hidden={isEditPage}
              isLoading={createLoading}>
              Save changes
            </Button>
            {isEditPage && variables?.type !== "REST" && (
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
                Reconnect
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{display: "flex"}}>
          {isEditPage && (
            <ResourceeEnvironments
              control={control}
              selectedEnvironment={selectedEnvironment}
              setSelectedEnvironment={setSelectedEnvironment}
            />
          )}
          {formLoading || isLoading ? (
            // <SimpleLoader flex={1} />
            <h2>Loader</h2>
          ) : resourceType === "GITHUB" ? (
            <GitForm
              control={control}
              selectedEnvironment={selectedEnvironment}
              btnLoading={configureLoading || updateLoading}
              setSelectedEnvironment={setSelectedEnvironment}
              projectEnvironments={projectEnvironments}
              isEditPage={isEditPage}
            />
          ) : (
            <Form
              control={control}
              selectedEnvironment={selectedEnvironment}
              btnLoading={configureLoading || updateLoading}
              setSelectedEnvironment={setSelectedEnvironment}
              projectEnvironments={projectEnvironments}
              isEditPage={isEditPage}
            />
          )}
          <AllowList />
        </Box>
      </form>
    </Box>
  );
};

export default ResourceDetail;
