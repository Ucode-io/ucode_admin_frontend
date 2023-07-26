import { ArrowDropDownCircleOutlined } from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import projectService from "../../services/projectService";

// const languages = [
//   {
//     title: "English",
//     slug: "en",
//   },
//   {
//     title: "Русский",
//     slug: "ru",
//   },
//   {
//     title: "O'zbekcha",
//     slug: "uz",
//   },
// ];

export default function LanguagesNavbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const projectId = useSelector((state) => state.auth.projectId);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: projectInfo = [] } = useQuery(["GET_PROJECT_BY_ID", projectId], () => {
    return projectService.getByID(projectId);
  });

  const languages = useMemo(() => {
    return projectInfo?.language?.map((lang) => ({
      title: lang?.name,
      slug: lang?.short_name,
    }));
  }, [projectInfo]);

  const { i18n } = useTranslation();

  console.log('languages', projectInfo)

  useEffect(() => {
    if (languages?.length) i18n.changeLanguage(languages?.[0]?.slug);
  }, [languages]);

  const handleRowClick = (lang) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  const activeLang = useMemo(() => {
    return languages?.find((lang) => lang.slug === i18n.language);
  }, [i18n.language]);

  return (
    <>
      <Button
        variant="outlined"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {activeLang?.title}
        <KeyboardArrowDownIcon />
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {languages?.map((language) => (
          <MenuItem key={language.slug} onClick={() => handleRowClick(language.slug)}>
            {language.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
