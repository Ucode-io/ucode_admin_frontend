import {Box, Button, CircularProgress, Dialog, Modal} from "@mui/material";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import HFTextField from "../../components/FormElements/HFTextField";
import conectionDatabaseService from "../../services/connectionDatabaseService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 2,
};

function AddConnectionModal({
  openModal,
  handleClose = () => {},
  refetch = () => {},
}) {
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    setLoading(true);
    conectionDatabaseService
      .createConnection({
        ...values,
      })
      .then(() => {
        refetch();
        handleClose();
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={style}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Box sx={{marginBottom: "8px"}}>Name</Box>
              <HFTextField
                required={true}
                placeholder={"name"}
                name="name"
                control={control}
              />
            </Box>
            <Box sx={{margin: "15px 0"}} />
            <Box>
              <Box sx={{marginBottom: "8px"}}>Connection String</Box>
              <HFTextField
                required={true}
                placeholder={"connection string"}
                name="connection_string"
                control={control}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}>
              <Button
                type="submit"
                sx={{marginTop: "10px", width: "110px"}}
                variant="contained">
                {loading ? (
                  <CircularProgress size={20} style={{color: "#fff"}} />
                ) : (
                  "Add"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default AddConnectionModal;
