import { Save } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import HeaderSettings from "../../../HeaderSettings";
import FormCard from "../../../FormCard";
import FRow from "../../../FormElements/FRow";
import HFTextField from "../../../FormElements/HFTextField";
import Footer from "../../../Footer";
import SecondaryButton from "../../../Buttons/SecondaryButton";
import PrimaryButton from "../../../Buttons/PrimaryButton";
import { useDispatch } from "react-redux";
import {
  useEmailCreateMutation,
  useEmailListQuery,
  useEmailUpdateMutation,
} from "../../../../services/emailService";
import { useEffect, useMemo, useState } from "react";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { store } from "../../../../store";
import {
  useProjectGetByIdQuery,
  useProjectUpdateMutation,
  useProjectsAllSettingQuery,
} from "../../../../services/projectService";
import HFAvatarUpload from "../../../FormElements/HFAvatarUpload";
import HFSelect from "../../../FormElements/HFSelect";
import HFMultipleSelect from "../../../FormElements/HFMultipleSelect";

const ProjectSettingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const company = store.getState().company;
  const { emailId } = useParams();
  const [type, setType] = useState("");
  const [check, setCheck] = useState(true);
  const { control, reset, handleSubmit, setValue, watch, getValues } =
    useForm();

  const { isLoading } = useProjectGetByIdQuery({
    projectId: company.projectId,
    queryParams: {
      onSuccess: (res) => {
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
        queryClient.invalidateQueries(["PROJECTS"]);
      },
    });

  const filteredLanguage = languageOptions.filter((item) =>
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

  return (
    <div>
      <HeaderSettings
        title="Project settings"
        backButtonLink={-1}
        subtitle={watch("title")}
      ></HeaderSettings>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-2"
        style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
      >
        <FormCard title="Детали" maxWidth={500}>
          <FRow
            label={"Name"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="title"
              control={control}
              fullWidth
              required
            />
          </FRow>
          <HFAvatarUpload control={control} name="logo" />

          <FRow
            label={"Language"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFMultipleSelect
              options={languageOptions}
              name="language"
              control={control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"Currency"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFSelect
              disabledHelperText
              options={currencyOptions}
              name="currency"
              control={control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"Timezone"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFSelect
              disabledHelperText
              options={timezoneOptions}
              name="timezone"
              control={control}
              fullWidth
              required
            />
          </FRow>
        </FormCard>
      </form>

      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => navigate(-1)} color="error">
              Закрыть
            </SecondaryButton>
            <PrimaryButton loader={btnLoading} onClick={handleSubmit(onSubmit)}>
              <Save /> Сохранить
            </PrimaryButton>
          </>
        }
      />
    </div>
  );
};

export default ProjectSettingPage;
