import React from "react";
import styles from "./style.module.scss";

function WebsiteView({view}) {
  const webUrl = view?.attributes?.web_link;
  return (
    <iframe
      className={styles.websiteLink}
      src={webUrl}
      width={"100%"}
      style={{height: "calc(100vh - 50px)"}}
      frameborder="0"></iframe>
  );
}

export default WebsiteView;
