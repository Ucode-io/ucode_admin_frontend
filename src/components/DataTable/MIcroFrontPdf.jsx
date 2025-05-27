import {MenuItem} from "@mui/material";
import React from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";

export default function MicroFrontPdf({
  row,
  handleClose = () => {},
  view,
  projectId,
}) {
  const {appId, tableSlug} = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const menuId = searchParams.get("menuId");

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
    navigate(
      `/main/${appId}/object/${tableSlug}/templates?menuId=${menuId}&id=${row?.guid}`
    );
  };

  return (
    <>
      <MenuItem
        onClick={(event) => {
          Boolean(
            projectId === "342fba37-fc7d-4b6f-b02f-57b21beb0218" ||
              projectId === "b9029a9f-9431-4a44-b5e4-be148e4cc573"
          )
            ? navigateToDocumentEditPage(event)
            : templateNavigation();
        }}>
        PDF page
      </MenuItem>
    </>
  );
}
