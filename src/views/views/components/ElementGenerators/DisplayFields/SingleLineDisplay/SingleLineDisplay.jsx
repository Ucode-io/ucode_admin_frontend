import cls from "./styles.module.scss"

export const SingleLineDisplay = ({ value, onClick }) => {
  return (
    <div className={cls.singleLineDisplay} onClick={onClick}>
      <span>{value}</span>
    </div>
  );
};