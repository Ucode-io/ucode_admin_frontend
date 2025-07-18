import React from "react";
import {Modal, Box} from "@mui/material";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

function TelegramMultiImageViewer({
  open = false,
  onClose,
  startIndex = 0,
  images = [],
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.4)",
          zIndex: 1400,
        }}>
        <Lightbox
          open={open}
          close={onClose}
          index={startIndex}
          slides={images}
          carousel={{
            finite: true,
            padding: 0,
            spacing: 0,
            imageFit: "contain",
          }}
          plugins={[Thumbnails, Zoom, Download]}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
          }}
          styles={{
            thumbnailsContainer: {
              position: "absolute",
              left: 0,
              bottom: 0,
              width: `100%`,
              margin: 0,
              padding: "10px 0",
              background: "rgba(18,18,18,0.7)",
              display: "flex",
              justifyContent: "center",
              zIndex: 11,
            },
            thumbnail: {
              width: 60,
              height: 70,
              border: "none",
              background: "transparent",
            },
            container: {
              background: "transparent",
            },
          }}
          animation={{swipe: 400}}
        />
      </Box>
    </Modal>
  );
}

export default TelegramMultiImageViewer;
