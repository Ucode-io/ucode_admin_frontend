import React from "react";
import {useLocation, useParams} from "react-router-dom";

function WebsitePage() {
  const {location} = useLocation();
  const test = useParams();
  console.log("locationlocation", location, test);
  return <div>WebsitePage</div>;
}

export default WebsitePage;
