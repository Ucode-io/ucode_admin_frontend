import { useState, useEffect } from "react"
import { Formik } from "formik"
import * as Yup from "yup"

export default function Form({
  initialValues = {},
  onSubmit,
  children,
  formRef,
  initialSchema = {},
}) {
  let schema = initialSchema,
    values = {}

  // **** USE-HOOKS ****
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape({})
  )
  const [_initialValues, setInitialValues] = useState({})
  const [isReadyData, setIsReadyData] = useState(false)
  // const [_children, setChildren] = useState([])

  useEffect(() => {
    // fixDataForForm()
    // console.log(children)
    defineChildrenType(children)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // **** FUNCTIONS ****
  // function fixDataForForm () {
  //   let schema = {}, values = {}
  //   if(Array.isArray(children)) {
  //     for (let el of children) {
  //       if(el.type.name === "FormItem") {
  //         values = {...values, [el.props.name]: null}
  //         if(el.props.rule?.required) {
  //           schema = {...schema, [el.props.name]: Yup.mixed().required(el.props.rule?.message ?? 'Required filed')}
  //         }
  //       }
  //     }
  //   } else if (typeof children === "object") {
  //     schema = {[children.props.name]: Yup.mixed().required(children.props.rule?.message ?? 'Required filed')}
  //     values = {[children.props.name]: null}
  //   }
  //   console.log(values)
  //   setInitialValues({...values, ...initialValues}) // {...values, ...initialValues}
  //   setValidationSchema(Yup.object().shape(schema))
  //   setIsReadyData(true)
  // }

  function defineChildrenType(children) {
    // if(!children) return
    if (Array.isArray(children)) {
      for (let el of children) {
        if (Array.isArray(el)) {
          defineChildrenType(el)
        } else {
          makeInitialValuesAndSchema(el)
        }
      }
    } else if (typeof children === "object") {
      makeInitialValuesAndSchema(children)
    }
    // console.log(schema, values)
    setInitialValues({ ...values, ...initialValues }) // {...values, ...initialValues}
    setValidationSchema(Yup.object().shape(schema))
    setIsReadyData(true)
  }

  function makeInitialValuesAndSchema(el) {
    if (el.type.name === "FormItem") {
      values = { ...values, [el.props.name]: null }
      if (el.props.rule?.required) {
        schema = {
          ...schema,
          [el.props.name]: Yup.mixed().required(
            el.props.rule?.message ?? "Required filed"
          ),
        }
      }
    } else {
      defineChildrenType(el.props.children)
    }
  }

  function setFormikToChildren(children, formik) {
    // debugger
    if (!children) return undefined
    if (Array.isArray(children)) {
      return children.map((el) =>
        Array.isArray(el)
          ? setFormikToChildren(el, formik)
          : setPropsToChild(el, formik)
      )
    } else if (typeof children === "object") {
      return setPropsToChild(children, formik)
    }
    return children
  }

  function setPropsToChild(el, formik) {
    if (el.type.name === "FormItem") {
      // values = {...values, [el.props.name]: null}
      // if(el.props.rule?.required) {
      //   schema = {...schema, [el.props.name]: Yup.mixed().required(el.props.rule?.message ?? 'Required filed')}
      // }
      return {
        ...el,
        props: { ...el.props, formik },
      }
    } else {
      return {
        ...el,
        props: {
          ...el.props,
          children: setFormikToChildren(el.props.children, formik),
        },
      }
    }
  }

  return (
    <>
      {isReadyData ? (
        <Formik
          initialValues={_initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <form ref={formRef} onSubmit={formik.handleSubmit}>
              {/* {children.map(el => el.type.name === "FormItem" 
                ? ({
                  ...el,
                  props: {...el.props, formik}
                }) 
                : el
              )} */}
              {setFormikToChildren(children, formik)}
            </form>
          )}
        </Formik>
      ) : (
        <></>
      )}
    </>
  )
}
