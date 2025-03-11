import { Box } from "@mui/material";
import { usePermissionsProps } from "./usePermissionsProps";
import { ContentTitle } from "../../components/ContentTitle";
import { FolderCreateModal } from "../../components/FolderCreateModal";
import { generateLangaugeText } from "../../../../utils/generateLanguageText";
import { ContentList } from "../../components/ContentList";

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
  return (
    <Box>
      <ContentTitle>
        {generateLangaugeText(lang, i18n?.language, "Permissions") ||
          "Permissions"}
      </ContentTitle>

      <ContentList
        sx={{ marginTop: "36px" }}
        arr={child}
        onItemClick={(row) => handleItemClick(row)}
        handleEdit={(e, row) => menuSettingsClick(e, row)}
        handleDelete={(row) => deleteRole(row)}
        isLoading={isLoading}
        canDelete
        canEdit
      />

      {selectedUserFolder && (
        <FolderCreateModal
          clientType={selectedUserFolder}
          closeModal={closeUserFolderModal}
          modalType={userFolderModalType}
        />
      )}
    </Box>
  );
};
