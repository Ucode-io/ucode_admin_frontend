import React, {useState} from "react";
import style from "../style.module.scss";
import {Button, Pagination} from "@mui/material";
import CSelect from "../../../../components/CSelect";
import useTabRouter from "../../../../hooks/useTabRouter";
import {useParams, useSearchParams} from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import constructorObjectService from "../../../../services/constructorObjectService";
import {useTranslation} from "react-i18next";
import {paginationActions} from "../../../../store/pagination/pagination.slice";
import {useDispatch} from "react-redux";

function AggridFooter({
  view,
  count,
  limit = 10,
  selectedRows = [],
  page = 1,
  refetch = () => {},
  setOffset = () => {},
  setLimit = () => {},
  setLoading = () => {},
  createChild = () => {},
  updateTreeData = () => {},
  onChange = () => {},
}) {
  const dispatch = useDispatch();
  const {tableSlug: tableSlugFromParams, appId, menuId: menuID} = useParams();
  const tableSlug = tableSlugFromParams ?? view?.table_slug;

  const {navigateToForm} = useTabRouter();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId") ?? menuID;
  const {i18n, t} = useTranslation();

  const options = [
    {value: 10, label: `10 ${t("row")}`},
    {value: 15, label: `15 ${t("row")}`},
    {value: 20, label: `20 ${t("row")}`},
    {value: 25, label: `25 ${t("row")}`},
    {value: 30, label: `30 ${t("row")}`},
    {value: 35, label: `35 ${t("row")}`},
    {value: 40, label: `40 ${t("row")}`},
  ];

  const multipleDelete = () => {
    constructorObjectService
      .deleteMultiple(tableSlug, {
        ids: selectedRows.map((i) => i.guid),
      })
      .then(() => (view?.attributes?.treeData ? updateTreeData() : refetch()));
  };

  const navigateCreatePage = () => {
    navigateToForm(tableSlug, "CREATE", {}, {}, menuId ?? appId);
  };

  return (
    <div className={style.footer}>
      <div className={style.limitCount}>
        <div>{t("show")} </div>
        {limit && (
          <div className={style.limitSide}>
            <CSelect
              sx={null}
              size="small"
              value={limit}
              options={options}
              disabledHelperText
              endAdornment={null}
              onChange={(e) => {
                setOffset(0);
                setLoading(true);
                setLimit(e.target.value);
                onChange({
                  limit: e.target.value,
                  offset: 0,
                });

                dispatch(
                  paginationActions.setTablePages({
                    tableSlug: tableSlug,
                    pageLimit: e.target.value,
                  })
                );
              }}
              inputProps={{style: {borderRadius: 50}}}
              style={{fontWeight: "600", color: "#344054"}}
              menuStyle={{fontWeight: "600", color: "#344054"}}
            />
          </div>
        )}
        <div>
          {t("outOf")} {count}
        </div>
      </div>

      <div className={style.pagination}>
        <Pagination
          variant="outlined"
          shape="rounded"
          onChange={(e, val) => {
            setLoading(true);
            setOffset(val);
            onChange({
              limit,
              offset: val,
            });
          }}
          count={Math.ceil(count / limit)}
          color="primary"
          defaultPage={page || 1}
        />
      </div>

      <div className={style.footerActions}>
        <div className={style.footerBtns}>
          {Boolean(selectedRows?.length) && (
            <RectangleIconButton color="error" onClick={multipleDelete}>
              <Button variant="outlined" color="error">
                {t("delete_selected")}
              </Button>
            </RectangleIconButton>
          )}

          {Boolean(
            selectedRows?.length === 1 && view?.attributes?.treeData
          ) && (
            <Button variant="outlined" onClick={createChild}>
              {t("add_child")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AggridFooter;
