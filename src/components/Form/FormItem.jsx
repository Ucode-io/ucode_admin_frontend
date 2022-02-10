// import { useEffect, useState } from "react"

export default function FormItem ({ children, formik, name, rule }) {
  // const [_children, setChildren] = useState(undefined)

  // useEffect(() => {
  //   if(Array.isArray(children)) {
  //     setChildren(setChildrenProps(children[0]))
  //   } else if (typeof children === "object") {
  //     setChildren(setChildrenProps(children))
  //   }
  // }, [])

  const onTextInputChange = (e, item) => {
    if(item.props.onChange) item.props.onChange(e)
    formik.setFieldValue(name, item.props.value ?? e.target.value)
  }

  const onItemChange = (val, item) => {
    if(item.props.onChange) item.props.onChange(val)
    formik.setFieldValue(name, item.props.value ?? val)
  }

  const onSwitchChange = (val, item) => {
    if(item.props.onChange) item.props.onChange(val)
    formik.setFieldValue(name, item.props.checked ?? val)
  }

  function setChildrenProps (item) {
    switch (item.type.name) {
      case "Input":
      case "TextArea":
        return {
          ...item,
          props: {
            ...item.props,
            error: formik.errors[name] && formik.touched[name],
            value: item.props.value ?? formik.values[name],
            onChange: val => onTextInputChange(val, item),
            // ...formik.getFieldProps(name)
          }
        }
      case "Switch":
        return {
          ...item,
          props: {
            ...item.props,
            checked: item.props.checked ?? formik.values[name],
            onChange: val => onSwitchChange(val, item)
          }
        }
      default:
        return {
          ...item,
          props: {
            ...item.props,
            error: formik.errors[name] && formik.touched[name],
            value: item.props.value ?? formik.values[name],
            onChange: val => onItemChange(val, item)
          }
        }
    }
  }

  return (
    <div>
      {setChildrenProps(Array.isArray(children) ? children[0] : children)}
      {/* {console.log(formik)} */}
      <div className="min-h-6 w-full" style={{fontSize: '14px', lineHeight: 1.5715, color: '#ff4d4f'}}>
        {formik.errors[name] && formik.touched[name] ? formik.errors[name] : ''}
      </div>
    </div>
  )
}
