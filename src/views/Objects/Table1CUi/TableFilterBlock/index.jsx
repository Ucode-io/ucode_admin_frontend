import React, {useState} from "react";
import styles from "./style.module.scss";
import {TextField} from "@mui/material";
import CreateGroupModal from "./CreateGroupModal";
import GroupSwitchMenu from "./GroupSwitchMenu";
import DownloadMenu from "./DownloadMenu";
import FilterSearchMenu from "./FilterSearchMenu";

function TableFilterBlock({openFilter, setOpenFilter}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const open = Boolean(anchorEl);

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

  const mockData = [
    {
      label: "Наименование в программе",
      filter: 2,
    },
    {
      label: "ИНН",
      filter: 0,
    },
    {
      label: "Полное наименование",
      filter: 0,
    },
    {
      label: "ЭДО",
      filter: 1,
    },
    {
      label: "Полное наименование",
      filter: 0,
    },
    {
      label: "Полное наименование",
      filter: 0,
    },
    {
      label: "Полное наименование",
      filter: 0,
    },
  ];

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
          <button className={styles.createBtn}>Создать</button>
          <button onClick={handleGroup} className={styles.createGroupBtn}>
            Создать группу
          </button>
          <DownloadMenu />
        </div>
      </div>

      <div
        style={{display: openFilter ? "flex" : "none"}}
        className={styles.filterList}>
        <div className={styles.filterListItem}>
          <p>Сбросить фильтры</p>
        </div>

        {mockData?.map((item) => (
          <FilterSearchMenu item={item} />
        ))}
      </div>

      <GroupSwitchMenu
        columns={columns}
        toggleColumnVisibility={toggleColumnVisibility}
        setColumns={setColumns}
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={open}
      />

      <CreateGroupModal
        handleGroupClose={handleGroupClose}
        groupOpen={groupOpen}
      />
    </>
  );
}

export default TableFilterBlock;
