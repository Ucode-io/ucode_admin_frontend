import "./style.scss";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "../../components/Button";
import { useTranslation } from "react-i18next";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const CModal = ({
  open = false,
  close,
  confirm,
  onClose,
  onConfirm,
  title,
  footer,
  loading,
  className,
  style,
  width = 420,
  children,
  disable = false,
  isWarning = true,
  header = <div></div>,
  ...props
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const buttons = [
    <Button
      shape="outlined"
      key="cancel-btn"
      style={{ width: "100%" }}
      size="large"
      color="blue"
      borderColor="bordercolor"
      classNameParent="flex justify-end"
      onClick={onClose}
    >
      {close || "Нет"}
    </Button>,
    <Button
      key="confirm-btn"
      style={{ width: "100%" }}
      size="large"
      color="blue"
      classNameParent="flex justify-end"
      onClick={onConfirm}
      loading={loading}
      disabled={disable}
    >
      {confirm || "Да"}
    </Button>,
  ];

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      {...props}
    >
      <Fade in={open}>
        <div className="modal-component rounded-md">
          <div>{header}</div>
          <div
            className={`bg-white ${className} p-8`}
            style={{ ...style, width }}
          >
            {title !== null && (
              <div className="flex items-center mb-6">
                {isWarning && (
                  <WarningRoundedIcon
                    fontSize="medium"
                    style={{ color: "#F76659" }}
                    className="mr-4"
                  />
                )}
                <p className="modal-title whitespace-pre-wrap">
                  {title || t("are.you.sure.want.to.delete")}
                </p>
              </div>
            )}
            {children}
            {footer !== null && (
              <div className="grid grid-cols-2 gap-2">{footer ?? buttons}</div>
            )}
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default CModal;
