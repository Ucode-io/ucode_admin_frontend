import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const GreyLoader = () => {
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
          width: "50px",
          height: "50px",
        }}
      >
        <DotLottieReact
          src="https://lottie.host/5a23815c-b901-47ea-8032-249540761d63/eOUFfHsp4r.json"
          loop
          autoplay
          width="50px"
          height="50px"
        />
      </div>
    </div>
  );
};
