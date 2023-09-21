import React from "react";
import AppErrorMessage from "./AppErrorMessage.jsx";
import { useFormikContext } from "formik";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {Password} from "primereact/password";

const AppFormPasswordField=({name, label, ...otherProps})=> {
  const {touched, errors, values, setFieldValue } =useFormikContext();
  const isFormFieldInvalid = (name) => !!(touched[name] && errors[name]);

  return (
    <>
        <Password
            minLength={6}
            maxLength={16}
            color={'green'}
            inputStyle={{width:'100%'}}
            style={{width:'100%'}}
            required
            name="password"
            id="password"
            placeholder={'Enter Password'}
            toggleMask={true}
        />
    <div className={'col-12 p-3'}>
        <span className="p-float-label">
            <Password id={name} name={name} value={values[name]} onChange={(e) => {setFieldValue(name, e.target.value);}}
                       className={classNames({ 'p-invalid': isFormFieldInvalid(name) })} style={{width:'100%'}} {...otherProps}
                      toggleMask={true}
            />
            <label htmlFor={name}>{label}</label>
        </span>
      <AppErrorMessage message={errors[name]} visible={touched[name]} />
    </div>

    </>
  );
}


export default AppFormPasswordField;
