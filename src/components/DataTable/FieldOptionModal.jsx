import {Button, Menu, Typography} from "@mui/material";
import React, {useState} from "react";
import style from "./field.module.scss";
import {newFieldTypes} from "../../utils/constants/fieldTypes";
import {getColumnIcon} from "@/views/table-redesign/icons";
import {
  ChakraProvider,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import chakraUITheme from "@/theme/chakraUITheme";

export default function FieldOptionModal({
  anchorEl,
  setAnchorEl,
  setFieldCreateAnchor,
  setValue,
  target,
}) {
  const open = Boolean(anchorEl);
  const [searchValue, setSearchValue] = useState();

  const handleClose = () => {
    setAnchorEl(null);
    setFieldCreateAnchor(null);
    setValue("type", "");
  };

  const handleChange = (e, value) => {
    setAnchorEl(null);
    setValue("attributes.format", value);
    if (value === "NUMBER") {
      setValue("type", "NUMBER");
    } else if (value === "DATE") {
      setValue("type", "DATE");
    } else if (value === "SINGLE_LINE") {
      setValue("type", "SINGLE_LINE");
    } else if (value === "INCREMENT") {
      setValue("type", "INCREMENT_ID");
    } else if (value === "FILE") {
      setValue("type", "MAP");
    } else if (value === "MAP") {
      setValue("type", "FILE");
    } else if (value === "PRIMARY_KEY") {
      setValue("type", "RANDOM_TEXT");
    } else if (value === "CODE") {
      setValue("type", "JSON");
    } else {
      setValue("type", value);
    }
    setFieldCreateAnchor(target);
  };

  return (
    <ChakraProvider theme={chakraUITheme}>
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
        }}>
        <div className={style.field}>
          <Typography variant="h6" className={style.title}>
            CREATE NEW FIELD
          </Typography>
          <InputGroup mb="8px" width={"95%"} mt={2} mx={"auto"}>
            <InputLeftElement>
              <Image src="/img/search-lg.svg" alt="search" />
            </InputLeftElement>
            <Input
              placeholder="Search by filled name"
              value={searchValue}
              onChange={(ev) => setSearchValue(ev.target.value)}
            />
          </InputGroup>
          {newFieldTypes
            ?.filter((el) =>
              searchValue
                ? el?.label.toLowerCase().includes(searchValue.toLowerCase())
                : true
            )
            ?.map((field) => (
              <Button
                key={field?.value}
                fullWidth
                className={style.button}
                onClick={(e) => {
                  handleChange(e, field?.value);
                }}>
                {field?.value &&
                  getColumnIcon({
                    column: {type: field?.value, table_slug: field?.table_slug},
                  })}
                <p>{field?.label}</p>
              </Button>
            ))}
        </div>
      </Menu>
    </ChakraProvider>
  );
}
