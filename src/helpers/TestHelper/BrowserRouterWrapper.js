import {BrowserRouter} from "react-router-dom";

const BrowserRouterWrapper = ({children}) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

export default BrowserRouterWrapper;