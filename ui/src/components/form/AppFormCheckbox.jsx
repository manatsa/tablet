import React from "react";
import AppErrorMessage from "./AppErrorMessage.jsx";
import { useFormikContext } from "formik";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {RadioButton} from "primereact/radiobutton";
import {Checkbox} from "primereact/checkbox";

const AppFormCheckbox=({name, label,item, ...otherProps})=> {
  const {touched, errors, values, setFieldValue } =useFormikContext();

  return (
    <>
    <div className={'col-12 p-3'}>
        <span className="">

            <label className={'sm:col-12 md:col-3'} htmlFor={name}>{label}</label>
            <div className="card flex justify-content-center sm:col-12 md:col-9">
                <div className={`flex  gap-3`}>
                    <div  className="flex align-items-center">
                        <Checkbox inputId={name} name={name} value={values[name]} onChange={e=>setFieldValue(name, !values[name])} checked={values[name]} />
                        <label htmlFor={name} className="ml-2">{label}</label>
                    </div>


                </div>
        </div>
        </span>
      <AppErrorMessage message={errors[name]} visible={touched[name]} />
    </div>

    </>
  );
}


export default AppFormCheckbox;
