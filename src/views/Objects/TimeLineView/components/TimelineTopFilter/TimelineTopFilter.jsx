import cls from "./styles.module.scss";
import { Button, Divider, Menu } from "@mui/material";
import CRangePicker from "@/components/DatePickers/CRangePicker";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FRow from "@/components/FormElements/FRow";
import HFSelect from "@/components/FormElements/HFSelect";
import listToLanOptions from "@/utils/listToLanOptions";
import TimeLineGroupBy from "../../TimeLineGroupBy";
import { CheckIcon, SettingsIcon } from "@chakra-ui/icons";
import { useTimelineTopFilterProps } from "./useTimelineTopFilterProps";

export const TimelineTopFilter = ({
  dateFilters,
  setDateFilters,
  handleScrollClick,
  setSelectedType,
  selectedType,
  computedColumns,
  fields,
  saveSettings,
  computedColumnsFor,
  isLoading,
  views,
  form,
  selectedTabIndex,
}) => {

  const {
    openType,
    handleClickType,
    handleCloseType,
    anchorElType,
    i18n,
    types,
    openSettings,
    handleClickSettings,
    handleCloseSettings,
    anchorElSettings,
    openGroup,
    handleClickGroup,
    handleCloseGroup,
    anchorElGroup,
    updateView,
    updateLoading,
  } = useTimelineTopFilterProps({ views, form, selectedTabIndex });

  return <div
    className={cls.search}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <CRangePicker
        interval={"months"}
        value={dateFilters}
        onChange={setDateFilters}
      />
      <Button
        variant="text"
        sx={{
          margin: "0 5px",
          color: "#888",
        }}
        onClick={handleScrollClick}
      >
        Today
      </Button>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Divider orientation="vertical" flexItem />

      <Button
        onClick={handleClickType}
        style={{
          margin: "0 5px",
          color: "#888",
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
      >
        <span>
          {types.find((item) => item.value === selectedType).title}
        </span>
        {openType ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Button>

      <Divider orientation="vertical" flexItem />

      <Menu
        open={openType}
        onClose={handleCloseType}
        anchorEl={anchorElType}
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "5px 0",
          }}
        >
          {types.map((el) => (
            <Button
              onClick={() => setSelectedType(el.value)}
              variant="text"
              sx={{
                margin: "0 5px",
                color: "#888",
                minWidth: "100px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {el.title}
              {el.value === selectedType && <CheckIcon />}
            </Button>
          ))}
        </div>
      </Menu>

      <Button
        onClick={handleClickSettings}
        style={{
          margin: "0 5px",
          color: "#888",
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3px",
          }}
        >
          <SettingsIcon />
          <span>Settings</span>
        </div>
        {openSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Button>

      <Divider orientation="vertical" flexItem />

      <Menu
        open={openSettings}
        onClose={handleCloseSettings}
        anchorEl={anchorElSettings}
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            minWidth: "200px",
            padding: "10px",
          }}
        >
          <div>
            <FRow label="Time from">
              <HFSelect
                options={computedColumns}
                control={form.control}
                name="calendar_from_slug"
              />
            </FRow>
            <FRow label="Time to">
              <HFSelect
                options={computedColumns}
                control={form.control}
                name="calendar_to_slug"
              />
            </FRow>
            <FRow label="Visible field">
              <HFSelect
                options={listToLanOptions(
                  fields,
                  "label",
                  "slug",
                  i18n?.language
                )}
                control={form.control}
                name="visible_field"
              />
            </FRow>
          </div>
          <Button variant="contained" onClick={saveSettings}>
            Save
          </Button>
        </div>
      </Menu>

      <Button
        onClick={handleClickGroup}
        style={{
          margin: "0 5px",
          color: "#888",
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3px",
          }}
        >
          <WorkspacesIcon />
          <span>Group</span>
        </div>
        {openGroup ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Button>

      <Divider orientation="vertical" flexItem />

      <Menu
        open={openGroup}
        onClose={handleCloseGroup}
        anchorEl={anchorElGroup}
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "200px",
          }}
        >
          <TimeLineGroupBy
            columns={computedColumnsFor}
            isLoading={isLoading}
            updateLoading={updateLoading}
            updateView={updateView}
            selectedView={views?.[selectedTabIndex]}
            form={form}
          />
        </div>
      </Menu>
      <Divider orientation="vertical" flexItem />
    </div>
  </div>
}