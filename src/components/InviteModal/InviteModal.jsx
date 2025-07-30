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
import {generateLangaugeText} from "@/utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import {Controller, useForm, useWatch} from "react-hook-form";
import styles from "./style.module.scss";
import {Select} from "chakra-react-select";
import {useRoleListQuery} from "@/services/roleServiceV2";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import PhoneNumberInput from "react-phone-number-input";
import {
  useUserCreateMutation,
  useUserGetByIdQuery,
  useUserUpdateMutation,
} from "@/services/auth/userService";
import {useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import LinkIcon from "@mui/icons-material/Link";
import {toast} from "react-toastify";
import {useQuery} from "react-query";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import userService from "../../services/userService";
import useDebounce from "../../hooks/useDebounce";
import {useFieldsListQuery} from "../../services/constructorFieldService";
import DrawerFieldGenerator from "../../views/Objects/DrawerDetailPage/ElementGenerator/DrawerFieldGenerator";

function InviteModal({
  userInviteLan,
  isOpen,
  onOpen,
  onClose,
  guid = "",
  users = [],
  selectedClientType,
  invite: inviteProps,
}) {
  const dispatch = useDispatch();

  const finalRef = useRef(null);
  const mainForm = useForm();
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const project_id = useSelector((state) => state.auth.projectId);
  const env_id = useSelector((state) => state.auth?.environmentId);
  const [userId, setUserId] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const [allowPassword, setAllowPassword] = useState("noShow");
  const clientTypeId = users?.find((el) => el?.id === guid)?.client_type_id;
  const clientId = mainForm.watch().client_type_id?.guid;
  const roleId = mainForm.watch().role_id?.guid;

  const handleClose = () => {
    onClose();
    setSearchParams({});
    setTabIndex(0);
    mainForm.reset({});
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

  const updateMutation = useUserUpdateMutation({
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

    // if (Boolean(allowPassword === "noShow") && Boolean(userId)) {
    //   setLoading(false);
    //   return null;
    // } else

    if (Boolean(guid)) {
      updateMutation.mutate(data);
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

  const checkUser = useDebounce((type = "login", searchText) => {
    if (Boolean(!searchText)) setAllowPassword("noShow");

    userService
      .userCheck({[type]: searchText})
      .then((res) => {
        if (Boolean(res?.user_id)) {
          setAllowPassword("noShow");
          setUserId(res?.user_id);
        }
      })
      .catch((err) => {
        console.log("errerrerr", err);
        if (Boolean(searchText)) {
          setAllowPassword("show");
        }
      });
  }, 800);

  return (
    <>
      <Modal
        variant=""
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={handleClose}
        isCentered>
        <ModalOverlay />

        <form onSubmit={mainForm.handleSubmit(onSubmit)}>
          <ModalContent borderRadius={"12px"} maxW={"500px"}>
            <ModalHeader>Invite User</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <>
                {tabIndex === 3 &&
                  mainForm.watch("role_id")?.name !== "DEFAULT ADMIN" && (
                    <Button
                      onClick={copyToClipboard}
                      className={styles.copyButton}
                      isDisabled={
                        !mainForm.watch("client_type_id") ||
                        !mainForm.watch("role_id")
                      }>
                      <LinkIcon
                        style={{
                          transform: "rotate(140deg)",
                          color: "#A09F9D",
                        }}
                      />
                      Invite Link
                    </Button>
                  )}
                <UserInfo form={mainForm} />
                {Boolean(clientId && roleId) && (
                  <Tabs
                    index={tabIndex}
                    onChange={onTabChange}
                    className={styles.react_tab}>
                    <Box display="flex" alignItems={"flex-end"}>
                      <TabList borderBottom={"none"} marginLeft={"auto"}>
                        <Flex
                          p={"4px"}
                          bg={"#f9fafb"}
                          borderRadius={"8px"}
                          h={"32px"}
                          mb={"5px"}
                          border={"1px solid #EAECF0"}>
                          <Tab
                            className={`${tabIndex === 0 ? styles.reactTabIteActive : styles.reactTabItem}`}>
                            Login
                          </Tab>
                          <Tab
                            className={`${tabIndex === 1 ? styles.reactTabIteActive : styles.reactTabItem}`}>
                            Phone
                          </Tab>
                          <Tab
                            className={`${tabIndex === 2 ? styles.reactTabIteActive : styles.reactTabItem}`}>
                            Email
                          </Tab>
                          <Tab
                            className={`${tabIndex === 3 ? styles.reactTabIteActive : styles.reactTabItem}`}>
                            Invite Link
                          </Tab>
                        </Flex>
                      </TabList>
                    </Box>
                    <TabPanels>
                      <TabPanel minH={"100px"} mt={0} p={"0"}>
                        <LoginForm
                          guid={guid}
                          userId={userId}
                          mainForm={mainForm}
                          allowPassword={allowPassword}
                          setAllowPassword={setAllowPassword}
                          checkUser={checkUser}
                        />
                      </TabPanel>
                      <TabPanel minH={"100px"} mt={0} p={"0"}>
                        <Controller
                          name="phone"
                          control={mainForm.control}
                          render={({field}) => (
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
                                  _hover: {bg: "gray.50"},
                                  _focus: {outline: "none"},
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23757575'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundPosition: "right 0.5rem center",
                                  backgroundSize: "1.5em",
                                },
                                ".PhoneInputInput": {
                                  border: "none !important",
                                  boxShadow: "none !important",
                                  _focus: {boxShadow: "none !important"},
                                },
                              }}>
                              <PhoneNumberInput
                                numberInputProps={{
                                  size: "lg",
                                  isInvalid: errors?.phone,
                                }}
                                defaultCountry="UZ"
                                international
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e);
                                  checkUser("phone", e);
                                }}
                                inputComponent={Input}
                                limitMaxLength={true}
                              />
                            </Box>
                          )}
                        />
                        <TypesComponent
                          guid={guid}
                          form={mainForm}
                          client_type_id={mainForm?.watch()?.client_type_id}
                        />
                      </TabPanel>
                      <TabPanel p={"0"} minH={"100px"}>
                        <EmailComponent
                          checkUser={checkUser}
                          guid={guid}
                          form={mainForm}
                        />
                      </TabPanel>
                      <TabPanel p={"0"} minH={"100px"}>
                        <LinkComponent
                          checkUser={checkUser}
                          guid={guid}
                          form={mainForm}
                        />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                )}
              </>
            </ModalBody>
            <ModalFooter>
              <Box>
                {tabIndex !== 3 && (
                  <Button
                    ml={"10px"}
                    isLoading={loading}
                    w={"100px"}
                    type="submit"
                    bg={"#007aff"}
                    color={"#fff"}>
                    {guid ? "Save" : "Invite"}
                  </Button>
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
              style={{color: "#667085"}}
            />
          ) : (
            <VisibilityOff
              onClick={() => setShow(!show)}
              cursor="pointer"
              style={{color: "#667085"}}
            />
          )}
        </InputRightElement>
      </InputGroup>
    );
  }
);

