import { Close, FilterAlt } from "@mui/icons-material";
import { Menu, Switch } from "@mui/material";
import { useMemo } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { filterAction } from "../../../../store/filter/filter.slice";
import { tableColumnActions } from "../../../../store/tableColumn/tableColumn.slice";
import styles from "./style.module.scss";

const FastFilterButton = () => {
  const { tableSlug } = useParams();
  const dispatch = useDispatch();

  const columns = useSelector(
    (state) => state.tableColumn.list[tableSlug] ?? []
  );
  const filterRedux = useSelector((state) => state?.filters?.filters);

  const counter = useMemo(() => {
    let result = 0;

    Object.keys(filterRedux)?.forEach((key) => {
      if (filterRedux[key]) result++;
    });

    return result;
  }, [filterRedux]);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuVisible = Boolean(anchorEl);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const onChecked = (value, index) => {
    dispatch(
      tableColumnActions.setColumnFilterVisible({
        tableSlug,
        index,
        isFilterVisible: value,
      })
    );
  };

  return (
    <div>
      <RectangleIconButton
        color="white"
        onClick={openMenu}
        style={
          counter
            ? {
                width: "64px",
                display: "flex",
                gap: "4px",
                alignItems: "center",
              }
            : {}
        }
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <FilterAlt />
        </div>
        {counter ? (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {counter}
            </div>
            <div
              style={{ display: "flex", alignItems: "center" }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(filterAction.clearFilters());
              }}
            >
              <Close />
            </div>
          </>
        ) : null}
      </RectangleIconButton>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          {columns.map((column, index) => (
            <div key={column.id} className={styles.menuItem}>
              <p className={styles.itemText}>{column.label}</p>
              <Switch
                checked={column.isFilterVisible}
                onChange={(_, value) => onChecked(value, index)}
              />
            </div>
          ))}
        </div>
      </Menu>
    </div>
  );
};

export default FastFilterButton;
