import { Box, Chip, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { ENTITY_TYPES } from "./constants";

function ChatInput({
  loader,
  setInputValue,
  handleSendClick,
  inputValue,
  handleKeyDown,
  setLoader,
  selectedEntityType,
  selectedTable,
}) {
  const [placeholder, setPlaceholder] = useState("Type your message...");

  const options = [
    {
      label: "Add fields",
      value: `Update the ${selectedTable} table:\n- Add field1, field2, field3 fields`,
    },
    {
      label: "Edit fields",
      value: `Update the${selectedTable} table:\n -Edit field1's type to TYPE(if need), label to LABEL(if need)`,
    },
    {
      label: "Delete fields",
      value: `Update the ${selectedTable} table:\n- Delete field1, field2, field3 fields`,
    },
    {
      label: "Add relation",
      value: `Update the ${selectedTable} table:\n- Add relation with table1, table2 tables`,
    },
    {
      label: "Delete relation",
      value: `Update the ${selectedTable} table:\n- Delete relation with table1, table2 tables`,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        width: "100%",
        // height:
        //   selectedEntityType === ENTITY_TYPES.TABLES
        //     ? "100px !important"
        //     : "auto",
        padding: "16px 8px",
        border: "1px solid #E0E2E8",
        borderRadius: "6px",
      }}
    >
      <Box flexGrow={1}>
        <TextField
          multiline={!loader}
          fullWidth
          placeholder={
            selectedEntityType ? placeholder : "Type your message..."
          }
          value={inputValue}
          onChange={(e) => {
            // if (inputValue?.length > 0) {
            //   setLoader(true);
            // }
            setInputValue(e.target.value);
          }}
          autoFocus
          onKeyDown={handleKeyDown}
          sx={{
            "& .MuiInputBase-input": {
              width: "100%",
              height: "100% !important",
              // padding: "10px",
              fontSize: "14px",
              // border: "1px solid #000",
              // overflow: "hidden",
              // borderRadius: "20px",
              paddingRight: "0px",
              color: "#1A1B1E",
              "&::placeholder": {
                fontSize: "14px",
              },
            },

            "& .MuiOutlinedInput-root": {
              padding: "0px 10px 10px 0px",
              "&.Mui-focused fieldset": {
                borderColor: "transparent",
                borderWidth: 0,
              },
              "& fieldset": {
                borderWidth: 0,
              },
            },
            "& .MuiInputBase-root": {
              paddingRight: 0,
            },
          }}
          // InputProps={{
          //   endAdornment: (
          //     <InputAdornment position="end">

          //     </InputAdornment>
          //   ),
          // }}
        />
        {selectedEntityType === ENTITY_TYPES.TABLES &&
          inputValue?.trim()?.length === 0 &&
          selectedTable && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "8px",
                padding: "0",
              }}
            >
              {options.map((item) => (
                <Chip
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    fontSize: "14px",
                    height: "26px",
                  }}
                  sx={{
                    "& .MuiChip-label": {
                      padding: "2px 8px 0px 8px",
                    },
                  }}
                  size="small"
                  variant="outlined"
                  key={item.label}
                  label={item.label}
                  onMouseEnter={() => setPlaceholder(item.value)}
                  onMouseLeave={() => setPlaceholder("Type your message...")}
                  onClick={() => setInputValue(item.value)}
                />
              ))}
            </Box>
          )}
      </Box>

      <button
        disabled={inputValue?.length === 0}
        style={{
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          border: "none",
          color: inputValue?.length ? "#000" : "#eee",
          cursor: inputValue?.length ? "pointer" : "not-allowed",
          marginLeft: "auto",
        }}
        onClick={() => {
          handleSendClick();
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width={"24"}
          height={"24"}
          fill="none"
          class="c-bxOhME c-bxOhME-dvzWZT-size-medium"
        >
          <path
            fill="currentColor"
            d="m4.479 2.122 16.5 9v1.756l-16.5 9-1.428-1.194L5.613 13H14v-2H5.613L3.05 3.316l1.43-1.194Z"
          ></path>
        </svg>
        {/* <img src="/img/gptSendIcon.svg" alt="" /> */}
      </button>
    </Box>
  );
}

export default ChatInput;