const EmailComponent = ({form, placeholder = "Email", guid}) => {
  const errors = form.formState.errors;
  const client_type_id = form.watch()?.client_type_id;
  return (
    <Box mt={2}>
      <Input
        placeholder={placeholder}
        type="email"
        size="lg"
        {...form.register("email")}
        isInvalid={errors?.email}
      />
      <TypesComponent client_type_id={client_type_id} guid={guid} form={form} />
    </Box>
  );
};

const LinkComponent = ({form, placeholder = "Link", guid}) => {
  const client_type_id = form.watch()?.client_type_id;
  return (
    <Box mt={2}>
      <TypesComponent client_type_id={client_type_id} guid={guid} form={form} />
    </Box>
  );
};

const LoginForm = ({
  mainForm,
  userId = "",
  placeholder = "",
  allowPassword = "",
  guid,
  checkUser = () => {},
  setAllowPassword = () => {},
}) => {
  const [changePassword, setChangePassword] = useState(false);
  const errors = mainForm.formState.errors;
  const [searchParams] = useSearchParams();
  const [login, setLogin] = useState("");
  const client_type_id = mainForm?.watch()?.client_type_id;

  const shouldShowPassword =
    changePassword ||
    (searchParams.get("invite") === "true" &&
      Boolean(allowPassword === "show") &&
      Boolean(login));

  return (
    <>
      <Box mt={2}>
        <Input
          placeholder="Login"
          size="lg"
          {...mainForm.register("login", {required: true})}
          isInvalid={errors?.name}
          onChange={(e) => {
            setLogin(e.target.value);
            checkUser("login", e.target.value);
          }}
        />
        {allowPassword === "noShow" && Boolean(userId) && (
          <span
            style={{
              width: "100%",
              margin: "0 0 0 10px",
              color: "#91918e",
              fontSize: "10px",
            }}>
            {"The user already exists!"}
          </span>
        )}
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
            }}>
            Change Password
          </Button>
        )}
      </Flex>
      {shouldShowPassword && (
        <Box mt={2}>
          <PasswordInput
            placeholder="Enter new password"
            size="lg"
            {...mainForm.register("new_password", {required: true})}
            isInvalid={errors?.password}
          />
        </Box>
      )}

      <TypesComponent
        client_type_id={client_type_id}
        guid={guid}
        form={mainForm}
      />
    </>
  );
};

