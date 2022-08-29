import { format, setHours, setMinutes } from "date-fns"
import { useEffect, useRef, useState } from "react"
import styles from "./style.module.scss"
import Moveable from "react-moveable"
import constructorObjectService from "../../../services/constructorObjectService"
import { useParams } from "react-router-dom"
import "./moveable.scss"
import useTimeList from "../../../hooks/useTimeList"
import InfoBlock from "./InfoBlock"
import { Menu } from "@mui/material"
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel"
import IconGenerator from "../../../components/IconPicker/IconGenerator"
import CalendarStatusSelect from "../components/CalendarStatusSelect"

const DataCard = ({
  date,
  view,
  fieldsMap,
  data,
  viewFields,
  navigateToEditPage,
}) => {
  const [info, setInfo] = useState(data)
  const [anchorEl, setAnchorEl] = useState(null)
  const ref = useRef()
  const [target, setTarget] = useState()
  const { tableSlug } = useParams()
  const { timeList } = useTimeList(view.time_interval)
  const [isSingleLine, setIsSingleLine] = useState(info.calendar?.height <= 40)

  const [frame, setFrame] = useState({
    translate: [0, info.calendar?.startPosition ?? 0],
  })

  useEffect(() => {
    if (!ref?.current) return null
    setTarget(ref.current)
  }, [ref])

  const onPositionChange = (position, height) => {
    if (!position || position.translate[1] < 0) return null


    const beginIndex = Math.floor((position.translate[1] + 2) / 40)
    const endIndex = Math.ceil((position.translate[1] + height) / 40)
    
    // debugger

    const startTime = computeTime(beginIndex)
    const endTime = computeTime(endIndex)


    const computedData = {
      ...info,
      [view.calendar_from_slug]: startTime,
      [view.calendar_to_slug]: endTime,
    }

    constructorObjectService.update(tableSlug, {
      data: computedData,
    }).then(res => setInfo(computedData))
  }

  const computeTime = (index) => {
    const computedTime = timeList[index]


    const hour = Number(format(computedTime, "H"))
    const minute = Number(format(computedTime, "m"))

    return setMinutes(setHours(date, hour), minute)
  }

  // ---------DRAG ACTIONS------------

  const onDragStart = (e) => {
    e.set([0, frame.translate[1] > 0 ? frame.translate[1] : 0])
  }

  const onDrag = ({ target, beforeTranslate }) => {
    console.log(beforeTranslate)
    if (beforeTranslate[1] < 0) return null
    target.style.transform = `translateY(${beforeTranslate[1]}px)`
  }

  const onDragEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.beforeTranslate
      onPositionChange(lastEvent, lastEvent.height)
    }
  }

  // ----------RESIZE ACTIONS----------------------

  const onResizeStart = (e) => {
    e.setOrigin(["%", "%"])
    e.dragStart && e.dragStart.set(frame.translate)
    ref.current.classList.add(styles.resizing)
  }

  const onResize = ({ target, height, drag }) => {
    const beforeTranslate = drag.beforeTranslate
    if (beforeTranslate[1] < 0) return null
    target.style.height = `${height}px`
    target.style.transform = `translateY(${beforeTranslate[1]}px)`
    if (height <= 40) setIsSingleLine(true)
    else setIsSingleLine(false)
  }

  const onResizeEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.drag.beforeTranslate
      onPositionChange(lastEvent.drag, lastEvent.height)
      ref.current.classList.remove(styles.resizing)
    }
  }

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  
  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <div
        key={data.guid}
        className={styles.infoBlockWrapper}
        style={{
          top: 0,
          transform: `translateY(${info.calendar?.startPosition}px)`,
          height: info.calendar?.height,
        }}
        onClick={openMenu}
        ref={ref}
      >
        <div className={styles.infoCard} style={{ height: "100%" }}>
          <InfoBlock
            viewFields={viewFields}
            data={info}
            isSingleLine={isSingleLine}
          />
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <div className={styles.popupHeader} >
          <p className={styles.time}>
            {info.calendar?.elementFromTime ? format(info.calendar?.elementFromTime, "HH:mm") : ''} -
            {info.calendar?.elementToTime ? format(info.calendar?.elementToTime, " HH:mm") : ''}
          </p>

          <IconGenerator onClick={() => navigateToEditPage(info)} className={styles.linkIcon} icon="arrow-up-right-from-square.svg" size={16} />

        </div>
        {viewFields?.map((field) => (
          <div>
            <b>{field.label}: </b>
            {field.type === "LOOKUP"
              ? getRelationFieldTableCellLabel(field, info, field.table_slug)
              : info[field.slug]}
          </div>
        ))}

        <CalendarStatusSelect view={view} fieldsMap={fieldsMap} info={info} setInfo={setInfo} />
      </Menu>

      <Moveable
        target={target}
        // container={container}
        draggable
        resizable
        throttleDrag={40}
        throttleResize={40}
        keepRatio={false}
        origin={false}
        renderDirections={["s", "n"]}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      />
    </>
  )
}

export default DataCard
