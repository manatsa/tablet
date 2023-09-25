import React, {useEffect, useRef, useState} from 'react';
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import GetFromAPI from "../../api/getFromAPI";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {Button} from "primereact/button";
import * as yup from "yup";
import {useFormik} from "formik";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../../query/doUpdate.js";
import showToast from "../../notifications/showToast.js";
import {getLogin} from "../../auth/check.login.jsx";

const EditPrivilegeDialog = ({openNewPrivilegeDialog,setEditPrivilegeDialogVisible, privilege, token,setPrivilegesData, showSuccessFeedback, showErrorFeedback}) =>{
    const toast=useRef(null);
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const[indicator, setIndicator]=useState(false);
    const {login}=getLogin();

    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    useEffect((e)=>{
        if(!token || isExpired ){
            navigate("/")
        }else {
            if(!logins['privileges']?.includes('ADMIN')){
                showToast(toast,'error','Error 401: Access Denied','You do not have access to this resource!');
                window.history.back();
            }
        }
    },[])

    const {mutate, error,data, isLoading, isError, isSuccess} = useMutation({
        mutationFn:data=>doUpdate('/api/privileges/',token,data?.id,data?.privilege),
        onError: error=>{
            setIndicator(false)
            showErrorFeedback( error);
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            setIndicator(false)
            setPrivilegesData(data)
            showSuccessFeedback();
        }
    });

    const initialValues={
        id:privilege?.id ||'',
        name:privilege?.name||'',
    }

    const validationSchema=yup.object().shape({
        name: yup.string().required("Please enter privilege name."),
    })
    const onSubmit= (values)=>{
        const priv={name:values['name']}
        mutate({id:values['id'], privilege:priv});
        formik.resetForm();
        setEditPrivilegeDialogVisible(false)
    }

    const formik=useFormik({
        initialValues,validationSchema,onSubmit
    })

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };


    return (
        <div>

            <Toast ref={toast} />
            {indicator && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}

            <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2" >
                <div className={'grid flex justify-content-center'}>
                    <div className={'col-12 md:col-10'}>
                        <span className="p-float-label">
                            <InputText id="name" name="name" value={formik.values['name']} onChange={(e) => {formik.setFieldValue('name', e.target.value);}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('name') })} style={{width:'100%'}}
                            />
                            <label htmlFor="name">Privilege Name</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>

                </div>

                <br/>
                <div className={'flex justify-content-around'}>
                    <Button  severity={'danger'} outlined={true} type="button" label="Close" onClick={()=>setEditPrivilegeDialogVisible(false)} />
                    <Button  severity={'warning'} outlined={true} type="button" label="Clear" onClick={()=>formik.resetForm()} />
                    <Button  severity={'success'} outlined={true} type="submit" label="Save" />
                </div>
            </form>
        </div>
    )
}

export  default  EditPrivilegeDialog;