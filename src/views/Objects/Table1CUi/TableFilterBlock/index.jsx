import {TextField} from "@mui/material";
import React, {useState} from "react";
import CreateGroupModal from "./CreateGroupModal";
import DownloadMenu from "./DownloadMenu";
import GroupSwitchMenu from "./GroupSwitchMenu";
import styles from "./style.module.scss";
import NewFastFilter from "./FastFilter";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {mergeStringAndState} from "../../../../utils/jsonPath";
import useTabRouter from "../../../../hooks/useTabRouter";
import {useDispatch} from "react-redux";
import {filterActions} from "../../../../store/filter/filter.slice";
import useFilters from "../../../../hooks/useFilters";

function TableFilterBlock({
  openFilter,
  setOpenFilter,
  fields,
  fieldsMap,
  view,
  menuItem,
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

  const [columns, setColumns] = useState([
    {label: "Наименование в программе", visible: true},
    {label: "ИНН", visible: true},
    {label: "Полное наименование", visible: true},
    {label: "ЭДО", visible: true},
  ]);

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

  const {filters, clearFilters, clearOrders} = useFilters(tableSlug, view.id);

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
        columns={fields}
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
