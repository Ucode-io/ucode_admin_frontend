import {MenuItem} from "@mui/material";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function MicroFrontPdf({
  row,
  handleClose = () => {},
  view,
  projectId,
}) {
  const {appId, tableSlug} = useParams();
  const navigate = useNavigate();

  const replaceUrlVariables = (urlTemplate, data) => {
    return urlTemplate?.replace(/\{\{\$(\w+)\}\}/g, (_, variable) => {
      return data[variable] || "";
    });
  };

  const navigateToDocumentEditPage = (event) => {
    event.stopPropagation();
    handleClose();
    const urlTemplate = view?.attributes?.pdf_url;

    const url = replaceUrlVariables(urlTemplate, row);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const templateNavigation = () => {
    navigate(`/main/${appId}/object/${tableSlug}/templates`);
  };

  return (
    <>
      <MenuItem
        onClick={(event) => {
          projectId === "6fd296f6-9195-4ed3-af84-c1dcca929273"
            ? templateNavigation()
            : navigateToDocumentEditPage(event);
        }}>
        PDF page
      </MenuItem>
    </>
  );
}
