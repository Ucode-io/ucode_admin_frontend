import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux";
import authService from "../../../../services/auth/authService";
import { showAlert } from "../../../../store/alert/alert.thunk";
import userService from "../../../../services/auth/userService";
import sessionService from "../../../../services/sessionService";

export const useAccountProps = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const role = useSelector((state) => state?.auth?.roleInfo);
  const clientType = useSelector((state) => state?.auth?.clientType);
  const userId = useSelector((state) => state?.auth?.userId);

  const projectId = useSelector((state) => state?.auth?.projectId);
  const userInfo = useSelector((state) => state?.auth?.userInfo);
  const envId = useSelector((state) => state?.auth);

  const [inputType, setInputType] = useState(true);
  const [passwordType, setPasswordType] = useState(true);

  const [inputMatch, setInputMatch] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(false);

  const [sessions, setSessions] = useState([]);

  const getSessions = () => {
    sessionService
      .getList({
        user_id: envId?.userId,
        client_type_id: envId?.clientType?.id,
        limit: 50,
        offset: 1,
      })
      .then((res) => {
        setSessions(res?.sessions);
      });
  };

  const deleteSession = (id) => {
    sessionService.delete(id).then(() => getSessions());
  };

  const handleProfilePhotoUpload = (photoUrl) => {
    setPhotoUrl(photoUrl);
  };

  const resetPasswordV2 = (
    oldPassword,
    newPassword,
    clientTypeId,
    projectId,
    envId
  ) => {
    authService
      .resetUserPasswordV2({
        password: newPassword,
        old_password: oldPassword,
        user_id: userId,
        client_type_id: clientTypeId,
        project_id: projectId,
        environment_id: envId,
      })
      .then((res) => {
        dispatch(showAlert("Password successfully updated", "success"));
      })
      .catch((err) => {
        dispatch(showAlert("Something went wrong on changing password"));
      });
  };

  const update = (data) => {
    const oldPassword = data?.old_password;
    const newPassword = data?.new_password;

    const requestData = {
      ...data,
      guid: userInfo?.id,
      user_id: userInfo?.id,
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
            envId?.environmentId
          );
        } else {
          delete requestData.confirm_password;
        }
      });
  };

  const { control, register, handleSubmit, reset, watch } = useForm({
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

  const onSubmit = (values) => {
    if (values?.new_password && values?.old_password) {
      if (values?.new_password !== values?.confirm_password) {
        dispatch(showAlert("Confirm Password fields do not match"));
        setInputMatch(true);
      } else if (userInfo) {
        update(values);
        setInputMatch(false);
      }
    } else if (userInfo) {
      update(values);
      setInputMatch(false);
    }
  };

  useEffect(() => {
    getSessions();

    authService
      .getUserById(userId, {
        "project-id": projectId,
        "client-type-id": clientType?.id,
      })
      .then((res) => {
        reset(res);
      });
  }, []);

  return {
    t,
    control,
    clientType,
    role,
    inputType,
    setInputType,
    passwordType,
    setPasswordType,
    inputMatch,
    setInputMatch,
    register,
    handleProfilePhotoUpload,
    photoUrl,
    userInfo,
    sessions,
    deleteSession,
  };
};
