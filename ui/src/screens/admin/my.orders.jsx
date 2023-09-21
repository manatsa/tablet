import React, {useEffect, useRef, useState} from 'react';
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import showToast from "../../notifications/showToast.js";
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
import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";
import {doFetch} from "../../query/doFetch.js";
import {getLogin} from "../../auth/check.login.jsx";
import {SecondaryColor} from "../../components/Constants.jsx";

const MyOrders =  () => {

    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast= useRef(null);
    const[indicator, setIndicator]=useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [openNewRoleDialog, setOpenNewRoleDialog] = useState(false);
    const [openViewRoleDialog, setOpenViewRoleDialog] = useState(false);
    const [orders, setOrders]=useState([]);
    const dt = useRef(null);
    const cm = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        lastName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] } ,
        productName:{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        productTag: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        productDescription: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        ownerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        customerAddress: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        customerEmail: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        customerPhone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    });

    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    useEffect(()=>{
        if(!token || isExpired ){
            navigate("/")
        }else {
            if(!logins?.privileges?.includes('ADMIN')){
                showToast(toast,'error','Error 401: Access Denied','You do not have access to this resource!');
                window.history.back();
            }
        }
    },[])

    const viewRole = () => {
        setOpenViewRoleDialog(true)
    };

    const {data, error, isError, isLoading }=doFetch('/api/customers/orders/user/',token,['get',login?.userName,'orders']);

    useEffect(()=>{
        let order=data?.map(order=>{
            return {...order, firstName: order?.customer?.firstName, lastName: order?.customer?.lastName, customerAddress: order?.customer?.address,
                customerPhone: order?.customer?.phone, customerPhone2: order?.customer?.phone2, customerEmail: order?.customer?.email,
            productName: order?.product?.name, productDescription: order?.product?.description, productTags: order?.product?.tags}
        })
        setOrders(order)
    },[data])

    const cols = [
        { field: 'firstName', header: 'FIRST NAME' },
        { field: 'lastName', header: 'LAST NAME' },
        { field: 'customerAddress', header: 'CUSTOMER ADDRESS' },
        { field: 'customerPhone', header: 'CUSTOMER PHONE' },
        { field: 'customerEmail', header: 'CUSTOMER EMAIL' },
        { field: 'productName', header: 'PRODUCT NAME' },
        { field: 'productDescription', header: 'PRODUCT DECSRIPTION' },
        { field: 'productTags', header: 'PRODUCT TAGS' },
        { field: 'quantity', header: 'QUANTITY' },
    ];

    const editRole = () => {
        setOpenNewRoleDialog(true)
    };

    const deleteRole = () => {
        toast.current.show({ severity: 'info', summary: 'role deleted', detail: selectedOrder.name });
    };

    const openNew=()=>{
        setOpenNewRoleDialog(true);
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
                <h2 className="m-0">Orders List</h2>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" variant={'standard'}/>
                </span>
            </div>
        );
    };

    const menuModel = [
        { label: 'View', icon: 'pi pi-fw pi-hourglass', command: () => viewRole() },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editRole() },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteRole() }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, orders);
                doc.save('My_Orders.pdf');
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="" rounded icon="pi pi-plus" style={{backgroundColor: SecondaryColor}} onClick={openNew}/>
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


    return (
        <>
            <Toast ref={toast} position={'center'} />
            {isLoading && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <ContextMenu model={menuModel} ref={cm} onHide={()=>null} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>
                <DataTable ref={dt} value={orders}  tableStyle={{ minWidth: '50rem' }} paginator={true} rows={5} header={renderHeader}
                           filters={filters} filterDisplay="menu" globalFilterFields={['firstName', 'lastName',  'customerAddress', 'customerEmail','customerPhone','productName','productDescription','productTags']}
                           onContextMenu={(e) => cm.current.show(e.originalEvent)} stripedRows={true}
                           rowsPerPageOptions={[5,10, 25, 50]} dataKey="id" resizableColumns showGridlines
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           contextMenuSelection={selectedOrder} onContextMenuSelectionChange={(e) => setSelectedOrder(e.value)}>
                    {cols?.map((col,index)=>{
                        return <Column key={index}  field={col?.field} header={col?.header} sortable={true}/>
                    })
                    }

                </DataTable>


                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {':: VIEW ORDER :: '}
                        </Typography>
                    </div>
                }} visible={openViewRoleDialog} style={{ width: '60vw' }} onHide={() => setOpenViewRoleDialog(false)}>
                   <div className={'grid'}>
                       <div className="col-6 sm:col-6">Role Name</div>
                       <div className="col-6 sm:col-6">{selectedOrder?.name}</div>

                       <div className="col-6 sm:col-6">Role privileges</div>
                       <div className="col-6 sm:col-6">{selectedOrder?.privileges?.map(p=>p?.name+', ')}</div>

                       <div className="col-6 sm:col-6">Role Active</div>
                       <div className="col-6 sm:col-6">{selectedOrder?.active?.toString()}</div>

                       <div className="col-6 sm:col-6">Date Created</div>
                       <div className="col-6 sm:col-6">{selectedOrder?.dateCreated}</div>

                       <div className="col-6 sm:col-6">Created By</div>
                       <div className="col-6 sm:col-6">{selectedOrder?.createdBy?.toString()}</div>
                   </div>
                </Dialog>

            </div>
        </>
    )
}

export default MyOrders;
