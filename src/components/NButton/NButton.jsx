import clsx from 'clsx'
import cls from './styles.module.scss'

export const NButton = ({ children, className, primary, loading, ...props }) => {

  return <button className={clsx(cls.button, className, { [cls.primary]: primary, [cls.loading]: loading })} {...props}>{children}</button>
}
