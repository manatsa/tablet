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

const EditUserDialog=({openNewUserDialog,setEditUserDialogVisible, selectedUser, token, setUsers, showErrorFeedback, showSuccessFeedback})=>{

    const toast=useRef(null);
    const navigate=useNavigate();
    const {isExpired}=useJwt(token);
    const [indicator, setIndicator] = useState(false)
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
        mutationFn:data=>doUpdate('/api/users/',token,data?.id,data?.user),
        onError: error=>{
            setIndicator(false)
            showErrorFeedback(error);
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            setIndicator(false)
            setUsers(data);
            showSuccessFeedback();
        }
    });

    const rolesData=doFetch('api/roles/',token,['get',selectedUser?.id,'roles']);


    const initialValues={
        id:selectedUser?.id ||'',
        firstName:selectedUser?.firstName||'',
        lastName: selectedUser?.lastName || '',
        userName: selectedUser?.userName || '',
        active: selectedUser?.active || false,
        userLevel: {name:selectedUser?.userLevel, code:selectedUser?.userLevel} || {},
        roles: selectedUser?.roles?.map(role=>role?.name) || null,
        password: ''
    }

    const validationSchema=yup.object().shape({
        id: yup.string().optional(),
        firstName: yup.string().required("Please enter user's first name."),
        lastName: yup.string().required("Please enter user's last name."),
        userName: yup.string().required("Please enter user's username.").min(4,'Minimum length for a username is 4 characters. '),
        active: yup.boolean(),
        userLevel: yup.object().required("Please select user's level."),
        roles: yup.array().min(1,'You must select at least one role for the user!').nonNullable(),
        password: yup.string().optional()
    })
    const onSubmit= (values)=>{
        if(values?.id!==null){
            delete values?.password;
        }
        const roles=values['roles']?.map(r=>typeof r==='string'?r:r?.name)
        const userLevel=values['userLevel']?.name;
        const user={...values, roles,userLevel};
        mutate({id:values['id'],user})
        formik.resetForm();
        setEditUserDialogVisible(false)

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
                            <InputText id="firstName" name="firstName" value={formik.values['firstName']} onChange={(e) => {formik.setFieldValue('firstName', e.target.value);}}
                               className={classNames({ 'p-invalid': isFormFieldInvalid('firstName') })} style={{width:'100%'}}
                            />
                            <label htmlFor="firstName">User First Name</label>
                        </span>
                        {getFormErrorMessage('firstName')}
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <InputText id="lastName" name="lastName" value={formik.values['lastName']} onChange={(e) => {formik.setFieldValue('lastName', e.target.value);}}
                               className={classNames({ 'p-invalid': isFormFieldInvalid('lastName') })} style={{width:'100%'}}
                            />
                            <label htmlFor="lastName">User Last Name</label>
                        </span>
                        {getFormErrorMessage('lastName')}
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <InputText id="userName" name="userName" value={formik.values['userName']} onChange={(e) => {formik.setFieldValue('userName', e.target.value); console.log(e.target.value);}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('userName') })} style={{width:'100%'}}
                            />
                            <label htmlFor="userName">User Username</label>
                        </span>
                        {getFormErrorMessage('userName')}
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <AppAutocomplete name={'userLevel'} items={USERLEVELS} formik={formik} multiple={false} placeholder={'Select User Level'} dropdown={true} />
                            <label htmlFor="userLevel">User Level</label>
                        </span>
                        {getFormErrorMessage('userLevel')}
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <AppAutocomplete name={'roles'} multiple={true} formik={formik} items={rolesData?.data}  placeholder={'Select Roles'} dropdown={true} />
                            <label htmlFor="roles">User Roles</label>
                        </span>
                        {getFormErrorMessage('roles')}
                    </div>
                    {!formik?.values['id'] && <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <Password id="password" name="password" value={formik.values['password']} onChange={(e) => formik.setFieldValue('password', e.target.value)}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('password') })} style={{width:'100%'}} toggleMask={true} inputStyle={{width:'100%'}}
                            />
                            <label htmlFor="password">Initial Password</label>
                        </span>
                        {getFormErrorMessage('password')}
                    </div>}
                    <div className={'col-12 md:col-6'}>
                        <div className="flex align-items-center">
                            <Checkbox inputId="" name="activate" value={formik.values['active']} onChange={e => formik.setFieldValue('active', !e.value) } checked={formik.values['active']} />
                            <label htmlFor="activate" className="ml-2">Activate</label>
                        </div>
                        {getFormErrorMessage('active')}
                    </div>
                </div>

                <br/>
                <div className={'flex justify-content-around'}>
                    <Button  severity={'danger'} outlined={true} type="button" label="Close" onClick={()=>setEditUserDialogVisible(false)} />
                    <Button  severity={'warning'} outlined={true} type="button" label="Clear" onClick={()=>formik.resetForm()} />
                    <Button  severity={'success'} outlined={true} type="submit" label="Save" />
                </div>
            </form>
        </>
    )
}

export default EditUserDialog;