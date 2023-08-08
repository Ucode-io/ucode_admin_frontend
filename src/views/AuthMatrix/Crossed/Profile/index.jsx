import React, { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FormCard from "../../../../components/FormCard";
import FRow from "../../../../components/FormElements/FRow";
import HFAvatarUpload from "../../../../components/FormElements/HFAvatarUpload";
import HFTextField from "../../../../components/FormElements/HFTextField";
import Header from "../../../../components/Header";
import constructorObjectService from "../../../../services/constructorObjectService";
import CancelButton from "../../../../components/Buttons/CancelButton";
import SaveButton from "../../../../components/Buttons/SaveButton";
import authService from "../../../../services/auth/authService";
import userService from "../../../../services/auth/userService";

const UsersForm = () => {
  const navigate = useNavigate();
  const isUserInfo = useSelector((state) => state?.auth?.userInfo);
  const isUserId = useSelector((state) => state?.auth?.userId);
  const role = useSelector((state) => state?.auth?.roleInfo);
  const clientType = useSelector((state) => state?.auth?.clientType);
  const userTableSlug = useSelector((state) => state?.auth?.loginTableSlug);
  const projectId = useSelector((state) => state?.auth?.projectId);


  const update = (data) => {
    const newPassword = data?.new_password;
    const requestData = {
      ...data,
      guid: isUserInfo?.id,
    };
  
    if (newPassword) {
      requestData.password = newPassword;
      resetPassword(newPassword)
    } else {
      delete requestData.password;
    }
    userService
      ?.updateV2({
       ...requestData,
      })
      .then((res) => {
        navigate(-1);
      });

      if(newPassword) {

     
      }
  };

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      name: "",
      email: "",
      login: "",
      phone: "",
      password: '',
      client_type_id: clientType?.id ?? "",
      role_id: role?.id ?? "",
    },
  });

  const resetPassword = (newPassword) => {
    authService.resetPassword( {
      password: newPassword,
      user_id: isUserId
    })
  }

  const onSubmit = (values) => {
    if (isUserInfo) return update(values);
  };

  useEffect(() => {
    authService.getUserById(isUserId, { 'project-id': projectId, 'client-type-id': clientType?.id }).then((res) => {
      reset(res);
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header
          title="Profile"
          backButtonLink={-1}
          extra={
            <>
              <CancelButton onClick={() => navigate(-1)} />
              <SaveButton type="submit" />
            </>
          }
        ></Header>

        <FormCard title="Main info" className="UsersForm p-2">
          <div>
            <HFAvatarUpload control={control} name="photo_url" />
          </div>

          <div className="side">
            <FRow label="Name">
              <HFTextField
                placeholder="Enter name"
                fullWidth
                control={control}
                autoFocus
                name="name"
              />
            </FRow>

            <FRow label="Email">
              <HFTextField
                placeholder="Enter email"
                fullWidth
                control={control}
                name="email"
              />
            </FRow>

            <FRow label="Phone">
              <HFTextField
                placeholder="Enter phone"
                fullWidth
                control={control}
                name="phone"
              />
            </FRow>

            <FRow label="Login">
              <HFTextField
                placeholder="Enter login"
                fullWidth
                control={control}
                name="login"
              />
            </FRow>


            <FRow label="Type">
              <HFTextField
                placeholder="Type"
                fullWidth
                control={control}
                name="client_type_id"
                value={clientType?.name}
                disabled
              />
            </FRow>

            <FRow label="Role">
              <HFTextField
                placeholder="Role"
                fullWidth
                control={control}
                name="role_id"
                disabled
                value={role?.name}
              />
            </FRow>

            <FRow label="New Password">
              <HFTextField
                placeholder="New Password"
                fullWidth
                control={control}
                name="new_password"
              />
            </FRow>

          </div>
        </FormCard>
      </form>
    </>
  );
};

export default UsersForm;
