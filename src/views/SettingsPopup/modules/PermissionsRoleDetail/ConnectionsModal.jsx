import {Box, Button, Flex, Grid, GridItem, Image} from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import {useConnectionDeleteMutation} from "../../../../services/auth/connectionService";
import {store} from "../../../../store";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {getAllFromDB} from "../../../../utils/languageDB";
import ConnectionCreateModal from "../../../Matrix/ConnectionCreateModal";

const templateColumns =
  "minmax(72px, 32px) minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr) minmax(62px, 1fr)";

function ConnectionsModal({connections}) {
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState();
  const [settingLan, setSettingLan] = useState();
  const [connectionId, setConnectionId] = useState();
  const {i18n} = useTranslation();

  const clientTypeId = store.getState()?.auth?.clientTypes?.id;

  const {mutateAsync: deleteRole, isLoading: createLoading} =
    useConnectionDeleteMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["GET_CONNECTION_LIST"]);
      },
    });

  const deleteRoleElement = (id) => {
    deleteRole(id);
  };
  const closeModal = () => {
    setModalType(null);
  };

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        setSettingLan(formattedData?.find((item) => item?.key === "Setting"));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <Flex w={"full"} alignItems={"center"} justifyContent={"flex-end"}>
        {" "}
        <Button
          px={"8px"}
          h={"32px"}
          minW={"60px"}
          bg={"#2383e2"}
          color={"#fff"}
          m={"5px"}
          borderRadius={"8px"}
          onClick={() => setModalType("NEW")}>
          <AddIcon /> Add Connection
        </Button>
      </Flex>
      <Box borderTop="1px solid #EAECF0" overflowX="auto" flexGrow={1}>
        <Grid
          templateColumns={templateColumns}
          borderBottom="1px solid #EAECF0"
          borderLeft="1px solid #EAECF0"
          fontWeight="bold">
          <Th justifyContent="center">
            <img src="/img/hash.svg" alt="index" />
          </Th>
          <Th type="text">
            {generateLangaugeText(settingLan, i18n?.language, "Name") || "Name"}
          </Th>
          <Th type="text">
            {generateLangaugeText(settingLan, i18n?.language, "Table Slug") ||
              "Table Slug"}
          </Th>
          <Th type="text">
            {generateLangaugeText(settingLan, i18n?.language, "View Slug") ||
              "View Slug"}
          </Th>
          <Th></Th>
        </Grid>

        {connections?.data?.response?.map((user, index) => (
          <Grid
            key={user.id}
            templateColumns={templateColumns}
            borderBottom="1px solid #EAECF0"
            borderLeft="1px solid #EAECF0"
            _hover={{bg: "gray.50"}}
            cursor="pointer"
            onClick={() => {
              setModalType("UPDATE");
              setConnectionId(user.guid);
            }}>
            <Td display="flex" justifyContent="center" fontWeight={600}>
              {index + 1}
            </Td>
            <Td>{user.name}</Td>
            <Td>{user?.table_slug}</Td>
            <Td>{user.view_slug}</Td>

            <Td display="flex" justifyContent="center" columnGap="6px">
              <RectangleIconButton
                style={{height: "24px", border: "none"}}
                color="error"
                onClick={() => {
                  deleteRoleElement(user.guid);
                }}>
                <Image src="/img/delete.svg" alt="delete" />
              </RectangleIconButton>
            </Td>
          </Grid>
        ))}
        {modalType && (
          <ConnectionCreateModal
            clientTypeId={clientTypeId}
            settingLan={settingLan}
            closeModal={closeModal}
            modalType={modalType}
            connectionId={connectionId}
          />
        )}
      </Box>
    </div>
  );
}

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

export default ConnectionsModal;
