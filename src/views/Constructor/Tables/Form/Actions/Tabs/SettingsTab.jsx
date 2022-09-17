import { useFieldArray, useForm } from "react-hook-form";
import { Add } from "@mui/icons-material";
import cls from "../styles.module.scss";
import SecondaryButton from "../../../../../../components/Buttons/SecondaryButton";
import PrimaryButton from "../../../../../../components/Buttons/PrimaryButton";
import SettingsFormRow from "./SettingsFormRow";
import HFSelect from "../../../../../../components/FormElements/HFSelect";
import { useMutation, useQuery } from "react-query";
import eventsService from "../../../../../../services/eventsService";
import { useParams } from "react-router-dom";
import constructorTableService from "../../../../../../services/constructorTableService";

const SettingsTab = () => {
  const { slug: table_slug } = useParams();

  const emptyFields = {
    left_field: "",
    right_field: "",
    comparison_symbol: "",
    right_field_type: "",
  };

  const { control, handleSubmit } = useForm({
    defaultValues: {
      action: "",
      condition: [
        {
          group: [emptyFields],
        },
      ],
      after: [
        {
          group: [emptyFields],
        },
      ],
    },
  });

  const { data: tables } = useQuery(
    ["GET_TABLE_LIST"],
    () => constructorTableService.getList(),
    {
      select: (data) => {
        return data?.tables?.map((i) => ({
          label: i.label,
          value: i.slug,
        }));
      },
    }
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "condition",
  });

  const {
    fields: fieldsAfter,
    append: appendAfter,
    remove: removeAfter,
  } = useFieldArray({
    control,
    name: "after",
  });

  const { mutate: createHandler } = useMutation((data) =>
    eventsService.create(
      {
        does: data.after.map((i) => ({
          fields: i.group.map((j) => ({
            ...j,
            left_field: "current." + j.left_field,
            right_field: "previous." + j.right_field,
          })),
          opperation_type: i.action,
          table_slug: i.table,
        })),
        table_slug,
        when: {
          action: data.action,
          app_slug: "",
          conditions: data.condition.map((i) => ({
            match_fields: i.group.map((j) => ({
              ...j,
              left_field: "current." + j.left_field,
              right_field: "previous." + j.right_field,
            })),
          })),
        },
      },
      {
        onSuccess: () => console.log("EVENT CREATING WORKED!!!"),
      }
    )
  );

  return (
    <div className={cls.modal_main}>
      <form onSubmit={handleSubmit(createHandler)}>
        <div className={cls.main_box}>
          <div className={cls.left}>
            <div className={cls.slug}>
              <span>Когда </span>
              <span>Клиника/Запись</span>
            </div>
            <div className={cls.action}>
              <HFSelect
                control={control}
                options={[
                  { label: "Создан", value: "create" },
                  { label: "Изменен", value: "update" },
                  { label: "Удален", value: "delete" },
                ]}
                name="action"
                style={{ width: "50%" }}
                placeholder="Действие"
              />
              <div className={cls.terms}>
                <span>Условия</span>
                {fields.map((outerField, index) => (
                  <div key={outerField.id}>
                    <SettingsFormRow
                      nestedFieldName="condition"
                      nestedIndex={index}
                      control={control}
                      removeField={remove}
                    />
                    {fields.length > 0 && outerField.group.length > 0 && (
                      <div className={cls.splitter}>
                        <div></div>
                        <div>OR</div>
                        <div></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={cls.add_condition_btn}>
                <SecondaryButton
                  type="button"
                  style={{ width: "100%" }}
                  onClick={() =>
                    append({
                      group: [
                        {
                          left_field: "",
                          right_field: "",
                          comparison_symbol: "",
                          right_field_type: "",
                        },
                      ],
                    })
                  }
                >
                  <Add />
                  Добавить условия
                </SecondaryButton>
              </div>
            </div>
          </div>
          <div className={cls.right}>
            <div className={cls.after}>После</div>
            {fieldsAfter.map((field, index) => (
              <div key={field.id} className={cls.after_item}>
                <div style={{ display: "flex", marginBottom: 8, gap: 8 }}>
                  <HFSelect
                    control={control}
                    options={[
                      { label: "Объект создан", value: "create" },
                      { label: "Объект изменен", value: "update" },
                      { label: "Объект удален", value: "delete" },
                    ]}
                    name={`after.${index}.action`}
                    placeholder="Действие"
                  />
                  <HFSelect
                    control={control}
                    options={tables}
                    name={`after.${index}.table`}
                    placeholder="Действие"
                  />
                </div>
                <SettingsFormRow
                  nestedFieldName="after"
                  nestedIndex={index}
                  control={control}
                  removeField={removeAfter}
                />
              </div>
            ))}
            <SecondaryButton
              type="button"
              style={{ width: "100%" }}
              onClick={() =>
                appendAfter({
                  group: [emptyFields],
                })
              }
            >
              <Add />
              Добавить
            </SecondaryButton>
          </div>
        </div>
        <div className={cls.save_btn}>
          <PrimaryButton type="submit">Сохранить</PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default SettingsTab;
