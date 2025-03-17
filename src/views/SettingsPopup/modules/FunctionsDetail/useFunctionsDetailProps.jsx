import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useResourceListQueryV2} from "@/services/resourceService";
import listToOptions from "@/utils/listToOptions";
import {
  useMicrofrontendCreateWebhookMutation,
} from "@/services/microfrontendService";
import {
  useGithubBranchesQuery,
  useGithubRepositoriesQuery,
} from "@/services/githubService";
import functionService, {
  useFunctionByIdQuery,
  useFunctionCreateMutation,
  useFunctionUpdateMutation,
} from "@/services/functionService";
import {
  useGitlabBranchesQuery,
  useGitlabRepositoriesQuery,
} from "@/services/githubService";
import {useTranslation} from "react-i18next";

import {showAlert} from "@/store/alert/alert.thunk";
import { useGetLang } from "@/hooks/useGetLang";
import { useSettingsPopupContext } from "../../providers";

export const useFunctionsDetailProps = () => {

  const lang = useGetLang("Functions");
  const { appId } = useParams();

  const { searchParams, setSearchParams, } = useSettingsPopupContext();

  const functionId = searchParams.get("functionId");

  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [logsList, setLogsList] = useState(null);
  const [btnLoader, setBtnLoader] = useState();

  const dispatch = useDispatch();
  const {i18n} = useTranslation();

  const microfrontendListPageLink = `/main/${appId}/openfaas-functions`;

  const mainForm = useForm({
    defaultValues: {
      description: "",
      name: "",
      // framework_type: "REACT",
      resource_id: "ucode_gitlab",
      type: "FUNCTION",
    },
  });

  const knativeForm = useForm({});

  const resourceId = mainForm.watch("resource_id");
  const selectedRepo = mainForm.watch("repo_name");

  const {data: resources} = useResourceListQueryV2({
    params: {
      type: "GIT",
    },
    queryParams: {
      select: (res) => res?.resources,
    },
  });

  const resourceOptions = useMemo(() => {
    return [
      {value: "ucode_gitlab", label: "Ucode GitLab"},
      ...listToOptions(resources, "name", "id"),
    ];
  }, [resources]);

  const handleBackClick = () => {
    setSearchParams({ });
  }

  const selectedResource = useMemo(() => {
    if (resourceId === "ucode_gitlab") return null;

    return resources?.find((resource) => resource.id === resourceId);
  }, [resources, resourceId]);

  const {data: repositories} = useGithubRepositoriesQuery({
    username: selectedResource?.settings?.github?.username,
    token: selectedResource?.settings?.github?.token,
    queryParams: {
      enabled: !!selectedResource?.settings?.github?.username,
      select: (res) => listToOptions(res, "name", "name"),
    },
  });

  const {data: repositoriesGitlab} = useGitlabRepositoriesQuery({
    username: selectedResource?.settings?.gitlab?.username,
    token: selectedResource?.settings?.gitlab?.token,
    resource_id: selectedResource?.id,
    queryParams: {
      enabled: !!selectedResource?.settings?.gitlab?.username,
      select: (res) => res,
    },
  });

  const {data: branches} = useGithubBranchesQuery({
    username: selectedResource?.settings?.github?.username,
    repo: selectedRepo,
    token: selectedResource?.settings?.github?.token,
    queryParams: {
      enabled: !!selectedResource?.settings?.github?.username && !!selectedRepo,
      select: (res) => listToOptions(res, "name", "name"),
    },
  });

  const gitlabRepoId = repositoriesGitlab?.find(
    (item) => item?.name === selectedRepo
  )?.id;

  const {data: branchesGitlab} = useGitlabBranchesQuery({
    username: selectedResource?.settings?.gitlab?.username,
    repo_id: gitlabRepoId,
    token: selectedResource?.settings?.gitlab?.token,
    resource_id: selectedResource?.id,
    queryParams: {
      enabled:
        !!selectedResource?.settings?.gitlab?.username &&
        !!selectedRepo &&
        Boolean(gitlabRepoId),
      select: (res) => listToOptions(res, "name", "name"),
    },
  });

  const {mutate: createWebHook, isLoading: createWebHookIsLoading} =
    useMicrofrontendCreateWebhookMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully created", "success"));
        navigate(-1);
      },
    });

  const {mutate: createFunction, isLoading: createFunctionIsLoading} =
    useFunctionCreateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully created", "success"));
        navigate(-1);
      },
    });

  const {mutate: updateFunction, isLoading: updateFunctionIsLoading} =
    useFunctionUpdateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully updated", "success"));
        navigate(-1);
      },
    });

  const {isLoading} = useFunctionByIdQuery({
    functionId,
    queryParams: {
      enabled: Boolean(functionId),
      onSuccess: (res) => {
        knativeForm.setValue(
          "type",
          res?.type === "FUNCTION"
            ? "openfass-fn"
            : res?.type === "KNATIVE"
              ? "knative-fn"
              : ""
        );

        knativeForm.setValue("path", res?.path);
        mainForm.reset({...res});
      },
    },
  });

  const onSubmit = (data) => {
    if (functionId) updateFunction(data);
    else {
      if (resourceId === "ucode_gitlab") createFunction(data);
      else
        createWebHook({
          ...data,
          github_token: selectedResource?.token,
          username: selectedResource?.username,
          repo_id: gitlabRepoId,
        });
    }
  };

  const startDateTimeStap = (time = 0) => {
    const date = new Date();
    const timestamp = date.getTime();

    return timestamp - time;
  };

  const onSubmitKnative = (data) => {
    setLoader(true);
    functionService
      .getFunctionLogs({
        From: startDateTimeStap(data?.time_frame).toString(),
        To: startDateTimeStap().toString(),
        Namespace: data?.type,
        Function: data?.path,
      })
      .then((res) => {
        setLogsList(res);
        setLoader(false);
      })
      .catch((err) => setLoader(false));
  };

  useEffect(() => {
    if (selectedRepo) {
      mainForm.setValue("name", selectedRepo);
    }
  }, [selectedRepo]);

  const resourcesOptions = repositories?.length
    ? repositories
    : listToOptions(repositoriesGitlab, "name", "name");


  return {
    functionId,
    navigate,
    btnLoader,
    loader,
    logsList,
    lang,
    i18n,
    microfrontendListPageLink,
    mainForm,
    knativeForm,
    resourceId,
    resourceOptions,
    branches,
    branchesGitlab,
    createWebHookIsLoading,
    createFunctionIsLoading,
    updateFunctionIsLoading,
    isLoading,
    onSubmit,
    onSubmitKnative,
    resourcesOptions,
    handleBackClick,
  };
};
