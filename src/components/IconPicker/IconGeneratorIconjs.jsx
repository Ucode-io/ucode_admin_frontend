import {memo} from "react";
import SVG from "react-inlinesvg";

const IconGeneratorIconJs = ({icon, size = 20, prefix = "", ...props}) => {
  if (!icon) return null;
  return Boolean(prefix) ? (
    <SVG
      src={`${import.meta.env.VITE_ICONJS_PICKER_URL}/${prefix}:${icon}.svg`}
      width={size}
      height={size}
      preProcessor={(code) => code.replace("path", 'path fill="currentColor"')}
      {...props}
    />
  ) : (
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
