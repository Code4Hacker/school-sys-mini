import React, { useEffect, useRef } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import {  ArrowDown, Fullscreen, Toggle2On } from 'react-bootstrap-icons'
import { udom_logo } from '../assets'
import { Link, useNavigate } from 'react-router-dom'

const Topbar = ({ headline, subheadline, note}) => {
  const tableRef = useRef(null);
  const navigator = useNavigate();

  const enterFullscreen = () => { };
  
  
  return (
    <div className='' style={{
      position:'relative',
      overflow:'hidden',
      width:'100%'
    }} onClick={enterFullscreen}>
        <Row className='' style={{
          background: 'var(--bold-ocean)'
        }}>
          <div className="flex_box top-bar snippe_top" style={{
            "--width": 'auto', "--width-two": 'auto', '--height': 'auto'
          }}>
            <div className="">
              <button className="primary text-larger">
                <i><Toggle2On /></i>
              </button>
            </div>
            <div className="border_end">
              <button className='primary'>
                <span className="icon-b" style={{
                  position: 'relative',
                  top: '0px',
                  fontSize:'large'
                }}><Fullscreen /></span>
                <div className="image">
                  <img src={udom_logo} alt="" />
                </div>
                <div className="">
                  <span>Paulo(Student)</span>
                </div>
                <span className='icon-bg'><ArrowDown /></span>
              </button>
            </div>
          </div>
        </Row>
        <Row className="divider" style={{
          background: 'var(--light)'
        }}>
          <div className="flex_box top-bar" style={{
            "--width": 'auto', "--width-two": 'auto', '--height': 'auto'
          }}>
            <div className="">
              <h4 className='page-title'>{headline} <span>{note}</span></h4>
            </div>
            <div className="flex">
               <span><Link className='link' to={''}>School Administration SYS </Link><span>/{subheadline}</span></span>
            </div>
          </div>
        </Row>
    </div>
  )
}

export default Topbar