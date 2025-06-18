import { Box, Button, Card, Menu, Popover, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Container, Draggable } from "react-smooth-dnd";
import style from "./field.module.scss";
import "./style.scss";
import FRow from "../FormElements/FRow";
import HFTextField from "../FormElements/HFTextField";
import { generateLangaugeText } from "../../utils/generateLanguageText";
import StatusFieldSettings from "../../views/Constructor/Tables/Form/Fields/StatusFieldSettings";
import { AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import TextField from "../NewFormElements/TextField/TextField";
import { useFieldArray, useForm } from "react-hook-form";
import {
  DeleteOutline,
  DragIndicator,
  KeyboardArrowRight,
} from "@mui/icons-material";
import StatusSettings from "./StatusSettings";
import { PlusIcon } from "../../assets/icons/icon";

const MultiselectSettings = ({
  dropdownFields,
  onDrop,
  watch,
  control,
  setValue,
  handleOpenColor,
  dropdownRemove,
  tableLan,
  i18n,
  openColor,
  colorEl,
  handleCloseColor,
  colorList,
  idx,
  dropdownAppend,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const isStatusFormat = watch("type") === "STATUS";

  const toDoFieldArray = useFieldArray({
    control,
    name: "attributes.todo.options",
  });

  const inProgressFieldArray = useFieldArray({
    control,
    name: "attributes.progress.options",
  });

  const completeFieldArray = useFieldArray({
    control,
    name: "attributes.complete.options",
  });

  const statusFields = {
    todo: toDoFieldArray,
    progress: inProgressFieldArray,
    complete: completeFieldArray,
  };

  const handleCloseAddPopup = (e) => {
    if (isOpen && !e.target.closest(`.${style.appendInput}`)) {
      setIsOpen(false);
    } else if (!e.target.closest(`.${style.editOptionMenu}`)) {
      setIsMenuOpen(false);
    }
  };

  const handleOpenAddPopup = (e) => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      e.stopPropagation();
      setIsOpen(true);
    }
  };

  const handleOpenEdit = (field, e, index) => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    } else {
      e.stopPropagation();
      setIsMenuOpen(true);
      setEditingField({ ...field, index });
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleCloseAddPopup);
    return () => {
      window.removeEventListener("click", handleCloseAddPopup);
    };
  }, []);

  console.log({ editingField });

  return (
    <Box className={style.dropdown}>
      <div className={style.dropdownHeader}>
        <p>Options</p>
        {watch("type") === "MULTISELECT" && dropdownFields?.length > 0 && (
          <button
            className={style.appendBtn}
            onClick={handleOpenAddPopup}
            type="button"
          >
            <AddIcon width="14px" height="14px" color="rgba(71, 70, 68, 0.6)" />
          </button>
        )}
      </div>
      {dropdownFields?.length === 0 &&
        !isOpen &&
        watch("type") !== "STATUS" && (
          <div className={style.btnWrapper}>
            <button
              className={style.btn}
              type="button"
              onClick={handleOpenAddPopup}
            >
              <AddIcon />
              <span>Add an option</span>
            </button>
          </div>
        )}
      {isOpen && watch("type") !== "STATUS" && (
        <div className={style.appendOption}>
          <input
            className={style.appendInput}
            placeholder="Create a new option..."
            name="new_option"
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                e.preventDefault();
                dropdownAppend({
                  label: e.target.value,
                  value: e.target.value,
                  color: colorList[Math.ceil(Math.random() * colorList.length)],
                });
                e.target.value = "";
              }
            }}
          />
        </div>
      )}

      <Container
        lockAxis="y"
        orientation="vertical"
        onDrop={onDrop}
        dragHandleSelector=".column-drag-handle"
      >
        {dropdownFields.map((item, index) => (
          <Draggable key={item.id}>
            <Box
              position="relative"
              key={item.id}
              className="column-drag-handle"
            >
              <Box
                className={style.fieldItemWrapper}
                onClick={(e) => handleOpenEdit(item, e)}
              >
                <DragIndicator
                  htmlColor="rgba(71, 70, 68, 0.6)"
                  style={{ cursor: "grab" }}
                />
                <span
                  className={style.fieldItem}
                  style={{
                    backgroundColor:
                      watch(`attributes.options.${index}.color`) + 33,
                    color: watch(`attributes.options.${index}.color`),
                  }}
                >
                  {watch(`attributes.options.${index}.label`)}
                </span>
                <KeyboardArrowRight
                  htmlColor="rgba(71, 70, 68, 0.6)"
                  width={16}
                  height={16}
                  style={{ marginLeft: "auto" }}
                />
              </Box>
              {/* {isMenuOpen && editingField?.id === item.id && (
                <div className={style.editOptionMenu}>
                  <input
                    className={style.appendInput}
                    placeholder="..."
                    name="option"
                    type="text"
                    value={watch(`attributes.options.${index}.label`)}
                    onChange={(e) => {
                      setValue(
                        `attributes.options.${index}.label`,
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
                      dropdownRemove(index);
                      setIsMenuOpen(false);
                    }}
                  >
                    <DeleteOutline
                      htmlColor="rgb(50, 48, 44)"
                      width={20}
                      height={20}
                    />
                    <span>Delete</span>
                  </button>
                  <span className={style.line} />
                  <span className={style.colors}>Colors</span>
                  <div className={style.colorsWrapper}>
                    {colorList.map((color, colorIndex) => (
                      <div
                        className={style.colorWrapper}
                        onClick={() => {
                          setValue(`attributes.options.${index}.color`, color);
                          setValue(`attributes.has_color`, true);
                          setIsMenuOpen(false);
                        }}
                        key={colorIndex}
                      >
                        <div
                          className={style.color}
                          style={{ backgroundColor: color }}
                        />
                        <span className={style.colorName} style={{ color }}>
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </Box>
            {/* <Popover
              open={openColor}
              anchorEl={colorEl}
              onClose={handleCloseColor}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Card elevation={12} className="ColorPickerPopup">
                {colorList.map((color, colorIndex) => (
                  <div
                    className="round"
                    key={colorIndex}
                    style={{ backgroundColor: color + 33, color: color }}
                    onClick={() => {
                      setValue(`attributes.options.${idx}.color`, color);
                      setValue(`attributes.has_color`, true);
                      handleCloseColor();
                    }}
                  />
                ))}
              </Card>
            </Popover> */}
          </Draggable>
        ))}
      </Container>

      {isMenuOpen && (
        <div className={style.editOptionMenu}>
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
                <div
                  className={style.color}
                  style={{ backgroundColor: color }}
                />
                <span className={style.colorName} style={{ color }}>
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isStatusFormat && (
        <StatusSettings
          handleOpenEdit={handleOpenEdit}
          watch={watch}
          control={control}
          toDoFieldArray={toDoFieldArray}
          inProgressFieldArray={inProgressFieldArray}
          completeFieldArray={completeFieldArray}
        />
      )}
    </Box>
  );
};

export default MultiselectSettings;
