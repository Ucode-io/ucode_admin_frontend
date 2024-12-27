import React from "react";
import style from "../style.module.scss";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import {Button, Pagination} from "@mui/material";
import {useParams, useSearchParams} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import constructorObjectService from "../../../../services/constructorObjectService";
import useTabRouter from "../../../../hooks/useTabRouter";

function AggridFooter({
  view,
  rowData = [],
  selectedRows = [],
  refetch = () => {},
  setOffset = () => {},
  setLimit = () => {},
  limit = 10,
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
      <div className="">
        <div>Count: {rowData?.length ?? 0}</div>
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
              setOffset(val);
            }}
            count={5}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}

export default AggridFooter;
