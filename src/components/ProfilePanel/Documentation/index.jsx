import {Box} from "@mui/material";
import React from "react";

function Documentation({sidebarIsOpen, menuStyle}) {
  return (
    <a
      target="t_blank"
      style={{
        display: "inline-flex",
        gap: "10px",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 5px",
        color: menuStyle?.text ?? "#000",
      }}
      href="https://ucode.gitbook.io/ucode-docs">
      <img width={22} height={22} src="/img/documentIcon.svg" alt="AI" />
      <Box sx={{fontSize: "13px", fontWeight: 600}}>
        {sidebarIsOpen ? "Documentation" : ""}
      </Box>
    </a>
  );
}

export default Documentation;
