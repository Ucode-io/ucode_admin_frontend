import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
} from "@chakra-ui/react";
import {store} from "../../../store";
import {useForm} from "react-hook-form";
import {Check} from "@mui/icons-material";
import {useQueryClient} from "react-query";
import {Menu, MenuItem} from "@mui/material";
import React, {useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useTabRouter from "../../../hooks/useTabRouter";
import DrawerFormDetailPage from "./DrawerFormDetailPage";
import {showAlert} from "../../../store/alert/alert.thunk";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

function DrawerDetailPage({
  open,
  layout,
  refetch,
  setOpen,
  menuItem,
  fieldsMap,
  selectedRow,
  dateInfo = {},
  selectedViewType,
  fullScreen = false,
  setLayoutType = () => {},
  setFullScreen = () => {},
  navigateToEditPage = () => {},
  setSelectedViewType = () => {},
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {tableSlug} = useParams();
  const {state = {}} = useLocation();
  const menu = store.getState().menu;
  const isInvite = menu.invite;
  const queryClient = useQueryClient();
  const {id: idFromParam} = useParams();
  const handleClose = () => setOpen(false);
  const {navigateToForm} = useTabRouter();
  const [btnLoader, setBtnLoader] = useState(false);
  const isUserId = useSelector((state) => state?.auth?.userId);

  const id = useMemo(() => {
    return idFromParam ?? selectedRow?.guid;
  }, [idFromParam, selectedRow]);

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: {errors},
    setValue: setFormValue,
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
                  <KeyboardDoubleArrowRightIcon
                    style={{color: "rgba(55, 53, 47, 0.45)"}}
                    w={6}
                    h={6}
                  />
                </Box>
                <Box
                  sx={{
                    width: "1px",
                    height: "14px",
                    margin: "0 6px",
                    background: "rgba(55, 53, 47, 0.16)",
                  }}></Box>
                <Box>
                  <ScreenOptions
                    selectedViewType={selectedViewType}
                    setSelectedViewType={setSelectedViewType}
                    setLayoutType={setLayoutType}
                    selectedRow={selectedRow}
                    navigateToEditPage={navigateToEditPage}
                  />
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

const ScreenOptions = ({
  selectedViewType,
  selectedRow,
  setSelectedViewType = () => {},
  setLayoutType = () => {},
  navigateToEditPage = () => {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const options = [
    {label: "Side peek", icon: "SidePeek"},
    {label: "Center peek", icon: "CenterPeek"},
    {label: "Full page", icon: "FullPage"},
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option?.icon === "FullPage") {
      setLayoutType("SimpleLayout");
      navigateToEditPage(selectedRow);
    }

    if (option) setSelectedViewType(option);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button onClick={handleClick} variant="outlined">
        <span>{getColumnIcon(selectedViewType)}</span>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}>
        <Box sx={{width: "220px", padding: "4px 0"}}>
          {options.map((option) => (
            <MenuItem
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "6px",
                color: "#37352f",
              }}
              key={option.label}
              onClick={() => handleClose(option)}>
              <Box sx={{display: "flex", alignItems: "center", gap: "5px"}}>
                <span>{getColumnIcon(option)}</span>
                {option.label}
              </Box>

              <Box>
                {option.label === selectedViewType?.label ? <Check /> : ""}
              </Box>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export const getColumnIcon = (column) => {
  if (column.icon === "SidePeek") {
    return (
      <img
        src="/public/img/drawerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else if (column?.icon === "CenterPeek") {
    return (
      <img
        src="/public/img/centerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else
    return (
      <img
        src="/public/img/fullpagePeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
};

export default DrawerDetailPage;
