import './index.css'
import RcSwitch from 'rc-switch'

export default function Switch({ style, ...props }) {

  return (
    <RcSwitch style={{outline: 'none', ...style}} {...props} />
  )
}
