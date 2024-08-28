import React from "react";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

export default class SafeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "calc(100vh)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}>
          <h1>Week internet connection</h1>
          {/* <div>
            <NotInterestedIcon style={{color: "red", fontSize: "32px"}} />
          </div> */}
        </div>
      );
    }

    return this.props.children;
  }
}
