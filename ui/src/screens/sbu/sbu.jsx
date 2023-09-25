import React, {useEffect, useRef, useState} from 'react';
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import showToast from "../../notifications/showToast";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import {ContextMenu} from "primereact/contextmenu";
import {Toolbar} from "primereact/toolbar";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import {InputText} from "primereact/inputtext";
import EditSbuDialog from "./edit.sbu.dialog.jsx";
import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";
import {doFetch} from "../../query/doFetch.js";
import {getLogin} from "../../auth/check.login";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../../query/doUpdate.js";
import {PrimaryColor, SecondaryColor} from "../../components/Constants.jsx";

const Sbu =  () => {

    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast= useRef(null);
    const [selectedSbu, setSelectedSbu] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [openNewSbuDialog, setOpenNewSbuDialog] = useState(false);
    const [openViewSbuDialog, setOpenViewSbuDialog] = useState(false);
    const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
    const [newPassword, setNewPassword] = useState(null);
    const [indicator, setIndicator] = useState(false);
    const [sbus, setSbus]=useState([]);
    const dt = useRef(null);
    const cm = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        code: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        active: { value: null, matchMode: FilterMatchMode.IN },
        dateCreated: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

    });



    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    const sbuData=doFetch('/api/sbu/',token,['get','sbus']);
    useEffect(()=>{
        let data=sbuData?.data?.map(sbu=>{
            return {...sbu, creator:sbu?.createdBy?.userName}
        })
        setSbus(data);
    },[])

    const cols = [
        { field: 'code', header: 'SBU CODE' },
        { field: 'name', header: 'SBU NAME' },
        { field: 'description', header: 'DESCRIPTION' },
        { field: 'active', header: 'ACTIVE' },
        { field: 'dateCreated', header: 'DATE CREATED' },
        { field: 'creator', header: 'CREATED BY' },

    ];

    const viewSbu = () => {
        setOpenViewSbuDialog(true);
    };

    const editSbu = () => {
        setOpenNewSbuDialog(true);
    };


    const openNew=()=>{
        setOpenNewSbuDialog(true);
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className={'flex flex-row justify-content-between'}>
                <h2 className="m-0">SBUs List</h2>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search"/>
                </span>
            </div>
        );
    };

    const menuModel = [
        { label: 'View', icon: 'pi pi-fw pi-hourglass', command: () => viewSbu() },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editSbu() },
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt?.current.exportCSV({ selectionOnly,filename:'subs.csv' });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc?.autoTable(exportColumns, sbus);
                doc.save('sbus.pdf');
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="" rounded icon="pi pi-plus" style={{backgroundColor: SecondaryColor}} onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div style={{width:'100%', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                <Button type="button" label={'CSV'} icon="pi pi-download " severity="success" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                &nbsp;&nbsp;
                <Button type="button" label={'PDF'} icon="pi pi-download" severity="danger" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>)
    };

    const refresh=(data)=>{
        let datas=sbuData?.data?.map(sbu=>{
            return {...sbu, creator:sbu?.createdBy?.userName}
        })
        // console.log(datas)
        setSbus(datas);
    }

    const showSuccessFeedback=()=>{
        showToast(toast,'success','Operation Feedback','Operation completed successfully!')
    }

    const showErrorFeedback=(error)=>{
        showToast(toast,'error','Operation Feedback',error.toString())
    }


    return (
        <>
            <Toast ref={toast} position={'center'} />
            {indicator && <div><ProgressSpinner title={'Please wait...'}/> <span> Please wait...</span></div>}
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <ContextMenu model={menuModel} ref={cm} onHide={() => null} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>
                <DataTable ref={dt} value={sbus}  tableStyle={{ minWidth: '50rem' }} paginator={true} rows={5} header={renderHeader}
                           filters={filters} filterDisplay="menu" globalFilterFields={['firstName', 'lastName', 'userName', 'active', 'dateCreated','userLevel']}
                           onContextMenu={(e) => cm['current'].show(e.originalEvent)} stripedRows={true}
                           rowsPerPageOptions={[5,10, 25, 50]} dataKey="id" resizableColumns showGridlines
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           contextMenuSelection={selectedSbu} onContextMenuSelectionChange={(e) => setSelectedSbu(e.value)}>
                    {cols?.map((col,index)=>{
                        return <Column key={index}  field={col?.field} header={col?.header} sortable={true} />
                    })
                    }

                </DataTable>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {selectedSbu && selectedSbu?.id ? selectedSbu?.firstName+' '+selectedSbu?.lastName:"New Sbu"}
                        </Typography>
                    </div>
                }} visible={openNewSbuDialog} style={{ width: '80vw' }} onHide={() => {
                    setSelectedSbu(null)
                    setOpenNewSbuDialog(false)
                }}>
                    <EditSbuDialog selectedSbu={selectedSbu} setEditSbuDialogVisible={setOpenNewSbuDialog} openNewSbuDialog={openNewSbuDialog}
                                    token={token} setSbus={refresh} showSuccessFeedback={showSuccessFeedback} showErrorFeedback={showErrorFeedback}/>
                </Dialog>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:PrimaryColor, paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {selectedSbu?.firstName+' '+selectedSbu?.lastName}
                        </Typography>
                    </div>
                }} visible={openViewSbuDialog} style={{ width: '80vw' }} onHide={() => setOpenViewSbuDialog(false)}>
                    {/*<ViewSbuDialog user={selectedSbu} setShowViewSbuDialog={setOpenViewSbuDialog} />*/}
                </Dialog>


            </div>
        </>
    )
}

export default Sbu;
