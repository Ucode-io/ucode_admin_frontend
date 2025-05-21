import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import microfrontendService, {
  useMicrofrontendCreateWebhookMutation,
} from "@/services/microfrontendService";
import {useResourceListQueryV2} from "@/services/resourceService";
import listToOptions from "@/utils/listToOptions";
import {
  useGithubBranchesQuery,
  useGithubRepositoriesQuery,
} from "@/services/githubService";
import {showAlert} from "@/store/alert/alert.thunk";
import {useDispatch} from "react-redux";
import { useSettingsPopupContext } from "../../providers";

export const useMicroFrontendDetailProps = () => {

  const { setSearchParams, searchParams } = useSettingsPopupContext();

  const microfrontendId = searchParams.get("microfrontendId")

  const { appId} = useParams();
  const navigate = useNavigate();

  const [btnLoader, setBtnLoader] = useState();
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();

  const microfrontendListPageLink = `/main/${appId}/microfrontend`;

  const mainForm = useForm({
    defaultValues: {
      description: "",
      name: "",
      framework_type: "REACT",
      resource_id: "ucode_gitlab",
    },
  });

  const resourceId = mainForm.watch("resource_id");
  const selectedRepo = mainForm.watch("repo_name");

  const frameworkOptions = [
    {
      label: "React",
      value: "REACT",
    },
    {
      label: "Vue",
      value: "VUE",
    },
    {
      label: "Angular",
      value: "ANGULAR",
    },
  ];

  const {data: resources} = useResourceListQueryV2({
    params: {
      type: "GITHUB",
    },
    queryParams: {
      select: (res) => res.resources,
    },
  });

  const resourceOptions = useMemo(() => {
    return [
      {value: "ucode_gitlab", label: "Ucode GitLab"},
      ...listToOptions(resources, "name", "id", " (GitHub)"),
    ];
  }, [resources]);

  const selectedResource = useMemo(() => {
    if (resourceId === "ucode_gitlab") return null;

    return resources?.find((resource) => resource.id === resourceId);
  }, [resources, resourceId]);

  const handleBackClick = () => {
    setSearchParams({})
  }

  const {data: repositories} = useGithubRepositoriesQuery({
    username: selectedResource?.settings?.github?.username,
    token: selectedResource?.settings?.github?.token,
    queryParams: {
      enabled: !!selectedResource?.settings?.github?.username,
      select: (res) => listToOptions(res, "name", "name"),
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

  const {mutate: createWebHook, isLoading: createWebHookIsLoading} =
    useMicrofrontendCreateWebhookMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully created", "success"));
        navigate(microfrontendListPageLink);
      },
    });

  const createMicrofrontend = (data) => {
    setBtnLoader(true);
    microfrontendService
      .create(data)
      .then(() => {
        navigate(microfrontendListPageLink);
      })
      .catch(() => setBtnLoader(false));
  };

  const updateMicrofrontend = (data) => {
    setBtnLoader(true);

    microfrontendService
      .update({
        ...data,
      })
      .then(() => {
        navigate(microfrontendListPageLink);
      })
      .catch(() => setBtnLoader(false));
  };

  const getData = () => {
    setLoader(true);

    microfrontendService
      .getById(microfrontendId)
      .then((res) => {
        mainForm.reset(res);
        mainForm.setValue("resource_id", res?.resource || "ucode_gitlab");
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    if (microfrontendId) {
      getData();
    } else {
      setLoader(false);
    }
  }, []);

  const onSubmit = (data) => {
    if (microfrontendId) updateMicrofrontend(data);
    else {
      if (resourceId === "ucode_gitlab") createMicrofrontend(data);
      else
        createWebHook({
          ...data,
          github_token: selectedResource?.token,
          username: selectedResource?.username,
          type:
            selectedResource?.type === "GITHUB" ? "MICRO_FRONTEND" : undefined,
        });
    }
  };

  return {
    loader,
    microfrontendId,
    mainForm,
    onSubmit,
    resourceOptions,
    resourceId,
    repositories,
    branches,
    frameworkOptions,
    handleBackClick,
  }
}
