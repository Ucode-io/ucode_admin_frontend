import cls from "./styles.module.scss";
import Moveable from "react-moveable";
import { useMoveableTaskProps } from "./useMoveableTaskProps"

export const MoveableTask = ({ task, rowIndex, months, dayWidth }) => {

  const {
    ref,
    frame,
    setFrame,
    taskRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useMoveableTaskProps({dayWidth, months, task, rowIndex});

  return <>
      {
        (task?.start_date && task?.end_date) ? <>
          <div
            className={cls.moveableTask}
            ref={taskRef}
            style={{
              transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`,
              width: `${frame.width}px`,
              height: "32px",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {task.title}
            <div
              className={cls.resizeHandle}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "10px",
                height: "100%",
                cursor: "ew-resize",
              }}
            ></div>
          </div>
        </>
        : task?.data?.map(
          (option, subIndex) =>
            option?.data &&
          option?.data?.map((optionItem, optionIdex) => {
            return  <MoveableTask 
            dayWidth={60}
            months={months}
            rowIndex={rowIndex}
            task={optionItem}
            />
          })
        )
      }
  </>
}
{/* <Moveable
  className="moveable1"
  target={ref.current}
  draggable
  resizable
  keepRatio={false}
  renderDirections={["w", "e"]}
  edge={false}
  throttleDrag={dayWidth}
  throttleResize={dayWidth}
  onDrag={({ beforeTranslate }) => {
    setFrame((f) => ({
      ...f,
      translate: [beforeTranslate[0], f.translate[1]], // фиксируем Y
    }));
  }}            
  onResize={({ width, drag }) => {
    setFrame({
      translate: drag.beforeTranslate,
      width,
    });
  }}
  // тут можно вызывать setTaskDate(...) при отпускании
/> */}
