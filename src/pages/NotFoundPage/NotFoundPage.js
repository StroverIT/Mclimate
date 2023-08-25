import React from 'react';
import NotFoundImage from '../../assets/images/404-image.png'
import {Button} from "reactstrap";
import {useHistory} from "react-router-dom";
import './notFoundPage.scss'
import {AllRoutes} from "../../routes/allRoutes";

const NotFoundPage = () => {
  const history = useHistory();
  return (
    <div className={'not-found-wrapper'}>
      <img src={NotFoundImage} alt="no-image" className={'not-found-image'}/>
      <h3 style={{color: '#F7D53B'}}>Something's wrong here.</h3>
      <p style={{color: 'white'}}>The page you're looking for can't be found.</p>
      <div style={{height: 20}}/>
      <Button
        color="primary"
        className="btn btn-primary waves-effect waves-light float-md-end"
        onClick={() => {
          history.push(AllRoutes.DASHBOARD.path)
        }}
      >
        <i className="uil-arrow-left"/>&nbsp; Back To Enterprise
      </Button>
    </div>
  );
};

export default NotFoundPage;