
import React, { useEffect, useRef, useState } from 'react'
import { BarTop, Sidebar, Topbar } from '../components'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { baseURL } from '../paths/base_url';
import toast from 'react-hot-toast';


const IndividualStudent = () => {
    const [student, setStudent] = useState({});
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [nameloc, setNameloc] = useState();

    const params = useParams();
    const { id } = params;
    const handleGetUser = async () => {
        let formdata = new FormData();
        formdata.append("studentId", id);
        const bodydata = formdata;
        const requests = axios.request({
            url: `${baseURL}arrival_data.php`,
            method: "POST",
            data: bodydata
        });

        // console.log((await requests).data.arrival[0]);
        (await requests).data.arrival[0] ? getUserCoordinates() : toast.error("something happed");
        setStudent((await requests).data.arrival[0]);
    }

    const geolocationAPI = navigator.geolocation;
    const getUserCoordinates = () => {
        if (!geolocationAPI) {
            console.log("Geolocation API is not available in your browser!");
        } else {
            geolocationAPI.getCurrentPosition(
                async (position) => {

                    try {
                        const { coords } = position;
                        const request_for = axios.request({
                            url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`,
                            method: "GET"
                        });
                        try {
                            setNameloc((await request_for).data);
                        } catch (error) {
                            toast.error(error);
                        }
                    } catch (error) {
                        toast.error(error);
                    }

                },
                (error) => {
                    console.log("Something went wrong getting your position!");
                }
            );
            console.log("");
        }
    };
    // setTimeout(handleGetUser, 10000); 
    useEffect(() => {
        handleGetUser();
    }, []);
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
                        headline={`${student !== null ? student.region + " " + student.district + " " + student.place : "udom, cive"}`}
                        subheadline={"Dashboard"}
                        note={""}
                    />
                    <div>
                        {/* IndividualStudent {params.id} */}
                        <div className="absolute">
                            <div><div><iframe className='border_box fullbox' src={`https://www.google.com/maps/embed/v1/directions?origin=${nameloc !== undefined ? nameloc.city + " " + nameloc.locality + " " + nameloc.countryName : "udom"}&destination=${student !== null ? student.region + " " + student.district + " " + student.place : "udom, cive"}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}></iframe></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default IndividualStudent;
