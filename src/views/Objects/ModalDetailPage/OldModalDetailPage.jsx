import {Check, Close} from "@mui/icons-material";
import {Box, Card, IconButton, Menu, MenuItem, Modal} from "@mui/material";
import {useState} from "react";
import ObjectsFormPageForModal from "../ObjectsFormpageForModal";
import styles from "./style.module.scss";
import {Button} from "@chakra-ui/react";
import {useGetLang} from "../../../hooks/useGetLang";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {detailDrawerActions} from "../../../store/detailDrawer/detailDrawer.slice";

export default function OldModalDetailPage({
  open,
  setOpen,
  tableSlug,
  selectedRow,
  dateInfo,
  refetch,
  menuItem,
  layout,
  fieldsMap,
  selectedViewType,
  setLayoutType = () => {},
  setSelectedViewType = () => {},
  navigateToEditPage = () => {},
}) {
  const dispatch = useDispatch();
  const [fullScreen, setFullScreen] = useState(false);
  const handleClose = () => {
    dispatch(detailDrawerActions.closeDrawer());
    setOpen(false);
    setFullScreen(false);
  };

  const lang = useGetLang("Layout");
  const {i18n} = useTranslation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{width: "1120px", margin: "0 auto"}}
      className="child-position-center">
      <Card
        className={`${fullScreen ? styles.cardModal : styles.card} PlatformModal`}>
        <div className={styles.header}>
          <div
            style={{display: " flex", alignItems: "center", gap: "5px"}}
            className={styles.cardTitle}>
            <span>
              {generateLangaugeText(lang, i18n?.language, "Detailed")}
            </span>
            <Box
              sx={{
                width: "1px",
                height: "14px",
                margin: "0 6px",
                background: "rgba(55, 53, 47, 0.16)",
              }}></Box>
            <ScreenOptions
              selectedViewType={selectedViewType}
              setSelectedViewType={setSelectedViewType}
              navigateToEditPage={navigateToEditPage}
              setLayoutType={setLayoutType}
              selectedRow={selectedRow}
            />
          </div>
          <IconButton
            className={styles.closeButton}
            onClick={() => {
              setFullScreen((prev) => !prev);
              handleClose();
            }}>
            <Close className={styles.closeIcon} />
          </IconButton>
        </div>

        <ObjectsFormPageForModal
          menuItem={menuItem}
          layout={layout}
          selectedRow={selectedRow}
          tableSlugFromProps={tableSlug}
          handleClose={handleClose}
          modal={true}
          dateInfo={dateInfo}
          setFullScreen={setFullScreen}
          fullScreen={fullScreen}
          fieldsMap={fieldsMap}
          refetch={refetch}
        />
      </Card>
    </Modal>
  );
}

const ScreenOptions = ({
  selectedViewType,
  selectedRow,
  setSelectedViewType = () => {},
  navigateToEditPage = () => {},
  setLayoutType = () => {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const options = [
    {label: "Side peek", icon: "SidePeek"},
    {label: "Center peek", icon: "CenterPeek"},
    {label: "Full page", icon: "FullPage"},
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option?.icon === "FullPage") {
      setLayoutType("SimpleLayout");
      navigateToEditPage(selectedRow);
    }

    if (option) setSelectedViewType(option.icon);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button onClick={handleClick} variant="outlined">
        <span>{getColumnIcon(selectedViewType)}</span>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}>
        <Box sx={{width: "220px", padding: "4px 0"}}>
          {options.map((option) => (
            <MenuItem
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "6px",
                color: "#37352f",
              }}
              key={option.label}
              onClick={() => handleClose(option)}>
              <Box sx={{display: "flex", alignItems: "center", gap: "5px"}}>
                <span>{getColumnIcon(option)}</span>
                {option.label}
              </Box>

              <Box>
                {option.label === selectedViewType?.label ? <Check /> : ""}
              </Box>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export const getColumnIcon = (column) => {
  if (column?.icon === "SidePeek") {
    return (
      <img
        src="/img/drawerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else if (column?.icon === "CenterPeek") {
    return (
      <img
        src="/img/centerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else
    return (
      <img
        src="/img/fullpagePeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
};
