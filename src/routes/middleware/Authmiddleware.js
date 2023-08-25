import React from "react"
import PropTypes from "prop-types"
import {Route, Redirect} from "react-router-dom"
import ErrorBoundary from "../../components/Common/ErrorBoundary/ErrorBoundary";
import {AllRoutes} from "../allRoutes";

const Authmiddleware = ({component: Component, layout: Layout, isAuthProtected, ...rest}) => (
  <Route {...rest}
         render={props => {
           if (isAuthProtected) {
             return (
               <Redirect
                 to={{pathname: AllRoutes.CUSTOMIZABLE_DASHBOARD.path, state: {from: props.location}}}
               />
             )
           }

           return (
             <Layout>
               <ErrorBoundary>
                 <Component {...props} />
               </ErrorBoundary>
             </Layout>
           )
         }}
  />
)

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
}

export default Authmiddleware
