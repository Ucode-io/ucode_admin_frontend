import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export const ConfirmPopup = ({  open, handleClose, onConfirm = () => {}, onNotConfirm = () => {} }) => {

  return <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Are you sure you want to permanently delete this resource?
            </DialogTitle>
            <DialogContent>
              {/* <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous
              location data to Google, even when no apps are running.
            </DialogContentText> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={onNotConfirm} fullWidth variant="outlined">
                No
              </Button>
              <Button
                onClick={onConfirm}
                fullWidth
                variant="contained"
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
}