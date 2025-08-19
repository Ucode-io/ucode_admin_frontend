import React, {useState} from "react";
import {
  Button,
  Grid,
  GridItem,
  Image,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  useDisclosure,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import {useForm, useFieldArray} from "react-hook-form";
import {useQuery, useQueryClient} from "react-query";
import {useTranslation} from "react-i18next";

import MaterialUIProvider from "../../providers/MaterialUIProvider";
import ActionSettings from "../Constructor/Tables/Form/Actions/ActionSettings";
import constructorCustomEventService from "../../services/constructorCustomEventService";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import ButtonGroup from "../../theme/overrides/ButtonGroup";

const templateColumns =
  "minmax(72px, 32px) minmax(260px, 4fr) minmax(72px, 1fr)";

function TableActions({tableLan, tableSlug = ""}) {
  const {i18n} = useTranslation();
  const queryClient = useQueryClient();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [drawerState, setDrawerState] = useState(null);

  const mainForm = useForm();
  const {
    fields: actions,
    remove,
    append,
    update,
  } = useFieldArray({
    control: mainForm.control,
    name: "actions",
    keyName: "key",
  });

  const onCreate = (data) => append(data);
  const onUpdate = (data) => {
    const index = actions?.findIndex((action) => action.id === data.id);
    update(index, data);
  };

  const deleteAction = (row, index) => {
    constructorCustomEventService.delete(row.id, row.table_slug).then(() => {
      remove(index);
      queryClient.refetchQueries("GET_ACTIONS_LIST");
    });
  };

  const {data: custom_events} = useQuery(
    ["GET_ACTIONS_LIST", tableSlug],
    () =>
      constructorCustomEventService.getList({table_slug: tableSlug}, tableSlug),
    {select: (res) => res?.custom_events ?? []}
  );

  return (
    <>
      <Button
        h="30px"
        ml="auto"
        onClick={onOpen}
        variant="outline"
        colorScheme="gray"
        borderColor="#D0D5DD"
        color="#344054"
        borderRadius="8px">
        <Image h={"18px"} src="/img/lighting.svg" alt="settings" />
      </Button>

      {/* Modal for listing actions */}
      <Modal
        trapFocus={false}
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size="6xl">
        <ModalOverlay />
        <ModalContent borderRadius="12px" p="20px 0px" minH="400px">
          <ModalHeader p={0} mb={4}>
            <Flex
              p="0px 20px"
              w="full"
              alignItems="center"
              justifyContent="space-between">
              <Text fontSize="2xl" fontWeight="bold">
                Actions
              </Text>
              <Button onClick={() => setDrawerState("CREATE")}>
                Add Action
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody p={0}>
            <Box borderTop="1px solid #EAECF0" overflowX="auto" flexGrow={1}>
              <Grid
                templateColumns={templateColumns}
                borderBottom="1px solid #EAECF0"
                borderLeft="1px solid #EAECF0"
                fontWeight="bold">
                <Th justifyContent="center">
                  <img src="/img/hash.svg" alt="index" />
                </Th>
                <Th type="text">Label</Th>
                <Th></Th>
              </Grid>

              {custom_events?.map((row, index) => (
                <Grid
                  key={row.id}
                  templateColumns={templateColumns}
                  borderBottom="1px solid #EAECF0"
                  borderLeft="1px solid #EAECF0"
                  _hover={{bg: "gray.50"}}
                  cursor="pointer"
                  onClick={() => setDrawerState(row)}>
                  <Td display="flex" justifyContent="center" fontWeight={600}>
                    {index + 1}
                  </Td>
                  <Td>{row.label}</Td>
                  <Td display="flex" justifyContent="center" columnGap="6px">
                    <Flex>
                      <Button
                        bg="none"
                        _hover={{bg: "none"}}
                        style={{height: "24px", border: "none"}}
                        onClick={() => setDrawerState(row)}>
                        <Image src="/img/edit.svg" alt="edit" />
                      </Button>
                      <Button
                        _hover={{bg: "none"}}
                        bg="none"
                        style={{height: "24px", border: "none"}}
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAction(row, index);
                        }}>
                        <Image src="/img/delete.svg" alt="delete" />
                      </Button>
                    </Flex>
                  </Td>
                </Grid>
              ))}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Chakra Drawer for editing/creating actions */}
      <Drawer
        isOpen={!!drawerState}
        placement="right"
        onClose={() => setDrawerState(null)}
        size="md">
        <DrawerOverlay />
        <DrawerContent w="450px" maxW="450px">
          {/* <DrawerHeader borderBottomWidth="1px">
            {drawerState === "CREATE" ? "Create Action" : "Edit Action"}
          </DrawerHeader> */}
          <DrawerBody p={0}>
            <MaterialUIProvider>
              <ActionSettings
                modalAction={true}
                action={drawerState}
                closeSettingsBlock={() => setDrawerState(null)}
                formType={drawerState}
                height={`calc(100vh - 48px)`}
                onCreate={onCreate}
                onUpdate={onUpdate}
              />
            </MaterialUIProvider>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
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
      {icon}
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

export default TableActions;
