import React from "react";
import styles from "./style.module.scss";

export const Website = ({view}) => {
  const webUrl = view?.attributes?.web_link;
  return (
    <iframe
      className={styles.websiteLink}
      src={webUrl}
      width={"100%"}
      style={{height: "calc(100vh - 50px)"}}
      frameBorder="0"></iframe>
  );
}
