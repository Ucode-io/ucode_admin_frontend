import style from "./styles.module.scss";
import {Badge, Button, Divider, Menu, Switch} from "@mui/material";
import {Description, MoreVertOutlined} from "@mui/icons-material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchInput from "../../../../components/SearchInput";
import SearchParams from "../ViewSettings/SearchParams";
import FixColumnsTableView from "../FixColumnsTableView";
import GroupByButton from "../../GroupByButton";
import VisibleColumnsButton from "../../VisibleColumnsButton";
import TableViewGroupByButton from "../../TableViewGroupByButton";
import ExcelButtons from "../ExcelButtons";
import { VIEW_TYPES_MAP } from "../../../../utils/constants/viewTypes";
import { AddIcon } from "@chakra-ui/icons";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import { useNavigate } from "react-router-dom";

export const ExtraNavbar = ({
  filterCount,
  setFilterVisible,
  inputChangeHandler,
  handleClickSearch,
  inputKey,
  searchText,
  openSearch,
  anchorElSearch,
  handleCloseSearch,
  roleInfo,
  permissions,
  checkedColumns,
  setCheckedColumns,
  columnsForSearch,
  updateField,
  view,
  fieldsMap,
  selectedTabIndex,
  visibleRelationColumns,
  openHeightControl,
  handleCloseHeightControl,
  anchorElHeightControl,
  tableHeightOptions,
  handleHeightControl,
  handleClick,
  open,
  handleClose,
  anchorEl,
  computedVisibleFields,
  setSelectedTabIndex,
  views,
  tableHeight,
  withRightPanel = true,
  tableSlug,
  isRelationTable,
  navigateToForm,
  navigateCreatePage,
  // visibleColumns,
  // refetchViews,
  // tableLan,
}) => {
  const navigate = useNavigate();

  const objectNavigate = () => {
    navigate(view?.attributes?.url_object);
  };

  return (
    <div
      className={style.extraNavbar}
      style={{
        minHeight: "42px",
      }}
    >
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
            color="primary"
          >
            <FilterAltOutlinedIcon color={"#A8A8A8"} />
          </Badge>
          {/* {view?.type === "GRID" ? (
            <ChakraProvider>
              <FilterPopover
                tableLan={tableLan}
                view={view}
                visibleColumns={visibleColumns}
                refetchViews={refetchViews}
              >
                <FilterButton view={view} />
              </FilterPopover>
            </ChakraProvider>
          ) : (
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
              color="primary"
            >
              <FilterAltOutlinedIcon color={"#A8A8A8"} />
            </Badge>
          )} */}

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
              }}
            >
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
            }}
          >
            <SearchParams
              checkedColumns={checkedColumns}
              setCheckedColumns={setCheckedColumns}
              columns={columnsForSearch}
              updateField={updateField}
            />
          </Menu>
        </div>
        {withRightPanel && (
          <div className={style.rightExtra}>
            {(roleInfo === "DEFAULT ADMIN" || permissions?.fix_column) &&
              view?.type !== VIEW_TYPES_MAP.GRID && (
                <FixColumnsTableView view={view} fieldsMap={fieldsMap} />
              )}
            <Divider orientation="vertical" flexItem />
            {(roleInfo === "DEFAULT ADMIN" || permissions?.group) && (
              <GroupByButton
                selectedTabIndex={selectedTabIndex}
                view={view}
                fieldsMap={fieldsMap}
                relationColumns={visibleRelationColumns}
              />
            )}
            <Divider orientation="vertical" flexItem />
            {(roleInfo === "DEFAULT ADMIN" || permissions?.columns) && (
              <VisibleColumnsButton currentView={view} fieldsMap={fieldsMap} />
            )}
            <Divider orientation="vertical" flexItem />
            {(roleInfo === "DEFAULT ADMIN" || permissions?.tab_group) && (
              <TableViewGroupByButton
                currentView={view}
                fieldsMap={fieldsMap}
              />
            )}
            {view.type === "TABLE" && (
              <>
                <Menu
                  open={openHeightControl}
                  onClose={handleCloseHeightControl}
                  anchorEl={anchorElHeightControl}
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
                  }}
                >
                  <div className={style.menuBar}>
                    {tableHeightOptions.map((el) => (
                      <div
                        className={style.template}
                        onClick={() => handleHeightControl(el.value)}
                      >
                        <span>{el.label}</span>

                        <Switch
                          size="small"
                          checked={tableHeight === el.value}
                          onChange={() => handleHeightControl(el.value)}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </Menu>
              </>
            )}
            <Divider orientation="vertical" flexItem />
            {view?.type === VIEW_TYPES_MAP.GRID && (
              <>
                <PermissionWrapperV2 tableSlug={tableSlug} type="write">
                  {
                    <Button
                      id="addObject"
                      variant="outlined"
                      onClick={() => {
                        if (view?.attributes?.url_object) {
                          objectNavigate();
                        } else {
                          navigateToForm(tableSlug, "CREATE");
                        }
                      }}
                    >
                      <AddIcon style={{ color: "#007AFF" }} />
                      Add object
                    </Button>
                  }
                </PermissionWrapperV2>
              </>
            )}
            {permissions?.excel_menu && (
              <Button
                onClick={handleClick}
                variant="text"
                style={{
                  color: "#A8A8A8",
                  borderColor: "#A8A8A8",
                  minWidth: "auto",
                }}
              >
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
              }}
            >
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
                  onClick={() => setSelectedTabIndex(views?.length)}
                >
                  <div
                    className={`${style.element} ${
                      selectedTabIndex === views?.length ? style.active : ""
                    }`}
                  >
                    <Description
                      className={style.icon}
                      style={{ color: "#6E8BB7" }}
                    />
                  </div>
                  <span>Template</span>
                </div>
              </div>
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
};
