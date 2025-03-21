import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { store } from "@/store";
import { showAlert } from "@/store/alert/alert.thunk";
import {
  useRedirectCreateMutation,
  useRedirectGetByIdQuery,
  useRedirectListQuery,
  useRedirectUpdateMutation,
} from "@/services/redirectService";
import { useState } from "react";
import { useSettingsPopupContext } from "../../providers";

export const useRedirectFormProps = () => {
  const { searchParams, setSearchParams } = useSettingsPopupContext();

  // const {redirectId} = useParams();
  const redirectId = searchParams.get("redirectId");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [computedData, setComputedData] = useState();

  const onBackClick = () => {
    setSearchParams({});
  };

  const mainForm = useForm({
    defaultValues: {
      defaultFrom: "/x-api/",
      defaultTo: "/",
    },
  });

  const { isLoading: redirectLoading } = useRedirectListQuery({
    queryParams: {
      onSuccess: (res) => setComputedData(res?.redirect_urls?.length),
    },
  });

  const { isLoading } = useRedirectGetByIdQuery({
    redirectId: redirectId,
    queryParams: {
      enabled: Boolean(redirectId),
      onSuccess: (res) => {
        console.log(res);
        mainForm.reset({
          ...res,
          from: res.from.slice(5),
          to: res.to.slice(1),
          defaultFrom: "/x-api/",
          defaultTo: "/",
        });
      },
    },
  });

  const { mutateAsync: createRedirect, isLoading: createLoading } =
    useRedirectCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["REDIRECT"]);
        store.dispatch(showAlert("Успешно", "success"));
        navigate(-1);
      },
    });
  const { mutateAsync: updateRedirect, isLoading: updateLoading } =
    useRedirectUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["REDIRECT"]);
        store.dispatch(showAlert("Успешно", "success"));
        navigate(-1);
      },
    });

  const onSubmit = (data) => {
    if (redirectId)
      updateRedirect({
        ...data,
        from: data.defaultFrom + data.from,
        to: data.defaultTo + data.to,
      });
    else
      createRedirect({
        ...data,
        from: data.defaultFrom + data.from,
        to: data.defaultTo + data.to,
        order: computedData + 1,
      });
  };

  return {
    isLoading,
    redirectId,
    mainForm,
    onSubmit,
    navigate,
    createLoading,
    updateLoading,
    onBackClick,
  };
};