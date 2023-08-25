import React, {createRef, forwardRef, useImperativeHandle} from 'react';
import AppUtils from "../../../../../../../../../common/AppUtils";
import {Button} from "reactstrap";
import plusIcon from "../../../../../../../../../assets/images/common/plusIcon.svg";
import AddDeviceModal from "./components/AddDeviceModal/AddDeviceModal";
import {useDispatch, useSelector} from "react-redux";
import {setChartDevicesModal} from "../../../../../../../../../store/chartWidget/actions";
import DynamicDeviceFragment from "./components/DeviceFragment/DynamicDeviceFragment";
import "./data.scss";

const Data = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const widgetValues = useSelector((store) => store.chartWidget.values);
  const dynamicDeviceFragmentRef = createRef();

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  return (
    <>
      <div style={{height: 35}}/>
      <DynamicDeviceFragment
        ref={dynamicDeviceFragmentRef}
        createdInputs={widgetValues.selectedDevices}
      />
      <Button className={`add-new-value-control`}
              onClick={() => dispatch(setChartDevicesModal({isOpen: true, selectedDeviceIndex: -1}))}>
        <img src={plusIcon} alt={''}
             style={{filter: AppUtils.changeSVGColor('#57AFDF'), width: 12, margin: '0 7px 2px 0'}}/>
        Add Device
      </Button>
      <AddDeviceModal/>
    </>
  );
});

export default Data;