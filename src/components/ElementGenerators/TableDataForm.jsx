import { Box } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";
import constructorObjectService from "../../services/constructorObjectService";
import CellElementGeneratorForTable from "./CellElementGeneratorForTable";
import CellElementGeneratorForTableView from "./CellElementGeneratorForTableView";
import CellElementGeneratorForRelation from "./CellElementGeneratorForRelation";

const cellBoxStyle = {
  position: "relative",
  minWidth: "150px",
  boxSizing: "border-box",
};

// ponytail: контролы держали строку в одну линию и занимали всю высоту ячейки.
// Текст этого не делает: без nowrap строки становятся выше, а пустое значение
// схлопывает обёртку в 0 px — 334 ячейки из 1080 переставали кликаться.
const displayBoxStyle = {
  ...cellBoxStyle,
  display: "flex",
  alignItems: "center",
  height: "100%",
  minHeight: "24px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

// ponytail: до первого клика ячейка — только текст (тот же read-only рендерер,
// что и в режиме table_editable). Раньше каждая из 56x20=1141 ячейки монтировала
// живой контрол: 800 <input>, 362 MUI OutlinedInput (каждый со своим emotion
// <Global>), 180 MUI Dialog, 1141 useMutation -> 55 000 фиберов и 5188 тегов
// <style>. React рисовал это одним синхронным проходом: коммит на +613 мс,
// следующий только на +32 218 мс. Всё это время главный поток стоял, поэтому
// get-list и layout даже не успевали уйти в сеть.
// Ceiling: стоимость возвращается пропорционально числу прокликанных ячеек.
// Если станет заметно — виртуализация строк в ObjectDataTable.
const TableDataForm = (props) => {
  const { row, field, view } = props;
  const readOnly = Boolean(view?.attributes?.table_editable);
  const [active, setActive] = useState(false);
  const boxRef = useRef(null);
  const clickPoint = useRef(null);

  useEffect(() => {
    if (!active) return;
    const box = boxRef.current;
    if (!box) return;

    // preventScroll — иначе таблица прыгает по горизонтали из-под fixed-колонок
    box
      .querySelector("input:not([type='hidden']), textarea")
      ?.focus({preventScroll: true});

    // ponytail: клик пользователя пришёлся по тексту — контрола тогда ещё не
    // существовало. Повторяем клик в той же точке, уже по смонтированному
    // контролу. Так с первого раза открываются поповеры (react-quill в
    // MULTI_LINE), пикеры дат, карты и дропдауны — вместо частных хаков на
    // каждый тип поля.
    const point = clickPoint.current;
    clickPoint.current = null;
    if (!point) return;

    const target = document.elementFromPoint(point.x, point.y);
    if (!target || !box.contains(target)) return;

    // переключатели не трогаем: повторный клик изменил бы значение
    if (target.closest("input[type='checkbox'], .MuiSwitch-root, .MuiCheckbox-root"))
      return;

    ["mousedown", "mouseup", "click"].forEach((type) =>
      target.dispatchEvent(
        new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: point.x,
          clientY: point.y,
          button: 0,
        })
      )
    );
  }, [active]);

  if (readOnly || !active) {
    return (
      <Box
        ref={boxRef}
        style={displayBoxStyle}
        onClick={
          readOnly
            ? undefined
            : (e) => {
                clickPoint.current = {x: e.clientX, y: e.clientY};
                setActive(true);
              }
        }
      >
        <CellElementGeneratorForTable field={field} row={row} />
      </Box>
    );
  }

  return <TableDataFormEditor {...props} boxRef={boxRef} />;
};

const TableDataFormEditor = ({
  row,
  data,
  index,
  field,
  watch,
  isWrap,
  fields,
  control,
  boxRef,
  tableView,
  tableSlug,
  relOptions,
  isTableView,
  relationfields,
  getValues = () => {},
  setFormValue = () => {},
  newUi,
  relationView,
}) => {
  const { mutate: updateObject } = useMutation(() =>
    constructorObjectService.update(tableSlug, {
      data: { ...getValues(`multi.${index}`) },
    }),
  );

  const isWrapField = useMemo(() => {
    if (!isWrap || !field || !field.id) {
      return null;
    }

    return Object.keys(isWrap)
      .map((key) => {
        return {
          id: key,
          status: isWrap?.[key],
        };
      })
      .find((x) => x?.id === field?.id)?.status;
  }, [isWrap, field?.id]);

  return (
    <Box ref={boxRef} style={cellBoxStyle}>
      {field?.type === "LOOKUP" || field?.type === "LOOKUPS" ? (
        <CellElementGeneratorForRelation
          row={row}
          data={data}
          field={field}
          index={index}
          key={field?.id}
          fields={fields}
          control={control}
          tableView={tableView}
          tableSlug={tableSlug}
          relOptions={relOptions}
          isWrapField={isWrapField}
          isTableView={isTableView}
          updateObject={updateObject}
          setFormValue={setFormValue}
          relationfields={relationfields}
          relationView={relationView}
          newUi={newUi}
        />
      ) : (
        <CellElementGeneratorForTableView
          row={row}
          data={data}
          field={field}
          index={index}
          watch={watch}
          key={`${row.guid || row.id}_${field.id}`}
          fields={fields}
          control={control}
          getValues={getValues}
          tableView={tableView}
          tableSlug={tableSlug}
          relOptions={relOptions}
          isTableView={isTableView}
          isWrapField={isWrapField}
          updateObject={updateObject}
          setFormValue={setFormValue}
          relationfields={relationfields}
          newUi={newUi}
        />
      )}
    </Box>
  );
};

export default TableDataForm;
