import { useMemo } from "react";
import { useParams } from "react-router-dom";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";
import HFCheckbox from "../../../../../components/FormElements/HFCheckbox";

const DefaultValueBlock = ({ control, watch, columnsList }) => {
  const { slug } = useParams();
  const relation = watch();

  const relatedTableSlug =
    relation?.table_from === slug ? relation?.table_to : relation?.table_from;

  const computedRelation = useMemo(
    () => ({
      id: `${relatedTableSlug ?? ""}#${relation.id ?? ""}`,
      label: relation?.title,
      slug: "default_values",
      attributes: {
        view_fields: relation?.view_fields
          ?.map((fieldId) =>
            columnsList?.find((column) => column.id === fieldId)
          )
          .filter((el) => el),
        default_values: null,
        // field_permission:
      },
      relation_type: relation.type,
    }),
    [relation, relatedTableSlug, columnsList]
  );

  if (!relation.table_to || !relation.table_from) return null;
  return (
    <div style={{ padding: 0 }}>
      <div className={styles.inputPart}>
        <FormElementGenerator
          disabled={false}
          field={computedRelation}
          control={control}
        />
      </div>
      <HFCheckbox
        control={control}
        label={"Свой ID"}
        name="is_user_id_default"
        required
      />

      <HFCheckbox
        control={control}
        label={"JWT object ID"}
        name="object_id_from_jwt"
        required
      />
    </div>
  );
};

export default DefaultValueBlock;
