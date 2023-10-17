import { Save } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Tabs } from "react-tabs";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import Footer from "../../components/Footer";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import HFSelect from "../../components/FormElements/HFSelect";
import HFTextField from "../../components/FormElements/HFTextField";
import HeaderSettings from "../../components/HeaderSettings";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import roleServiceV2 from "../../services/roleServiceV2";
import listToOptions from "../../utils/listToOptions";
import apiKeyService from "../../services/apiKey.service";
import PageFallback from "../../components/PageFallback";
import { store } from "../../store";

const ApiKeysForm = () => {
  const { appId, apiKeyId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
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

  // Export to Json
  // const exportToJson = async () => {
  //   await exportToJsonService
  //     .postToJson({
  //       table_ids: ids,
  //     })
  //     .then((res) => {
  //       download({
  //         link: "https://" + res?.link,
  //         fileName: res?.link.split("/").pop(),
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("exportToJson error", err);
  //     });
  // };

  // const inputChangeHandler = (e) => {
  //   const file = e.target.files[0];

  //   const data = new FormData();
  //   data.append("file", file);

  //   fileService.upload(data).then((res) => {
  //     fileSend(res?.filename);
  //   });
  // };

  // const fileSend = (value) => {
  //   exportToJsonService.uploadToJson({
  //     file_name: value,
  //     app_id: appId,
  //   });
  // };

  useEffect(() => {
    getClientTypeList();
    // if (appId) {
    //   // getData();
    //   // getApp();
    // } else {
    //   setLoader(false);
    // }
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

  const computedClientTypes = useMemo(() => {
    return listToOptions(clientType?.response, "name", "guid");
  }, [clientType?.response]);

  const computedRoles = useMemo(() => {
    return listToOptions(role?.response, "name", "guid");
  }, [role?.response]);

  const onSubmit = (data) => {
    if (apiKeyId) updateApp(data);
    else createApp(data);
  };

  if (loader) return <PageFallback />;

  return (
    <div>
      <Tabs
        selectedIndex={Number(search.get("tab") ?? 0)}
        onSelect={(index) => setSearch({ tab: index })}
        direction={"ltr"}
        style={{ height: "100vh", position: "relative" }}
      >
        <HeaderSettings
          title="Приложение"
          backButtonLink={-1}
          subtitle={appId ? mainForm.watch("name") : "Новый"}
        ></HeaderSettings>

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
            {/* <FRow
              label={"Client type"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFSelect
                name="client_type_id"
                control={mainForm.control}
                fullWidth
                required
                options={computedClientTypes}
              />
            </FRow>
            <FRow
              label={"Role type"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFSelect
                name="role_id"
                control={mainForm.control}
                fullWidth
                required
                options={computedRoles}
              />
            </FRow> */}
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
      </Tabs>
    </div>
  );
};

export default ApiKeysForm;
