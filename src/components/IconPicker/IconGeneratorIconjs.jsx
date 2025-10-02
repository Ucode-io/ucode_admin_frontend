import {memo} from "react";
import SVG from "react-inlinesvg";

const IconGeneratorIconJs = ({icon, size = 20, prefix = "", ...props}) => {
  let iconName = "";

  if (!icon) return null;
  const splittedByColon = icon.split(":");

  if (splittedByColon.length > 2) {
    iconName = splittedByColon[1] + ":" + splittedByColon[2];
  }

  if (iconName) {
    return (
      <SVG
        src={`${import.meta.env.VITE_ICONJS_PICKER_URL}/${iconName}.svg`}
        width={size}
        height={size}
        preProcessor={(code) =>
          code.replace("path", 'path fill="currentColor"')
        }
        {...props}
      />
    );
  }

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
