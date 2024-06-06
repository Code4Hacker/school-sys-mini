import React, { useEffect, useRef, useState } from 'react'
import { udom_logo } from '../assets'
import { Button, Row } from 'react-bootstrap'
import { ArrowDown, BagCheckFill, BoxArrowRight, Fullscreen, Lock, LockFill, Toggle2On } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from 'primereact/dialog'
import toast from 'react-hot-toast'
import axios from 'axios'
import { baseURL } from '../paths/base_url';

const BarTop = ({ username, menu, extras }) => {
    const op = useRef(null);
    const tableRef = useRef(null);
    const navigator = useNavigate();

    const enterFullscreen = () => { };
    const storage = window.localStorage;


    const logOut = () => navigator("/");

    const { getRemainingTime } = useIdleTimer({
        onIdle: logOut,
        timeout: 10 * 60 * 30000
    });
    useEffect(() => {
        // if (!storage.getItem("super") && !storage.getItem("std_usr") && !storage.getItem("admin")) navigator("/");
    }, [])

    const [visible, setVisible] = React.useState(false);
    const [oldpass, setOldpass] = useState("");
    const [newpass, setNewpass] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleSubmit = async () => {
        let formdata = new FormData();

        if (newpass.length < 5) {
            toast.error("please your 'new' password is to short");
        } else {
            if (confirm !== newpass) {
                toast.error("Confirmation Not match!");
            } else {
                formdata.append("old", oldpass);
                formdata.append("new_pwd", newpass);
                formdata.append("studentId", storage.getItem("std_usr") ? storage.getItem("std_usr"): storage.getItem("super")? storage.getItem("super") : "");
                const bodydata = formdata;

                
                const dataform = {
                    method: "POST",
                    url: `${baseURL}update_password.php`,
                    data: bodydata
                }
                try {
                    const requests = axios.request(dataform);
                    console.log((await requests).data);
                    if((await requests).data.status  !== 200){
                        toast.error((await requests).data.message);
                    }else{
                        toast.success("update Success");
                        setVisible(false);
                        setOldpass(""); setNewpass(""); setConfirm("");
                    }
                } catch (error) {
                    toast.error(error);

                }
            }



        }



    }
    return (
        <div onClick={enterFullscreen}>
            <div className="dark_overlay" style={{
                display: `${!visible ? 'none' : 'block'}`
            }}>
                <Dialog header="" className='white_box modal_box' visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                    <div className="page-title text-bold" style={{
                        borderBottom: '1.5px solid var(--shadow_color)',
                        paddingBottom: '10px'
                    }}>
                        School Administration SYS | <span className="" style={{
                            color: "green"
                        }}>( {storage.getItem("std_usr") ? storage.getItem("std_usr"): storage.getItem("super")? storage.getItem("super") : "gemini"} ) </span> Change My Password
                    </div>

                    <div className="input m-1">
                        <div className="span">
                            <h4 className="text-muted page-title text-bold">Old Password</h4>
                        </div>
                        <input type="password" className='primary' value={oldpass} onChange={(e) => setOldpass(e.target.value)} />
                    </div>
                    <div className="input m-1">

                        <div className="flex_2">
                            <div className="input m-1">
                                <div className="span">
                                    <h4 className="text-muted page-title text-bold">New Password</h4>
                                </div>
                                <input type="password" className='primary' value={newpass} onChange={(e) => setNewpass(e.target.value)} />
                            </div>
                            <div className="input m-1">
                                <div className="span">
                                    <h4 className="text-muted page-title text-bold">Confirm New  Password</h4>
                                </div>
                                <input type="password" className='primary' value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                            </div>
                        </div>

                    </div>

                    <div className="button text-end justify-end m-2" style={{
                        display: "grid",
                        gridTemplateColumns: "auto 200px"
                    }}>
                        <div className=""></div>
                        <button type="butto" className="flex text-sharp text-center  text-white" outlined style={{
                            backgroundColor: 'var(--green)', height: '45px', fontWeight: 300, width: '200px',
                            textAlign: 'center', position: 'relative', left: '50%', transform: "translateX(-50%)"
                        }} onClick={handleSubmit}> <LockFill className='ms-2 mt-1 me-1' /> Change Password</button>
                    </div>
                </Dialog>
            </div>
            <Row className='' style={{
                background: 'var(--bold-ocean)'
            }}>
                <div className="flex_box" style={{
                    "--width": '240px', "--width-two": 'auto', '--height': 'auto', padding: "0px", margin: '0px'
                }}>
                    <div className="" style={{ background: 'var(--light)' }}></div>
                    <div className="flex_box top-bar snipped_top" style={{
                        "--width": 'auto', "--width-two": 'auto', '--height': 'auto'
                    }}>
                        <div className="" style={{
                            marginLeft: "240px"
                        }}>
                            <button className="primary text-larger">
                                <i><Toggle2On /></i>
                            </button>
                        </div>
                        <OverlayPanel ref={op} className=''>
                            <div className="divide-y divide-gray-100 shadow-xl rounded" style={{
                                backgroundColor: 'var(--light)'
                            }}>

                                <div className="hidden shrink-0 divide-gray-100 devide sm:flex sm:flex-col sm:items-end rounded">
                                    <Button style={{
                                        border: "none",
                                        color: "var(--muted)",
                                        width: "100%",
                                        display: "flex",
                                        gap: "10px",
                                        background: "none !important",
                                        fontSize: "medium",
                                        borderBottom: "1px solid  var(--meal)",
                                        borderRadius: "0px"
                                    }} className='p-3 hover:text-white hover:bg-black hover:rounded' onClick={()  => setVisible(!false)}><BagCheckFill className='hover:text-white' /> <span className='-mt-1 hover:text-white'>Change  Password</span></Button>
                                    <Button style={{
                                        border: "none",
                                        color: "var(--muted)",
                                        width: "100%",
                                        display: "flex",
                                        gap: "10px",
                                        fontSize: "medium",
                                        borderBottom: "1px solid  var(--meal)",
                                        borderRadius: "0px"
                                    }} className='p-3 hover:bg-black hover:rounded' onClick={() => {
                                        window.localStorage.clear();
                                        navigator("/");
                                    }}><BoxArrowRight className='hover:text-white' /> <span className='-mt-1 hover:text-white'> Log  Out</span></Button>
                                </div>
                            </div>

                        </OverlayPanel>
                        <div className="border_end">
                            <button className='primary'>
                                <span className="icon-b" style={{
                                    position: 'relative',
                                    top: '0px',
                                    fontSize: 'large'
                                }}><Fullscreen /></span>
                                <div className="image">
                                    <img src={udom_logo} alt="" />
                                </div>
                                <div onClick={(e) => op.current.toggle(e)}>
                                    <span>{storage.getItem("u_name") ? storage.getItem("u_name").split(" ")[0] : "Paulo"}</span>
                                </div>
                                <span className='icon-bg'><ArrowDown /></span>
                            </button>
                        </div>
                    </div>
                </div>
            </Row>
        </div>
    )
}

export default BarTop