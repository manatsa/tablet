import React, {useEffect, useRef, useState} from 'react';
// import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Toast } from 'primereact/toast';
import showToast from "../notifications/showToast";
import {createSearchParams, useNavigate} from 'react-router-dom';
import {Password} from "primereact/password";
import {getLogin} from "../auth/check.login";
import {useMutation} from "@tanstack/react-query";
import Loader from "../query/Loader/Loader.jsx";
import doUpdate from "../query/doUpdate.js";
import {PrimaryColor} from "../components/Constants.jsx";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {InputTextarea} from "primereact/inputtextarea";
import * as yup from "yup";
import {useFormik} from "formik";
import {Button} from "primereact/button";


export default function Login({showLoginDialog}) {
    const { token, login } = getLogin();
    const toast = useRef(null);
    const [logged, setLogged] = useState(false);
    const [locked, setLocked] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [username, setUsername] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const navigate= useNavigate();

    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    useEffect(()=>{
        if(token && logins){
            navigate("/home")
        }
    },[])

    const lockMutation =  useMutation({
        mutationFn: (data) => doUpdate('api/users/lock-account/', token, data?.username, data?.data),
    })
    const mutation =  useMutation({
        mutationFn: (data) => doUpdate('api/signin',token, '',data?.data),
        onMutate: (variables) => {
            return { id: 1 }
        },
        onError: (error, variables, context) => {
            setLoginError(error?.message);
            console.log(error)
            const loginThreshhold=3;

            if( attempts<(loginThreshhold)) {
                setAttempts(attempts + 1);
                if(attempts===loginThreshhold-1) {
                    lockMutation.mutate({username,data:username})
                }
            }
            console.log('ERROR2:: ',error)

        },
        onSuccess: async (data, variables, context) => {
            console.log(data)
            const token=data?.token;
            await localStorage.setItem('token',token);
            await localStorage.setItem('login',JSON.stringify(data));
            showLoginDialog(false);
            navigate({
                path:"/",
                search: createSearchParams({
                    user: data?.userName
                }).toString()
            })
        },
        onSettled: (data, error, variables, context) => {
            if(mutation.isError){
                showToast(toast,'error','Login Error',mutation?.error?.message);
            }

            // showLoginDialog(false);
        },
    })

    const onSubmit = (values) => {
        setUsername(values["username"]);
        mutation.mutate({id: 'login' + values['username'], data: values})
    };
    const initialValues={
        username:'',
        password:''
    }

    const validationSchema=yup.object().shape({
        username: yup.string().required("Please enter username.").min(3,"Your username is awkwardly small!"),
        password: yup.string().required("Please enter password.").min(3,"Your password is awkwardly small!"),
    })



    const formik=useFormik({
        initialValues,validationSchema, onSubmit
    })

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };


    return (
        mutation.isLoading?<Loader isLoading={true} />
            :
            (
                <div className="flex flex-column">
                    <Toast ref={toast} position={'top-center'}/>

                    <div>
                        <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2" style={{border: `5px solid ${PrimaryColor}`}} >
                            <Typography component="h1" variant="h3" color={PrimaryColor} className={'p-3'}>
                                <span><span className="pi pi-sign-in" style={{fontSize: '2rem'}} /> Sign in: {logged}</span>
                            </Typography>
                            <div className="col-12">
                                <small style={{color:'red'}}>{loginError?loginError:''} </small> <small style={{color:'red'}}>{loginError?' - Bad credentials or your account maybe locked!':null}</small>
                            </div>
                            <div className={'grid pl-2 pr-2'}>
                                <div className={'col-12'}>
                                    <span className="p-float-label">
                                        <InputText id="username" name="username" value={formik.values['username']} onChange={(e) => {formik.setFieldValue('username', e.target.value);}}
                                                   className={classNames({'slick-field': true},{ 'p-invalid': isFormFieldInvalid('username') })} style={{width:'100%'}} autoFocus={true}
                                        />
                                        <label htmlFor="username">Username</label>
                                    </span>
                                    {getFormErrorMessage('username')}
                                </div>

                                <div className={'col-12'}>
                                    <span className="p-float-label">
                                        <Password id="password" name="password" value={formik.values['password']} onChange={(e) => {formik.setFieldValue('password', e.target.value);}}
                                                   className={classNames({ 'p-invalid': isFormFieldInvalid('password') })} style={{width:'100%'}} toggleMask={true} width={'100%'} inputStyle={{width:'100%'}}
                                        />
                                        <label htmlFor="password">Password</label>
                                    </span>
                                    {getFormErrorMessage('password')}
                                </div>
                            </div>

                            {/*<div className="col-12">
                                <div className={'col-12'}>
                                <span className="p-float-label">
                                    <InputTextarea id="description" name="description" value={formik.values['description']} onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                                   className={classNames({ 'p-invalid': isFormFieldInvalid('description') })} style={{width:'100%'}}
                                    />
                                    <label htmlFor="description">Sbu Description</label>
                                </span>
                                    {getFormErrorMessage('description')}
                                </div>
                            </div>*/}
                            <div className="col-12">
                                <small style={{color:'orange'}}>{(attempts>0)?attempts===3?attempts+' attempts. Account locked!':attempts+' login attempts. '+(3-attempts)+' attempt left.' :null}</small>
                            </div>
                            <div className={'flex justify-content-around p-2'}>
                                <Button  severity={'warning'} outlined={true} type="button" label="Clear" onClick={()=>formik.resetForm()} />
                                <Button  severity={'success'} outlined={true} type="submit" label="Login" />
                            </div>
                        </form>
                    </div>
                </div>
        )
    );
}