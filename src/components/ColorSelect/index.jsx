import { useState } from "react"
import "./style.scss"
import OutsideClickHandler from "react-outside-click-handler"
import { useEffect } from "react"

const ColorSelect = ({
  onChange = () => {},
  colorsList = ["#000", "#123125", "#421342"],
  value
}) => {
  const [popupVisible, setPopupVisible] = useState(true)
  const [selectedColor, setSelectedColor] = useState(value ?? "#fff")

  const switchPopupVisible = () => setPopupVisible((prev) => !prev)

  useEffect(()=>{
    onChange(selectedColor)
    setPopupVisible(false)
  }, [selectedColor])

  return (
    <OutsideClickHandler onOutsideClick={() => setPopupVisible(false)}>
      <div className="ColorSelect">
        <div className="select-block" onClick={switchPopupVisible}>
          <div
            className="round"
            style={{ backgroundColor: value ?? selectedColor }}
          ></div>
          <p className="label">Выберите цвет</p>
        </div>

        {popupVisible && (
          <div className="popup">
            {colorsList.map((color, index) => (
              <div className="round" key={index} style={{ backgroundColor: color }} onClick={()=>setSelectedColor(color)} />
            ))}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  )
}

export default ColorSelect
