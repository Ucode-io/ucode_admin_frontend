import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import {Controller, useForm, useWatch} from "react-hook-form";
import styles from "./style.module.scss";
import {Select} from "chakra-react-select";
import {useClientTypesQuery} from "../../client-types/utils";
import {useRoleListQuery} from "../../../services/roleServiceV2";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import PhoneNumberInput from "react-phone-number-input";
import {
  useUserCreateMutation,
  useUserGetByIdQuery,
} from "../../../services/auth/userService";
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";
import {showAlert} from "../../../store/alert/alert.thunk";
import {ToastContainer, toast} from "react-toastify";

function InviteModal({
  userInviteLan,
  isOpen,
  onOpen,
  onClose,
  guid = "",
  users = [],
  selectedClientType,
}) {
  const dispatch = useDispatch();
  const finalRef = useRef(null);
  const { i18n } = useTranslation();
  const mainForm = useForm();
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const project_id = useSelector((state) => state.auth.projectId);
  const env_id = useSelector((state) => state.auth?.environmentId);
  const role_id = useSelector((state) => state.auth?.roleInfo?.id);
  const cl_type_id = useSelector(
    (state) => state.auth?.roleInfo?.client_type_id
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const clientTypeId = users?.find((el) => el?.id === guid)?.client_type_id;

  const handleClose = () => {
    onClose();
    setSearchParams({});
  };

  const createMutation = useUserCreateMutation({
    onSuccess: () => {
      onClose();
      setLoading(false);
    },
    onError: (err) => {
      setLoading(false);
    },
  });
  const onSubmit = (data) => {
    setLoading(true);
    const value = {
      ...data,
      role_id: data?.role_id?.guid,
      client_type_id:
        typeof data?.client_type_id === "string"
          ? data.client_type_id
          : data.client_type_id?.guid,
      phone: data?.phone,
      project_id,
      status: data?.status || "ACTIVE",
    };

    if (Boolean(guid)) {
      createMutation.mutate(data);
    } else createMutation.mutate(value);
  };

  const userQuery = useUserGetByIdQuery({
    userId: guid,
    params: {
      "client-type-id": clientTypeId,
    },
    queryParams: {
      enabled: Boolean(guid),
      onSuccess: (data) => {},
    },
  });

  useEffect(() => {
    if (userQuery.data) {
      mainForm.reset(userQuery.data);
    }
  }, [userQuery.data]);

  const onTabChange = (index) => {
    setTabIndex(index);
  };
  const errors = mainForm.formState.errors;

  useEffect(() => {
    if (!guid) {
      mainForm.reset({});
    }
  }, [guid]);

  const copyToClipboard = async () => {
    notifyButton();
    try {
      await navigator.clipboard.writeText(
        `${import.meta.env.VITE_DOMAIN}/invite-user?project-id=${project_id}&env_id=${env_id}&role_id=${selectedClientType?.guid}&client_type_id=${selectedClientType?.client_type_id}`
      );
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  function notifyButton() {
    toast("Copied link to clipboard", {
      toastId: "clipboard-toast",
      position: "bottom-center",
      autoClose: 200,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      closeButton: false,
    });
  }

  return (
    <>
      <Box w={"100%"} display={"flex"} justifyContent={"flex-end"}>
        <Button
          ml="auto"
          fontSize={13}
          // rightIcon={<ChevronDownIcon fontSize={20} />}
          borderRadius={8}
          onClick={() => {
            onOpen();
            setSearchParams({ invite: true });
          }}
        >
          {generateLangaugeText(userInviteLan, i18n?.language, "Invite") ||
            "Invite"}
        </Button>
      </Box>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />

        <form onSubmit={mainForm.handleSubmit(onSubmit)}>
          <ModalContent borderRadius={"12px"} maxW={"500px"}>
            <ModalHeader>Invite User</ModalHeader>
            <ModalCloseButton />
            {/* {selectedClientType?.name !== "DEFAULT ADMIN" && (
              <Button onClick={copyToClipboard} className={styles.copyButton}>
                <LinkIcon
                  style={{ transform: "rotate(140deg)", color: "#A09F9D" }}
                />
                Invite Link
              </Button>
            )} */}

            <ModalBody>
              <Tabs
                index={tabIndex}
                onChange={onTabChange}
                className={styles.react_tab}
              >
                <TabList borderBottom={"none"}>
                  <Flex
                    p={"4px"}
                    bg={"#f9fafb"}
                    borderRadius={"8px"}
                    h={"32px"}
                    mb={"5px"}
                    border={"1px solid #EAECF0"}
                  >
                    <Tab
                      className={`${tabIndex === 0 ? styles.reactTabIteActive : styles.reactTabItem}`}
                    >
                      Login
                    </Tab>
                    <Tab
                      className={`${tabIndex === 1 ? styles.reactTabIteActive : styles.reactTabItem}`}
                    >
                      Phone
                    </Tab>
                    <Tab
                      className={`${tabIndex === 2 ? styles.reactTabIteActive : styles.reactTabItem}`}
                    >
                      Email
                    </Tab>
                    <Tab
                      className={`${tabIndex === 3 ? styles.reactTabIteActive : styles.reactTabItem}`}
                    >
                      Invite Link
                    </Tab>
                  </Flex>
                </TabList>
                <TabPanels>
                  <TabPanel minH={"300px"} mt={0} p={"0"}>
                    <LoginForm guid={guid} form={mainForm} />
                  </TabPanel>
                  <TabPanel minH={"300px"} mt={0} p={"0"}>
                    <Controller
                      name="phone"
                      control={mainForm.control}
                      render={({ field }) => (
                        <Box
                          mt={2}
                          px={"0px"}
                          style={{
                            ".PhoneInput": {
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid",
                              borderColor: "gray.200",
                              borderRadius: "md",
                              _focusWithin: {
                                borderColor: "#007AFF",
                                boxShadow: "0 0 0 1px #007AFF",
                              },
                              transition: "box-shadow 200ms",
                            },
                            ".PhoneInputCountry": {
                              ml: "12.8px",
                            },
                            ".PhoneInputCountrySelect": {
                              px: 3,
                              pr: 8,
                              height: "full",
                              borderRight: "1px solid",
                              borderColor: "inherit",
                              bg: "transparent",
                              _hover: { bg: "gray.50" },
                              _focus: { outline: "none" },
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23757575'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 0.5rem center",
                              backgroundSize: "1.5em",
                            },
                            ".PhoneInputInput": {
                              border: "none !important",
                              boxShadow: "none !important",
                              _focus: { boxShadow: "none !important" },
                            },
                          }}
                        >
                          <PhoneNumberInput
                            numberInputProps={{
                              size: "lg",
                              isInvalid: errors?.phone,
                            }}
                            defaultCountry="UZ"
                            international
                            value={field.value}
                            onChange={field.onChange}
                            inputComponent={Input}
                            limitMaxLength={true}
                          />
                        </Box>
                      )}
                    />
                    <TypesComponent guid={guid} form={mainForm} />
                  </TabPanel>
                  <TabPanel p={"0"} minH={"300px"}>
                    <EmailComponent guid={guid} form={mainForm} />
                  </TabPanel>
                  <TabPanel p={"0"} minH={"300px"}>
                    <LinkComponent guid={guid} form={mainForm} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Box>
                {tabIndex === 3 &&
                mainForm.watch("role_id")?.name !== "DEFAULT ADMIN" ? (
                  <Button
                    onClick={copyToClipboard}
                    className={styles.copyButton}
                  >
                    <LinkIcon
                      style={{ transform: "rotate(140deg)", color: "#A09F9D" }}
                    />
                    Invite Link
                  </Button>
                ) : (
                  tabIndex !== 3 && (
                    <Button
                      ml={"10px"}
                      isLoading={loading}
                      w={"100px"}
                      type="submit"
                      bg={"#007aff"}
                    >
                      Invite
                    </Button>
                  )
                )}
              </Box>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

const PasswordInput = forwardRef(
  (props, ref, placeholder = "", loading = false) => {
    const [show, setShow] = useState(false);
    return (
      <InputGroup>
        <Input
          placeholder={placeholder}
          type={show ? "text" : "password"}
          ref={ref}
          {...props}
        />
        <InputRightElement height="100%" pr="10px">
          {show ? (
            <Visibility
              onClick={() => setShow(!show)}
              cursor="pointer"
              style={{ color: "#667085" }}
            />
          ) : (
            <VisibilityOff
              onClick={() => setShow(!show)}
              cursor="pointer"
              style={{ color: "#667085" }}
            />
          )}
        </InputRightElement>
      </InputGroup>
    );
  }
);

const EmailComponent = ({ form, placeholder = "Email", guid }) => {
  const errors = form.formState.errors;
  return (
    <Box mt={2}>
      <Input
        placeholder={placeholder}
        type="email"
        size="lg"
        {...form.register("email")}
        isInvalid={errors?.email}
      />
      <TypesComponent guid={guid} form={form} />
    </Box>
  );
};

const LinkComponent = ({ form, placeholder = "Link", guid }) => {
  return (
    <Box mt={2}>
      <TypesComponent guid={guid} form={form} disabledOptionName={"ADMIN1"} />
    </Box>
  );
};

const LoginForm = ({ form, placeholder = "", guid }) => {
  const [changePassword, setChangePassword] = useState(false);
  const errors = form.formState.errors;
  const [searchParams] = useSearchParams();

  return (
    <>
      <Box mt={2}>
        <Input
          placeholder="Login"
          size="lg"
          {...form.register("login", { required: true })}
          isInvalid={errors?.name}
        />
      </Box>
      <Flex w={"100%"}>
        {!changePassword && Boolean(guid) && (
          <Button
            onClick={() => setChangePassword(!changePassword)}
            w={"130px"}
            type="button"
            bg={"#fff"}
            color={"#007aff"}
            ml={"auto"}
            h={"26px"}
            _hover={{
              background: "#fff",
            }}
          >
            Change Password
          </Button>
        )}
      </Flex>
      {changePassword ||
        (searchParams.get("invite") === "true" && (
          <Box mt={2}>
            <PasswordInput
              placeholder="Enter new password"
              size="lg"
              {...form.register("new_password", { required: true })}
              isInvalid={errors?.password}
            />
          </Box>
        ))}

      <TypesComponent guid={guid} form={form} />
    </>
  );
};

const TypesComponent = ({ form, disabledOptionName, guid }) => {
  return (
    <Box
      sx={{
        marginTop: "7px",
        flexWrap: "wrap",
        gap: "15px",
        paddingTop: "10px",
        // padding: "15px",
        // border: "1px solid #eee",
        // borderRadius: "8px",
        // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#91918E",
        }}
      >
        User Info
      </Box>
      <Box mt={2}>
        <UserType
          disabledOptionName={disabledOptionName}
          placeholder="User type"
          form={form}
          control={form.control}
        />
      </Box>
      <Box mt={2}>
        <Role placeholder="Role" form={form} control={form.control} />
      </Box>
      {Boolean(guid) && (
        <Box mt={2}>
          <Statuses placeholder="Status" form={form} control={form.control} />
        </Box>
      )}
    </Box>
  );
};

const UserType = ({ control, placeholder = "", form, disabledOptionName }) => {
  const clientTypesQuery = useClientTypesQuery();
  const clientTypes = clientTypesQuery.data?.data?.response ?? [];

  const value = useMemo(() => {
    let result;
    if (typeof form.watch("client_type_id") === "string") {
      result = clientTypes.find(
        (type) => type.guid === form.watch("client_type_id")
      );
    } else
      result = clientTypes.find(
        (type) => type.guid === form.watch("client_type_id")?.guid
      );
    return result;
  }, [form.watch("client_type_id")]);
  return (
    <Controller
      name="client_type_id"
      control={control}
      render={({ field }) => (
        <Select
          placeholder={placeholder}
          value={value}
          onChange={field.onChange}
          options={clientTypes}
          getOptionLabel={({ name }) => name}
          getOptionValue={({ guid }) => guid}
          menuPlacement="top"
          size="lg"
          isOptionDisabled={(option) => option?.name === disabledOptionName}
        />
      )}
    />
  );
};

const Role = ({ control, placeholder = "", form }) => {
  const clientTypeId = useWatch({ control, name: "client_type_id" });
  const id =
    typeof clientTypeId === "string" ? clientTypeId : clientTypeId?.guid;
  const rolesQuery = useRoleListQuery({
    params: id ? { "client-type-id": id } : {},
    queryParams: { enabled: Boolean(id) },
  });
  const roles = rolesQuery.data?.data?.response ?? [];

  const value = useMemo(() => {
    let result;
    if (typeof form.watch("role_id") === "string") {
      result = roles?.find((type) => type.guid === form.watch("role_id"));
    } else
      result = roles?.find((type) => type.guid === form.watch("role_id")?.guid);
    return result;
  }, [form.watch("role_id")]);

  return (
    <Controller
      name="role_id"
      control={control}
      render={({ field }) => (
        <Select
          placeholder={placeholder}
          value={value}
          onChange={field.onChange}
          options={roles}
          getOptionLabel={({ name }) => name}
          getOptionValue={({ guid }) => guid}
          menuPlacement="top"
          size="lg"
        />
      )}
    />
  );
};

const Statuses = ({ control, placeholder = "", form }) => {
  const options = [
    {
      label: "ACTIVE",
      value: "ACTIVE",
    },
    {
      label: "INACTIVE",
      value: "INACTIVE",
    },
    {
      label: "BLOCKED",
      value: "BLOCKED",
    },
  ];

  const value = useMemo(() => {
    let result;
    if (typeof form.watch("status") === "string") {
      result = options?.find((type) => type.value === form.watch("status"));
    } else
      result = options?.find((type) => type.value === form.watch("status"));
    return result;
  }, [form.watch("status")]);

  return (
    <Controller
      name="status"
      control={control}
      render={({ field }) => (
        <Select
          placeholder={placeholder}
          value={value}
          onChange={(e) => field.onChange(e?.value)}
          options={options}
          getOptionLabel={({ label }) => label}
          getOptionValue={({ value }) => value}
          menuPlacement="top"
          size="lg"
          defaultValue={options[0]}
        />
      )}
    />
  );
};

export default InviteModal;
