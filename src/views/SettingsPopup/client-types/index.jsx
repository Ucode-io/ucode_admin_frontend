import {useEffect, useMemo, useState} from "react";
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
  IconButton,
} from "@chakra-ui/react";

import PageFallback from "@/components/PageFallback";
import chakraUITheme from "@/theme/chakraUITheme";
import {useUsersListQuery} from "@/services/userService";
import {Select} from "chakra-react-select";
import {Pagination} from "@mui/material";

import {useNavigate} from "react-router-dom";
import {useUserDeleteMutation} from "@/services/auth/userService";
import {useRoleListQuery} from "@/services/roleServiceV2";
import {useTranslation} from "react-i18next";
import {useClientTypesQuery} from "../../client-types/utils";
import {CreateDrawer, EditDrawer} from "../../client-types/actions";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import styles from "./style.module.scss";
import InviteModal from "./InviteModal";

const templateColumns =
  "minmax(72px, 32px) minmax(160px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(76px, 32px)";

const limitOptions = [
  {value: 10, label: "10 rows"},
  {value: 20, label: "20 rows"},
  {value: 30, label: "30 rows"},
  {value: 40, label: "40 rows"},
];

export const UserClientTypes = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [editUserGuid, setEditUserGuid] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [userInviteLan, setUserInviteLan] = useState(null);
  const {i18n} = useTranslation();
  const {isOpen, onOpen, onClose} = useDisclosure();

  const clientTypesQuery = useClientTypesQuery();
  const clientTypes = clientTypesQuery.data?.data?.response ?? [];
  const clientTypeId = clientTypes[tabIndex]?.guid;

  const usersListQuery = useUsersListQuery({
    params: {"client-type-id": clientTypeId, limit, offset: (page - 1) * limit},
    queryParams: {enabled: Boolean(clientTypeId)},
  });
  const users = usersListQuery.data?.users ?? [];
  const usersCount = usersListQuery.data?.count;

  const rolesQuery = useRoleListQuery();
  const roles = rolesQuery.data?.data?.response ?? [];
  const selectedClientType = roles?.find(
    (item) => item?.client_type_id === clientTypeId
  );

  if (clientTypesQuery.isLoading || rolesQuery.isLoading) {
    return <PageFallback />;
  }

  const onTabChange = (index) => {
    setTabIndex(index);
    setPage(1);
  };

  const onLimitChange = (value) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <ChakraProvider theme={chakraUITheme}>
      <Box h="100%" display="flex" flexDirection="column" bg="#fff">
        <Flex pt="10px">
          <Tabs index={tabIndex} onChange={onTabChange}>
            <TabList className={styles.react_tab}>
              <Flex
                p={"4px"}
                bg={"#f9fafb"}
                borderRadius={"8px"}
                h={"32px"}
                mb={"5px"}
                border={"1px solid #EAECF0"}>
                {clientTypes.map((type, index) => (
                  <Tab
                    className={`${tabIndex === index ? styles.reactTabIteActive : styles.reactTabItem}`}
                    sx={{fontSize: "12px"}}
                    key={type.guid}>
                    {type.name}
                  </Tab>
                ))}
              </Flex>
            </TabList>
          </Tabs>
          <InviteModal
            selectedClientType={selectedClientType}
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setEditUserGuid(null);
            }}
            onOpen={onOpen}
            guid={editUserGuid}
            users={users}
            userInviteLan={userInviteLan}
          />
        </Flex>

        <Box borderTop="1px solid #EAECF0" overflowX="auto" flexGrow={1}>
          <Grid
            templateColumns={templateColumns}
            borderBottom="1px solid #EAECF0"
            borderLeft="1px solid #EAECF0">
            <Th justifyContent="center">
              <img src="/img/hash.svg" alt="index" />
            </Th>
            <Th type="text">
              {generateLangaugeText(userInviteLan, i18n?.language, "Name") ||
                "Name"}
            </Th>
            <Th type="text">
              {generateLangaugeText(userInviteLan, i18n?.language, "Role") ||
                "Role"}
            </Th>
            <Th type="text">
              {generateLangaugeText(userInviteLan, i18n?.language, "Login") ||
                "Login"}
            </Th>
            <Th type="text">
              {generateLangaugeText(userInviteLan, i18n?.language, "Mail") ||
                "Mail"}
            </Th>
            <Th type="phone">
              {generateLangaugeText(userInviteLan, i18n?.language, "Phone") ||
                "Phone"}
            </Th>
            <Th></Th>
          </Grid>

          {users.map((user, index) => (
            <Grid
              onClick={() => {
                onOpen();
                setEditUserGuid(user?.id);
              }}
              cursor={"pointer"}
              key={user.id}
              templateColumns={templateColumns}
              borderBottom="1px solid #EAECF0"
              borderLeft="1px solid #EAECF0">
              <Td display="flex" justifyContent="center" fontWeight={600}>
                {index + 1}
              </Td>
              <Td>{user.name}</Td>
              <Td>{roles.find((role) => role.guid === user.role_id)?.name}</Td>
              <Td>{user.login}</Td>
              <Td>{user.email}</Td>
              <Td>{user.phone}</Td>
              <Td display="flex" justifyContent="center" columnGap="6px">
                {/* <IconButton
                  h={"25px"}
                  aria-label="edit"
                  icon={<Image src="/img/edit.svg" alt="edit" />}
                  variant="ghost"
                  colorScheme="gray"
                /> */}
                <DeleteButton user={user} />
              </Td>
            </Grid>
          ))}
        </Box>

        <Flex
          p="8px 16px 0px"
          borderTop="1px solid #EAECF0"
          justifyContent="space-between">
          <Flex
            columnGap="16px"
            alignItems="center"
            fontSize={14}
            fontWeight={600}
            color="#344054">
            {generateLangaugeText(userInviteLan, i18n?.language, "Show") ||
              "Show"}
            <Select
              value={{value: limit, label: `${limit} rows`}}
              options={limitOptions}
              menuPlacement="top"
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

          <div />
          <div />
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

const DeleteButton = ({user}) => {
  const deleteMutation = useUserDeleteMutation({
    userMenuId: user?.client_type_id,
  });

  return (
    <IconButton
      h={"25px"}
      aria-label="delete"
      icon={<Image src="/img/delete.svg" alt="delete" />}
      variant="ghost"
      colorScheme="gray"
      isLoading={deleteMutation.isLoading}
      onClick={() => deleteMutation.mutate(user?.id)}
    />
  );
};

const icons = {
  text: <img src="/img/text-column.svg" alt="text" />,
  phone: <img src="/img/phone.svg" alt="text" />,
};

const Th = ({type, children, ...props}) => {
  const icon = icons[type];

  return (
    <GridItem
      display="flex"
      alignItems="center"
      columnGap="8px"
      h="32px"
      py="4px"
      px="8px"
      bg="#F9FAFB"
      borderRight="1px solid #EAECF0"
      color="#475467"
      fontWeight={500}
      fontSize={12}
      {...props}>
      {Boolean(icon) && icon}
      {children}
    </GridItem>
  );
};

const Td = ({children, ...props}) => (
  <GridItem
    px="8px"
    py="4px"
    h="32px"
    bg="#fff"
    borderRight="1px solid #EAECF0"
    color="#475467"
    fontSize={14}
    fontWeight={400}
    whiteSpace="nowrap"
    overflow="hidden"
    textOverflow="ellipsis"
    {...props}>
    {children}
  </GridItem>
);
