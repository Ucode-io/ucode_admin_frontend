import { Portal } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import style from "./field.module.scss";
import "./style.scss";
import { useLayoutEffect, useState } from "react";

const EditOptionsMenu = ({
  watch = () => {},
  setValue = () => {},
  dropdownRemove = () => {},
  dropdownAppend = () => {},
  setIsMenuOpen = () => {},
  isStatusFormat,
  statusFields,
  editingField,
  colorList = [],
  isMenuOpen,
  anchorEl,
}) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (isMenuOpen && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setCoords({
        top: rect.top + 50,
        left: rect.left + window.scrollX,
      });
    } else {
      setCoords({ top: 0, left: 0 });
    }
  }, [isMenuOpen, anchorEl]);

  console.log(watch(`attributes.options.${editingField.index}.label`));
  return (
    <Portal>
      <div
        className={style.editOptionMenu}
        style={{ top: coords.top, left: coords.left }}
      >
        <input
          className={style.appendInput}
          placeholder="..."
          name="option"
          type="text"
          value={watch(
            isStatusFormat
              ? `attributes.${editingField.name}.options.${editingField.index}.label`
              : `attributes.options.${editingField.index}.label`
          )}
          onChange={(e) => {
            setValue(
              isStatusFormat
                ? `attributes.${editingField.name}.options.${editingField.index}.label`
                : `attributes.options.${editingField.index}.label`,
              e.target.value
            );
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
        <button
          className={style.deleteOptionBtn}
          type="button"
          onClick={() => {
            if (isStatusFormat) {
              statusFields[editingField.name].remove(editingField.index);
            } else {
              dropdownRemove(editingField.index);
            }
            setIsMenuOpen(false);
          }}
        >
          <DeleteOutline htmlColor="rgb(50, 48, 44)" width={20} height={20} />
          <span>Delete</span>
        </button>
        <span className={style.line} />
        <span className={style.colors}>Colors</span>
        <div className={style.colorsWrapper}>
          {colorList.map((color, colorIndex) => (
            <div
              className={style.colorWrapper}
              onClick={() => {
                setValue(
                  isStatusFormat
                    ? `attributes.${editingField.name}.options.${editingField.index}.color`
                    : `attributes.options.${editingField.index}.color`,
                  color
                );
                setValue(`attributes.has_color`, true);
                setIsMenuOpen(false);
              }}
              key={colorIndex}
            >
              <div className={style.color} style={{ backgroundColor: color }} />
              <span className={style.colorName} style={{ color }}>
                {color}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Portal>
  );
};

export default EditOptionsMenu;
