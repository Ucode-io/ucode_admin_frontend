import {Box, Button, CircularProgress, Dialog} from "@mui/material";
import React, {useState} from "react";
import constructorFieldService from "../../../../services/constructorFieldService";
import constructorViewService from "../../../../services/constructorViewService";
import {useQueryClient} from "react-query";

function DeleteColumnModal({
  view,
  tableSlug,
  columnId,
  openDeleteModal,
  handleCloseModal = () => {},
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const deleteField = () => {
    setLoading(true);
    constructorFieldService.delete(columnId, tableSlug).then((res) => {
      constructorViewService
        .update(tableSlug, {
          ...view,
          columns: view?.columns?.filter((item) => item !== columnId),
        })
        .then(() => {
          handleCloseModal();
          queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
          queryClient.refetchQueries("GET_OBJECTS_LIST", {tableSlug});
        })
        .catch(() => setLoading(false))
        .finally(() => setLoading(false));
    });
  };

  return (
    <>
      <Dialog onClose={handleCloseModal} open={openDeleteModal}>
        <Box sx={{width: "400px", padding: "32px", height: "133px"}}>
          <Box sx={{marginBottom: "16px"}}>
            Are you sure you want to delete?
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Button
              onClick={handleCloseModal}
              sx={{width: "156px"}}
              color="primary"
              variant="outlined">
              Cancel
            </Button>
            <Button
              loading={loading}
              sx={{width: "156px"}}
              variant="contained"
              color="error"
              onClick={deleteField}>
              {loading ? (
                <CircularProgress style={{color: "#fff"}} size={20} />
              ) : (
                "Yes"
              )}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

export default DeleteColumnModal;
