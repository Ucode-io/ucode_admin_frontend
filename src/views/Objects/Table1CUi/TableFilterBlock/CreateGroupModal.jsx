import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import {Box, Modal} from "@mui/material";
import React from "react";
import {useForm} from "react-hook-form";
import {useQueryClient} from "react-query";
import HFTextArea from "../../../../components/FormElements/HFTextArea";
import newTableService from "../../../../services/newTableService";
import HCTextField from "../TableComponent/TableElements/HCTextField";
import styles from "./style.module.scss";
import {useSearchParams} from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 640,
  height: 410,
  bgcolor: "#fff",
  borderRadius: "12px",
  boxShadow: 24,
  padding: "26px 24px",
};

function CreateGroupModal({handleGroupClose, groupOpen, menuItem}) {
  const {control, handleSubmit} = useForm();
  const queryClient = useQueryClient();

  const onSubmit = (values) => {
    newTableService
      .createFolder({
        table_id: menuItem?.table_id,
        parent_id: localStorage.getItem("folder_id") ?? undefined,
        ...values,
      })
      .then((res) => {
        queryClient.refetchQueries("GET_FOLDER_LIST");
        handleGroupClose();
      });
  };
  return (
    <Modal open={groupOpen} onClose={handleGroupClose}>
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: " 0 0 24px 0",
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              justifyContent: "space-between",
            }}>
            <ArrowBackIcon sx={{fontSize: "22px"}} />
            <h3 className={styles.groupHead}>Контрагенты (создание группы)</h3>
          </Box>
          <button onClick={handleGroupClose} className={styles.closeBtn}>
            <CloseIcon sx={{fontSize: "24px"}} />
          </button>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} action="">
          <Box
            sx={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              marginBottom: "15px",
            }}>
            <div className={styles.groupLabel}>
              <p>Наименование</p>
              <HCTextField
                control={control}
                placeholder={"Search"}
                name="name"
                width={"440px"}
                height={"46px"}
              />
            </div>
            <div className={styles.groupLabel}>
              <p>Код</p>
              <HCTextField
                control={control}
                placeholder={"Код"}
                name="code"
                width={"120px"}
                height={"46px"}
              />
            </div>
            <div className={styles.groupLabel}>
              <p>Комментарий</p>
              <div className={styles.groupdTextArea}>
                <HFTextArea
                  resize={false}
                  control={control}
                  name="comment"
                  minHeight="118px"
                  placeholder={"Комментарий"}
                />
              </div>
            </div>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <button className={styles.moreBtn}>
              <span>Еще</span>

              <img src="/img/chevron_down.svg" alt="" />
            </button>

            <div className={styles.actionBtns}>
              <button className={styles.actionRegBtn}>Записать</button>
              <button className={styles.actionCloseBtn}>
                Записать и закрыть
              </button>
            </div>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default CreateGroupModal;
