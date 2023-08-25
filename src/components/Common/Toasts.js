import React, { useState, useEffect } from "react";
import { Toast, ToastBody, ToastHeader, ToastContainer } from "react-bootstrap";
import moment from 'moment';


const Toasts = (props) => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        setToasts(props.toasts);
    }, [props.toasts])

    const getTime = (time) => {
        let startTime = moment(new Date(time), 'DD-MM-YYYY hh:mm:ss');
        let endTime = moment(new Date(), 'DD-MM-YYYY hh:mm:ss');

        let hoursDiff = endTime.diff(startTime, 'hours');
        let minutesDiff = endTime.diff(startTime, 'minutes');
        let secondsDiff = endTime.diff(startTime, 'seconds');

        if(minutesDiff == 0 && hoursDiff == 0 ) return secondsDiff == 0 ?  'just now' : `${secondsDiff} second${secondsDiff > 1 ? 's' : ''} ago`
        else if(minutesDiff !== 0 && hoursDiff == 0) return `${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`
        else if(hoursDiff !== 0 && minutesDiff !== 0) return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`
        else return ''
    }

    return (
        <React.Fragment>
            <ToastContainer className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: "100000" }}>
                {toasts.map((toast, i) => {
                    return <Toast className="custom-toast" bg='white' onClose={() => { props.close(toast.time) }} key={i}>
                        <ToastHeader>
                            {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" /> */}
                            <p className="me-auto mb-0">{toast.title}</p>
                            <small className="text-muted">{getTime(toast.time)}</small>
                        </ToastHeader>
                        <ToastBody>{toast.msg}</ToastBody>
                    </Toast>
                })}
            </ToastContainer>
        </React.Fragment>
    );
};

export default Toasts;
