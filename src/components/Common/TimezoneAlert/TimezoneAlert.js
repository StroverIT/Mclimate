import React, { useEffect, useState } from "react"
 
// Redux
import { connect, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

import SweetAlert from "react-bootstrap-sweetalert"
import { AllRoutes } from "../../../routes/allRoutes";

const TimezoneAlert = () => { 
    let history = useHistory();
    const user = useSelector((store) => store.Profile.user);
    const [timezoneAlert, showTimezoneAlert] = useState(false)

    useEffect(() => {
        if (!user?.country_id) {
            showTimezoneAlert(true)
        }
    }, [])
       
    return (
        <React.Fragment>
            {timezoneAlert && (
                <SweetAlert
                    customClass='mclimate-sweetalert'
                    title={`Timezone information missing`}
                    type="custom"
                    btnSize="xs"
                    showCancel
                    showCloseButton
                    closeBtnStyle={{ background: 'transparent', border: 'none', fontWeight: '100', boxShadow: 'none' }}
                    confirmBtnText="Navigate me"
                    confirmBtnCssClass="w-md btn btn-primary"
                    cancelBtnCssClass="w-md btn btn-grey"
                    onConfirm={() => {
                        history.push(AllRoutes.USER_PROFILE.path);
                    }}
                    onCancel={() => showTimezoneAlert(false)}>
                    <p>{`You should add information about your timezone in order to be able to use time-related functionalities. The settings are located in your profile page.`}</p>
                </SweetAlert>
            )}
        </React.Fragment>
    )
}

export default TimezoneAlert