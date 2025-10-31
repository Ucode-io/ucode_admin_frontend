import HFTextField from "@/components/FormElements/HFTextField";
import cls from "./styles.module.scss";
import { Box } from "@mui/material"
import clsx from "clsx";
import TextFieldWithMultiLanguage from "@/components/NewFormElements/TextFieldWithMultiLanguage/TextFieldWithMultiLanguage";
import { useSelector } from "react-redux";

export const StatusFieldSettings = ({
  item,
  index,
  remove,
  control,
  name = "name",
  type,
  group = "Options",
  colors = [],
  hasColor,
  setValue,
  optionName,
  watch = () => {},
  setActiveId = () => {},
  isMultiLanguage,
}) => {
  const languages = useSelector((state) => state.languages.list);
  return (
    <Box className={cls.card}>
      <Box>
        {isMultiLanguage ? (
          <Box>
            <TextFieldWithMultiLanguage
              control={control}
              name={`${name}.${optionName}`}
              placeholder="Name"
              languages={languages}
              id={"field_label"}
              watch={watch}
              required
            />
            <input
              className={cls.slugInput}
              onChange={(e) => setValue(`${name}.value`, e.target.value)}
              placeholder="Slug"
              value={watch(`${name}.value`)}
            />
          </Box>
        ) : (
          // <HFTextField
          //   control={control}
          //   name={`${name}.${optionName || "value"}`}
          // />
          <Box>
            <TextFieldWithMultiLanguage
              control={control}
              name={`${name}.label`}
              placeholder="Name"
              languages={languages}
              id={"field_label"}
              watch={watch}
              required
            />
            <input
              className={cls.slugInput}
              onChange={(e) => setValue(`${name}.slug`, e.target.value)}
              placeholder="Slug"
              value={watch(`${name}.slug`)}
            />
          </Box>
        )}
        <button
          className={cls.removeBtn}
          type="button"
          onClick={() => {
            remove(index);
            setActiveId(null);
          }}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
            >
              <path
                stroke="#101828"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.2"
                d="M10.667 4v-.533c0-.747 0-1.12-.146-1.406a1.333 1.333 0 0 0-.582-.582c-.286-.146-.659-.146-1.406-.146H7.467c-.747 0-1.12 0-1.406.146-.25.127-.455.331-.582.582-.146.285-.146.659-.146 1.406V4m1.334 3.667V11m2.666-3.333V11M2 4h12m-1.333 0v7.467c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874c-.428.218-.988.218-2.108.218H6.533c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874c-.218-.428-.218-.988-.218-2.108V4"
              />
            </svg>
          </span>
          <span>Delete</span>
        </button>
      </Box>
      {hasColor && (
        <Box marginTop="8px" borderTop="1px solid #EAECF0;">
          <p className={cls.group}>{group}</p>
          <Box>
            {colors?.map((color) => (
              <button
                key={color?.color}
                className={cls.colorBtn}
                onClick={() => setValue(`${name}.color`, color?.color)}
              >
                <span
                  className={cls.color}
                  style={{ backgroundColor: color?.color }}
                />
                <span
                  style={{
                    opacity:
                      color?.color === watch(`${name}.color`) ? "1" : "0.8",
                  }}
                >
                  {color?.name}
                </span>
              </button>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
