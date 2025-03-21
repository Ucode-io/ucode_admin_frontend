import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./style.scss";

const RippleLoader = ({ size = "120px", height = "80px" }) => {
  if (size === "btn_size")
    return (
      <div className={`lds-dual-ring ${size}`} styles={{ height: height }} />
    );
  else
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DotLottieReact
          width={"30px"}
          height={"30px"}
          src="https://lottie.host/5a23815c-b901-47ea-8032-249540761d63/eOUFfHsp4r.json"
          loop
          autoplay
        />
      </div>
    );
};

export default RippleLoader;
