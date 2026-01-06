import { useEffect, useRef, useState } from "react";
import cls from "./styles.module.scss";

export const FilterDropdown = ({
  multiple,
  options,
  placeholder,
  onChange,
  defaultValue,
  searchable,
  onSearch = () => {},
 }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(defaultValue ?? []);
  const wrapperRef = useRef(null);

  const handleSelect = (option) => {
    if (multiple) {
      setSelectedOptions((prev) =>
        prev.find((item) => item.value === option.value)
          ? prev.filter((item) => item.value !== option.value)
          : [...prev, option]
      );
      return;
    }

    setSelectedOptions([option]);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onChange(selectedOptions);
  }, [selectedOptions]);

  return (
    <div className={cls.filterDropdownWrapper} ref={wrapperRef}>
      <button
        type="button"
        className={cls.filterDropdown}
        onClick={handleOpen}
      >
        <div className={cls.filterDropdown__selected}>
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span
                className={cls.filterDropdown__selected__item}
                key={option.value}
              >
                {option?.label}
              </span>
            ))
          ) : (
            <span className={cls.filterDropdown__selected__placeholder}>
              {placeholder}
            </span>
          )}
          <span
            className={`${cls.filterDropdown__arrow} ${
              isOpen ? cls["filterDropdown__arrow--open"] : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className={cls.filterDropdown__options}>
          {
            searchable && (
              <div className={cls.filterDropdown__search}>
                <input
                  onChange={(e) => onSearch(e.target.value)}
                  type="text"
                  className={cls.filterDropdown__search__input}
                  placeholder="Search"
                />
              </div>
            )
          }
          <div>
          {options.map((option) => {
            const isSelected = selectedOptions?.find(
              (item) => item?.value === option?.value
            );

            return (
              <button
                type="button"
                key={option.value}
                className={`${cls.filterDropdown__options__option} ${
                  isSelected ? cls["filterDropdown__options__option--active"] : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                <span>{option.label}</span>
                <span
                  className={`${cls.filterDropdown__options__option__check} ${
                    isSelected
                      ? cls["filterDropdown__options__option__check--visible"]
                      : ""
                  }`}
                />
              </button>
            );
          })}
        </div>
        </div>
      )}
    </div>
  );
}
