import {Badge, TextField} from "@mui/material";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import useFilters from "../../../../hooks/useFilters";
import useTabRouter from "../../../../hooks/useTabRouter";
import CreateGroupModal from "./CreateGroupModal";
import DownloadMenu from "./DownloadMenu";
import NewFastFilter from "./FastFilter";
import GroupSwitchMenu from "./GroupSwitchMenu";
import styles from "./style.module.scss";
import useDebounce from "../../../../hooks/useDebounce";

function TableFilterBlock({
  openFilter,
  setOpenFilter,
  fields,
  fieldsMap,
  view,
  menuItem,
  setSearchText,
}) {
  const {tableSlug, appId} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();
  const {navigateToForm} = useTabRouter();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);
  const {filters, clearFilters, clearOrders} = useFilters(tableSlug, view.id);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGroup = () => setGroupOpen(true);
  const handleGroupClose = () => setGroupOpen(false);

  const toggleColumnVisibility = (index) => {
    setColumns((prevColumns) =>
      prevColumns.map((col, i) =>
        i === index ? {...col, visible: !col.visible} : col
      )
    );
  };

  const navigateCreatePage = (row) => {
    navigateToForm(
      tableSlug,
      "CREATE",
      {},
      {folder_id: localStorage.getItem("folder_id")},
      menuId ?? appId
    );
  };

  const inputChangeHandler = useDebounce((val) => {
    setSearchText(val.target.value);
  }, 300);

  return (
    <>
      <div className={styles.tableFilterBlock}>
        <div className={styles.searchFilter}>
          <TextField
            sx={{
              width: "300px",
              height: "36px",
              "& .MuiInputBase-input": {
                padding: "10px 12px",
              },
            }}
            onChange={inputChangeHandler}
            placeholder="Search"
            variant="outlined"
            size="small"
          />

          <button
            className={styles.filterBtn}
            onClick={() => {
              setOpenFilter(!openFilter);
            }}>
            <img src="/img/filter_funnel.svg" alt="" />
            {Object.values(filters)?.length > 0 && (
              <div className={styles.filterBadge}>
                {Object.values(filters)?.length}
              </div>
            )}
          </button>
          <button onClick={handleClick} className={styles.filterBtn}>
            <img src="/img/eye_off.svg" alt="" />
          </button>
        </div>

        <div className={styles.filterCreatBtns}>
          <button
            onClick={() => {
              navigateCreatePage(tableSlug);
            }}
            className={styles.createBtn}>
            Создать
          </button>
          <button onClick={handleGroup} className={styles.createGroupBtn}>
            Создать группу
          </button>
          <DownloadMenu />
        </div>
      </div>

      <div
        style={{display: openFilter ? "flex" : "none"}}
        className={styles.filterList}>
        <div onClick={clearFilters} className={styles.filterListItem}>
          <p>Сбросить фильтры</p>
        </div>

        <NewFastFilter fields={fields} fieldsMap={fieldsMap} view={view} />
      </div>

      <GroupSwitchMenu
        columns={columns}
        toggleColumnVisibility={toggleColumnVisibility}
        setColumns={setColumns}
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={open}
        view={view}
        fieldsMap={fieldsMap}
      />

      <CreateGroupModal
        handleGroupClose={handleGroupClose}
        groupOpen={groupOpen}
        menuItem={menuItem}
      />
    </>
  );
}

export default TableFilterBlock;
