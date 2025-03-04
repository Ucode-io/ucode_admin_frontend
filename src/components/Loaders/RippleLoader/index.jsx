import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./style.scss";

const RippleLoader = ({ size = "", height = "80px" }) => {
  return (
    // <div className={`lds-dual-ring ${size}`} styles={{ height: height }}></div>
    <DotLottieReact
      width="80px"
      height="80px"
      src="https://lottie.host/46bb4df5-f100-4dcd-966b-5cd6d1aec871/Tl9PuY8xNO.lottie"
      loop
      autoplay
    />
  );
};

export default RippleLoader;
