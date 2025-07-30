import cls from "./styles.module.scss";

export const FieldChip = ({ value, color }) => {
  return (
    <span className={cls.chip}>
      {value} <span style={{ backgroundColor: color }} />
    </span>
  );
};