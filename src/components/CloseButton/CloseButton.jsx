import cls from './styles.module.scss'

export const CloseButton = ({ onClick }) => {
  return <button className={cls.closeBtn} onClick={onClick}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    fill="none"
  >
    <path
      stroke="#8F8E8B"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="m8.75 1.25-7.5 7.5m0-7.5 7.5 7.5"
    />
  </svg>
</button>
}