import PropTypes from 'prop-types'
import React from "react"

import {Switch, BrowserRouter as Router} from "react-router-dom";
import {connect} from "react-redux"

// Import Routes all
import {AllRoutes} from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// main alert for errors
import SweetAlert from "react-bootstrap-sweetalert"
import {setNError, clearNToast} from "./store/layout/actions"
import Toasts from './components/Common/Toasts';

// Import scss
import "./assets/scss/theme.scss"

import NonAuthLayout from './components/NonAuthLayout';

// import mellisaBackend from "./helpers/AuthType/mellisaBackend"

// Activating fake backend
// mellisaBackend();
import AppSpinner from './components/Common/Spinner/AppSpinner'
import {API_ENTERPRISE_URL, API_URL, V1_POSTFIX, createInstances} from "./helpers/api_helper";

export const DefinedAxiosInstances = {
  BASE_URL: 'baseURL',
  ENTERPRISE_URL: 'enterpriseURL',
}

createInstances(
  {
    name: DefinedAxiosInstances.BASE_URL,
    config: {
      baseURL: `${API_URL}${V1_POSTFIX}`
    }
  },
  {
    name: DefinedAxiosInstances.ENTERPRISE_URL,
    config: {
      baseURL: `${API_ENTERPRISE_URL}`
    }
  }
)

const App = props => {

  return (
    <React.Fragment>
      <AppSpinner/>
      <Router>
        {props.layout.error &&
          <SweetAlert
            customClass='mclimate-sweetalert'
            confirmBtnCssClass="w-md btn btn-primary"
            type="custom"
            btnSize="xs"
            showCloseButton
            closeBtnStyle={{
              background: 'transparent',
              border: 'none',
              fontWeight: '100',
              boxShadow: 'none'
            }}
            title={'Error'}
            onConfirm={() => {
              props.setNError(false)
            }}
            onCancel={() => {
              props.setNError(false)
            }}>
            <p>{props.layout.errorMessage}</p>
          </SweetAlert>
        }

        {props.layout.toasts && props.layout.toasts !== undefined && typeof props.layout.toasts !== 'undefined' &&
          <Toasts close={props.clearNToast} toasts={props.layout.toasts}/>}

        <Switch>
          {Object.keys(AllRoutes).map((route, idx) => {
            return <Authmiddleware
              path={AllRoutes[route].path}
              layout={AllRoutes[route]?.public && NonAuthLayout}
              component={AllRoutes[route].component}
              key={idx}
              isAuthProtected={!AllRoutes[route].public}
              exact={!AllRoutes[route].public}
            />
          })}
        </Switch>

      </Router>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, {setNError, clearNToast})(App)