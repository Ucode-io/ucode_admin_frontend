import React, {useState} from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useQueryClient} from "react-query";
import {useForm} from "react-hook-form";
import MaterialUIProvider from "@/providers/MaterialUIProvider";
import deleteField from "@/utils/deleteField";
import { RelationPopover } from "@/views/Constructor/Tables/Form/Relations/components/RelationPopover";
import { FieldPopover } from "@/views/Constructor/Tables/Form/Fields/components/FieldPopover";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { useViewContext } from "@/providers/ViewProvider";

export const FieldOptions = ({ field, view, tableSlug, tableLan }) => {
  const { refetchTableInfo } = useViewContext();

  const queryClient = useQueryClient();
  const [selectedField, setSelectedField] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

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
    setAnchorEl(e.currentTarget);
    setMenuAnchor(e.currentTarget);
    setFormType("UPDATE");
    setSelectedField(field);
    handleMenuClose();
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteField = (column) => {
    deleteField({
      column,
      tableSlug,
      callback: () => {
        refetchTableInfo();
        queryClient.refetchQueries("GET_OBJECTS_LIST", { tableSlug });
      },
    });
    handleMenuClose();
  };

  return (
    <MaterialUIProvider>
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <MoreVertIcon fontSize="medium" />
      </IconButton>

      <Menu
        anchorEl={anchorMenu}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "140px",
          }}
          onClick={handleEditClick}
        >
          <ListItemText>Edit Field</ListItemText>
          <EditIcon fontSize="small" />
        </MenuItem>

        <MenuItem
          onClick={() => handleDeleteField(field)}
          sx={{
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "140px",
          }}
        >
          <ListItemText>Delete Field</ListItemText>
          <DeleteIcon fontSize="small" color="error" />
        </MenuItem>
      </Menu>

      {selectedField?.type === FIELD_TYPES.LOOKUP ? (
        <RelationPopover
          anchorEl={anchorEl ?? menuAnchor}
          onClose={handlePopoverClose}
          tableLan={tableLan}
          relation={selectedField}
          closeSettingsBlock={() => handlePopoverClose()}
          // getRelationFields={getRelationFields}
          formType={formType}
          open={Boolean(openPopover)}
        />
      ) : (
        <FieldPopover
          open={Boolean(openPopover)}
          anchorEl={anchorEl ?? menuAnchor}
          onClose={handlePopoverClose}
          formType={formType}
          mainForm={mainForm}
          tableLan={tableLan}
          slug={tableSlug}
          field={selectedField}
          selectedField={selectedField}
        />
      )}
    </MaterialUIProvider>
  );
};
