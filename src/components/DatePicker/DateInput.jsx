import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
} from "@material-ui/icons"
import moment from "moment"
import { useEffect, useRef } from "react"
import { useState } from "react"

const DateInput = ({
  setCalendarVisible,
  selectedDate,
  setSelectedDate,
  placeholder,
  className,
  style,
  disabled,
  onChange,
  hideTimeBlock,
}) => {
  const [inputValue, setInputValue] = useState("")
  const [focus, setFocus] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    setInputValue(
      selectedDate?.format(
        hideTimeBlock ? "DD-MM-YYYY" : "DD-MM-YYYY HH:mm:ss"
      ) ?? ""
    )
  }, [selectedDate, hideTimeBlock])

  const clearInput = () => {
    setSelectedDate(null)
    onChange(null)
    setCalendarVisible(false)
  }

  const onInputFocus = () => setFocus(true)

  const onInputBlur = () => setFocus(false)

  const calendarIconClick = () => inputRef.current.focus()

  useEffect(() => {
    if (focus) return setCalendarVisible(true)

    const inputValueMoment = moment(inputValue, "DD-MM-YYYY HH:mm:ss")

    if (inputValueMoment.isValid()) setSelectedDate(inputValueMoment)
    else setInputValue(selectedDate?.format("DD-MM-YYYY HH:mm:ss") ?? "")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus])

  return (
    <div
      style={style}
      className={`border
      bg-white
      flex
      space-x-2
      items-center
      rounded
      text-body
      relative
      w-full
      text-gray-600
      font-smaller
      focus-within:outline-none
      focus-within:ring-1
      transition ease-linear
      hover:border-gray-400 
      p-1 px-2 pl-4 ${className} ${
        disabled ? "cursor-not-allowed opacity-40" : ""
      }`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        ref={inputRef}
        disabled={disabled}
        className={`${disabled ? "cursor-not-allowed" : ""}`}
      />

      <div className="date-input__icons">
        {selectedDate && (
          <CloseIcon
            className="date-input__icons__icon"
            onClick={clearInput}
            style={{ marginRight: "5px" }}
          />
        )}
        <CalendarIcon
          className="date-input__icons__icon"
          onClick={calendarIconClick}
        />
      </div>
    </div>
  )
}

export default DateInput
