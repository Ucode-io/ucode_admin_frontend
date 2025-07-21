import {memo} from "react";
import SVG from "react-inlinesvg";

const IconGeneratorIconJs = ({icon, size = 20, ...props}) => {
  if (!icon) return null;

  return (
    <SVG
      src={`${import.meta.env.VITE_ICONJS_PICKER_URL}/${icon}.svg`}
      width={size}
      height={size}
      preProcessor={(code) => code.replace("path", 'path fill="currentColor"')}
      {...props}
    />
  );
};

export default memo(IconGeneratorIconJs);
