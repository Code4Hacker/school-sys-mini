import { ProgressSpinner } from 'primereact/progressspinner'
import React, { useState } from 'react'

const Loading = ({ message }) => {
    const [show, setShow] = useState(false);
    setTimeout(() => {
        setShow(true);
    }, 4000);
    return (
        <div>
            <div className="card" style={{
                display: !show ? "block" : "none",
                textAlign:"center",

            }}>
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />

            </div>
            <div className="card text-center p-4 text-sharp" style={{
                display: show ? "block" : "none"
            }}>
                {message}
            </div>
        </div>
    )
}

export default Loading