import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const GreyLoader = ({ size = "120px" }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
        }}
      >
        <DotLottieReact
          src="https://lottie.host/5a23815c-b901-47ea-8032-249540761d63/eOUFfHsp4r.json"
          loop
          autoplay
        />
      </div>
    </div>
  );
};
