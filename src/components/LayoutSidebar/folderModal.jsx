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
const FolderModal = ({
  closeModal,
  modalType,
  loading,
  selectedTable,
  getAppById,
  computedFolderList,
  menuList,
}) => {
  const queryClient = useQueryClient();
  const [folder, setFolder] = useState();

  const createType = (data) => {
    constructorTableService
      .update({
        ...selectedTable,
        folder_id: folder,
      })
      .then(() => {
        queryClient.refetchQueries(["GET_TABLE_FOLDER"]);
        closeModal();
        getAppById();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSelect = (event, itemId) => {
    setFolder(itemId);
  };
  const renderTree = (nodes) => (
    <TreeItem key={nodes?.id} nodeId={nodes?.id} label={nodes?.label}>
      {Array.isArray(nodes?.child_menus)
        ? nodes?.child_menus.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

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
              {renderTree(menuList?.menus[0])}
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
