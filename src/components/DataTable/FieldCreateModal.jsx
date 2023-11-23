import { Box, Button, Menu, Typography } from "@mui/material";
import React, { useState } from "react";
import style from "./field.module.scss";
import "./style.scss";
import { newFieldTypes } from "../../utils/constants/fieldTypes";
import IconGenerator from "../IconPicker/IconGenerator";
import FormCard from "../FormCard";
import FRow from "../FormElements/FRow";
import HFTextField from "../FormElements/HFTextField";
import HFSelect from "../FormElements/HFSelect";
import { useFieldArray } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../utils/applyDrag";
import { useFieldsListQuery } from "../../services/fieldService";

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
}) {
  const type = watch("type");
  const [fields, setFields] = useState([]);
  const {
    fields: dropdownFields,
    append: dropdownAppend,
    remove: dropdownRemove,
  } = useFieldArray({
    control,
    name: "attributes.options",
    keyName: "key",
  });
  const open = Boolean(anchorEl);

  console.log("watch", watch());

  const onDrop = (dropResult) => {
    const result = applyDrag(dropdownFields, dropResult);
    if (result) {
      reset({
        attributes: {
          options: result,
        },
      });
    }
  };
  console.log("fields", fields);
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

  const handleClick = () => {
    setAnchorEl(null);
    setValue("type", "");
    setFieldOptionAnchor(target);
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
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            // width: 100,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
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
          {type === "DROPDOWN" && (
            <Box className={style.dropdown}>
              <Container
                dragHandleSelector=".column-drag-handle"
                onDrop={onDrop}
              >
                {dropdownFields.map((item, index) => (
                  <Draggable key={index}>
                    <Box className="column-drag-handle">
                      <FRow
                        label={`Option ${index + 1}`}
                        className={style.option}
                      >
                        <HFTextField
                          disabledHelperText
                          name={`attributes.options.${index}.label`}
                          control={control}
                          fullWidth
                          required
                          placeholder="Type..."
                          customOnChange={(e) => {
                            setValue(
                              `attributes.options.${index}.value`,
                              e.target.value.replace(/ /g, "_")
                            );
                          }}
                        />
                      </FRow>
                    </Box>
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
          {type === "FORMULA" && (
            <Box className={style.formula}>
              <HFSelect
                disabledHelperText
                options={fields}
                name="formula"
                control={control}
                fullWidth
                required
                placeholder="Select variable"
              />
              <HFSelect
                disabledHelperText
                options={[{ label: "+", value: "+" }]}
                name="plus"
                control={control}
                fullWidth
                required
              />
              <HFSelect
                disabledHelperText
                options={fields}
                name="fff"
                control={control}
                fullWidth
                required
                placeholder="Select variable"
              />
            </Box>
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
