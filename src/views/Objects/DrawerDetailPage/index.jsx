import {
  Box,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Flex,
  Text,
} from "@chakra-ui/react";
import React, {useMemo, useState} from "react";
import {ChevronRightIcon} from "@chakra-ui/icons";
import DrawerFormDetailPage from "./DrawerFormDetailPage";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import {useQueryClient} from "react-query";
import {store} from "../../../store";
import {showAlert} from "../../../store/alert/alert.thunk";

function DrawerDetailPage({
  open,
  setOpen,
  selectedRow,
  menuItem,
  layout,
  fieldsMap,
  refetch,
  dateInfo = {},
  fullScreen = false,
  setFullScreen = () => {},
}) {
  const {tableSlug} = useParams();
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {navigateToForm} = useTabRouter();
  const [btnLoader, setBtnLoader] = useState(false);
  const queryClient = useQueryClient();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const {state = {}} = useLocation();
  const menu = store.getState().menu;
  const isInvite = menu.invite;

  const {id: idFromParam} = useParams();

  const id = useMemo(() => {
    return idFromParam ?? selectedRow?.guid;
  }, [idFromParam, selectedRow]);

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...state,
      ...dateInfo,
      invite: isInvite ? menuItem?.data?.table?.is_login_table : false,
    },
  });

  const update = (data) => {
    delete data.invite;
    setBtnLoader(true);
    constructorObjectService
      .update(tableSlug, {data})
      .then(() => {
        dispatch(showAlert("Successfully updated", "success"));
        handleClose();
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => {
        handleClose();
        setBtnLoader(false);
      });
  };
  const create = (data) => {
    setBtnLoader(true);

    constructorObjectService
      .create(tableSlug, {data})
      .then((res) => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
          }
        );
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        if (modal) {
          handleClose();
          queryClient.refetchQueries(
            "GET_OBJECTS_LIST_WITH_RELATIONS",
            tableSlug,
            {
              table_slug: tableSlug,
            }
          );
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
          handleClose();
          if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data);
        }

        dispatch(showAlert("Successfully updated!", "success"));
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => {
        setBtnLoader(false);
        refetch();
      });
  };

  const onSubmit = (data) => {
    if (id) {
      update(data);
    } else {
      create(data);
    }
  };

  return (
    <Drawer isOpen={open} placement="right" onClose={handleClose} size="md">
      <Box position={"relative"} zIndex={9} bg={"red"} maxW="650px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent
            boxShadow="
        rgba(15, 15, 15, 0.04) 0px 0px 0px 1px,
        rgba(15, 15, 15, 0.03) 0px 3px 6px,
        rgba(15, 15, 15, 0.06) 0px 9px 24px
      "
            zIndex={9}
            bg={"white"}
            maxW="650px">
            <DrawerHeader
              px="12px"
              bg="white"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              pr={10}>
              <Flex h={"44px"} align="center" justify="space-between">
                <Box
                  onClick={handleClose}
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="24px"
                  height="24px">
                  <KeyboardDoubleArrowRightIcon w={6} h={6} />
                </Box>
              </Flex>

              <Button
                isLoading={btnLoader}
                disabled={btnLoader}
                type="submit"
                rounded={4}
                bg={"#007aff"}
                color={"#fff"}
                w={100}
                h={10}>
                Save
              </Button>
            </DrawerHeader>

            <DrawerBody p="0px 50px" overflow={"auto"}>
              <DrawerFormDetailPage
                menuItem={menuItem}
                layout={layout}
                selectedRow={selectedRow}
                tableSlugFromProps={tableSlug}
                handleClose={handleClose}
                modal={true}
                dateInfo={dateInfo}
                setFullScreen={setFullScreen}
                fullScreen={fullScreen}
                fieldsMap={fieldsMap}
                control={control}
                watch={watch}
                reset={reset}
              />
            </DrawerBody>
          </DrawerContent>
        </form>
      </Box>
    </Drawer>
  );
}

export default DrawerDetailPage;
