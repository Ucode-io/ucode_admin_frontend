import {Button, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import {Box, Dialog, Menu} from "@mui/material";
import {useTranslation} from "react-i18next";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import RelationViewTypeList from "./RelationViewTypeList";

function ViewAddMenu({fieldsMap, setData = () => {}}) {
  const {i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewCreate, setViewCreate] = useState(false);
  const [relationField, setRelationField] = useState(null);
  const open = Boolean(anchorEl);

  const relationFields = Object.values(fieldsMap)?.filter(
    (el) => el?.type === "LOOKUP"
  );

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleClickModal = (field) => {
    setViewCreate(true);
    handleClose();
    setRelationField(field);
  };
  const handleCloseModal = () => setViewCreate(false);

  return (
    <>
      <Button
        onClick={handleClick}
        w={"28px"}
        h={"24px"}
        border={"#708DB7 1px solid"}
        borderRadius={"4px"}
        ml={3}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}>
        <AddIcon />
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box
          sx={{
            minWidth: "150px",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}>
          {relationFields?.map((item) => (
            <Box
              onClick={() => handleClickModal(item)}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "4px",
                borderRadius: "4px",
                cursor: "pointer",
                "&:hover": {
                  background: "#f1f1f1",
                },
              }}>
              <AttachFileIcon />
              <Text>{item?.attributes?.[`label_${i18n?.language}`]}</Text>
            </Box>
          ))}
        </Box>
      </Menu>

      <Dialog open={viewCreate} onClose={handleCloseModal}>
        <RelationViewTypeList
          tablSlug={relationField?.table_slug}
          handleClose={handleCloseModal}
        />
      </Dialog>
    </>
  );
}

export default ViewAddMenu;
