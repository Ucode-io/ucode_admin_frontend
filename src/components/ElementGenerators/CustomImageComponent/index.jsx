import React, { useRef, useState } from "react";
import { Text, Rect, Circle, Designer, Image } from "@looop/react-designer";
import styles from "./style.module.scss";
import html2canvas from "html2canvas";
import axios from "axios";
import { Button } from "@mui/material";
import fileService from "../../../services/fileService";

function HFCustomImageComponent(props) {
  const [inputs, setInputs] = useState({
    bgColor: "#fff",
    carton: {
      color: "#fff",
    },
    toast: {
      color: "#fff",
      crustColor: "#fff",
    },
    face: {
      eyeColor: "#fff",
      noseColor: "#fff",
      strokeColor: "#26001b",
    },
  });
  const {
    bgColor,
    carton: cartonProps,
    toast: toastProps,
    face: faceProps,
  } = inputs;

  const [svg, setSVG] = useState([]);

  const designerRef = useRef(null);

  const captureScreenshot = () => {
    html2canvas(designerRef.current).then((canvas) => {
      const imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
  
      const uploadedImage = svg.find((obj) => obj.type === "image");
      const { x, y, width, height } = uploadedImage;
      const croppedCanvas = document.createElement("canvas");
      const croppedContext = croppedCanvas.getContext("2d");
      croppedCanvas.width = width;
      croppedCanvas.height = height;
  
      croppedContext.putImageData(
        imageData,
        -x,
        -y
      );
  
      const croppedImage = croppedCanvas.toDataURL();
      sendImageToBackend(croppedImage);
    });
  };

  const sendImageToBackend = async (imageData) => {
    try {
      const blob = dataURItoBlob(imageData);
      const formData = new FormData();
      formData.append("file", blob, "image.png");

      const response = await fileService.upload(formData);
      const imageUrl = import.meta.env.VITE_CDN_BASE_URL + "ucode/" + response.filename;
      onChange(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  return (
    <>
      <div className={styles.designer_content}>
        <div ref={designerRef} className={styles.designer_content_item}>
          <Designer
            width={1100}
            height={500}
            background={null} 
            objectTypes={{
              text: Text,
              rect: Rect,
              circle: Circle,
              image: Image,
            }}
            onUpdate={(objects) => setSVG(objects)}
            objects={svg}
          />
        </div>
        <Button
          variant="contained"
          className={styles.captureBtn}
          onClick={captureScreenshot}
        >
          Capture and Send Image
        </Button>
      </div>
    </>
  );
}

export default HFCustomImageComponent;
