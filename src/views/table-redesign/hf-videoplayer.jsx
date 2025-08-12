import React, {useEffect, useRef} from "react";
import shaka from "shaka-player/dist/shaka-player.ui";
import "shaka-player/dist/controls.css";

export default function ShakaVideoPlayer({src}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
      console.error("Browser not supported!");
      return;
    }

    const video = videoRef.current;
    const container = containerRef.current;
    const ui = new shaka.ui.Overlay(new shaka.Player(video), container, video);
    const player = ui.getControls().getPlayer();

    player.load(src).catch((err) => console.error("Error loading video", err));

    return () => {
      ui.destroy();
    };
  }, [src]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={containerRef}
      style={{width: "100%"}}>
      <video
        onClick={(e) => e.stopPropagation()}
        ref={videoRef}
        style={{width: "100%"}}></video>
    </div>
  );
}
