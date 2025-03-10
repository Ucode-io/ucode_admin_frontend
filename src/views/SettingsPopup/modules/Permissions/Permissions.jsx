import { Box, List, ListItem, ListItemText } from "@mui/material";
import { usePermissionsProps } from "./usePermissionsProps";
import { ContentTitle } from "../../components/ContentTitle";
import { RiPencilFill } from "react-icons/ri";
import { FolderCreateModal } from "../../components/FolderCreateModal";
import DeleteWrapperModal from "../../../../components/DeleteWrapperModal";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import { generateLangaugeText } from "../../../../utils/generateLanguageText";

export const Permissions = () => {

  const { 
    child, 
    isLoading,
    menuSettingsClick,
    selectedUserFolder,
    userFolderModalType,
    closeUserFolderModal,
    deleteRole,
    lang,
    i18n,
    handleItemClick,
  } = usePermissionsProps();

  return <Box>
    <ContentTitle>
      {
        generateLangaugeText(
          lang,
          i18n?.language,
          "Permissions"
        ) || "Permissions"
      }
    </ContentTitle>
    <List sx={{marginTop: "36px"}}>
      {
        child?.map((row) => {
          return (
            <ListItem key={row.id} sx={{ borderBottom: "1px solid #E0E0E0", cursor: "pointer"}} onClick={() => handleItemClick(row)}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <ListItemText>{row.name}</ListItemText>
                <Box display="flex" alignItems="center" gap="10px">
                  <RiPencilFill
                    cursor="pointer"
                    size={13}
                    onClick={(e) => {
                      menuSettingsClick(e, row);
                    }}
                    style={{
                      color: "#475467",
                    }}
                  />
                  <Box className="extra_icon">
                    <DeleteWrapperModal
                      onDelete={(e) => {
                        e.stopPropagation();
                        deleteRole(row);
                      }}>
                      <RectangleIconButton style={{border: "none"}}>
                        <Delete
                          size={13}
                          style={{
                            color: "#475467",
                          }}
                        />
                      </RectangleIconButton>
                    </DeleteWrapperModal>
                  </Box>
                </Box>
              </Box>
            </ListItem>
          )
        })
      }
    </List>

    {
      selectedUserFolder && (
        <FolderCreateModal
          clientType={selectedUserFolder}
          closeModal={closeUserFolderModal}
          modalType={userFolderModalType}
        />
      )
    }
  </Box>
}
