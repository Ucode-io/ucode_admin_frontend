import {Close} from "@mui/icons-material";
import {Card, IconButton, Modal} from "@mui/material";
import {cloneElement, useState} from "react";
import PrimaryButton from "../Buttons/PrimaryButton";
import SecondaryButton from "../Buttons/SecondaryButton";
import styles from "./style.module.scss";
import {useGetLang} from "../../hooks/useGetLang";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";

const DeleteWrapperModal = ({children, onDelete, id}) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const {i18n, t} = useTranslation();
  const tableLan = useGetLang("Table");
  const closeModal = () => setModalIsVisible(false);
  const openModal = () => setModalIsVisible(true);

  return (
    <>
      <Modal
        open={modalIsVisible}
        disableAutoFocus
        className={styles.modal}
        onClose={closeModal}
        onClick={(e) => e.stopPropagation()}>
        <Card className={styles.card}>
          <div className={styles.body}> {t("sure_delete")}</div>

          <div className={styles.footer}>
            <SecondaryButton className={styles.button} onClick={closeModal}>
              {generateLangaugeText(tableLan, i18n?.language, "Cancel") ||
                "Cancel"}
            </SecondaryButton>
            <PrimaryButton
              className={styles.button}
              color="error"
              onClick={() => {
                onDelete(id);
                closeModal();
              }}>
              {generateLangaugeText(tableLan, i18n?.language, "Yes") || "Yes"}
            </PrimaryButton>
          </div>
        </Card>
      </Modal>
      {cloneElement(children, {onClick: openModal})}
      {/* {children} */}
    </>
  );
};

export default DeleteWrapperModal;
