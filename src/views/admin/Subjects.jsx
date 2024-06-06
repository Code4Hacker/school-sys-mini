import React, { useEffect, useRef, useState } from 'react'
import { BarTop, Sidebar, Topbar } from '../../components'
import { Container } from 'react-bootstrap'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { CloudArrowUpFill, CloudPlusFill, FileArrowUp, FilePdfFill, FiletypeXlsx, Filter, Plus, PlusCircle, PlusLg, Watch } from 'react-bootstrap-icons';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import toast, { Toaster } from 'react-hot-toast';
import jQuery from 'jquery';
import studentRaws from "../../raws/studentprojects.json";
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import axios from 'axios';
import { baseURL } from '../../paths/base_url';
import { AutoComplete } from 'primereact/autocomplete';
import { Chips } from "primereact/chips";
import { useNavigate, useParams } from 'react-router-dom';
import { udom_logo } from '../../assets';

const Subjects = () => {
    const [project, setProject] = useState([]);
    const [filters, setFilters] = useState(null);
    const [selected, setSelected] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);
    const storage = window.localStorage;
    const handleSubmitSelection = async (event, id) => {
        let formdata = new FormData();
        const splitter = params.id.split("_13_");
        formdata.append("place_name", splitter[3]);
        formdata.append("branch", splitter[4]);
        formdata.append("area", splitter[2]);
        formdata.append("region", splitter[0]);
        formdata.append("district", splitter[1]);
        formdata.append("supervisor", event.data.super_id);

        const bodydata = formdata;
        try {
            const requests = axios.request({
                url: `${baseURL}add_place_supe.php`,
                method: "POST",
                data: bodydata
            });

            // console.log((await requests).data);
            if((await requests).data.status === 200){

                toast.success("Updated Successiful, "+ (new Date()).toDateString());
                getSupervisors();
                getModulesDetails();
                toast.dismiss();
            } else{
                toast.error("something went wrong!");
            }
        } catch (error) {
            toast.error(error);
        }
        // console.log(splitter);
    }
    const onRowSelect = (event) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <img
                                className="h-10 w-10 rounded-full"
                                src={udom_logo}
                                alt=""
                            />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                {storage.getItem("u_name") ? storage.getItem("u_name") : "Paulo Michael"}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Are you Sure! Do you  wan't to select
                                <div className="">
                                    Name: <span className=" text-indigo-500">{event.data.name}</span>, Category: <span className=" text-indigo-500">{event.data.category}</span> at
                                    <br />
                                    <span className=" ">{event.data.region}</span>  <span className=" ">[{event.data.supervisor}]</span>

                                </div>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200">
                    <button
                        onClick={() => handleSubmitSelection(event, t)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Accept
                    </button>
                </div>
            </div>
        ), { duration: 10000 })
        jQuery("td").css({
            "background-color": 'var(--light)'
        })
        jQuery(event.originalEvent.target).css({
            "background-color": 'var(--alice)'
        })

    };
    const dt = React.forwardRef(null);

    const cols = [
        { field: 'sn', header: '#' },
        { field: 'name', header: 'Supervisor Name' },
        { field: 'department', header: 'Department' },
        { field: 'super_id', header: 'Supervisor ID' },
        { field: 'mobile', header: 'Mobile' },
        { field: 'location', header: 'Location' },
        { field: 'some', header: 'Already Selected at' }

    ];
    const params = useParams();
    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));
    const getModulesDetails = async () => {
        let formadata = new FormData();
        formadata.append("location", params.id.split("_13_")[0].trim());
        const bodydata = formadata;
        try {
            const requests = axios.request({
                method: "POST",
                url: `${baseURL}supervisors.php`,
                data: bodydata
            }); setProject((await requests).data);
            console.log((await requests).data);
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

                <span className="p-input-icon-left text-end mb-4" style={{ color: 'var(--dark)', marginTop: '-10px' }}>

                    <br />
                    Search:
                    <i className="pi pi-search " />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} className='ms-2' placeholder="Any Column" />
                </span>
            </div>

        </div>
    );
    const [sselected, setSselected] = useState();

    const getSupervisors = async () => {
        let formdata = new FormData();
        const splitter = params.id.split("_13_");
        formdata.append("place_name", splitter[3]);
        formdata.append("branch", splitter[4]);
        formdata.append("area", splitter[2]);
        formdata.append("region", splitter[0]);
        formdata.append("district", splitter[1]);

        const bodydata = formdata;
        try {
            const requests = axios.request({
                url: `${baseURL}check_super.php`,
                method: "POST",
                data: bodydata
            });

            // console.log((await requests).data);
            setSselected((await requests).data);
        } catch (error) {
            toast.error(error);
        }
        // console.log(splitter);
    }
    useEffect(() => { getSupervisors() }, []);
    return (
        <div className='view user_board'>
            <div className="flex_box" style={{
                '--width': '240px', '--width-two': 'auto', '--height': '100vh'
            }}>
                <div className="left-screen-view">
                    <Sidebar />
                </div>
                <div className="right-screen-view">
                    <BarTop />
                    <Topbar
                        headline={"Welcome to Academic Year"}
                        subheadline={"PSupervisor"}
                        note={"2022/2023"}
                    />
                    <div className="" style={{
                        paddingTop: '20px'
                    }}>
                        <div className="border_box" style={{
                            paddingLeft: '0px'
                        }}>
                            <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                                <div
                                    className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                                    aria-hidden="true"
                                >
                                    <div
                                        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                                        style={{
                                            clipPath:
                                                'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                                        }}
                                    />
                                </div>
                                <div
                                    className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                                    aria-hidden="true"
                                >
                                    <div
                                        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                                        style={{
                                            clipPath:
                                                'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                                        }}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <p className="text-sm leading-6 text-gray-900">
                                        <strong className="font-semibold">Selected Supervisor</strong>
                                        <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                                            <circle cx={1} cy={1} r={1} />
                                        </svg>
                                        {sselected !== undefined && sselected.supervisor?.length > 0 ? sselected.supervisor.map((data, key) => <span key={key}>{data.f_name} {data.m_name} {data.l_name}</span>) : " No selected Supervisor"}
                                        {console.log(sselected)}
                                    </p>
                                    {/* {sselected !== undefined && sselected.supervisor?.length > 0 ? <button
                                        href="#"
                                        className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                    >
                                        Remove Supervisor <span aria-hidden="true">&rarr;</span>
                                    </button> : ""} */}

                                </div>
                                <div className="flex flex-1 justify-end">
                                    <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
                                        <span className="sr-only">Dismiss</span>
                                        {/* <Watch className="h-5 w-5 text-gray-900" aria-hidden="true" /> */}
                                    </button>
                                </div>
                            </div>
                            <div className="data_table">
                                <Tooltip target=".export-buttons>button" position="bottom" />

                                <DataTable ref={dt} value={project} paginator rows={5} filters={filters} globalFilterFields={['name', 'department', 'super_id', 'mobile', 'location', 'some']} rowsPerPageOptions={[5, 10, 25, 50]} emptyMessage="No Supervisor Yet." header={header}
                                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} tableStyle={{ minWidth: '50rem' }} selectionMode='single' selection={selected} onSelectionChange={(e) => setSelected(e.value)} dataKey="id"
                                    onRowSelect={onRowSelect} onRowUnselect={onRowSelect} metaKeySelection={false}>
                                    {cols.map((col, key) => (
                                        <Column key={col.field} className="border_box p-4" style={{ borderColor: "var(--dark) !important" }} sortable field={col.field} header={col.header} />
                                    ))}
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Subjects