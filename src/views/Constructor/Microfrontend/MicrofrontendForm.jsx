import { Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import Footer from "../../../components/Footer";
import FormCard from "../../../components/FormCard";
import FRow from "../../../components/FormElements/FRow";
import HFTextField from "../../../components/FormElements/HFTextField";
import HeaderSettings from "../../../components/HeaderSettings";
import PageFallback from "../../../components/PageFallback";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import applicationService from "../../../services/applicationSercixe";
import { fetchApplicationListActions } from "../../../store/application/application.thunk";
import microfrontendService from "../../../services/microfrontendService";

const microfrontendListPageLink = "/settings/constructor/microfrontend";

const MicrofrontendForm = () => {
  const { microfrontendId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [btnLoader, setBtnLoader] = useState();
  const [loader, setLoader] = useState(true);
  const [appData, setAppData] = useState({});
  const [appPermission, setAppPermission] = useState();

  const mainForm = useForm({
    defaultValues: {
      description: "",
      name: "",
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
    else createMicrofrontend(data);
  };

  if (loader) return <PageFallback />;

  return (
    <div>
      <HeaderSettings
        title="Микрофронтенд"
        backButtonLink={microfrontendListPageLink}
        subtitle={microfrontendId ? mainForm.watch("name") : "Новый"}
      ></HeaderSettings>

      <form
        onSubmit={mainForm.handleSubmit(onSubmit)}
        className="p-2"
        style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
      >
        <FormCard title="Детали" maxWidth={500}>
          <FRow
            label={"Ссылка"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="path"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
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
          <FRow label="Описания">
            <HFTextField
              name="description"
              control={mainForm.control}
              multiline
              rows={4}
              fullWidth
            />
          </FRow>
        </FormCard>
      </form>

      <Footer
        extra={
          <>
            <SecondaryButton
              onClick={() => navigate(microfrontendListPageLink)}
              color="error"
            >
              Закрыть
            </SecondaryButton>
            <PermissionWrapperV2 tabelSlug="app" type="update">
              <PrimaryButton
                loader={btnLoader}
                onClick={mainForm.handleSubmit(onSubmit)}
              >
                <Save /> Сохранить
              </PrimaryButton>
            </PermissionWrapperV2>
          </>
        }
      />
    </div>
  );
};

export default MicrofrontendForm;
