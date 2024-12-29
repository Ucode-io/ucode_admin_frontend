import React from "react";
import style from "../style.module.scss";
import AddIcon from "@mui/icons-material/Add";
import {Button, Pagination} from "@mui/material";
import CSelect from "../../../../components/CSelect";
import useTabRouter from "../../../../hooks/useTabRouter";
import {useParams, useSearchParams} from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import constructorObjectService from "../../../../services/constructorObjectService";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";

const options = [
  {value: "all", label: "All"},
  {value: 10, label: 10},
  {value: 15, label: 15},
  {value: 20, label: 20},
  {value: 25, label: 25},
  {value: 30, label: 30},
  {value: 35, label: 35},
  {value: 40, label: 40},
];

function AggridFooter({
  count,
  limit = 10,
  selectedRows = [],
  refetch = () => {},
  setOffset = () => {},
  setLimit = () => {},
  setLoading = () => {},
}) {
  const {tableSlug, appId} = useParams();
  const {navigateToForm} = useTabRouter();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

  const multipleDelete = () => {
    constructorObjectService
      .deleteMultiple(tableSlug, {
        ids: selectedRows.map((i) => i.guid),
      })
      .then(() => refetch());
  };

  const navigateCreatePage = () => {
    navigateToForm(tableSlug, "CREATE", {}, {}, menuId ?? appId);
  };

  return (
    <div className={style.footer}>
      <div className={style.limitCount}>
        <div>Count: {count ?? 0}</div>
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
          <PermissionWrapperV2 tableSlug={tableSlug} type="write">
            <Button
              variant="outlined"
              onClick={() => {
                navigateCreatePage();
              }}>
              <AddIcon style={{color: "#007AFF"}} />
              Add object
            </Button>
          </PermissionWrapperV2>
        </div>
        <div className="pagination">
          <Pagination
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
