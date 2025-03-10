import { ArrowBackIcon } from '@chakra-ui/icons'
import cls from './styles.module.scss'

export const ContentTitle = ({ children, subtitle, withBackBtn, onBackClick = () => {} }) => {

  if(subtitle) {
    return (
      <div className={cls.wrapper}>
        {withBackBtn && <button className={cls.btn} type='button' onClick={onBackClick}><ArrowBackIcon /></button>}
        <h3 className={cls.title}>
          { children }
          <p className={cls.subtitle}>{ subtitle }</p>
        </h3>
      </div>
    )
  }

  return <div className={cls.wrapper}>
    {withBackBtn && <button className={cls.btn} type='button' onClick={onBackClick}><ArrowBackIcon /></button>}
    <h3 className={cls.title}>{ children }</h3>
  </div>
}
