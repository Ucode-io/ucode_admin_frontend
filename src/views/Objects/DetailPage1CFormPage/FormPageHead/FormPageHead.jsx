import React from "react";
import styles from "./style.module.scss";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import useRelationTabRouter from "../../../../hooks/useRelationTabRouter";

function FormPageHead({onSubmit = () => {}, getRelatedTabeSlug, selectedTab}) {
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const stateLabel = useLocation();

  const navigate = useNavigate();
  const {navigateToRelationForm} = useRelationTabRouter();
  return (
    <div className={styles.tableHeadTitle}>
      <div className={styles.tabBackBtn}>
        {/* <h2>{stateLabel?.state?.label}</h2> */}
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
