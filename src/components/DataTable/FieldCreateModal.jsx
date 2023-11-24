import "./style.scss";
import { Box, Button, Card, Menu, Popover, Typography } from "@mui/material";
import React, { useState } from "react";
import style from "./field.module.scss";
import { math, newFieldTypes } from "../../utils/constants/fieldTypes";
import FRow from "../FormElements/FRow";
import HFTextField from "../FormElements/HFTextField";
import HFSelect from "../FormElements/HFSelect";
import { useFieldArray } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../utils/applyDrag";
import { useFieldsListQuery } from "../../services/fieldService";
import CloseIcon from "@mui/icons-material/Close";
import { colorList } from "../ColorPicker/colorList";
import HFSwitch from "../FormElements/HFSwitch";

export default function FieldCreateModal({
  anchorEl,
  setAnchorEl,
  watch,
  control,
  setValue,
  handleSubmit,
  onSubmit,
  setFieldOptionAnchor,
  target,
  reset,
  menuItem,
  fieldData,
  handleOpenFieldDrawer,
}) {
  const type = watch("type");
  const [fields, setFields] = useState([]);
  const [colorEl, setColorEl] = useState(null);
  const [mathEl, setMathEl] = useState(null);
  const [idx, setIdx] = useState(null);
  const mathType = watch("attributes.math");

  const {
    fields: dropdownFields,
    append: dropdownAppend,
    remove: dropdownRemove,
  } = useFieldArray({
    control,
    name: "attributes.options",
  });
  const open = Boolean(anchorEl);
  const openColor = Boolean(colorEl);
  const openMath = Boolean(mathEl);

  const onDrop = (dropResult) => {
    const result = applyDrag(watch("attributes.options"), dropResult);
    if (result) {
      setValue("attributes.options", result);
    }
  };

  console.log("watch", watch());

  const { isLoading: fieldLoading } = useFieldsListQuery({
    params: {
      table_id: menuItem?.table_id,
    },
    queryParams: {
      enabled: Boolean(menuItem?.table_id),
      onSuccess: (res) => {
        setFields(
          res?.fields?.map((item) => {
            return { value: item.slug, label: item.label };
          })
        );
      },
    },
  });

  const handleClose = () => {
    setAnchorEl(null);
    setValue("type", "");
  };

  const handleCloseColor = () => {
    setColorEl(null);
  };

  const handleCloseMath = () => {
    setMathEl(null);
  };

  const handleClick = () => {
    setAnchorEl(null);
    setValue("type", "");
    setFieldOptionAnchor(target);
  };

  const handleOpenColor = (e, index) => {
    setIdx(index);
    setColorEl(e.currentTarget);
  };

  const closeAllDrawer = () => {
    setFieldOptionAnchor(null);
    setAnchorEl(null);
  };

  return (
    <Menu
      open={open}
      onClose={handleClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <div className={style.field}>
        <Typography variant="h6" className={style.title}>
          ADD COLUMN
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
          <Box className={style.field}>
            <FRow
              label={"Field name"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFTextField
                disabledHelperText
                name="label"
                control={control}
                fullWidth
                required
                placeholder="Field name"
              />
            </FRow>
            <FRow
              label={"Field type"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFSelect
                disabledHelperText
                options={newFieldTypes}
                name="type"
                control={control}
                fullWidth
                required
                placeholder="Select type"
              />
            </FRow>
          </Box>
          {fieldData && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                handleOpenFieldDrawer(fieldData);
                closeAllDrawer();
              }}
            >
              Advanced settings
            </Button>
          )}
          <div>
            {type === "MULTISELECT" && (
              <Box className={style.dropdown}>
                <Container
                  lockAxis="y"
                  orientation="vertical"
                  onDrop={onDrop}
                  dragHandleSelector=".column-drag-handle"
                >
                  {dropdownFields.map((item, index) => (
                    <Draggable key={item.id}>
                      <Box key={item.id} className="column-drag-handle">
                        <FRow
                          label={`Option ${index + 1}`}
                          className={style.option}
                        >
                          <span
                            className={style.startAdornment}
                            style={{
                              background: watch(
                                `attributes.options.${index}.color`
                              ),
                            }}
                          ></span>

                          <HFTextField
                            disabledHelperText
                            name={`attributes.options.${index}.label`}
                            control={control}
                            fullWidth
                            required
                            placeholder="Type..."
                            endAdornment={
                              <Box className={style.adornment}>
                                <p onClick={(e) => handleOpenColor(e, index)}>
                                  Add color
                                </p>
                                <CloseIcon
                                  onClick={() => dropdownRemove(index)}
                                />
                              </Box>
                            }
                            customOnChange={(e) => {
                              setValue(
                                `attributes.options.${index}.value`,
                                e.target.value.replace(/ /g, "_")
                              );
                            }}
                          />
                        </FRow>
                      </Box>
                      <Popover
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
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setValue(
                                  `attributes.options.${idx}.color`,
                                  color
                                );
                                handleCloseColor();
                              }}
                            />
                          ))}
                        </Card>
                      </Popover>
                    </Draggable>
                  ))}
                </Container>
                <Button
                  onClick={() => {
                    dropdownAppend({
                      label: "",
                      value: "",
                    });
                  }}
                >
                  +Add option
                </Button>
              </Box>
            )}
          </div>
          {type === "FORMULA_FRONTEND" && (
            <>
              {watch("attributes.advanced_type") ? (
                <>
                  <Box className={style.formula}>
                    <HFTextField
                      disabledHelperText
                      name="attributes.formula"
                      control={control}
                      fullWidth
                      required
                      placeholder="Formula"
                    />
                  </Box>
                  <h2>Fields list:</h2>
                  {fields.map((field) => (
                    <div>
                      {field.label} - <strong>{field.value}</strong>{" "}
                    </div>
                  ))}
                </>
              ) : (
                <Box className={style.formula}>
                  <HFSelect
                    disabledHelperText
                    options={fields}
                    name="attributes.from_formula"
                    control={control}
                    fullWidth
                    required
                    placeholder="Select variable"
                  />

                  <span
                    className={`math_${mathType?.label}`}
                    onClick={(e) => setMathEl(e.currentTarget)}
                  >
                    {mathType?.value}
                  </span>
                  <HFSelect
                    disabledHelperText
                    options={fields}
                    name="attributes.to_formula"
                    control={control}
                    fullWidth
                    required
                    placeholder="Select variable"
                  />

                  <Menu
                    open={openMath}
                    onClose={handleCloseMath}
                    anchorEl={mathEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <Box className="math">
                      {math.map((item) => {
                        return (
                          <span
                            className={`math_${item?.label}`}
                            onClick={() => {
                              setValue("attributes.math", item);
                              setMathEl(null);
                            }}
                          >
                            {item?.value}
                          </span>
                        );
                      })}
                    </Box>
                  </Menu>
                </Box>
              )}

              <Box
                mt={1}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  columnGap: "5px",
                }}
              >
                <HFSwitch control={control} name="attributes.advanced_type" />
                Advanced Editor
              </Box>
            </>
          )}
          <Box className={style.button_group}>
            <Button variant="contained" color="error" onClick={handleClick}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Add column
            </Button>
          </Box>
        </form>
      </div>
    </Menu>
  );
}
