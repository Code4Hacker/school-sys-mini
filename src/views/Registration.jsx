import axios from 'axios';
import { Button } from 'primereact/button';
// import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext'
import React, { useRef } from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../paths/base_url';
import { useIdleTimer } from 'react-idle-timer';
import { useEffect } from 'react';
import Loading from '../components/Loading';
import emailjs from '@emailjs/browser';
const Registration = () => {
  const [checked1, setChecked1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const onIdle = () => {
    toast.loading("Please, don't take much time...");
  }
  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: .11 * 60 * 30000
  });
  const handleSubmit = async () => {
    window.localStorage.clear();
    toast.dismiss();
    if (username.length < 2) toast.error("username not meet requirements");
    if (password.length < 2) toast.error("password not meet requirements");

    if (!(username.length < 2) && !(password.length < 2)) {

      let the_body = JSON.stringify({
        "username": username,
        "password": password
      });
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
      }
      try {
        const checkingUser = await axios.request({
          url: `${baseURL}auth/login`,
          method: "POST",
          data: the_body,
          headers: headersList

        });
        console.log(checkingUser.data);
        if (checkingUser.data.code === 9000) {
          toast.success("Credential are Valid!\nlogin Successiful...");
          setTimeout(() => {
            toast.loading("Redirecting...");
            show ? setShow(false) : setShow(true);
            setShow(true);
            const {userType,token} = checkingUser.data.data;
            switch (userType) {
              case "SUPER_ADMIN":
                window.localStorage.setItem("admin", token);
                window.localStorage.setItem("role", "admin");
                window.localStorage.setItem("u_name", username);
                setTimeout(() => {
                  toast.dismiss();
                  console.log(token)
                  navigate("/dashboard");
                }, 1500);
                break;
              default:
                break;
            }
          }, 2000);
        } else {
          toast.error("Fail to Sign In.\ncredential are Incorrect!");
        }

      } catch (error) {
        toast.error(`Something went wrong! \n ${error}`);

        console.log(error)
      }

    }
  }
  
  const load = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
    const form = useRef();

  return (
    <>
      <div className="load">
        {
          show ? <Loading message={"Something Wrong"} /> : ""
        }
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">

          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            SCHOOL ADMINISTRATION
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm shadow-xl p-5 rounded-md border-b-8" style={{
          borderColor: 'var(--bold-ocean)'
        }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>

              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                style={{
                  backgroundColor: 'var(--bold-ocean)'
                }}
                onClick={handleSubmit}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Registration