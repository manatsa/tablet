import React, {useEffect, useRef, useState} from 'react';
import Button from "@mui/material/Button";
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


export default function Login({showLoginDialog}) {
    const { token, login } = getLogin();
    const toast = useRef(null);
    const [logged, setLogged] = useState(false);
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
        mutationFn: (data) => doUpdate('api/login',token, '',data?.data),
        onMutate: (variables) => {
            return { id: 1 }
        },
        onError: (error, variables, context) => {
            setLoginError(error?.message);
            const loginThreshhold=3;

            if( attempts<(loginThreshhold)) {
                setAttempts(attempts + 1);
                if(attempts===loginThreshhold-1) {
                    lockMutation.mutate({username,data:username})
                }
            }

            console.log('ERROR:: ',mutation.failureReason)

        },
        onSuccess: async (data, variables, context) => {
            const token=data?.token;
            await localStorage.setItem('token',token);
            await localStorage.setItem('login',JSON.stringify(data));
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

            showLoginDialog(false);
        },
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const datas = new FormData(event.currentTarget);

        const login={ username: datas.get("username"),password: datas.get("password")};
        setUsername(datas.get("username"));
        mutation.mutate({ id: 'login'+login['username'], data:login})
    };

    return (
        mutation.isLoading?<Loader isLoading={true} />
            :
            (
            <Container component="main" maxWidth="sm">
            <Toast ref={toast} position={'top-center'}/>

                <Box sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
                     style={{
                         border: `5px solid ${PrimaryColor}`,
                         borderWidth: '5px',
                         borderRadius: '20px',
                         padding:'20px',
                         backgroundColor: "white"
                     }}
                >
                    <Typography component="h1" variant="h3" color={PrimaryColor}>
                        <span><span className="pi pi-sign-in" style={{fontSize: '2rem'}} /> Sign in: {logged}</span>
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <small style={{color:'red'}}>{loginError?`${loginError} : Bad credentials or your account maybe locked!`:null}</small>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Enter username"
                            name="username"
                            autoComplete="username"
                            variant={'standard'}
                            color={'info'}
                            autoFocus
                        />
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
                        /><br/>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="info" />}
                            label="Remember me"
                        />
                        <small style={{color:'orange'}}>{(attempts>0)?attempts===3?attempts+' attempts. Account locked!':attempts+' login attempts.'+(3-attempts)+' attempt left.' :null}</small>
                        <Button
                            type="submit"
                            fullWidth
                            variant={'outlined'}
                            color={'info'}
                            sx={{mt: 3, mb: 2}}
                        >
                            <i className="pi pi-lock-open flex flex-start" />  <span>&nbsp; &nbsp; &nbsp;Login</span>
                        </Button>

                    </Box>
                </Box>
        </Container>
        )
    );
}