const TypesComponent = ({form, guid, client_type_id}) => {
  const project_id = useSelector((state) => state.auth.projectId);
  const {data: fieldsData} = useFieldsListQuery(
    {
      queryParams: {
        enabled: Boolean(client_type_id?.table_slug),
      },
      params: {
        table_slug: client_type_id?.table_slug,
        "project-id": project_id,
      },
    },
    client_type_id?.table_slug
  );

  const computedFields = useMemo(() => {
    return fieldsData?.fields?.filter((item) =>
      client_type_id?.columns?.includes(item?.id)
    );
  }, [fieldsData, client_type_id]);

  return (
    <>
      <Box
        sx={{
          marginTop: "7px",
          flexWrap: "wrap",
          gap: "15px",
          paddingTop: "10px",
        }}>
        {computedFields?.map((item) => (
          <Box mt={2} mb={2}>
            <p
              style={{
                color: "#91918E",
                fontWeight: "600",
                margin: "6px 0px",
                fontSize: "14px",
              }}>
              {item?.label}
            </p>
            <Box
              sx={{
                border: "1px solid #eee",
                borderRadius: "6px",
                height: "34px",
              }}>
              <DrawerFieldGenerator
                drawerDetail={true}
                field={item}
                name={item?.slug}
                control={form.control}
                setFormValue={form.setValue}
              />
            </Box>
          </Box>
        ))}

        {Boolean(guid) && (
          <Box mt={2}>
            <Statuses placeholder="Status" form={form} control={form.control} />
          </Box>
        )}
      </Box>
    </>
  );
};

const UserType = ({control, placeholder = "", form, disabledOptionName}) => {
  const useClientTypesQuery = () =>
    useQuery({
      queryKey: ["GET_CLIENT_TYPES"],
      queryFn: () => clientTypeServiceV2.getList(),
    });

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
      render={({field}) => (
        <Select
          placeholder={placeholder}
          value={value}
          onChange={field.onChange}
          options={clientTypes}
          getOptionLabel={({name}) => name}
          getOptionValue={({guid}) => guid}
          menuPlacement="bottom"
          isOptionDisabled={(option) => option?.name === disabledOptionName}
          height="20px"
          borderRadius="12px"
        />
      )}
    />
  );
};

const Role = ({control, placeholder = "", form, disabledRoleOptionName}) => {
  const clientTypeId = useWatch({control, name: "client_type_id"});
  const id =
    typeof clientTypeId === "string" ? clientTypeId : clientTypeId?.guid;
  const rolesQuery = useRoleListQuery({
    params: id ? {"client-type-id": id} : {},
    queryParams: {enabled: Boolean(id)},
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
      render={({field}) => (
        <Select
          placeholder={placeholder}
          value={value}
          onChange={field.onChange}
          options={roles}
          getOptionLabel={({name}) => name}
          getOptionValue={({guid}) => guid}
          isOptionDisabled={(option) => option?.name === disabledRoleOptionName}
          menuPlacement="bottom"
          borderRadius="12px"
        />
      )}
    />
  );
};

const UserInfo = ({form, disabledOptionName}) => {
  return (
    <Box mb={4}>
      <Box
        sx={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#91918E",
        }}>
        User Info
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}>
        <Box mt={2} w={"100%"}>
          <UserType
            disabledOptionName={disabledOptionName}
            placeholder="User type"
            form={form}
            control={form.control}
          />
        </Box>
        <Box mt={2} w="100%">
          <Role
            placeholder="Role"
            form={form}
            control={form.control}
            disabledRoleOptionName={"DEFAULT ADMIN"}
          />
        </Box>
      </Box>
    </Box>
  );
};

const Statuses = ({control, placeholder = "", form}) => {
  const options = [
    {
      label: "Active",
      value: "ACTIVE",
      color: "#38B2AC",
    },
    {
      label: "Inactive",
      value: "INACTIVE",
      color: "#A0AEC0",
    },
    {
      label: "Blocked",
      value: "BLOCKED",
      color: "#F56565",
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
      render={({field}) => (
        <Select
          placeholder={placeholder}
          value={value}
          onChange={(e) => field.onChange(e?.value)}
          options={options}
          getOptionLabel={({label}) => label}
          getOptionValue={({value}) => value}
          menuPlacement="top"
          size="lg"
          defaultValue={options[0]}
          chakraStyles={{
            // option: (provided, state) => ({
            //   ...provided,
            //   background: state.data.color,
            //   color: "#fff",
            // }),
            singleValue: (provided, state) => ({
              ...provided,
              color: state.data.color,
              padding: "2px",
              borderRadius: "4px",
              border: "1px solid #EAECF0",
              background: state.data.color + "20",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "20px",
              width: "fit-content",
            }),
          }}
        />
      )}
    />
  );
};

export default InviteModal;
