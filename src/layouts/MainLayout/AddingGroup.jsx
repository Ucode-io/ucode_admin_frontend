import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import userService from "../../services/auth/userService";
import {store} from "../../store";
import {useLocation, useParams} from "react-router-dom";

function AddingGroup() {
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const authStore = store.getState();
  const location = useLocation();

  const query = new URLSearchParams(location?.search);
  const projectId = query.get("project-id");
  const envId = query.get("env_id");
  const roleId = query.get("role_id");
  const clientTypeId = query.get("client_type_id");

  useEffect(() => {
    if (window.location.href.includes("invite-user")) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => setOpen(false);

  const handleAddGroup = () => {
    setLoader(true);
    const data = {
      project_id: projectId,
      env_id: envId,
      user_id: authStore?.auth?.userId,
      client_type_id: clientTypeId,
      role_id: roleId,
    };

    userService
      .userInvite(data)
      .then(() => {
        console.log("Joined company successfully!");
        setOpen(false);
      })
      .finally(() => setLoader(false));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {borderRadius: 3, textAlign: "center", py: 3, px: 2},
      }}>
      <Box sx={{display: "flex", justifyContent: "center", mb: 2}}>
        <Box
          sx={{
            width: 60,
            height: 60,
            bgcolor: "primary.main",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
          }}>
          C
        </Box>
      </Box>

      <Typography variant="h4" sx={{mb: 1}}>
        Join Company
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>
        You have been invited to join this company via link.
      </Typography>

      <DialogActions sx={{justifyContent: "center"}}>
        <Button
          disabled={loader}
          fullWidth
          variant="contained"
          color="primary"
          sx={{height: 45, borderRadius: 2, fontSize: 15}}
          onClick={handleAddGroup}>
          {loader ? (
            <CircularProgress size={30} style={{color: "#007aff"}} />
          ) : (
            " Join Company"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddingGroup;
