import {useSelector} from "react-redux";
import {
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
} from "@chakra-ui/react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Checkbox, FormControlLabel} from "@mui/material";
import {Controller, useForm, useWatch} from "react-hook-form";
import {forwardRef, useEffect, useState} from "react";
import PhoneNumberInput from "react-phone-number-input";
import {Select} from "chakra-react-select";
import {useRoleListQuery} from "@/services/roleServiceV2";
import {useUserCreateMutation} from "@/services/userService";
import {useUserGetByIdQuery, useUserUpdateMutation} from "@/services/auth/userService";
import 'react-phone-number-input/style.css'

import {useClientTypesQuery} from "./utils";

export const CreateDrawer = ({isOpen, onClose}) => {
  const form = useForm();
  const project_id = useSelector((state) => state.company.projectId);
  const createMutation = useUserCreateMutation({
    onSuccess: console.log
  });

  const onSubmit = (data) => {
    data = {
      ...data,
      role_id: data.role_id.guid,
      client_type_id: data.client_type_id.guid,
      phone: '998' + data.phone.replaceAll(/\D/g, ''),
      project_id
    }

    createMutation.mutate(data);
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size='md'>
      <DrawerOverlay/>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerCloseButton/>
          <DrawerHeader borderBottomWidth='1px' fontSize={18} fontWeight={600} color="#344054">
            Invite user
          </DrawerHeader>
          <Form form={form}/>
          <DrawerFooter borderTopWidth='1px'>
            <Button w='100%' size="lg" type='submit' isLoading={createMutation.isLoading}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  )
}

export const EditDrawer = ({guid, client_type_id, onClose}) => {
  const userQuery = useUserGetByIdQuery({
    userId: guid,
    params: {
      "client-type-id": client_type_id,
    },
    queryParams: {enabled: Boolean(guid),},
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
  }, [guid])

  return (
    <Drawer isOpen={Boolean(guid)} onClose={onClose} size='md'>
      <DrawerOverlay/>
      <form onSubmit={onSubmit}>
        <DrawerContent>
          <DrawerCloseButton/>
          <DrawerHeader borderBottomWidth='1px' fontSize={18} fontWeight={600} color="#344054">
            Edit User
          </DrawerHeader>
          <DrawerBody py='20px'>
            <Form form={form}/>
          </DrawerBody>
          <DrawerFooter borderTopWidth='1px'>
            <Button w='100%' size="lg" type='submit'>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  )
}

const Form = ({form}) => {
  const errors = form.formState.errors;

  return (
    <DrawerBody py='20px'>
      <Field label='Name' required={true}>
        <Input size='lg' {...form.register('name', {required: true})} isInvalid={errors?.name}/>
      </Field>
      <Field label='Email' required={true}>
        <Input type='email' size='lg' {...form.register('email', {required: true})} isInvalid={errors?.email}/>
      </Field>
      <Field label='Login' required={true}>
        <Input size='lg' {...form.register('login', {required: true})} isInvalid={errors?.login}/>
      </Field>
      <Field label='Password' required={true}>
        <PasswordInput size='lg' {...form.register('password', {required: true})} isInvalid={errors?.password}/>
      </Field>
      <Field label='Phone' required={true}>
        <Controller
          name='phone'
          control={form.control}
          rules={{required: true}}
          render={({field}) =>
            <PhoneNumberInput
              numberInputProps={{size: "lg", isInvalid: errors?.phone}}
              defaultCountry="UZ"
              international
              value={field.value}
              onChange={field.onChange}
              inputComponent={Input}
              limitMaxLength={true}
            />
          }
        />
      </Field>
      <Field label='User type' required={true} isInvalid={errors?.client_type_id}>
        <UserType control={form.control}/>
      </Field>
      <Field label='Role' required={true} isInvalid={errors?.role_id}>
        <Role control={form.control}/>
      </Field>
      <FormControlLabel
        control={
          <Checkbox
            icon={<img src="/img/checbkox.svg" alt="checkbox"/>}
            checkedIcon={<img src="/img/checkbox-checked.svg" alt="checked"/>}
          />
        }
        label='Active role'/>
    </DrawerBody>
  )
}

const Field = ({label, required, children, ...props}) => (
  <FormControl mb='16px' {...props}>
    <FormLabel fontSize={14} fontWeight={500} color='#344054' mb='6px'>
      {label}{required ? "*" : ""}
    </FormLabel>
    {children}
  </FormControl>
);

const UserType = ({control}) => {
  const clientTypesQuery = useClientTypesQuery();
  const clientTypes = clientTypesQuery.data?.data?.response ?? [];

  return (
    <Controller
      name='client_type_id'
      control={control}
      rules={{required: true}}
      render={({field}) =>
        <Select
          value={clientTypes.find(type => type.guid === field.value)}
          onChange={field.onChange}
          options={clientTypes}
          getOptionLabel={({name}) => name}
          getOptionValue={({guid}) => guid}
          menuPlacement='top'
          size='lg'
        />
      }
    />
  )
}

const Role = ({control}) => {
  const clientTypeId = useWatch({control, name: "client_type_id"});
  const rolesQuery = useRoleListQuery({
    params: clientTypeId?.guid ? {'client-type-id': clientTypeId?.guid} : {}
  });
  const roles = rolesQuery.data?.data?.response ?? [];

  return (
    <Controller
      name='role_id'
      control={control}
      rules={{required: true}}
      render={({field}) =>
        <Select
          value={roles.find(role => role.guid === field.value)}
          onChange={field.onChange}
          options={roles}
          getOptionLabel={({name}) => name}
          getOptionValue={({guid}) => guid}
          menuPlacement='top'
          size='lg'
        />
      }
    />
  )
}

const PasswordInput = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  return (
    <InputGroup>
      <Input type={show ? "text" : "password"} ref={ref} {...props} />
      <InputRightElement height="100%" pr='10px'>
        {show ?
          <Visibility onClick={() => setShow(!show)} cursor="pointer" style={{color: "#667085"}}/> :
          <VisibilityOff onClick={() => setShow(!show)} cursor="pointer" style={{color: "#667085"}}/>
        }
      </InputRightElement>
    </InputGroup>
  )
});
