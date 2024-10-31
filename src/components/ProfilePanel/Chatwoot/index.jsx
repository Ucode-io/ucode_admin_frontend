import {Box} from "@mui/material";
import React, {useEffect, useState} from "react";

function Chatwoot({sidebarIsOpen}) {
  const [originalButtonFunction, setOriginalButtonFunction] = useState(null);

  useEffect(() => {
    const handleOriginalButtonClick = () => {
      window.$chatwoot.toggle();
    };
    const headerClass = document.querySelector(".conversation-wrap");
    const originalButton = document.querySelector(".woot-elements--left");

    const closeButton = document.createElement("button");
    closeButton.style.position = "absolute";
    closeButton.style.top = "20px";
    closeButton.style.right = "20px";
    closeButton.style.zIndex = "9999";
    closeButton.style.background = "none";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    originalButton.appendChild(closeButton);

    const closeButtonImage = document.createElement("img");
    closeButtonImage.src = "/img/close.svg";
    closeButtonImage.alt = "Close Chat";
    closeButtonImage.style.width = "20px";
    closeButtonImage.style.height = "20px";

    closeButton.appendChild(closeButtonImage);

    if (originalButton) {
      originalButton.addEventListener("click", handleOriginalButtonClick);
      setOriginalButtonFunction(() => handleOriginalButtonClick);
    }
    return () => {
      if (originalButton) {
        originalButton.removeEventListener("click", handleOriginalButtonClick);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px",
        padding: "0 5px",
      }}
      onClick={originalButtonFunction}>
      <img width={22} height={22} src="/img/chatwoot.svg" alt="AI" />
      <Box sx={{fontSize: "13px", fontWeight: 600}}>
        {sidebarIsOpen ? "Support" : ""}
      </Box>
    </Box>
  );
}

export default Chatwoot;
