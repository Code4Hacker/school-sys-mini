import React, { useEffect, useRef, useState } from 'react'
import { BarTop, Sidebar, Topbar } from '../../components'
import { Container } from 'react-bootstrap'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { EyeFill, FileArrowUp, FilePdfFill, FiletypeXlsx, Filter, PenFill, Plus, PlusCircle, Trash3Fill } from 'react-bootstrap-icons';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import toast, { Toaster } from 'react-hot-toast';
import jQuery from 'jquery';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { baseURL } from '../../paths/base_url';
import { udom_logo } from '../../assets';
import { useNavigate } from 'react-router';
import { AutoComplete } from 'primereact/autocomplete';
import { Placeholder } from 'rsuite';


const Dashboard = () => {
    const [project, setProject] = useState([]);
    const [filters, setFilters] = useState(null);
    const [selected, setSelected] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [sltction, setSlction] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [selectedDomain, setselectedDomain] = useState(null);
    const [parameters, setParameters] = useState();

    const [Domains, setDomains] = useState([]);
    const [filteredDomains, setFilteredDomains] = useState(null);
    const storage = window.localStorage;

    const [Supervisors, setSupervisors] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [filteredSupervisors, setFilteredSupervisors] = useState(null);

    const search3 = (event) => {

        setTimeout(() => {
            let _filteredSupervisors;

            if (!event.query.trim().length) {
                _filteredSupervisors = [...Supervisors];
            }
            else {
                _filteredSupervisors = Supervisors.filter((Supervisor) => {
                    console.log("filtered", _filteredSupervisors)
                    return Supervisor.name.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredSupervisors(_filteredSupervisors);
        }, 250);
    }
    const search2 = (event) => {

        setTimeout(() => {
            let _filteredDomains;

            if (!event.query.trim().length) {
                _filteredDomains = [...Domains];
            }
            else {
                _filteredDomains = Domains.filter((Supervisor) => {
                    // console.log("filtered", _filteredDomains)
                    return Supervisor.name.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredDomains(_filteredDomains);
        }, 250);
    }

    const navigate = useNavigate();
    const onRowSelect = (event) => {
        jQuery("td").css({
            "background-color": 'var(--light)'
        })
        jQuery(event.originalEvent.target).css({
            "background-color": 'var(--alice)'
        })
        // navigate(`/selection_place/${event.data.remarks}_13_${event.data.students}_13_${event.data.supervisor}_13_${event.data.name}_13_${event.data.description}`);
        setParameters(`/selection_place/${event.data.remarks}_13_${event.data.students}_13_${event.data.supervisor}_13_${event.data.name}_13_${event.data.description}`);
        setSlction(!false);

    };
    const viewSubjects = () => {
        setSlction(false);
        navigate(parameters);

    }
    const dt = useRef(null);

    const cols = [
        { field: 'id', header: '#' },
        { field: 'department', header: 'Department Name' },
    ];
    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const getModulesDetails = async () => {
        try {
            let headersList = {
                "Accept": "*/*",
                "Authorization": `Bearer ${localStorage.getItem('admin') !== undefined ? localStorage.admin : 'null'}`,
                "Content-Type": "application/json"
            }
            const requests = axios.request({
                method: "GET",
                url: `${baseURL}api/v1/departments/all`,
                headers: headersList
            });
            console.log((await requests).data);
            setProject((await requests).data.content);
            setLoader(true);
        } catch (error) {
            toast.error(`Something went wrong\n${error}`);
        }
    }
    useEffect(() => {
        getModulesDetails();
        initFilters();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, project);
                doc.save('project.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(project);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'project');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const paginatorLeft = <div className="flex align-items-center justify-content-end  me-5" style={{
        width: '100%'
    }}>
        <Button type="button" className='mv_btn_2' rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" ><i className="text-large"><FileArrowUp /></i></Button>
        <Button type="button" className='mv_btn_2' icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" >
            <FiletypeXlsx />
        </Button>
        <Button type="button" className='mv_btn_2' icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" >
            <FilePdfFill />
        </Button>
    </div>
    const paginatorRight = <Button type="button" className='mv_btn' text >Next</Button>;


    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            category: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
        });
        setGlobalFilterValue('');
    };

    const header = (
        <div className="">
            <div className="flex justify-content-between">

                <Button type="button" className="mv_btn" outlined onClick={clearFilter} style={{ height: '40px' }}><Filter /> Clear</Button>
                <Button type="button" className="mv_btn ms-5 mb-3" outlined onClick={() => setVisible(true)} style={{
                    backgroundColor: 'var(--ocean)', height: '45px'
                }}><Plus /> Add Department</Button>
                <span className="p-input-icon-left text-end mb-4" style={{ color: 'var(--dark)', marginTop: '-10px' }}>

                    <br />
                    Search:
                    <i className="pi pi-search " />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} className='ms-2' placeholder="Any Column" />
                </span>
            </div>

        </div>
    );
    // inputs states

    const [depname, setDepname] = useState("");
    const [capacity, setCapacity] = useState("");
    const [depcode, setDepcode] = useState("");
    const [area, setArea] = useState("");
    const [region, setRegion] = useState("");
    const [district, setDistrict] = useState("");
    const [contact, setContact] = useState("");
    const [loader, setLoader] = useState(false);

    const handleSubmit = async () => {
        // console.log(selectedSupervisor, selectedDomain);
        if (depname !== "" && depcode !== "") {
            let formdata = new FormData();
            if (selectedSupervisor !== null) {
                formdata.append("supervisor", selectedSupervisor.super);
            }
            let bodyContent = JSON.stringify({
                "department": depname,
                "deptCode": depcode
            });
            let headersList = {
                "Accept": "*/*",
                "Authorization": `Bearer ${localStorage.getItem('admin') !== undefined ? localStorage.admin : 'null'}`,
                "Content-Type": "application/json"
            }

            try {
                const request = axios.request({
                    url: `${baseURL}api/v1/departments/new`,
                    method: "POST",
                    data: bodyContent,
                    headers: headersList
                });
                if ((await request).data.code === 9000) {
                    toast.success("Department Added Successiful!");
                    setVisible(false);
                    getModulesDetails();
                    setDepname(""); setDepcode(""); 
                } else {
                    toast.error("Something went wrong!");
                }
            } catch (error) {

            }

        } else {
            toast.error("All field Required to be filled!");
        }
    }
    const handleDelete = async () => {
        console.log(selected.uuid)
        if (selected.id !== "") {
            let headersList = {
                "Accept": "*/*",
                "Authorization": `Bearer ${localStorage.getItem('admin') !== undefined ? localStorage.admin : 'null'}`,
                "Content-Type": "application/json"
            }

            try {
                const request = axios.request({
                    url: `${baseURL}api/v1/departments/delete/${selected.uuid}`,
                    method: "DELETE",
                    headers: headersList
                });
                if ((await request).data.code === 9000) {
                    toast.success("Department Added Successiful!");
                    setVisible(false);
                    getModulesDetails();
                    setDepname(""); setDepcode(""); 

                    setSlction(false);
                } else {
                    console.log((await request).data)
                    toast.error("Something went wrong!");
                }
            } catch (error) {

            }

        } else {
            toast.error("All field Required to be filled!");
        }
    }
    return (
        <div className='view user_board studentprojects'>
            <Toaster ref={toast} position='top-right' color='white' />
            {/* creating */}
            <div className="dark_overlay" style={{
                display: `${!visible ? 'none' : 'block'}`
            }}>
                <Dialog header="" className='white_box modal_box' visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                    <h3 className="page-title text-bold" style={{
                        borderBottom: '1.5px solid var(--shadow_color)',
                        paddingBottom: '10px'
                    }}>
                        CREATE DEPARTMENT
                    </h3>
                    <div className="flex_2">

                        <div className="input m-1">
                            <div className="span">
                                <h4 className="text-muted page-title">Department Name<span>*</span></h4>
                            </div>
                            <input type="text" value={depname} onChange={(e) => setDepname(e.target.value)} />
                        </div>
                        <div className="input m-1">
                            <div className="span">
                                <h4 className="text-muted page-title">Department Code<span>*</span></h4>
                            </div>
                            <input type="text" value={depcode} onChange={(e) => setDepcode(e.target.value)} />

                        </div>

                    </div>
                    <div className="button text-center">
                        <Button type="button" className="mv_btn btn_btn ms-5 mb-3 pt-0 pb-0 text-center text-sharp" outlined style={{
                            backgroundColor: 'var(--ocean)', height: '45px', fontWeight: 300, width: '150px', textAlign: 'center'
                        }} onClick={handleSubmit}> <PlusCircle />Save to Finish</Button>
                    </div>
                </Dialog>
            </div>

            {/* done creating */}

            {/*selection */}
            <div className="dark_overlay" style={{
                display: `${!sltction ? 'none' : 'block'}`
            }}>
                <Dialog header="" className='white_box modal_box' visible={sltction} style={{ width: '13vw' }} onHide={() => setSlction(false)}>
                    <h1 className='text-center p-2 text-bold'>CHOOSE ACTION</h1>
                    <div className="flex text-center">
                        <div className=""></div>
                        <div className="button text-center">
                            <Button type="button" className=" btn_btn mb-3 pt-0 pb-0 text-center text-sharp" outlined style={{
                                backgroundColor: 'red', height: '50px', fontWeight: 300, width: '180px', textAlign: 'center',
                                color: 'white',
                                margin: '4px'
                            }} onClick={handleDelete}> <Trash3Fill />Delete Department</Button>
                        </div>
                        {/* <div className="button text-center">
                            <Button type="button" className="btn_btn mb-3 pt-0 pb-0 text-center text-sharp" outlined style={{
                                backgroundColor: 'var(--ocean)', height: '50px', fontWeight: 300, width: '180px', textAlign: 'center',
                                color: 'white',
                                margin: '4px'
                            }} onClick={() => {
                                setSlction(false);
                                setUpdating(true);
                            }}> <PenFill />Update Department</Button>
                        </div> */}
                    </div>
                </Dialog>
            </div>
            {/* done selection */}


            {/* creating */}
            <div className="dark_overlay" style={{
                display: `${!updating ? 'none' : 'block'}`
            }}>
                <Dialog header="" className='white_box modal_box' visible={updating} style={{ width: '45vw' }} onHide={() => setUpdating(false)}>
                    <h3 className="page-title text-bold" style={{
                        borderBottom: '1.5px solid var(--shadow_color)',
                        paddingBottom: '10px'
                    }}>
                        UPDATE COURSE
                    </h3>
                    <div className="flex_2">

                        <div className="input m-1">
                            <div className="span">
                                <h4 className="text-muted page-title">Department <span>*</span></h4>
                            </div>
                            <AutoComplete className='auto_cp' field="name" value={selectedDomain} suggestions={filteredDomains} completeMethod={search2} onChange={(e) => setselectedDomain(e.value)} style={{
                                border: "none !important"

                            }} dropdown />
                        </div>
                        <div className="input m-1">
                            <div className="span">
                                <h4 className="text-muted page-title">Course Code<span>*</span></h4>
                            </div>
                            <input type="text" value={depname} onChange={(e) => setDepname(e.target.value)} />

                        </div>

                    </div>
                    <div className="input m-1">
                        <div className="span">
                            <h4 className="text-muted page-title">Course Name <span>*</span></h4>
                        </div>
                        <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />

                    </div>
                    <div className="button text-center">
                        <Button type="button" className="mv_btn btn_btn ms-5 mb-3 pt-0 pb-0 text-center text-sharp" outlined style={{
                            backgroundColor: 'var(--ocean)', height: '45px', fontWeight: 300, width: '150px', textAlign: 'center'
                        }} onClick={handleSubmit}> <PlusCircle />Save to Finish</Button>
                    </div>
                </Dialog>
            </div>

            {/* done creating */}


            <div className="flex_box" style={{
                '--width': '240px', '--width-two': 'auto', '--height': '100vh'
            }}>

                <div className="left-screen-view" style={{
                    position: 'relative',
                    zIndex: "50"
                }}>
                    <Sidebar />
                </div>
                <div className="right-screen-view">
                    <BarTop />
                    <Topbar
                        headline={"Departments"}
                        subheadline={""}
                        note={""}
                    />
                    <div className="" style={{
                        paddingTop: '20px'
                    }}>
                        <div className="border_box" style={{
                            paddingLeft: '10px'
                        }}>
                            {
                                loader ?
                                <div className="data_table">
                                <Tooltip target=".export-buttons>button" position="bottom" />

                                <DataTable ref={dt} value={project} paginator rows={5} filters={filters} globalFilterFields={['id', 'department']} rowsPerPageOptions={[5, 10, 25, 50]} emptyMessage="No Department found."
                                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} header={header} tableStyle={{ minWidth: '50rem' }} selectionMode='single' selection={selected} onSelectionChange={(e) => setSelected(e.value)} dataKey="id"
                                    onRowSelect={onRowSelect} onRowUnselect={onRowSelect} metaKeySelection={false}>
                                    {cols.map((col) => (
                                        <Column key={col.field} className="border_box p-4" style={{ borderColor: "var(--dark) !important" }} sortable field={col.field} header={col.header} />
                                    ))}
                                </DataTable>
                            </div>:
                            <div style={{
                                margin:'20px',
                                marginTop:'50px'
                            }}>
                                <Placeholder.Paragraph graph="circle" active className='mt-5 mb-5' />
                                <Placeholder.Grid rows={5} columns={6} active />
                                <Placeholder.Paragraph graph="circle" active className='mt-5 mb-5' />
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard