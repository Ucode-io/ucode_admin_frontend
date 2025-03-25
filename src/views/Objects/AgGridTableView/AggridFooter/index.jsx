import React, {useState} from "react";
import style from "../style.module.scss";
import {Button, Pagination} from "@mui/material";
import CSelect from "../../../../components/CSelect";
import useTabRouter from "../../../../hooks/useTabRouter";
import {useParams, useSearchParams} from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import constructorObjectService from "../../../../services/constructorObjectService";
import {useTranslation} from "react-i18next";

const options = [
  {value: "all", label: "All"},
  {value: 10, label: "10 Rows"},
  {value: 15, label: "15 Rows"},
  {value: 20, label: "20 Rows"},
  {value: 25, label: "25 Rows"},
  {value: 30, label: "30 Rows"},
  {value: 35, label: "35 Rows"},
  {value: 40, label: "40 Rows"},
];

function AggridFooter({
  view,
  count,
  limit = 10,
  selectedRows = [],
  refetch = () => {},
  setOffset = () => {},
  setLimit = () => {},
  setLoading = () => {},
  createChild = () => {},
  updateTreeData = () => {},
}) {
  const {tableSlug, appId} = useParams();
  const {navigateToForm} = useTabRouter();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const {i18n} = useTranslation();

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
        <div>Show </div>
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
              }}
              inputProps={{style: {borderRadius: 50}}}
            />
          </div>
        )}
        <div>Out of {count}</div>
      </div>

      <div className={style.footerActions}>
        <div className={style.footerBtns}>
          {Boolean(selectedRows?.length) && (
            <RectangleIconButton color="error" onClick={multipleDelete}>
              <Button variant="outlined" color="error">
                Delete all selected
              </Button>
            </RectangleIconButton>
          )}

          {Boolean(
            selectedRows?.length === 1 && view?.attributes?.treeData
          ) && (
            <Button variant="outlined" onClick={createChild}>
              Add Child
            </Button>
          )}
        </div>
        <div className="pagination">
          <Pagination
            variant="outlined"
            shape="rounded"
            onChange={(e, val) => {
              setLoading(true);
              setOffset(val);
            }}
            count={Math.ceil(count / limit)}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}

export default AggridFooter;
