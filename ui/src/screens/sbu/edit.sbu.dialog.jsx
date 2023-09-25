import React, {useEffect, useRef, useState} from 'react';
import * as yup from 'yup';
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import { classNames } from 'primereact/utils';
import {Checkbox} from "primereact/checkbox";
import {useNavigate} from "react-router-dom";
import {ProgressSpinner} from "primereact/progressspinner";
import {useMutation} from "@tanstack/react-query";
import {doFetch} from "../../query/doFetch.js";
import doUpdate from "../../query/doUpdate.js";
import AppAutocomplete from "../../components/AppAutocomplete.jsx";
import {getLogin} from "../../auth/check.login.jsx";
import showToast from "../../notifications/showToast.js";
import {useJwt} from "react-jwt";
import {USERLEVELS} from "../../components/Constants.jsx";
import {Password} from "primereact/password";
import {InputTextarea} from "primereact/inputtextarea";

const EditSbuDialog=({setEditSbuDialogVisible, selectedSbu, token, setSbus, showErrorFeedback, showSuccessFeedback})=>{

    const toast=useRef(null);
    const navigate=useNavigate();
    const {isExpired}=useJwt(token);
    const [indicator, setIndicator] = useState(false)
    const {login}=getLogin();

    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    useEffect((e)=>{
        if(!token || isExpired ){
            navigate("/")
        }
    },[])

    const {mutate, error,data, isLoading, isError, isSuccess} = useMutation({
        mutationFn:data=>doUpdate('/api/sbu/',token,data?.id,data?.sbu),
        onError: error=>{
            setIndicator(false)
            showErrorFeedback(error);
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            console.log("SBUS::", data)
            setIndicator(false)
            setSbus(data);
            showSuccessFeedback();
        }
    });

    const initialValues={
        id:selectedSbu?.id ||'',
        name:selectedSbu?.name||'',
        description: selectedSbu?.description || '',
        code: selectedSbu?.code || '',
    }

    const validationSchema=yup.object().shape({
        id: yup.string().optional(),
        name: yup.string().required("Please enter sbu's name."),
        description: yup.string().required("Please enter sbu's description."),
        code: yup.string().required("Please enter sbu's code.").min(2,'Minimum length for a code is 2 characters. '),
    })

    const onSubmit= (values)=>{
        mutate({id:values['id'],sbu:values})
        formik.resetForm();
        setEditSbuDialogVisible(false)

    }


    const formik=useFormik({
        initialValues,validationSchema,onSubmit
    })

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };


    return (
        <>
            <Toast ref={toast} />
            {indicator && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}
            <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2" >
                <div className={'grid'}>
                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <InputText id="code" name="code" value={formik.values['code']} onChange={(e) => {formik.setFieldValue('code', e.target.value);}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('code') })} style={{width:'100%'}}
                            />
                            <label htmlFor="code">Sbu Code</label>
                        </span>
                        {getFormErrorMessage('code')}
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <InputText id="name" name="name" value={formik.values['name']} onChange={(e) => {formik.setFieldValue('name', e.target.value);}}
                               className={classNames({ 'p-invalid': isFormFieldInvalid('name') })} style={{width:'100%'}}
                            />
                            <label htmlFor="name">Sbu Name</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>
                </div>

                <div className="col-12">
                    <div className={'col-12'}>
                        <span className="p-float-label">
                            <InputTextarea id="description" name="description" value={formik.values['description']} onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                           className={classNames({ 'p-invalid': isFormFieldInvalid('description') })} style={{width:'100%'}}
                            />
                            <label htmlFor="description">Sbu Description</label>
                        </span>
                        {getFormErrorMessage('description')}
                    </div>
                </div>

                <br/>
                <div className={'flex justify-content-around'}>
                    <Button  severity={'danger'} outlined={true} type="button" label="Close" onClick={()=>setEditSbuDialogVisible(false)} />
                    <Button  severity={'warning'} outlined={true} type="button" label="Clear" onClick={()=>formik.resetForm()} />
                    <Button  severity={'success'} outlined={true} type="submit" label="Save" />
                </div>
            </form>
        </>
    )
}

export default EditSbuDialog;