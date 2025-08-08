import {Box, Switch} from "@mui/material";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../components/CTable";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {ContentTitle} from "../../components/ContentTitle";
import {useEnvironmentProps} from "./useEnvironmentProps";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import authService from "../../../../services/auth/authService";
import {store} from "../../../../store";
import {authActions} from "../../../../store/auth/auth.slice";
import {companyActions} from "../../../../store/company/company.slice";
import {Button} from "../../components/Button";
import cls from "./styles.module.scss";
import SyncIcon from "@mui/icons-material/Sync";

export const Environment = () => {
  const {
    lang,
    i18n,
    environmentLoading,
    environments,
    navigateToEditForm,
    deleteEnvironment,
    navigateToCreateForm,
  } = useEnvironmentProps();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const envId = useSelector((state) => state?.company?.environmentId);

  const onSelectEnvironment = (environment = {}) => {
    const params = {
      refresh_token: auth?.refreshToken,
      env_id: environment.id,
      project_id: environment.project_id,
      for_env: true,
    };

    dispatch(companyActions.setEnvironmentItem(environment));
    dispatch(companyActions.setEnvironmentId(environment.id));
    authService
      .updateToken({...params, env_id: environment.id}, {...params})
      .then((res) => {
        dispatch(companyActions.setProjectId(environment.project_id));
        store.dispatch(authActions.setTokens(res));
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box>
      <ContentTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>
            {generateLangaugeText(lang, i18n?.language, "Environments") ||
              "Environments"}
          </span>
          <Button primary onClick={navigateToCreateForm}>
            {generateLangaugeText(lang, i18n?.language, "Add") || "Add"}
          </Button>
        </Box>
      </ContentTitle>

      <CTable disablePagination removableHeight={0}>
        <CTableHead>
          <CTableCell className={cls.tableHeadCell} width={10}>
            №
          </CTableCell>
          <CTableCell className={cls.tableHeadCell}>
            {generateLangaugeText(lang, i18n?.language, "Name") || "Name"}
          </CTableCell>
          <CTableCell className={cls.tableHeadCell}>
            {" "}
            {generateLangaugeText(lang, i18n?.language, "Description") ||
              "Description"}{" "}
          </CTableCell>
          <CTableCell width={60}></CTableCell>
        </CTableHead>
        <CTableBody
          loader={environmentLoading}
          columnsCount={4}
          dataLength={environments?.environments?.length}>
          {environments?.environments?.map((element, index) => (
            <CTableRow
              key={element.id}
              onClick={() => {
                navigateToEditForm(element.id);
              }}>
              <CTableCell className={cls.tBodyCell}>{index + 1}</CTableCell>
              <CTableCell className={cls.tBodyCell}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "8px",
                  }}>
                  <span
                    style={{
                      background: element.display_color,
                      width: "10px",
                      height: "10px",
                      display: "block",
                      borderRadius: "50%",
                    }}></span>
                  {element?.name}
                </div>
              </CTableCell>
              <CTableCell className={cls.tBodyCell}>
                {element?.description}
              </CTableCell>
              <CTableCell
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className={cls.tBodyCell}>
                {element?.id !== envId && (
                  <button
                    className={cls.btnSync}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (e.target.checked) {
                        onSelectEnvironment(element);
                      }
                    }}>
                    <span>
                      <SyncIcon color="inherit" />
                    </span>
                  </button>
                )}

                <button
                  className={cls.btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEnvironment(element.id);
                  }}>
                  <span>
                    <DeleteOutlinedIcon color="inherit" />
                  </span>
                </button>
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </Box>
  );
};
