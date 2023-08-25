import * as React from 'react';
import {Spinner} from "reactstrap";
import './appSpinner.scss'
import {useSelector} from "react-redux";


const AppSpinner = (props) => {
  const show = useSelector((store) => store.appSpinner.loading);
  return (
    <div className={show ? 'showActionSpinner' : 'hideActionSpinner'} key={'spinner'}>
      <Spinner className="" color="primary" />
    </div>
  );
};
export default AppSpinner