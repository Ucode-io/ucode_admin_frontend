import HFCheckbox from "../../../../../components/FormElements/HFCheckbox";
import { FieldCheckbox } from "../components/FieldCheckbox/FieldCheckbox";

const DefaultValueBlock = ({
  control,
  watch,
  register,
  setValue,
  columnsList,
}) => {
  const relation = watch();

  if (!relation.table_to || !relation.table_from) return null;
  return (
    <div
      style={{
        padding: 0,
        display: "flex",
        columnGap: "16px",
        marginBottom: "8px",
      }}
    >
      <FieldCheckbox
        control={control}
        watch={watch}
        register={register}
        setValue={setValue}
        required
        label={"Свой ID"}
        name="is_user_id_default"
      />

      <FieldCheckbox
        control={control}
        watch={watch}
        register={register}
        setValue={setValue}
        required
        label={"JWT object ID"}
        name="object_id_from_jwt"
      />
    </div>
  );
};

export default DefaultValueBlock;
