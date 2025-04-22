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
  useDisclosure,
} from "@chakra-ui/react";
import React, {forwardRef, useMemo, useRef, useState} from "react";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import {Controller, useForm, useWatch} from "react-hook-form";
import styles from "./style.module.scss";
import {Select} from "chakra-react-select";
import {useClientTypesQuery} from "../../client-types/utils";
import {useRoleListQuery} from "../../../services/roleServiceV2";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import PhoneNumberInput from "react-phone-number-input";
import {useUserCreateMutation} from "../../../services/auth/userService";
import {useSelector} from "react-redux";

function InviteModal({userInviteLan}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const finalRef = useRef(null);
  const {i18n} = useTranslation();
  const mainForm = useForm();
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const project_id = useSelector((state) => state.company.projectId);

  const createMutation = useUserCreateMutation({
    onSuccess: () => {
      onClose();
      setLoading(false);
    },
    onError: (err) => {
      console.log("errerrerr", err);
      setLoading(false);
    },
  });
  const onSubmit = (data) => {
    setLoading(true);
    data = {
      ...data,
      role_id: data?.role_id?.guid,
      client_type_id:
        typeof data?.client_type_id === "string"
          ? data.client_type_id
          : data.client_type_id?.guid,
      phone: data?.phone,
      project_id,
    };

    createMutation.mutate(data);
  };

  const onTabChange = (index) => {
    setTabIndex(index);
  };
  const errors = mainForm.formState.errors;
  return (
    <>
      <Button
        ml="auto"
        fontSize={13}
        rightIcon={<ChevronDownIcon fontSize={20} />}
        borderRadius={8}
        onClick={onOpen}>
        {generateLangaugeText(userInviteLan, i18n?.language, "Invite") ||
          "Invite"}
      </Button>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={mainForm.handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>Invite User</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Tabs
                index={tabIndex}
                onChange={onTabChange}
                className={styles.react_tab}>
                <TabList borderBottom={"none"}>
                  <Flex
                    p={"4px"}
                    bg={"#f9fafb"}
                    borderRadius={"8px"}
                    h={"32px"}
                    mb={"5px"}
                    border={"1px solid #e9ecf0y"}>
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
                  </Flex>
                </TabList>
                <TabPanels>
                  <TabPanel h={"180px"} mt={0} p={"0"}>
                    <LoginForm form={mainForm} />
                  </TabPanel>
                  <TabPanel h={"180px"} mt={0} p={"0"}>
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
                            onChange={field.onChange}
                            inputComponent={Input}
                            limitMaxLength={true}
                          />
                        </Box>
                      )}
                    />
                    <TypesComponent form={mainForm} />
                  </TabPanel>
                  <TabPanel p={"0"} h={"180px"}>
                    <EmailComponent form={mainForm} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={loading}
                w={"100px"}
                type="submit"
                bg={"#007aff"}
                mr={3}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

const PasswordInput = forwardRef((props, ref, placeholder = "") => {
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
});

const EmailComponent = ({form, placeholder = "Email"}) => {
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
      <TypesComponent form={form} />
    </Box>
  );
};

const LoginForm = ({form, placeholder = ""}) => {
  const errors = form.formState.errors;

  return (
    <>
      <Box mt={2}>
        <Input
          placeholder="Login"
          size="lg"
          {...form.register("name", {required: true})}
          isInvalid={errors?.name}
        />
      </Box>
      <Box mt={2}>
        <PasswordInput
          placeholder="Password"
          size="lg"
          {...form.register("password", {required: true})}
          isInvalid={errors?.password}
        />
      </Box>

      <TypesComponent form={form} />
    </>
  );
};

const TypesComponent = ({form}) => {
  return (
    <>
      <Box mt={2}>
        <UserType
          placeholder="Choose user"
          form={form}
          control={form.control}
        />
      </Box>
      <Box mt={2}>
        <Role placeholder="Choose role" form={form} control={form.control} />
      </Box>
    </>
  );
};

const UserType = ({control, placeholder = "", form}) => {
  const clientTypesQuery = useClientTypesQuery();
  const clientTypes = clientTypesQuery.data?.data?.response ?? [];

  const value = useMemo(() => {
    return clientTypes.find(
      (type) => type.guid === form.watch("client_type_id")?.guid
    );
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
          menuPlacement="top"
          size="lg"
        />
      )}
    />
  );
};

const Role = ({control, placeholder = "", form}) => {
  const clientTypeId = useWatch({control, name: "client_type_id"});
  const id =
    typeof clientTypeId === "string" ? clientTypeId : clientTypeId?.guid;
  const rolesQuery = useRoleListQuery({
    params: id ? {"client-type-id": id} : {},
    queryParams: {enabled: Boolean(id)},
  });
  const roles = rolesQuery.data?.data?.response ?? [];

  const value = useMemo(() => {
    return roles?.find((type) => type.guid === form.watch("role_id")?.guid);
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
          menuPlacement="top"
          size="lg"
        />
      )}
    />
  );
};

export default InviteModal;
