import React, {useState} from "react";
import style from "./style.module.scss";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import useDebounce from "../../../../hooks/useDebounce";
import ExcelButtons from "../../components/ExcelButtons";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {Badge, Button, Divider, Menu} from "@mui/material";
import SearchInput from "../../../../components/SearchInput";
import VisibleColumnsButton from "../../VisibleColumnsButton";
import {Description, MoreVertOutlined} from "@mui/icons-material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchParams from "../../components/ViewSettings/SearchParams";

function FiltersBlock({
  view,
  views,
  fieldsMap,
  checkedColumns,
  columnsForSearch,
  selectedTabIndex,
  computedVisibleFields,
  setFilterVisible = () => {},
  setSelectedTabIndex = () => {},
  setCheckedColumns,
  updateField,
}) {
  const {tableSlug} = useParams();
  const [searchText, setSearchText] = useState("");
  const [inputKey, setInputKey] = useState(0);
  const filterCount = useSelector((state) => state.quick_filter.quick_filters);
  const roleInfo = useSelector((state) => state.auth?.roleInfo?.name);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const permissions = useSelector(
    (state) => state.permissions.permissions?.[tableSlug]
  );

  const [anchorElSearch, setAnchorElSearch] = useState(null);
  const openSearch = Boolean(anchorElSearch);

  const inputChangeHandler = useDebounce((val) => {
    setSearchText(val);
  }, 300);

  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
  };

  const handleCloseSearch = () => {
    setAnchorElSearch(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className={style.extraNavbar}
      style={{
        minHeight: "42px",
      }}>
      <div className={style.extraWrapper}>
        <div className={style.search}>
          <Badge
            sx={{
              width: "35px",
              paddingLeft: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              setFilterVisible((prev) => !prev);
            }}
            badgeContent={filterCount}
            color="primary">
            <FilterAltOutlinedIcon color={"#A8A8A8"} />
          </Badge>

          <Divider orientation="vertical" flexItem />
          <SearchInput
            key={inputKey}
            defaultValue={searchText}
            placeholder={"Search"}
            onChange={(e) => {
              inputChangeHandler(e);
            }}
          />
          {(roleInfo === "DEFAULT ADMIN" || permissions?.search_button) && (
            <button
              className={style.moreButton}
              onClick={handleClickSearch}
              style={{
                paddingRight: "10px",
              }}>
              <MoreHorizIcon />
            </button>
          )}

          <Menu
            open={openSearch}
            onClose={handleCloseSearch}
            anchorEl={anchorElSearch}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  // width: 100,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  left: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}>
            <SearchParams
              checkedColumns={checkedColumns}
              setCheckedColumns={setCheckedColumns}
              columns={columnsForSearch}
              updateField={updateField}
            />
          </Menu>
        </div>

        <div className={style.rightExtra}>
          {/* {(roleInfo === "DEFAULT ADMIN" || permissions?.group) && (
            <GroupByButton
              selectedTabIndex={selectedTabIndex}
              view={view}
              fieldsMap={fieldsMap}
              relationColumns={visibleRelationColumns}
            />
          )} */}
          {/* <Divider orientation="vertical" flexItem /> */}
          {(roleInfo === "DEFAULT ADMIN" || permissions?.columns) && (
            <VisibleColumnsButton currentView={view} fieldsMap={fieldsMap} />
          )}
          {/* <Divider orientation="vertical" flexItem />
          {(roleInfo === "DEFAULT ADMIN" || permissions?.tab_group) && (
            <TableViewGroupByButton currentView={view} fieldsMap={fieldsMap} />
          )} */}
          {permissions?.excel_menu && (
            <Button
              onClick={handleClick}
              variant="text"
              style={{
                color: "#A8A8A8",
                borderColor: "#A8A8A8",
                minWidth: "auto",
              }}>
              <MoreVertOutlined
                style={{
                  color: "#888",
                }}
              />
            </Button>
          )}

          <Menu
            open={open}
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  // width: 100,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}>
            <div className={style.menuBar}>
              <ExcelButtons
                computedVisibleFields={computedVisibleFields}
                fieldsMap={fieldsMap}
                view={view}
                searchText={searchText}
                checkedColumns={checkedColumns}
              />
              <div
                className={style.template}
                onClick={() => setSelectedTabIndex(views?.length)}>
                <div
                  className={`${style.element} ${
                    selectedTabIndex === views?.length ? style.active : ""
                  }`}>
                  <Description
                    className={style.icon}
                    style={{color: "#6E8BB7"}}
                  />
                </div>
                <span>Template</span>
              </div>
            </div>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default FiltersBlock;
