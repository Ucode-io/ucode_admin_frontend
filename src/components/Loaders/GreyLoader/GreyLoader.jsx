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
          src="https://lottie.host/46bb4df5-f100-4dcd-966b-5cd6d1aec871/Tl9PuY8xNO.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};
