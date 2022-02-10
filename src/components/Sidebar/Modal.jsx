import { Fade } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import Button from "../Button"
import OutsideClickHandler from "react-outside-click-handler"

const LogoutModal = ({ isOpen, close, logout }) => {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 100,
      }}
    >
      <OutsideClickHandler onOutsideClick={close}>
        <Fade in={isOpen}>
          <div className="outline-none py-5 rounded-md bg-white">
            <div className=" px-5">
              <h1 className="title font-bold text-xl mb-8">{t("logout")}</h1>

              <div className="buttons-row flex justify-end">
                <Button
                  style={{ width: "160px" }}
                  size="large"
                  color="blue"
                  borderColor="bordercolor"
                  classNameParent="flex justify-end"
                  shape="outlined"
                  key="cancel-btn"
                  onClick={close}
                >
                  {t("cancel")}
                </Button>
                <Button
                  className="ml-2"
                  style={{ width: "160px" }}
                  size="large"
                  color="blue"
                  onClick={logout}
                >
                  {t("approve")}
                </Button>
              </div>
            </div>
          </div>
        </Fade>
      </OutsideClickHandler>
    </div>
  )
}

export default LogoutModal
