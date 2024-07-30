import React from "react";
import styles from "./style.module.scss";
import {useNavigate, useSearchParams} from "react-router-dom";
import useRelationTabRouter from "../../../../hooks/useRelationTabRouter";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormPageBackBtn from "./FormPageBackBtn";

function FormPageHead({onSubmit = () => {}, getRelatedTabeSlug, selectedTab}) {
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const navigate = useNavigate();
  const {navigateToRelationForm} = useRelationTabRouter();
  return (
    <div className={styles.tableHeadTitle}>
      <div className={styles.tabBackBtn}>
        {/* <button onClick={() => navigate(-1)}>Back</button> */}
        <h2>Контрагенты</h2>
      </div>
      <div className={styles.tableHeadLinks}>
        {selectedTab?.type !== "section" && (
          <button
            onClick={() => {
              navigateToRelationForm(
                getRelatedTabeSlug?.relation_table_slug,
                "CREATE",
                {},
                {},
                menuId
              );
            }}
            className={styles.headRegisterClose}>
            Добавить
          </button>
        )}
        <button onClick={onSubmit} className={styles.headRegister}>
          Записать
        </button>
      </div>
    </div>
  );
}

export default FormPageHead;
