import {useState} from "react";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  ChakraProvider,
  Flex,
  Grid,
  GridItem,
  Image,
  Button,
  useDisclosure,
  IconButton
} from "@chakra-ui/react";
import {ChevronDownIcon, ArrowBackIcon, ChevronRightIcon} from "@chakra-ui/icons"
import PageFallback from "@/components/PageFallback";
import chakraUITheme from "@/theme/chakraUITheme";
import {useUsersListQuery} from "@/services/userService";
import {useRoleListQuery} from "@/services/roleServiceV2";
import {Select} from "chakra-react-select";
import {Pagination} from "@mui/material";

import {CreateDrawer, EditDrawer} from "./actions";
import {useClientTypesQuery} from "./utils";
import {useNavigate} from "react-router-dom";
import {useUserDeleteMutation} from "@/services/auth/userService";

const templateColumns = 'minmax(72px, 72px) minmax(160px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(76px, 76px)';

const limitOptions = [
  {value: 10, label: "10 rows"},
  {value: 20, label: "20 rows"},
  {value: 30, label: "30 rows"},
  {value: 40, label: "40 rows"}
]

export const ClientTypes = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const createDrawer = useDisclosure();
  const [editUserGuid, setEditUserGuid] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const clientTypesQuery = useClientTypesQuery();
  const clientTypes = clientTypesQuery.data?.data?.response ?? [];
  const clientTypeId = clientTypes[tabIndex]?.guid;

  const usersListQuery = useUsersListQuery({
    params: {'client-type-id': clientTypeId, limit, offset: (page - 1) * limit},
    queryParams: {enabled: Boolean(clientTypeId)}
  })
  const users = usersListQuery.data?.users ?? [];
  const usersCount = usersListQuery.data?.count;

  const rolesQuery = useRoleListQuery();
  const roles = rolesQuery.data?.data?.response ?? [];

  if (clientTypesQuery.isLoading || rolesQuery.isLoading) {
    return <PageFallback/>
  }

  const onTabChange = (index) => {
    setTabIndex(index);
    setPage(1);
  }

  const onLimitChange = (value) => {
    setLimit(value);
    setPage(1);
  }

  return (
    <ChakraProvider theme={chakraUITheme}>
      <CreateDrawer
        isOpen={createDrawer.isOpen}
        onClose={createDrawer.onClose}
        clientTypeId={clientTypeId}
      />
      <EditDrawer
        guid={editUserGuid}
        client_type_id={users.find(user => user.id === editUserGuid)?.client_type_id}
        onClose={() => setEditUserGuid(null)}
      />

      <Box h='100%' display='flex' flexDirection='column' bg='#fff'>
        <Flex h='56px' px='16px' alignItems='center' borderBottom='1px solid #EAECF0'>
          <Flex columnGap='8px' alignItems='center'>
            <IconButton aria-label='back' icon={<ArrowBackIcon fontSize={20} color='#344054'/>} variant='ghost'
                        colorScheme='gray' onClick={() => navigate(-1)}/>
            <IconButton aria-label='home' icon={<img src="/img/home.svg" alt="home"/>} variant='ghost'
                        colorScheme='gray' onClick={() => navigate('/main')}/>
            <ChevronRightIcon fontSize={20} color='#344054'/>
            <Box p='8px' bg='#EAECF0' borderRadius={6} color='#344054' fontWeight={500}>Users</Box>
          </Flex>

          <Button ml='auto' fontSize={13} rightIcon={<ChevronDownIcon fontSize={20}/>} borderRadius={8}
                  onClick={createDrawer.onOpen}>
            Invite
          </Button>

        </Flex>
        <Box pt='10px'>
          <Tabs index={tabIndex} onChange={onTabChange}>
            <TabList>
              {clientTypes.map((type) =>
                <Tab key={type.guid}>{type.name}</Tab>
              )}
            </TabList>
          </Tabs>
        </Box>

        <Box overflowX='auto' flexGrow={1}>
          <Grid templateColumns={templateColumns} borderBottom='1px solid #EAECF0'>
            <Th justifyContent='center'>
              <img src="/img/hash.svg" alt="index"/>
            </Th>
            <Th type="text">Наименование</Th>
            <Th type="text">Роль</Th>
            <Th type="text">Логин</Th>
            <Th type="text">Почта</Th>
            <Th type="phone">Phone</Th>
            <Th></Th>
          </Grid>

          {users.map((user, index) =>
            <Grid key={user.id} templateColumns={templateColumns} borderBottom='1px solid #EAECF0'>
              <Td display='flex' justifyContent='center' fontWeight={600}>
                {index + 1}
              </Td>
              <Td>
                {user.name}
              </Td>
              <Td>
                {roles.find(role => role.guid === user.role_id)?.name}
              </Td>
              <Td>
                {user.login}
              </Td>
              <Td>
                {user.email}
              </Td>
              <Td>
                {user.phone}
              </Td>
              <Td display='flex' justifyContent='center' columnGap='6px'>
                <IconButton
                  aria-label='edit'
                  icon={<Image src="/img/edit.svg" alt="edit" />}
                  onClick={() => setEditUserGuid(user?.id)}
                  variant='ghost'
                  colorScheme='gray'
                />
                <DeleteButton user={user} />
              </Td>
            </Grid>
          )}
        </Box>

        <Flex p='16px' borderTop='1px solid #EAECF0' justifyContent='space-between'>
          <Flex columnGap='16px' alignItems='center' fontSize={14} fontWeight={600} color="#344054">
            Show
            <Select
              value={{value: limit, label: `${limit} rows`}}
              options={limitOptions}
              menuPlacement='top'
              onChange={({value}) => onLimitChange(value)}
            />
            out of {usersCount}
          </Flex>

          <Pagination
            page={page}
            onChange={(_, page) => setPage(page)}
            count={Math.ceil((usersCount ?? 0) / limit)}
            variant="outlined"
            shape="rounded"
            style={{marginLeft: 40}}
          />

          <div/>
          <div/>
        </Flex>
      </Box>
    </ChakraProvider>
  )
}

const DeleteButton = ({user}) => {
  const deleteMutation = useUserDeleteMutation({ userMenuId: user?.client_type_id });

  return (
    <IconButton
      aria-label='delete'
      icon={<Image src="/img/delete.svg" alt="delete" />}
      variant='ghost'
      colorScheme='gray'
      isLoading={deleteMutation.isLoading}
      onClick={() => deleteMutation.mutate(user?.id)}
    />
  )
}

const icons = {
  text: <img src='/img/text-column.svg' alt='text'/>,
  phone: <img src='/img/phone.svg' alt='text'/>
}

const Th = ({type, children, ...props}) => {
  const icon = icons[type];

  return (
    <GridItem
      display='flex'
      alignItems='center'
      columnGap='8px'
      py="14px"
      px="12px"
      bg='#F9FAFB'
      borderRight='1px solid #EAECF0'
      color='#475467'
      fontWeight={500}
      fontSize={12}
      {...props}
    >
      {Boolean(icon) && icon}
      {children}
    </GridItem>
  )
}

const Td = ({children, ...props}) => (
  <GridItem
    px='12px'
    py='16px'
    bg='#fff'
    borderRight='1px solid #EAECF0'
    color='#475467'
    fontSize={14}
    fontWeight={400}
    whiteSpace='nowrap'
    overflow='hidden'
    textOverflow='ellipsis'
    {...props}
  >
    {children}
  </GridItem>
)
