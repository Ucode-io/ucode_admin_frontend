import React, {useEffect, useState} from "react";
import ChatwootLoginPage from "./ChatWootLoginPage";
import PrimaryButton from "../../../../../../components/Buttons/PrimaryButton";

function ChatwootLogin() {
  const [originalButtonFunction, setOriginalButtonFunction] = useState(null);

  useEffect(() => {
    let observer;

    const handleOriginalButtonClick = () => {
      if (window.$chatwoot) {
        window.$chatwoot.toggle();
      }
    };

    const initializeCloseButton = () => {
      const originalButton = document.querySelector(".woot-elements--left");

      if (!originalButton) {
        console.error("Chatwoot button not found.");
        return;
      }

      const closeButton = document.createElement("button");
      closeButton.style.position = "absolute";
      closeButton.style.top = "20px";
      closeButton.style.right = "20px";
      closeButton.style.zIndex = "9999";
      closeButton.style.background = "none";
      closeButton.style.border = "none";
      closeButton.style.cursor = "pointer";

      const closeButtonImage = document.createElement("img");
      closeButtonImage.src = "/img/close.svg";
      closeButtonImage.alt = "Close Chat";
      closeButtonImage.style.width = "20px";
      closeButtonImage.style.height = "20px";

      closeButton.appendChild(closeButtonImage);
      originalButton.appendChild(closeButton);

      originalButton.addEventListener("click", handleOriginalButtonClick);
      setOriginalButtonFunction(() => handleOriginalButtonClick);
    };

    // Observe DOM changes to wait for Chatwoot to initialize
    observer = new MutationObserver(() => {
      const originalButton = document.querySelector(".woot-elements--left");
      if (originalButton) {
        initializeCloseButton();
        observer.disconnect(); // Stop observing once the button is found
      }
    });

    // Start observing the body for Chatwoot widget initialization
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (observer) observer.disconnect();
      const originalButton = document.querySelector(".woot-elements--left");
      if (originalButton) {
        originalButton.removeEventListener("click", handleOriginalButtonClick);
      }
    };
  }, []);

  return (
    <>
      <PrimaryButton
        onClick={originalButtonFunction}
        size="large"
        style={{
          width: "100%",
          marginTop: "14px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #D0D5DD",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        type="button">
        <p style={{fontSize: "14px", color: "#344054"}}>Support</p>
        <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
            href="tel:+998998650109"
            style={{fontSize: "14px", color: "#344054"}}>
            +998 99-865-01-09
          </a>
          <ChatwootLoginPage />
        </div>
      </PrimaryButton>
    </>
  );
}

export default ChatwootLogin;
