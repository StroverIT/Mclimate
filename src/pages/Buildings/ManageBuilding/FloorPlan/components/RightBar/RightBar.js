import * as React from 'react';
import NestedDynamicInput from "../../../../../../components/Common/NestedDynamicInput/NestedDynamicInput";
import SplitterLayout from "react-splitter-layout";
import {useDispatch, useSelector} from "react-redux";
import {DeviceSettings} from "./components/DeviceSettings/DeviceSettings";
import {Button} from "reactstrap";
import closeIcon from "../../../../../../assets/images/common/close-icon.svg"
import AppUtils from "../../../../../../common/AppUtils";
import {useState} from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import {filterDevices, removeFPDevice} from "../../../../../../store/floorPlan/actions";
import GenericInput from "../../../../../../components/GenericInput/Input/GenericInput";
import buildingImage from "../../../../../../assets/images/buildings/building-menu-icon.svg";
import './rightBar.scss';

const RightBar = ({devices}) => {
  const dispatch = useDispatch();
  const selectedDevice = useSelector((store) => store.floorPlan.device);
  const currentBuilding = useSelector((store) => store.buildings.building);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  const handleDeviceSearch = (deviceFilterText) => {
    dispatch(filterDevices(deviceFilterText));
  }

  const deviceListSection = <div className={'right-bar-container'}>
    <div className={'right-bar-device-container'}>
      <p className="device-list-header">Device list</p>
      <hr className="mb-0" />
    </div>
    <div className="search-for-devices-outer-container">
      <div className="search-box search-for-devices-inner-container">
        <div className="position-relative">
          <GenericInput
            classNameProp={'form-control search-for-devices-input'}
            elementConfig={{
              type: "text",
              placeholder: "Search for devices...",
              onKeyUp: (e) => handleDeviceSearch(e.target.value)
            }}
          />
          <i className="mdi mdi-magnify search-icon"></i>
        </div>
      </div>
    </div>
    <div className="nested-devices-container">
      <div style={{display: "flex"}}>
        <img className={'building-image'}
             src={buildingImage}
             alt="building-image-icon"/>
        {currentBuilding?.name}
      </div>
      <hr className="building-name-hr"/>
      {!devices || (!devices.buildingDevices && (!devices.assetDevices || devices.assetDevices.length === 0)) ?
        "No devices found" :
        <>
          {devices?.buildingDevices}
          <NestedDynamicInput key={"nested-input"} jsonData={devices?.assetDevices}/>
        </>
      }
    </div>
  </div>

  const deviceSettingsSection = <div className={'right-bar-container'}>
    <div className={'right-bar-device-container'}>
      <DeviceSettings />
      <div className="remove-device-btn-container">
        <Button
          className="fp-gray-btn remove-device-btn"
          onClick={() => setShowConfirmAlert(true)}>
          <img
            src={closeIcon}
            alt="close-icon"
            style={{filter: AppUtils.changeSVGColor('#D84C63'), width: 20, height: 20}}
          />
          <span className="remove-device-btn-text">Remove device from floor map</span>
        </Button>
      </div>
    </div>
  </div>

  const handleDeviceRemove = () => {
    dispatch(removeFPDevice(selectedDevice.id));
    setShowConfirmAlert(false);
  }

  return (
    <div className={'right-bar-floor-plan'}>
      <SplitterLayout
        vertical={true}
        borderColor="#999"
        percentage={false}
        primaryInitialSize={400}
        primaryMinSize={200}
        secondaryInitialSize={400}
        secondaryMinSize={200}>
        {deviceListSection}
        {selectedDevice ? deviceSettingsSection : null}
      </SplitterLayout>
      {showConfirmAlert &&
        <SweetAlert
          customClass='mclimate-sweetalert'
          title={`Remove device from floor plan`}
          type="custom"
          btnSize="xs"
          showCancel
          showCloseButton
          closeBtnStyle={{background: 'transparent', border: 'none', fontWeight: '100', boxShadow: 'none'}}
          confirmBtnText="Yes, remove"
          confirmBtnCssClass="w-md btn btn-danger"
          cancelBtnCssClass="w-md btn btn-grey"
          onConfirm={() => handleDeviceRemove()}
          onCancel={() => setShowConfirmAlert(false)}>
          <p>{`Are you sure you want to remove ${selectedDevice?.title} from the floor plan?`}</p>
        </SweetAlert>
      }
    </div>
  );
};

export default RightBar