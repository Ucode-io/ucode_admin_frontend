import React from "react";
import {useLocation, useParams} from "react-router-dom";

function WebsitePage() {
  const {state} = useLocation();

  return (
    <>
      <iframe
        src={state?.url}
        width={"100%"}
        height={"100%"}
        frameborder="0"></iframe>
    </>
  );
}

export default WebsitePage;
