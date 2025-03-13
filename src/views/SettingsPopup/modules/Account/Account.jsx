import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { Flex } from "@chakra-ui/react";
import { useAccountProps } from "./useAccountProps";
import AvatarUpload from "../../../../components/AvatarUpload";
import HFTextField from "../../../../components/FormElements/HFTextField";
import { SaveCancelBtns } from "../../components/SaveCancelBtns";
import { Field } from "../../components/Field";
import { ContentTitle } from "../../components/ContentTitle";
import { DeviceCard } from "./components/DeviceCard";

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
    sessions,
    deleteSession,
  } = useAccountProps();

  const mockData = [
    { name: "Device 1", ip: "192.168.0.1", createdAt: "2025-03-13 10:00 AM" },
    { name: "Device 2", ip: "192.168.0.2", createdAt: "2025-03-13 11:00 AM" },
  ];

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

      <ContentTitle>{t("sessions")}</ContentTitle>
      <Box
        display="grid"
        gridTemplateColumns={"1fr 1fr"}
        gap={2}
        marginBottom={2}
      >
        {sessions.map((device, index) => (
          <DeviceCard
            key={device.id}
            onDeleteClick={deleteSession}
            device={device}
          />
        ))}
      </Box>

      <SaveCancelBtns
        cancelProps={{
          onClick: handleClose,
        }}
        saveProps={{
          onClick: handleClose,
        }}
        marginTop="auto"
        paddingBottom="24px"
      />
    </Box>
  );
};
