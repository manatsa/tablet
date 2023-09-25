import React, {useEffect, useRef, useState} from "react";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Button, Icon} from "@mui/material";
import {Sidebar} from "primereact/sidebar";
import {useNavigate} from "react-router-dom";
import {useJwt} from "react-jwt";
import showToast from "../notifications/showToast.js";
import {Toast} from "primereact/toast";
import {Menu} from "primereact/menu";
import ProfileDialog from "../screens/admin/profile.dialog.jsx";
import ChangePasswordDialog from "../screens/admin/change.password.dialog.jsx";
import UserMenu from "./userMenu";
import {PanelMenu} from "primereact/panelmenu";
import './app.menu.css'
import {getLogin} from "../auth/check.login";
import {AppName, PrimaryColor, SecondaryColor} from "../components/Constants.jsx";
import Logo from "../assets/zimnat-logo.png";
import Pcm from "../assets/pcm.jpg";
import {Dialog} from "primereact/dialog";
import MyOrders from "../screens/admin/my.orders.jsx";






export default function AppMenu() {

    const [open, setOpen] = React.useState(false);
    const navigate=useNavigate();
    const {token, login} = getLogin();
    const {isExpired} = useJwt(token);
    const toast = useRef(null);
    const userMenu = useRef(null);
    const [logged, setLogged] = useState(false);

    useEffect(()=>{
        setLogged(true)
    },[AppName,login])

    const [profileVisible, setProfileVisible]= useState(false);
    const [subVisible, setSubVisible]= useState(false);
    const [changePasswordVisible, setChangePasswordVisible]= useState(false);
    const [showOrdersToMe, setShowOrdersToMe] = useState(false);

    const userMenuItems =
        [
        {
            label: 'User Operations',
            items: [
                {
                    label: 'Profile',
                    icon: 'pi pi-users',
                    command: () => {
                        if(token && !isExpired){
                            setProfileVisible(true)
                        }else{
                            showToast(toast, 'error', 'Error 401: Access Denied','You need to log in to see profile details!')
                        }
                    }
                },
                {
                    label: 'Change Password',
                    icon: 'pi pi-sync',
                    command: () => {
                        if(token && !isExpired){
                            setChangePasswordVisible(true);
                        }else{
                            showToast(toast, 'error', 'Error 401: Access Denied','You need to log in to see profile details!')
                        }
                    }
                }
            ]
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command:()=>{
                localStorage.setItem('token', null);
                localStorage.setItem('login', null);
                setOpen(false);
                navigate("/?search=true")
            }
        }
    ];

    const items =
        [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            expanded:false,
            command:()=> {
                if(token && !isExpired){
                    setOpen(false)
                    navigate("/home")

                }else{
                    showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                    navigate("/")
                }
            }
        },

        //    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Category ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        {
            label: 'SBU Admin',
            icon: 'pi pi-fw pi-folder-open',
            // expanded: login && login!=='undefined' &&  JSON.parse(login||{})?.roles?.includes('UNDERWRITING'),
            items: [
                {
                    label: 'SBU Admin',
                    icon: 'pi pi-sitemap',
                    command: ()=>{
                        if(token && !isExpired && login && login!=='undefined' && JSON.parse(login)?.roles?.includes('ADMIN')){
                            setOpen(false)
                            navigate("/sbu")
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                            navigate("/")
                        }
                    }
                },
                {
                    label: 'Branch Admin',
                    icon: 'pi pi-sitemap',
                    command: ()=>{
                        if(token && !isExpired && login && login!=='undefined' && JSON.parse(login)?.roles?.includes('ADMIN')){
                            setOpen(false)
                            navigate("/category")
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
                {
                    label: 'Department Admin',
                    icon: 'pi pi-sitemap',
                    command: ()=>{
                        if(token && !isExpired && login && login!=='undefined' && JSON.parse(login)?.roles?.includes('ADMIN')){
                            setOpen(false)
                            navigate("/category")
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                }
            ]
        },

        //    ***************************************************** Staff **********************************************
        {
                label: 'Asset Admin',
                icon: 'pi pi-fw pi-book',
                // expanded: login && login!=='undefined' && JSON.parse(login || {})?.roles?.includes('FINANCE'),
                items: [
                    {
                        label: 'Asset Admin',
                        icon: 'pi pi-fw pi-book',
                        command: ()=>{
                            if(token && !isExpired){
                                setOpen(false)
                                navigate("/");
                                setOpen(false);
                            }else{
                                showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                setOpen(false);
                            }
                        }
                    },

                    {
                        label: 'Allocations Admin',
                        icon: 'pi pi-fw pi-microsoft',
                        command: ()=>{
                            if(token && !isExpired){
                                setOpen(false)
                                navigate("/orders");
                                setOpen(false);
                            }else{
                                showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                setOpen(false);
                            }
                        }
                    }
                ]
            },

        //    ***************************************************** Staff **********************************************
        {
            label: 'Staff Admin',
            icon: 'pi pi-fw pi-users',
            // expanded: login && login!=='undefined' && JSON.parse(login || {})?.roles?.includes('FINANCE'),
            items: [
                {
                    label: 'Staff Admin',
                    icon: 'pi pi-fw pi-user',
                    command: ()=>{
                        if(token && !isExpired){
                            setOpen(false)
                            navigate("/");
                            setOpen(false);
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                            setOpen(false);
                        }
                    }
                },


            ]
        },

 //++++++++++++++++++++++++++++++++++++++++++++++++++ System ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 // token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN') &&
         {
                label: 'System Admin',
                icon: 'pi pi-fw pi-slack',
                // expanded: login && login!=='undefined' &&  JSON.parse(login || {})?.roles?.includes('ADMIN'),
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-users',
                        command: ()=>{
                            if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                                setOpen(false)
                                navigate("/users");
                                setOpen(false);
                            }else{
                                showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                            }
                        }
                    },
                    {
                        label: 'Roles',
                        icon: 'pi pi-fw pi-lock-open',
                        command: ()=>{
                            if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                                setOpen(false)
                                navigate("/roles");
                                setOpen(false);
                            }else{
                                showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                            }
                        }
                    },
                    {
                        label: 'Privileges',
                        icon: 'pi pi-fw pi-wrench',
                        command: ()=>{
                            if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                                setOpen(false)
                                navigate("/privileges");
                                setOpen(false);
                            }else{
                                showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                            }
                        }
                    },
                    {
                        label: 'Settings',
                        icon: 'pi pi-fw pi-cog',
                        command: ()=>{
                            if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')
                                //&& JSON.parse(login)?.userName?.toLowerCase()==='super'
                            ){
                                setOpen(false)
                                navigate("/settings");
                                setOpen(false);
                            }else{
                                showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                            }
                        }
                    },
                ]
            },

         {
                label: 'Reports Admin',
                icon: 'pi pi-chart-bar',
                // expanded: login && login!=='undefined' &&  JSON.parse(login || {})?.roles?.includes('ADMIN'),
                items: [
                    // all SBU reports
                    {
                        label: 'SBU Reports',
                        icon: 'pi pi-home',
                        items: [
                            {
                                label:'SBUs Report',
                                icon: 'pi pi-building',
                                command: ()=>{
                                    if(token && !isExpired){
                                        setOpen(false)
                                        navigate("/subscriptions")
                                        setOpen(false);
                                    }else{
                                        showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    }
                                }
                            },
                            {
                                label:'Branches Report',
                                icon: 'pi pi-building',
                                command: ()=>{
                                    if(token && !isExpired){
                                        setOpen(false)
                                        navigate("/subscriptions")
                                        setOpen(false);
                                    }else{
                                        showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    }
                                }
                            },
                            {
                                label:'Departments Report',
                                icon: 'pi pi-building',
                                command: ()=>{
                                    if(token && !isExpired){
                                        setOpen(false)
                                        navigate("/subscriptions")
                                        setOpen(false);
                                    }else{
                                        showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    }
                                }
                            },
                        ]

                    },
                    // all staff reports
                    {
                        label: 'Staff Reports',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'All Staff Report ',
                                icon: 'pi pi-fw pi-user',
                                command: ()=>{
                                    if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                                        setOpen(false)
                                        navigate("/users");
                                        setOpen(false);
                                    }else{
                                        showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    }
                                }
                            },
                            // active staff report
                            {
                                label: 'Active Staff Report ',
                                icon: 'pi pi-fw pi-user',
                                command: ()=>{
                                    if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                                        setOpen(false)
                                        navigate("/users");
                                        setOpen(false);
                                    }else{
                                        showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    }
                                }
                            },
                            // other staff resport

                        ]
                    },
                    // all assets reports
                    {
                        label: 'Asset Reports',
                        icon: 'pi pi-fw pi-microsoft',
                        items: [
                            {
                                label: 'All Assets Report',
                                icon: 'pi pi-gift',
                                command: ()=>{
                                    if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                                        setOpen(false)
                                        navigate("/roles");
                                        setOpen(false);
                                    }else{
                                        showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    }
                                }
                            },
                            {
                                label: 'Active Assets Report',
                                icon: 'pi pi-gift',
                                command: ()=>{
                                    if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                                        setOpen(false)
                                        navigate("/roles");
                                        setOpen(false);
                                    }else{
                                        showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    }
                                }
                            },

                        ]

                    },
                    // all allocations reports
                    {
                        label: 'Allocations Reports',
                        icon: 'pi pi-fw pi-id-card',
                        items: [
                            {
                                label: 'Active Allocations Report',
                                icon: "pi pi-link",
                                command: ()=>{
                                    if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                                        setOpen(false)
                                        navigate("/privileges");
                                        setOpen(false);
                                    }else{
                                        showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    }
                                }
                            },
                            {
                                label: 'Obsolete Allocations Report',
                                icon: "pi pi-link",
                                command: ()=>{
                                    if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                                        setOpen(false)
                                        navigate("/privileges");
                                        setOpen(false);
                                    }else{
                                        showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    }
                                }
                            },
                            {
                                label: 'Reversed Allocations Report',
                                icon: "pi pi-link",
                                command: ()=>{
                                    if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                                        setOpen(false)
                                        navigate("/privileges");
                                        setOpen(false);
                                    }else{
                                        showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    }
                                }
                            },
                        ]

                    },
                    // all other reports
                    {
                        label: 'Other Reports',
                        icon: 'pi pi-fw pi-cog',
                        command: ()=>{
                            if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')
                                //&& JSON.parse(login)?.userName?.toLowerCase()==='super'
                            ){
                                setOpen(false)
                                navigate("/settings");
                                setOpen(false);
                            }else{
                                showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                            }
                        }
                    },

                ]
            }


    ];

    const showSuccessFeedback=()=>{
        showToast(toast,'success','Operation Feedback','Operation completed successfully!')
    }

    const showErrorFeedback=(error)=>{
        showToast(toast,'error','Operation Feedback',error.toString())
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav" style={{backgroundColor:PrimaryColor}}>
                <Toolbar>
                    <div className={' flex flex-row align-items-center'}>
                        {//login && JSON.parse(login)?.privileges?.includes('ADMIN') && token &&
                             <IconButton
                            size="medium"
                            edge="start"
                            style={{color:'white'}}
                            sx={{ mr: 2 }}
                            onClick={()=>{
                                if(token!==null && login!==null){
                                    setOpen(true)
                                }else{
                                    showToast(toast,'error','Access denied!','Please login to have access to the menu!')
                                }
                            }}
                        >
                             <MenuIcon style={{marginRight:10}}/>

                        </IconButton>}

                        <div className={'gap-1 mr-2'}>
                            <a href={'#'} onClick={()=>navigate("/")}>
                                <img alt="logo" src={Logo} height="50" width={'50'} style={{borderRadius:'50%'}} onClick={()=>navigate("/home")} />
                            </a>
                        </div>

                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            className={'flex justify-content-center sx:col-0 gap-3'}
                        >
                            <a className={'sx:col-0'} href={''} onClick={()=>navigate("/")} style={{color:'white'}}> {AppName} </a>
                        </Typography>
                    </div>


                    <div className={'flex flex-1  justify-content-end}'}>
                        <UserMenu userMenu={userMenu} login={login} changeColor={true}  />
                    </div>
                </Toolbar>
            </AppBar>

            <Menu model={userMenuItems} className={'text-green-500'} data-pr-classname={'text-green-300'}  popup ref={userMenu} color={PrimaryColor} style={{backgroundColor: "white", color:PrimaryColor}} />
            <Toast ref={toast} position={'center'}/>
            <ProfileDialog visible={profileVisible} setVisible={setProfileVisible} data={login && login!=='undefined'?JSON.parse(login):null} />
            <ChangePasswordDialog  setChangePasswordVisible={setChangePasswordVisible} selectedUser={login && login!=='undefined'?JSON.parse(login):null}
                changePasswordVisible={changePasswordVisible} token={token} showSuccessFeedback={showSuccessFeedback} showErrorFeedback={showErrorFeedback} />

            <div className="card flex justify-content-center">
                <Sidebar visible={open} onHide={() => setOpen(false)} className="w-full md:w-20rem lg:w-30rem" closeOnEscape={true}>
                    <div className="card flex flex-column justify-content-center">
                        <div  style={{marginBottom:30}} className={'flex justify-content-end'}>
                            <UserMenu userMenu={userMenu} login={login} changeColor={false} />
                        </div>
                        <div className="card flex justify-content-center ">
                            <PanelMenu multiple={false} color={PrimaryColor} model={items} className="w-full md:w-25rem" style={{color: PrimaryColor}} onClick={()=>{
                                if(!token && isExpired){
                                    showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    navigate("/")
                                }
                            }} />
                        </div>
                    </div>
                </Sidebar>

            </div>

        </Box>
    );
}