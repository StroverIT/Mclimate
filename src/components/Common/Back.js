import React from "react"
import { useHistory } from "react-router-dom"
import { Row, Col } from "reactstrap"

import arrBack from "../../assets/images/arr-back.svg";

const Back = ({mbNumber}) => {
  let history = useHistory();

  return (
    <Row>
      <Col lg={12}>
        <div onClick={()=>{history.goBack()}} className={`mb-${mbNumber ?? 3} me-3 d-flex back-button justify-content-center align-items-center`}>
            <img className="filter-dark-grey" width='15px' src={arrBack}/>
            <p className="m-0">Back</p>
        </div>
      </Col>
    </Row>
  )
}

export default Back
