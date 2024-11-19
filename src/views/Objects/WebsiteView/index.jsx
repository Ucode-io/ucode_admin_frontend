import React from "react";

function WebsiteView({view}) {
  const webUrl = view?.attributes?.web_link;
  return (
    <iframe
      src={webUrl}
      width={"100%"}
      style={{height: "calc(100vh - 50px)"}}
      frameborder="0"></iframe>
  );
}

export default WebsiteView;
