import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import FormCard from "../../../../components/FormCard";
import FRow from "../../../../components/FormElements/FRow";
import HFAvatarUpload from "../../../../components/FormElements/HFAvatarUpload";
import HFTextField from "../../../../components/FormElements/HFTextField";
import Header from "../../../../components/Header";
import CancelButton from "../../../../components/Buttons/CancelButton";
import SaveButton from "../../../../components/Buttons/SaveButton";
import authService from "../../../../services/auth/authService";
import userService from "../../../../services/auth/userService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box, Button, Typography } from "@mui/material";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import BillingComponent from "./BillingComponent";
import AddIcon from "@mui/icons-material/Add";
import BillingTariffs from "./BillingTariffs";
import { generateLangaugeText } from "../../../../utils/generateLanguageText";
import { useTranslation } from "react-i18next";

const UsersForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isUserInfo = useSelector((state) => state?.auth?.userInfo);
  const envId = useSelector((state) => state?.auth);
  const isUserId = useSelector((state) => state?.auth?.userId);
  const role = useSelector((state) => state?.auth?.roleInfo);
  const clientType = useSelector((state) => state?.auth?.clientType);
  const projectId = useSelector((state) => state?.auth?.projectId);
  const [inputType, setInputType] = useState(true);
  const [passwordType, setPasswordType] = useState(true);
  const dispatch = useDispatch();
  const [inputMatch, setInputMatch] = useState(false);
  const [selectedTab, setSelectedTab] = useState(location?.state?.tab ?? 0);
  const [addBalance, setAddBalance] = useState(false);

  const handClickBalance = () => setAddBalance(true);

  const update = (data) => {
    const oldPassword = data?.old_password;
    const newPassword = data?.new_password;

    const requestData = {
      ...data,
      guid: isUserInfo?.id,
      user_id: isUserInfo?.id,
      client_type_id: clientType?.id,
      project_id: projectId,
      environment_id: envId?.environmentId,
    };

    userService
      ?.updateV2({
        ...requestData,
      })
      .then((res) => {
        if (newPassword || oldPassword) {
          resetPasswordV2(
            oldPassword,
            newPassword,
            clientType?.id,
            projectId,
            envId?.environmentId,
          );
        } else {
          delete requestData.confirm_password;
        }
      });
  };

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      name: "",
      email: "",
      login: "",
      phone: "",
      password: "",
      client_type_id: clientType?.id ?? "",
      role_id: role?.id ?? "",
    },
  });

  const resetPasswordV2 = (
    oldPassword,
    newPassword,
    clientTypeId,
    projectId,
    envId,
  ) => {
    authService
      .resetUserPasswordV2({
        password: newPassword,
        old_password: oldPassword,
        user_id: isUserId,
        client_type_id: clientTypeId,
        project_id: projectId,
        environment_id: envId,
      })
      .then((res) => {
        dispatch(showAlert("Password successfuly updated", "success"));
      })
      .catch((err) => {
        dispatch(showAlert("Something went wrong on changing password"));
      });
  };

  const onSubmit = (values) => {
    if (values?.new_password && values?.old_password) {
      if (values?.new_password !== values?.confirm_password) {
        dispatch(showAlert("Confirm Password fields do not match"));
        setInputMatch(true);
      } else if (isUserInfo) {
        update(values);
        setInputMatch(false);
      }
    } else if (isUserInfo) {
      update(values);
      setInputMatch(false);
    }
  };

  useEffect(() => {
    authService
      .getUserById(isUserId, {
        "project-id": projectId,
        "client-type-id": clientType?.id,
      })
      .then((res) => {
        reset(res);
      });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs selectedIndex={selectedTab} onSelect={setSelectedTab}>
          <Header
            styles={{ height: "50px" }}
            title={t("profile")}
            backButtonLink={-1}
            extra={
              selectedTab === 0 ? (
                <>
                  <CancelButton
                    title={t("cancel")}
                    onClick={() => navigate(-1)}
                  />
                  <SaveButton type="submit" title={t("save")} />
                </>
              ) : (
                <Button
                  onClick={handClickBalance}
                  variant="contained"
                  color="primary"
                  sx={{
                    width: "150px",
                    height: "30px",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <AddIcon />
                  <Typography variant="h6">Top Up</Typography>
                </Button>
              )
            }
          >
            <TabList
              style={{
                border: "none",
                height: "40px",
                display: "flex",
                alignItems: "center",
                marginBottom: "0",
                overflow: "hidden",
              }}
            >
              <Tab style={{ border: "none" }}>Profile</Tab>
              <Tab style={{ border: "none" }}>Billing</Tab>
              <Tab style={{ border: "none" }}>Tariffs</Tab>
            </TabList>
          </Header>

          <TabPanel>
            <FormCard
              // title={generateLangaugeText() ||"Main info"}
              title={t("main.info")}
              className="UsersForm p-2"
            >
              <div>
                <HFAvatarUpload control={control} name="photo_url" />
              </div>

              <div className="side">
                <FRow label={t("name")}>
                  <HFTextField
                    placeholder={t("enter_name")}
                    fullWidth
                    control={control}
                    autoFocus
                    name="name"
                  />
                </FRow>

                <FRow label={t("email")}>
                  <HFTextField
                    placeholder={t("enter.email")}
                    fullWidth
                    control={control}
                    name="email"
                  />
                </FRow>

                <FRow label={t("phone")}>
                  <HFTextField
                    placeholder={t("enter.phone")}
                    fullWidth
                    control={control}
                    name="phone"
                  />
                </FRow>

                <FRow label={t("login")}>
                  <HFTextField
                    placeholder={t("enter.login")}
                    fullWidth
                    control={control}
                    name="login"
                  />
                </FRow>

                <FRow label={t("type")}>
                  <HFTextField
                    placeholder={t("type")}
                    fullWidth
                    control={control}
                    name="client_type_id"
                    value={clientType?.name}
                    disabled
                  />
                </FRow>

                <FRow label={t("role")}>
                  <HFTextField
                    placeholder={t("role")}
                    fullWidth
                    control={control}
                    name="role_id"
                    disabled
                    value={role?.name}
                  />
                </FRow>

                <FRow label={t("old.password")}>
                  <HFTextField
                    placeholder={t("old.password")}
                    fullWidth
                    control={control}
                    name="old_password"
                  />
                </FRow>

                <FRow
                  style={{ position: "relative" }}
                  label={t("new.password")}
                >
                  <HFTextField
                    placeholder={t("new.password")}
                    fullWidth
                    control={control}
                    name="new_password"
                    type={inputType ? "password" : "text"}
                  />

                  <Box
                    onClick={() => setInputType(!inputType)}
                    sx={{
                      position: "absolute",
                      right: "15px",
                      bottom: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {inputType ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </Box>
                </FRow>

                <FRow
                  style={{ position: "relative" }}
                  label={t("confirm.password")}
                >
                  <HFTextField
                    placeholder={t("confirm.password")}
                    fullWidth
                    control={control}
                    name="confirm_password"
                    type={passwordType ? "password" : "text"}
                    style={{
                      border: `1px solid ${inputMatch ? "red" : "#eee"}`,
                    }}
                  />

                  <Box
                    onClick={() => setPasswordType(!passwordType)}
                    sx={{
                      position: "absolute",
                      right: "15px",
                      bottom: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {passwordType ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </Box>
                </FRow>
              </div>
            </FormCard>
          </TabPanel>

          <TabPanel>
            <BillingComponent
              setAddBalance={setAddBalance}
              addBalance={addBalance}
            />
          </TabPanel>

          <TabPanel>
            <BillingTariffs
              setAddBalance={setAddBalance}
              addBalance={addBalance}
              watch={watch}
              control={control}
              reset={reset}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
            />
          </TabPanel>
        </Tabs>
      </form>
    </>
  );
};

export default UsersForm;
