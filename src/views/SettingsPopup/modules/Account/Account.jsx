import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { Flex } from "@chakra-ui/react";
import { useAccountProps } from "./useAccountProps";
import AvatarUpload from "../../../../components/AvatarUpload";
import HFTextField from "../../../../components/FormElements/HFTextField";
import { SaveCancelBtns } from "../../components/SaveCancelBtns";
import { Field } from "../../components/Field";
import { ContentTitle } from "../../components/ContentTitle";

export const Account = ({ handleClose = () => {} }) => {
  const {
    t,
    control,
    clientType,
    role,
    register,
    handleProfilePhotoUpload,
    photoUrl,
    userInfo,
  } = useAccountProps();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ContentTitle>{t("profile")}</ContentTitle>

      <Flex alignItems="flex-end" mb="48px">
        <AvatarUpload
          size="xs"
          value={photoUrl}
          onChange={handleProfilePhotoUpload}
          defaultImage={
            <span className={cls.avatar}>
              <span className={cls.avatarLetter}>
                {userInfo?.login?.[0]?.toUpperCase()}
              </span>
            </span>
          }
        />
        <Box className={cls.nameWrapper}>
          <p className={cls.name}>{t("name")}</p>
          <Field
            register={register}
            name="name"
            type="text"
            placeholder={t("enter_name")}
          />
        </Box>
      </Flex>

      <ContentTitle>{t("main.info")}</ContentTitle>

      <Flex gap="24px" mb="24px">
        <Box flex="1">
          <span className={cls.label}>{t("email")}</span>
          <HFTextField
            placeholder={t("enter.email")}
            fullWidth
            control={control}
            name="email"
            id="email"
          />
        </Box>
        <Box flex="1">
          <span className={cls.label}>{t("phone")}</span>
          <HFTextField
            placeholder={t("enter.phone")}
            fullWidth
            control={control}
            name="phone"
          />
        </Box>
      </Flex>
      <Flex gap="24px" mb="24px">
        <Box flex="1">
          <span className={cls.label}>{t("login")}</span>
          <HFTextField
            placeholder={t("enter.login")}
            fullWidth
            control={control}
            name="login"
          />
        </Box>
        <Box flex="1">
          <span className={cls.label}>{t("type")}</span>
          <HFTextField
            placeholder={t("type")}
            fullWidth
            control={control}
            name="client_type_id"
            value={clientType?.name}
            disabled
          />
        </Box>
      </Flex>

      <Flex gap="24px" mb="32px">
        <Box flex="1">
          <span className={cls.label}>{t("role")}</span>
          <HFTextField
            placeholder={t("role")}
            fullWidth
            control={control}
            name="role_id"
            disabled
            value={role?.name}
          />
        </Box>
        <Box flex="1"></Box>
      </Flex>

      {/* <ContentTitle>{t("account_security")}</ContentTitle>

  <Flex gap="24px" mb="24px">
    <Box flex="1">
      <span className={cls.label}>{t("old.password")}</span>
      <HFTextField
        placeholder={t("old.password")}
        fullWidth
        control={control}
        name="old_password"
      />
    </Box>

    <Box position="relative" flex="1">
      <span className={cls.label}>{t("new.password")}</span>
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
    </Box>
  </Flex>

  <Flex gap="24px">
    <Box position="relative" flex="1">
      <span className={cls.label}>{t("confirm.password")}</span>
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
    </Box>
    <Box flex="1"></Box>
  </Flex> */}

      <SaveCancelBtns
        cancelProps={{
          onClick: handleClose,
        }}
        saveProps={{
          onClick: handleClose,
        }}
        marginTop="auto"
      />
    </Box>
  );
};
