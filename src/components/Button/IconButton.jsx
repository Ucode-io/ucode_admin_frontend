// import "./style.scss"
// import { useState } from 'react';
// import VisibilityIcon from '@material-ui/icons/Visibility';

const IconButton = ({
  icon,
  color = "blue",
  className,
  ...props
  // size = 16
}) => {
  return (
    <div className={`inline-block  ${className}`}>
      <div
        className={`
          icon-button
          transition
          focus:outline-none
          focus:ring 
          focus:z-40
          focus:border-${color}-300
          bg-${color}-100`}
        {...props}
      >
        {/* <VisibilityIcon style={{ fontSize: 16, color: 'red' }} /> */}
        <div className={`flex fill-current text-${color}-600`}>
          {{
            ...icon,
            props: {
              ...icon.props,
              style: { ...icon.props.style, fontSize: 20 },
            },
          }}
        </div>
      </div>
    </div>
  )
}

export default IconButton
