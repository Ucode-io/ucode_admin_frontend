import { ArrowDropDown, Close } from "@mui/icons-material"
import { Checkbox, Divider, Fade, IconButton, Menu } from "@mui/material"
import { useMemo, useState } from "react"
import SearchInput from "../../../../components/SearchInput"
import useDebounce from "../../../../hooks/useDebounce"
import styles from "./style.module.scss"

const FilterAutoComplete = ({ options = [], searchText, setSearchText, value = [], onChange, label }) => {
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

  const rowClickHandler = (optionValue) => {
    if (value?.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const computedOptions = useMemo(() => {
    const checkedOptions = []
    const uncheckedOptions = []

    options.forEach((option) => {
      if (value?.includes(option.value)) {
        checkedOptions.push(option)
      } else if (option.label?.toLowerCase().includes(searchText)) {
        uncheckedOptions.push(option)
      }
    })

    return {
      checkedOptions,
      uncheckedOptions,
    }
  }, [options, value, searchText])

  const onClearButtonClick = (e) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div className={styles.autocomplete}>
      <div className={styles.autocompleteButton} onClick={openMenu}>
        <div className={styles.autocompleteValue}>
          {computedOptions.checkedOptions?.[0]?.label || (
            <span className={styles.placeholder}>{label}</span>
          )}
        </div>
          {
            value?.length > 1 && `+${value.length - 1}`
          }
          {!!value?.length && <IconButton onClick={onClearButtonClick} >
            <Close />
          </IconButton>}
          <ArrowDropDown />
      </div>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        TransitionComponent={Fade}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <SearchInput fullWidth onChange={inputChangeHandler} placeholder={label} />

        <div className={styles.scrollBlock}>
          {computedOptions?.checkedOptions.map((option) => (
            <div
              onClick={() => rowClickHandler(option.value)}
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
              onClick={() => rowClickHandler(option.value)}
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
