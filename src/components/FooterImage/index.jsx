import React, {useState, useEffect} from "react";
import classes from "./style.module.scss";

function FooterImage() {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateHeight = () => {
      const newHeight = window.innerWidth * 0.25;
      setHeight(newHeight);
    };

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => window.removeEventListener("resize", updateHeight);
  }, [height]);

  return (
    <div style={{height: `${height}px`}} className={classes.footerImage}>
      <img src="/img/newDesign.svg" alt="" />
    </div>
  );
}

export default FooterImage;
