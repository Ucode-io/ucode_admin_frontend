import React, {useState} from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import constructorFieldService from "../../../services/constructorFieldService";
import {useQueryClient} from "react-query";
import constructorViewService from "../../../services/constructorViewService";
import {FieldPopover} from "../../Constructor/Tables/Form/Fields/components/FieldPopover/FieldPopover";
import {useForm} from "react-hook-form";
import MaterialUIProvider from "../../../providers/MaterialUIProvider";

function FieldOptions({field, view, tableSlug, tableLan}) {
  const queryClient = useQueryClient();
  const [selectedField, setSelectedField] = useState(null);

  const [anchorMenu, setAnchorMenu] = useState(null);
  const openMenu = Boolean(anchorMenu);

  const [anchorEl, setAnchorEl] = useState(null);
  const openPopover = Boolean(anchorEl);

  const mainForm = useForm();
  const [formType, setFormType] = useState("CREATE");

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setAnchorMenu(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorMenu(null);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setFormType("UPDATE");
    setSelectedField(field);
    setAnchorEl(e.currentTarget);
    handleMenuClose();
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const deleteField = (column) => {
    constructorFieldService.delete(column, tableSlug).then(() => {
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
    handleMenuClose();
  };

  return (
    <MaterialUIProvider>
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        onMouseDown={(e) => e.stopPropagation()}>
        <MoreVertIcon fontSize="medium" />
      </IconButton>

      <Menu
        anchorEl={anchorMenu}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        transformOrigin={{vertical: "top", horizontal: "right"}}>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "140px",
          }}
          onClick={handleEditClick}>
          <ListItemText>Edit Field</ListItemText>
          <EditIcon fontSize="small" />
        </MenuItem>

        <MenuItem
          onClick={() => deleteField(field?.id)}
          sx={{
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "140px",
          }}>
          <ListItemText>Delete Field</ListItemText>
          <DeleteIcon fontSize="small" color="error" />
        </MenuItem>
      </Menu>

      <FieldPopover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        formType={formType}
        mainForm={mainForm}
        tableLan={tableLan}
        slug={tableSlug}
        field={selectedField}
        selectedField={selectedField}
      />
    </MaterialUIProvider>
  );
}

export default FieldOptions;
