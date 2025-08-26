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
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {companyActions} from "../../store/company/company.slice";
import {permissionsActions} from "../../store/permissions/permissions.slice";
import {authActions} from "../../store/auth/auth.slice";
import {useDispatch} from "react-redux";
import authService from "../../services/auth/authService";

function AddingGroup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const authStore = store.getState();
  const location = useLocation();

  const query = new URLSearchParams(location?.search);
  const projectId = query.get("project-id");
  const envId = query.get("env_id");
  const roleId = query.get("role_id");
  const clientTypeId = query.get("client_type_id");
  const name = query.get("name");

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
      .then((res) => {
        onSelectEnvironment(res);
        console.log("Joined company successfully!");
        setOpen(false);
      })
      .finally(() => setLoader(false));
  };

  const onSelectEnvironment = (data = {}) => {
    if (!data?.env_id || !data?.project_id) {
      console.warn("Missing env_id or project_id:", data);
      return;
    }

    const params = {
      refresh_token: authStore?.auth?.refreshToken,
      env_id: envId,
      project_id: data.project_id,
      for_env: true,
    };

    dispatch(companyActions.setEnvironmentItem(data));
    dispatch(companyActions.setEnvironmentId(data.env_id));

    authService
      .updateToken({...params}, {...params})
      .then((res) => {
        dispatch(companyActions.setProjectId(data.project_id));
        dispatch(permissionsActions.setPermissions(res?.permissions));
        store.dispatch(authActions.setTokens(res));
        navigate("/");
        window.location.reload();
      })
      .catch((err) => console.log(err));
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
          {name?.[0]}
        </Box>
      </Box>

      <Typography variant="h4" sx={{mb: 1}}>
        {name || "Company name"}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{mb: 1}}>
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
