import React from 'react';
import {Panel} from "primereact/panel";
import {Container} from "@mui/material";
import {Button} from "primereact/button";

const ViewUserDialog=({setShowViewUserDialog, user})=>{

    return(
        <>
            <Container >
                <Panel header={`${user?.firstName} ${user?.lastName}`} className={'success'}>
                    <div className={'grid'}>
                        <div className={'col-6 sm:col-6'}>
                            First Name
                        </div>
                        <div className="col-6 sm:col-6">
                            {user?.firstName}
                        </div>


                        <div className={'col-6 sm:col-6 surface-100'}>
                            Last Name
                        </div>
                        <div className="col-6 sm:col-6 surface-100">
                            {user?.lastName}
                        </div>
                        <div className={'col-6 sm:col-6'}>
                            User Address
                        </div>
                        <div className="col-6 sm:col-6">
                            {user?.address}
                        </div>
                        <div className={'col-6 sm:col-6 surface-100'}>
                            User Email
                        </div>
                        <div className="col-6 sm:col-6 surface-100">
                            {user?.email}
                        </div>
                        <div className={'col-6 sm:col-6'}>
                            User Phone
                        </div>
                        <div className="col-6 sm:col-6">
                            {user?.phone}
                        </div>

                        <div className={'col-6 sm:col-6 surface-100'}>
                            User Level
                        </div>
                        <div className="col-6 sm:col-6 surface-100">
                            {user?.userLevel}
                        </div>

                        <div className={'col-6 sm:col-6 '}>
                            Active
                        </div>
                        <div className="col-6 sm:col-6">
                            {user?.active?.toString()}
                        </div>


                        <div className={'col-6 sm:col-6 surface-100'}>
                            Date Created
                        </div>
                        <div className="col-6 sm:col-6 surface-100">
                            {user?.dateCreated}
                        </div>


                    </div>
                    <div className={'flex justify-content-end'}>
                        <Button  severity={'success'} outlined={true} type="button" label="Close" onClick={()=>setShowViewUserDialog(false)} />
                    </div>
                </Panel>
            </Container>
        </>
    )
}

export default ViewUserDialog;