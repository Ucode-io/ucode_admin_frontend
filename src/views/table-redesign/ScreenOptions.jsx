import {Check} from "@mui/icons-material";
import {Box, Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

export const ScreenOptions = ({
  projectInfo,
  view,
  selectedViewType,
  selectedRow,
  setSelectedViewType = () => {},
  setLayoutType = () => {},
  navigateToEditPage = () => {},
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {menuId} = useParams();
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
    localStorage.setItem("detailPage", option?.icon);
    if (location?.state?.fullPage) {
      navigate(-1);
      setLayoutType("SidePeek");
    }
    if (option?.icon === "FullPage") {
      setLayoutType("SimpleLayout");
      navigate(`/${menuId}/detail?p=${selectedRow?.guid}`, {
        state: {
          viewId: view?.id,
          table_slug: view?.table_slug,
          projectInfo: projectInfo,
          selectedRow: selectedRow,
          fullPage: true,
        },
      });
    }

    if (option) setSelectedViewType(option?.icon);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box onClick={handleClick}>
        <span>{getColumnFieldIcon(selectedViewType)}</span>
      </Box>

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
              onClick={() => {
                localStorage.setItem("detailPage", option?.icon);
                handleClose(option);
              }}>
              <Box sx={{display: "flex", alignItems: "center", gap: "5px"}}>
                <span>{getColumnFieldIcon(option?.icon)}</span>
                {option.label}
              </Box>

              <Box>{option?.icon === selectedViewType ? <Check /> : ""}</Box>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export const getColumnFieldIcon = (column) => {
  if (column === "SidePeek") {
    return (
      <img
        src="/img/drawerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else if (column === "CenterPeek") {
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
