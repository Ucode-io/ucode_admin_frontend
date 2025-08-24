import React, {useState} from "react";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from "@chakra-ui/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import constructorFieldService from "../../../services/constructorFieldService";
import {useQueryClient} from "react-query";
import constructorViewService from "../../../services/constructorViewService";
import {FieldPopover} from "../../Constructor/Tables/Form/Fields/components/FieldPopover/FieldPopover";

function FieldOptions({setCloseOnBlur = () => {}, field, view, tableSlug}) {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [formType, setFormType] = useState("CREATE");

  const deleteField = (column) => {
    constructorFieldService.delete(column, tableSlug).then((res) => {
      constructorViewService
        .update(tableSlug, {
          ...view,
          columns: view?.columns?.filter((item) => item !== column),
        })
        .then(() => {
          queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
          queryClient.refetchQueries("GET_OBJECTS_LIST", {tableSlug});
        });
    });
  };

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <Menu placement="bottom-end" autoSelect={false} isLazy portal={false}>
        <MenuButton
          onClick={(e) => {
            setCloseOnBlur(true);
            e.stopPropagation();
          }}
          as={Box}
          cursor="pointer"
          h="18px"
          borderRadius="md"
          _hover={{bg: "gray.100"}}>
          <MoreVertIcon fontSize="medium" />
        </MenuButton>

        <MenuList
          portal={false}
          borderRadius="lg"
          shadow="xl"
          minW="180px"
          py={2}
          onClick={(e) => e.stopPropagation()}>
          <MenuItem
            icon={<Icon as={EditIcon} fontSize="18px" />}
            onClick={(e) => {
              e.stopPropagation();
              // onEdit?.();
            }}>
            Edit Field
          </MenuItem>
          <MenuItem
            icon={<Icon as={DeleteIcon} fontSize="18px" />}
            color="red.500"
            onClick={(e) => {
              e.stopPropagation();
              deleteField(field?.id);
            }}>
            Delete Field
          </MenuItem>
        </MenuList>
      </Menu>

      {/* <FieldPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        formType={formType}
        getRelationFields={getRelationFields}
        mainForm={mainForm}
        tableLan={tableLan}
        // onSubmit={(index, field) => updateField(field, index)}
        slug={tableSlug}
        field={drawerState}
        selectedField={selectedField}
        // menuItem={menuItem}
      /> */}
    </Box>
  );
}

export default FieldOptions;
