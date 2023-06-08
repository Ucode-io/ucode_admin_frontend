import { Box, Card, IconButton, Modal, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelButton from "../Buttons/CancelButton";
import CreateButton from "../Buttons/CreateButton";
import SaveButton from "../Buttons/SaveButton";
import constructorTableService from "../../services/constructorTableService";
import { useQueryClient } from "react-query";
import { useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./style.scss";
import FolderTreeView from "./TreeView";
import {
  useMenuListQuery,
  useMenuUpdateMutation,
} from "../../services/menuService";
const FolderModal = ({
  closeModal,
  modalType,
  loading,
  selectedTable,
  getAppById,
  computedFolderList,
  menuList,
  element,
}) => {
  const queryClient = useQueryClient();
  const [folder, setFolder] = useState();
  const [check, setCheck] = useState(false);

  const { mutateAsync: updateMenu, isLoading: createLoading } =
    useMenuUpdateMutation({
      onSuccess: () => {
        closeModal();
        queryClient.refetchQueries(["MENU"], element?.id);
      },
    });
  console.log("selectedTable", selectedTable);
  const createType = () => {
    updateMenu({
      parent_id: folder,
      id: selectedTable?.id,
      type: selectedTable?.type,
      icon: selectedTable?.icon || undefined,
      label: selectedTable?.label || undefined,
      table: selectedTable?.table || undefined,
      microfrontend: selectedTable?.microfrontend || undefined,
      table_id: selectedTable?.table_id || undefined,
      microfrontend_id: selectedTable?.microfrontend_id || undefined,
    });
  };

  const handleSelect = (e, itemId) => {
    setFolder(itemId);
    setCheck(true);
  };

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {modalType === "create" ? "Select folder" : "Select folder"}
            </Typography>
            <IconButton color="primary" onClick={closeModal}>
              <HighlightOffIcon fontSize="large" />
            </IconButton>
          </div>
          <Box className="tree_view">
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{
                height: "100%",
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                overflow: "auto",
                padding: "10px",
              }}
              onNodeSelect={handleSelect}
            >
              {/* {renderTree(menuList?.menus[0])} */}
              {menuList?.menus?.map((item) => (
                <FolderTreeView
                  element={item}
                  setCheck={setCheck}
                  check={check}
                  folder={folder}
                />
              ))}
            </TreeView>
          </Box>
          <div className="folder_btns-row">
            <CancelButton onClick={closeModal} />
            {modalType === "typeCreate" ? (
              <CreateButton onClick={() => createType()} loading={loading} />
            ) : (
              <SaveButton onClick={() => createType()} loading={loading} />
            )}
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default FolderModal;
