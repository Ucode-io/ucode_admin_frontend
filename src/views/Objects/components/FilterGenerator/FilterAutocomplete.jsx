import { ArrowDropDown, Close } from "@mui/icons-material"
import { Checkbox, Divider, Fade, IconButton, Menu } from "@mui/material"
import { useMemo, useState } from "react"
import SearchInput from "../../../../components/SearchInput"
import useDebounce from "../../../../hooks/useDebounce"
import styles from "./style.module.scss"

const FilterAutoComplete = ({
  options = [],
  searchText,
  setSearchText,
  localCheckedValues,
  value = [],
  onChange,
  label,
  field,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const menuVisible = Boolean(anchorEl)

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const inputChangeHandler = useDebounce((val) => {
    setSearchText(val)
  }, 300)

  const closeMenu = () => {
    setAnchorEl(null)
    setSearchText("")
  }

  const rowClickHandler = (option) => {
    if (value?.includes(option.value)) {
      onChange(
        value.filter((item) => item !== option.value),
        option
      )
    } else {
      onChange([...value, option.value], option)
    }
  }

  const computedOptions = useMemo(() => {
    const uncheckedOptions = []

    console.log("OPTIONS ===>", options, localCheckedValues)

    options.forEach((option) => {
      if (option.label?.toLowerCase().includes(searchText)) {
        uncheckedOptions.push(option)
      }
    })

    return {
      uncheckedOptions,
    }
  }, [options, value])

  const onClearButtonClick = (e) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div className={styles.autocomplete}>
      <div className={styles.autocompleteButton} onClick={openMenu}>
        <div className={styles.autocompleteValue}>
          {localCheckedValues?.[0]?.label || (
            <span
              className={styles.placeholder}
              style={{ color: !value?.length ? "#909EAB" : "#000" }}
            >
              {!value?.length ? label : value[0]}
            </span>
          )}
        </div>
        {value?.length > 1 && `+${value.length - 1}`}
        {!!value?.length && (
          <IconButton onClick={onClearButtonClick}>
            <Close />
          </IconButton>
        )}
        <ArrowDropDown />
      </div>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        TransitionComponent={Fade}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <SearchInput
          fullWidth
          onChange={inputChangeHandler}
          placeholder={label}
        />

        <div className={styles.scrollBlock}>
          {localCheckedValues?.map((option) => (
            <div
              onClick={() => rowClickHandler(option)}
              key={option.value}
              className={styles.option}
            >
              <Checkbox checked />
              <p className={styles.label}>{option.label}</p>
            </div>
          ))}

          <Divider />

          {computedOptions?.uncheckedOptions.map((option) => (
            <div
              onClick={() => rowClickHandler(option)}
              key={option.value}
              className={styles.option}
            >
              <Checkbox />
              <p className={styles.label}>{option.label}</p>
            </div>
          ))}
        </div>
      </Menu>
    </div>
  )
}

export default FilterAutoComplete
