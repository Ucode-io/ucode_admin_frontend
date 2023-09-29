import { Button, Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import CSelect from "../CSelect";
import styles from "./style.module.scss";
import AddIcon from "@mui/icons-material/Add";
import useTabRouter from "../../hooks/useTabRouter";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { paginationActions } from "../../store/pagination/pagination.slice";

const CPagination = ({
  setCurrentPage = () => {},
  view,
  paginationExtraButton,
  isTableView,
  multipleDelete,
  selectedObjectsForDelete,
  limit,
  setLimit = () => {},
  disablePagination,
  ...props
}) => {
  const { t } = useTranslation();
  const { navigateToForm } = useTabRouter();
  const navigate = useNavigate();
  const { tableSlug } = useParams();
  const dispatch = useDispatch()
  const pagination = useSelector((state) => state?.pagination?.pagination)

  const options = [
    {
      value: isNaN(parseInt(props?.defaultLimit))
        ? ""
        : parseInt(props?.defaultLimit),
      label: isNaN(parseInt(props?.defaultLimit))
        ? ""
        : parseInt(props?.defaultLimit),
    },
    { value: 10, label: 10 },
    { value: 15, label: 15 },
    { value: 20, label: 20 },
    { value: 25, label: 25 },
    { value: 30, label: 30 },
    { value: 35, label: 35 },
    { value: 40, label: 40 },
  ];

  const getLimitValue = (item) => {
    setLimit(item)
    dispatch(paginationActions.setTablePage(item))
  }

  const objectNavigate = () => {
    navigate(view?.attributes?.url_object);
  };

  return (
    <div
      style={{
        // width: "calc(100vw - 375px)",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "15px",
        paddingRight: "15px",
      }}
    >
      {!disablePagination && (
        <div>
          {limit && (
            <div className={styles.limitSide}>
              {t("showing")}
              <CSelect
                options={options}
                disabledHelperText
                size="small"
                value={pagination ?? limit}
                onChange={(e) => getLimitValue(e.target.value)}
                inputProps={{ style: { borderRadius: 50 } }}
                endAdornment={null}
                sx={null}
              />
            </div>
          )}
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginLeft: "10px",
        }}
      >
        {selectedObjectsForDelete?.length > 0 && !disablePagination ? (
          <Button variant="outlined" color="error" onClick={multipleDelete}>
            Delete all selected
          </Button>
        ) : null}

        {isTableView && (
          <Button
            variant="outlined"
            onClick={() => {
              if (view?.attributes?.url_object) {
                objectNavigate();
              } else navigateToForm(tableSlug);
            }}
          >
            <AddIcon style={{ color: "#007AFF" }} />
            Add object
          </Button>
        )}

        {!disablePagination && (
          <>
            <Pagination
              color="primary"
              onChange={(e, val) => setCurrentPage(val)}
              {...props}
            />
            {paginationExtraButton}
          </>
        )}
      </div>
    </div>
  );
};

export default CPagination;
