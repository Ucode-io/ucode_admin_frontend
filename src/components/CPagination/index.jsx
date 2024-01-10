import {Button, Pagination} from "@mui/material";
import {useTranslation} from "react-i18next";
import CSelect from "../CSelect";
import styles from "./style.module.scss";
import AddIcon from "@mui/icons-material/Add";
import useTabRouter from "../../hooks/useTabRouter";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {paginationActions} from "../../store/pagination/pagination.slice";
import {useMemo, useState} from "react";
import RectangleIconButton from "../Buttons/RectangleIconButton";

const CPagination = ({
  setCurrentPage = () => {},
  view,
  paginationExtraButton,
  isTableView,
  multipleDelete,
  isGroupByTable,
  selectedObjectsForDelete,
  limit,
  setLimit = () => {},
  disablePagination,
  filterVisible,
  navigateToEditPage,
  selectedTab,
  isRelationTable,
  ...props
}) => {
  const {t} = useTranslation();
  const {navigateToForm} = useTabRouter();
  const navigate = useNavigate();
  const {tableSlug} = useParams();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const dispatch = useDispatch();
  const paginationInfo = useSelector(
    (state) => state?.pagination?.paginationInfo
  );

  const paginiation = useMemo(() => {
    const getObject = paginationInfo.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageLimit ?? null;
  }, [paginationInfo]);

  const options = [
    {value: "all", label: "All"},
    // {
    //   value: isNaN(parseInt(props?.defaultLimit)) ? "" : parseInt(props?.defaultLimit),
    //   label: isNaN(parseInt(props?.defaultLimit)) ? "" : parseInt(props?.defaultLimit),
    // },
    {value: 10, label: 10},
    {value: 15, label: 15},
    {value: 20, label: 20},
    {value: 25, label: 25},
    {value: 30, label: 30},
    {value: 35, label: 35},
    {value: 40, label: 40},
  ];

  const getLimitValue = (item) => {
    setLimit(item);
    dispatch(
      paginationActions.setTablePages({
        tableSlug: tableSlug,
        pageLimit: item,
      })
    );
  };

  const objectNavigate = () => {
    navigate(view?.attributes?.url_object);
  };
  console.log("selectedTab", selectedTab);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: isGroupByTable ? "flex-end" : "space-between",
        alignItems: "center",
        marginTop: "15px",
        paddingRight: "15px",
      }}
    >
      {!disablePagination && !isGroupByTable && (
        <div>
          {limit && (
            <div className={styles.limitSide}>
              {t("showing")}
              <CSelect
                options={options}
                disabledHelperText
                size="small"
                value={paginiation ?? limit}
                onChange={(e) => getLimitValue(e.target.value)}
                inputProps={{style: {borderRadius: 50}}}
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
          <RectangleIconButton color="error" onClick={multipleDelete}>
            <Button variant="outlined" color="error">
              Delete all selected
            </Button>
          </RectangleIconButton>
        ) : null}

        {isTableView && (
          <Button
            variant="outlined"
            onClick={() => {
              if (view?.attributes?.url_object) {
                objectNavigate();
              } else {
                isRelationTable
                  ? navigateToForm(
                      isRelationTable
                        ? selectedTab?.relation?.relation_table_slug
                        : tableSlug,
                      "CREATE",
                      {},
                      {},
                      menuId
                    )
                  : navigateToEditPage(tableSlug);
              }
            }}
          >
            <AddIcon style={{color: "#007AFF"}} />
            Add object
          </Button>
        )}

        {!disablePagination && !isGroupByTable && (
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
