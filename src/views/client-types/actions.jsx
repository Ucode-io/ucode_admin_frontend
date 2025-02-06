import {useSelector} from "react-redux";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Checkbox, FormControlLabel} from "@mui/material";
import {Controller, useForm, useWatch} from "react-hook-form";
import {forwardRef, useEffect, useState} from "react";
import PhoneNumberInput from "react-phone-number-input";
import {Select} from "chakra-react-select";
import {useRoleListQuery} from "@/services/roleServiceV2";
import {useUserCreateMutation} from "@/services/userService";
import {
  useUserGetByIdQuery,
  useUserUpdateMutation,
} from "@/services/auth/userService";
import "react-phone-number-input/style.css";

import {useClientTypesQuery} from "./utils";
import {AccordionButton, AccordionIcon} from "@chakra-ui/icons";

export const CreateDrawer = ({isOpen, onClose, clientTypeId}) => {
  const form = useForm();
  const project_id = useSelector((state) => state.company.projectId);
  const createMutation = useUserCreateMutation({
    onSuccess: onClose,
  });

  const onSubmit = (data) => {
    data = {
      ...data,
      role_id: data.role_id.guid,
      client_type_id:
        typeof data.client_type_id === "string"
          ? data.client_type_id
          : data.client_type_id?.guid,
      phone: data.phone,
      project_id,
    };

    createMutation.mutate(data);
  };

  useEffect(() => {
    if (isOpen && clientTypeId) {
      form.reset({client_type_id: clientTypeId});
    }
  }, [isOpen, clientTypeId]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerOverlay />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            borderBottomWidth="1px"
            fontSize={18}
            fontWeight={600}
            color="#344054">
            Invite user
          </DrawerHeader>
          <Form form={form} />
          <DrawerFooter borderTopWidth="1px">
            <Button
              w="100%"
              size="lg"
              type="submit"
              isLoading={createMutation.isLoading}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export const EditDrawer = ({guid, client_type_id, onClose}) => {
  const userQuery = useUserGetByIdQuery({
    userId: guid,
    params: {
      "client-type-id": client_type_id,
    },
    queryParams: {enabled: Boolean(guid)},
  });
  const updateMutation = useUserUpdateMutation();

  const form = useForm();

  const onSubmit = form.handleSubmit((data) => {
    updateMutation.mutate(data);
  });

  useEffect(() => {
    if (userQuery.data) {
      form.reset(userQuery.data);
    }
  }, [userQuery.data]);

  useEffect(() => {
    if (!guid) {
      form.reset({});
    }
  }, [guid]);

  return (
    <Drawer isOpen={Boolean(guid)} onClose={onClose} size="md">
      <DrawerOverlay />
      <Tabs>
        <form onSubmit={onSubmit}>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader
              borderBottomWidth="1px"
              fontSize={18}
              fontWeight={600}
              color="#344054">
              <TabList>
                <Tab> Edit User</Tab>
                <Tab> Sessions</Tab>
              </TabList>
            </DrawerHeader>
            <DrawerBody py="20px">
              <TabPanels>
                <TabPanel>
                  <Form form={form} />
                </TabPanel>
              </TabPanels>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button w="100%" size="lg" type="submit">
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Tabs>
    </Drawer>
  );
};

const Form = ({form}) => {
  const errors = form.formState.errors;

  return (
    <DrawerBody py="20px">
      <Field label="Name" required={true}>
        <Input
          size="lg"
          {...form.register("name", {required: true})}
          isInvalid={errors?.name}
        />
      </Field>
      <Field label="Login" required={true}>
        <Input
          size="lg"
          {...form.register("login", {required: true})}
          isInvalid={errors?.login}
        />
      </Field>
      <Field label="Password" required={true}>
        <PasswordInput
          size="lg"
          {...form.register("password", {required: true})}
          isInvalid={errors?.password}
        />
      </Field>

      <Accordion allowToggle border="1px solid #E2E8F0" borderRadius={6}>
        <AccordionItem border="none">
          <AccordionButton
            borderRadius={6}
            justifyContent="space-between"
            fontSize={14}
            _expanded={{borderBottomRadius: 0}}>
            More
            <AccordionIcon fontSize={18} />
          </AccordionButton>
          <AccordionPanel>
            <Field label="Email">
              <Input
                type="email"
                size="lg"
                {...form.register("email")}
                isInvalid={errors?.email}
              />
            </Field>
            <Field label="Phone">
              <Controller
                name="phone"
                control={form.control}
                render={({field}) => (
                  <Box
                    sx={{
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
                      numberInputProps={{size: "lg", isInvalid: errors?.phone}}
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
            </Field>
            <Field label="User type" isInvalid={errors?.client_type_id}>
              <UserType control={form.control} />
            </Field>
            <Field label="Role" isInvalid={errors?.role_id}>
              <Role control={form.control} />
            </Field>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={true}
                  icon={<img src="/img/checbkox.svg" alt="checkbox" />}
                  checkedIcon={
                    <img src="/img/checkbox-checked.svg" alt="checked" />
                  }
                />
              }
              label="Active role"
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </DrawerBody>
  );
};

const Field = ({label, required, children, ...props}) => (
  <FormControl mb="16px" {...props}>
    <FormLabel fontSize={14} fontWeight={500} color="#344054" mb="6px">
      {label}
      {required ? "*" : ""}
    </FormLabel>
    {children}
  </FormControl>
);

const UserType = ({control}) => {
  const clientTypesQuery = useClientTypesQuery();
  const clientTypes = clientTypesQuery.data?.data?.response ?? [];

  return (
    <Controller
      name="client_type_id"
      control={control}
      render={({field}) => (
        <Select
          value={clientTypes.find((type) => type.guid === field.value)}
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

const Role = ({control}) => {
  const clientTypeId = useWatch({control, name: "client_type_id"});
  const id =
    typeof clientTypeId === "string" ? clientTypeId : clientTypeId?.guid;
  const rolesQuery = useRoleListQuery({
    params: id ? {"client-type-id": id} : {},
    queryParams: {enabled: Boolean(id)},
  });
  const roles = rolesQuery.data?.data?.response ?? [];

  return (
    <Controller
      name="role_id"
      control={control}
      render={({field}) => (
        <Select
          value={roles.find((role) => role.guid === field.value)}
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

const PasswordInput = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  return (
    <InputGroup>
      <Input type={show ? "text" : "password"} ref={ref} {...props} />
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
