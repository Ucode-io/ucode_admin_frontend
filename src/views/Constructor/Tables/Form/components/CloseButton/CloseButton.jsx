import cls from './styles.module.scss'

export const CloseButton = ({ onClick }) => {
  
  return (
    <button className={cls.closeButton} onClick={onClick} type="button">
      <span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.75 1.25L1.25 8.75M1.25 1.25L8.75 8.75" stroke="#8F8E8B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </button>
  )
}
