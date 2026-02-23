import React, { useState, useRef, useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import { Box, TextField, InputAdornment, ClickAwayListener } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const SearchableSelect = ({
  control,
  name,
  options = [],
  placeholder = "",
  required = false,
  onChange = () => { },
  defaultValue = "",
  rules = {},
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((opt) =>
      (opt?.label || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleSelect = (option, onFormChange) => {
    onFormChange(option.value);
    onChange(option.value);
    setSearch("");
    setIsOpen(false);
  };

  const handleClickAway = () => {
    setIsOpen(false);
    setSearch("");
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({
        field: { onChange: onFormChange, value },
        fieldState: { error },
      }) => {
        const selectedOption = options.find((opt) => opt.value === value);

        return (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box ref={containerRef} sx={{ position: "relative", width: "100%" }}>
              {/* Trigger field */}
              <Box
                onClick={() => {
                  if (!disabled) setIsOpen((prev) => !prev);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: error ? "1px solid #d32f2f" : "1px solid #d0d5dd",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  cursor: disabled ? "not-allowed" : "pointer",
                  backgroundColor: disabled ? "#f5f5f5" : "#fff",
                  transition: "border-color 0.2s",
                  minHeight: "40px",
                  "&:hover": {
                    borderColor: disabled ? "#d0d5dd" : "#94a3b8",
                  },
                }}
              >
                <Box
                  sx={{
                    fontSize: "14px",
                    color: selectedOption ? "#1e293b" : "#94a3b8",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedOption?.label || placeholder}
                </Box>
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: 20,
                    color: "#94a3b8",
                    transition: "transform 0.2s",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </Box>

              {/* Dropdown */}
              {isOpen && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    zIndex: 1300,
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  {/* Search input */}
                  <Box sx={{ padding: "8px" }}>
                    <TextField
                      autoFocus
                      fullWidth
                      size="small"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          fontSize: "13px",
                          borderRadius: "6px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e2e8f0",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#cbd5e1",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3b82f6",
                            borderWidth: "1px",
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Options list */}
                  <Box
                    sx={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      padding: "4px 0",
                      "&::-webkit-scrollbar": {
                        width: "4px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "transparent",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#cbd5e1",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <Box
                          key={option.value}
                          onClick={() => handleSelect(option, onFormChange)}
                          sx={{
                            padding: "8px 12px",
                            fontSize: "14px",
                            cursor: "pointer",
                            color: option.value === value ? "#3b82f6" : "#1e293b",
                            backgroundColor:
                              option.value === value
                                ? "rgba(59, 130, 246, 0.06)"
                                : "transparent",
                            fontWeight: option.value === value ? 500 : 400,
                            transition: "background-color 0.15s",
                            "&:hover": {
                              backgroundColor:
                                option.value === value
                                  ? "rgba(59, 130, 246, 0.1)"
                                  : "#f8fafc",
                            },
                          }}
                        >
                          {option.label}
                        </Box>
                      ))
                    ) : (
                      <Box
                        sx={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: "#94a3b8",
                          textAlign: "center",
                        }}
                      >
                        No results found
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* Error message */}
              {error?.message && (
                <Box
                  sx={{
                    fontSize: "12px",
                    color: "#d32f2f",
                    marginTop: "4px",
                  }}
                >
                  {error.message}
                </Box>
              )}
            </Box>
          </ClickAwayListener>
        );
      }}
    />
  );
};

export default SearchableSelect;
