import clsx from 'clsx'
import cls from './styles.module.scss'

export const Field = ({
  placeholder = "",
  register = () => {},
  name = "name",
  rules = {},
  className = "",
  label = "",
  ...props
}) => {

  return <label className={cls.wrapper}>
    {label && <span className={cls.label}>{label}</span>}
    <input
      className={clsx(cls.field, className)}
      {...register(name, {...rules})}
      placeholder={placeholder}
      {...props}
    />
  </label>
}
