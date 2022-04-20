import { Component, useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../Input/index";
import RequiredStar from "../RequiredStar";
import { get } from "lodash";

export default class CustomForm extends Component {
  static Input(props) {
    return <FormInput {...props} />;
  }

  static Item(props) {
    return <FormItem {...props} />;
  }

  static FieldArrayItem(props) {
    return <FieldArrayItem {...props} />;
  }

  render() {
    return <FromWrapper {...this.props} />;
  }
}

const FromWrapper = ({
  initialValues,
  onSubmit,
  layout = "vertical",
  children,
  rules,
}) => {
  const [formRules, setFormRules] = useState(null);

  useEffect(() => {
    let obj = {};
    for (let key in rules) {
      obj[key] = rules[key](Yup);
    }

    setFormRules(obj);
  }, [rules]);

  // const a = {

  //   firstName: Yup.string()
  //     .max(15, 'Must be 15 characters or less')
  //     .required('Required'),

  //   lastName: Yup.string()
  //     .max(20, 'Must be 20 characters or less')
  //     .required('Required'),
  //   email: Yup.string().email('Invalid email address').required('Required'),
  // }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object(formRules ?? {})}
      onSubmit={onSubmit}
    >
      {(formik) => children(formik)}
      {/* {formik => (
        <form onSubmit={formik.handleSubmit}>
          {children(formik)}
        </form>
      )} */}
      {/* <Form>
        {children}
      </Form> */}
    </Formik>
  );
};

const FormInput = ({ type = "text", name = "", label = "", ...args }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Input name={name} type={type} {...args} />
      <ErrorMessage name={name} />
    </div>
  );
};

const FormItem = ({
  name = "",
  label = "",
  children,
  formik,
  required,
  ...args
}) => {


  return (
    <>
      {label && (
        <div className="flex gap-0.5">
          {required && <RequiredStar />}
          <label className="input-label mb-1" htmlFor={name}>
            {label}
          </label>
        </div>
      )}
      {children}
      <div
        className="h-4 w-full order-3"
        style={{ fontSize: "12px", lineHeight: 1.5715, color: "#ff4d4f" }}
      >
        {get(formik.touched, name) && get(formik.errors, name, "")}
      </div>
      {/* {formik.errors[name] && formik.touched[name] ? (
        <div style={{fontSize: '14px', lineHeight: 1.5715, color: '#ff4d4f'}}>{formik.errors[name]}</div>
      ) : <div className="h-6 w-full" />} */}
    </>
  );
};

const FieldArrayItem = ({
  name = "",
  label = "",
  children,
  formik,
  index,
  ...args
}) => {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      {children}
      <div
        className="min-h-6 w-full"
        style={{ fontSize: "14px", lineHeight: 1.5715, color: "#ff4d4f" }}
      >
        {formik.errors[name] &&
        formik.errors[name][index] &&
        formik.touched[name] &&
        formik.touched[name][index]
          ? formik.errors[name][index]
          : ""}
      </div>
    </>
  );
};
