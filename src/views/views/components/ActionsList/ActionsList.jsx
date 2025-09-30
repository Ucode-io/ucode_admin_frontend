import React from "react";
import { useFieldArray } from "react-hook-form";
import cls from "./styles.module.scss";
import TableRow from "./TableRow";

export const ActionsList = ({ control, typeList, slug, setValue }) => {
  const {
    fields: relation,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "attributes.additional_parameters",
    keyName: "key",
  });

  const addNewSummary = () => {
    append({
      key: "row_click_action",
      value: "",
    });
  };
  return (
    <div>
      <div className="">
        {relation?.length > 0 && (
          <div className={cls.actionSettingBlock}>
            {relation?.map((summary, index) => (
              <TableRow key={index} summary={summary} control={control} index={index} update={update} remove={remove} slug={slug} relation={relation} typeList={typeList} setValue={setValue} />
            ))}
          </div>
        )}

        <div className={cls.summaryButton} onClick={addNewSummary}>
          <button type="button">+ Create new</button>
        </div>
      </div>
    </div>
  );
}
