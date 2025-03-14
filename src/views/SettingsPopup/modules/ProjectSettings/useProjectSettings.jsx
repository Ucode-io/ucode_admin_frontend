import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { store } from "../../../../store";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useProjectGetByIdQuery, useProjectsAllSettingQuery, useProjectUpdateMutation } from "../../../../services/projectService";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { useGetLang } from "../../../../hooks/useGetLang";

export const useProjectSettings = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const company = store.getState().company;
  const {i18n} = useTranslation();
  const lang = useGetLang("Setting");
  const { control, reset, handleSubmit, watch, register, setValue } = useForm({
    defaultValues: {
      new_layout: false,
      new_design: false,
    },
  });
  const dispatch = useDispatch();

  const { isLoading } = useProjectGetByIdQuery({
    projectId: company.projectId,
    queryParams: {
      onSuccess: (res) => {
        console.log({ res });
        reset({
          ...res,
          language: res?.language?.map((lang) => lang.id),
          currency: res.currency.id,
          timezone: res.timezone.id,
        });
      },
    },
  });

  const { data: language } = useProjectsAllSettingQuery({
    params: {
      "project-id": company.projectId,
      type: "LANGUAGE",
      limit: 200,
    },
  });
  const { data: timezone } = useProjectsAllSettingQuery({
    params: {
      "project-id": company.projectId,
      type: "TIMEZONE",
      limit: 200,
    },
  });
  const { data: currency } = useProjectsAllSettingQuery({
    params: {
      "project-id": company.projectId,
      type: "CURRENCY",
      limit: 200,
    },
  });

  const languageOptions = useMemo(() => {
    const arr = [];
    language?.data?.language?.forEach((el) => {
      arr.push({
        value: el?.id,
        label: el.name,
      });
    });
    return arr;
  }, [language]);

  const timezoneOptions = useMemo(() => {
    const arr = [];
    timezone?.data?.timezone?.forEach((el) => {
      arr.push({
        value: el?.id,
        label: el.name,
      });
    });
    return arr;
  }, [timezone]);

  const currencyOptions = useMemo(() => {
    const arr = [];
    currency?.data?.currency?.forEach((el) => {
      arr.push({
        value: el?.id,
        label: el.name,
      });
    });
    return arr;
  }, [currency]);

  const { mutate: updateProject, isLoading: btnLoading } =
    useProjectUpdateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully updated", "success"));
        queryClient.invalidateQueries(["PROJECTS"]);
      },
    });

  const filteredLanguage = languageOptions?.filter((item) =>
    watch("language")?.includes(item.value)
  );
  const filteredCurrency = currencyOptions?.filter(
    (item) => item.value === watch("currency")
  );
  const filteredTimezone = timezoneOptions?.filter(
    (item) => item.value === watch("timezone")
  );

  const onSubmit = (values) => {
    updateProject({
      ...values,
      timezone: filteredTimezone.map((item) => ({
        id: item.value,
        label: item.label,
      }))[0],
      currency: filteredCurrency.map((item) => ({
        id: item.value,
        label: item.label,
      }))[0],
      project_id: company.projectId,
      k8s_namespace: "cp-region-type-id",
      company_id: company.companyId,
      language: filteredLanguage.map((item) => ({
        id: item.value,
        label: item.label,
      })),
    });
  };

  return {
    navigate,
    i18n,
    lang,
    control,
    register,
    handleSubmit,
    onSubmit,
    watch,
    languageOptions,
    timezoneOptions,
    currencyOptions,
    btnLoading,
    setValue,
    isLoading,
  };
};
