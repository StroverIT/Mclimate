import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {contentMapping} from "../../../../../../../../../helpers/nested_elements_helper";
import AppUtils from "../../../../../../../../../common/AppUtils";
import {mapAssetDevices} from "../../../../ValueEdit/components/helpers/mapAssetDevices";
import {filterDevices} from "../../../../../../../../../store/booleanWidget/actions";
import NestedDevices from "../../../../../helpers/NestedDevices/NestedDevices";
import {setBooleanWidgetValues} from "../../../../../../../../../store/booleanWidget/actions";
import GenericInput from "../../../../../../../../../components/GenericInput/Input/GenericInput";
import {InputTypes} from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import {setControllerProviderData} from "../../../../../../../../../helpers/backend_helper";
import {showMessage} from "../../../../../../../../../helpers/ui_helper";
import {useParams} from "react-router-dom";
import './data.scss'

const Data = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const allBuildings = useSelector((store) => store.buildings.buildings);
  const filterText = useSelector((store) => store.booleanWidget.filterDeviceText);
  const widgetValues = useSelector((store) => store.booleanWidget.values);

  const [allDevices, setAllDevices] = useState({assetDevices: null, buildingDevices: null});
  const [contentMappedDevices, setContentMappedDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const {buildingId} = useParams();

  useEffect(() => {
    if (widgetValues.selectedDevice && widgetValues.selectedDevice.id && widgetValues.selectedDevice.type) {
      handleDeviceChange(widgetValues.selectedDevice.id, widgetValues.selectedDevice.type, false)
    }
  }, [])

  useEffect(() => {
    getCurrentBuilding();
  }, [allBuildings])

  useEffect(() => {
    if (allDevices.assetDevices && allDevices.buildingDevices) {
      const mappedDevices = contentMapping(allDevices, renderDOMElement);
      setContentMappedDevices(mappedDevices.assetDevices);
    }
  }, [allDevices])

  useEffect(() => {
    callMapBuildingsData();
  }, [filterText, selectedDevice])

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  const getCurrentBuilding = (updatedBuildings = null) => {
    const buildings = updatedBuildings ?? allBuildings;
    const currentBuilding = buildings.find(building => building.id === parseInt(buildingId));
    if (currentBuilding) {
      mapBuildingsData([currentBuilding]);
    } else {
      mapBuildingsData(buildings); // in case of missing building
    }
  }

  const callMapBuildingsData = () => {
    if (allBuildings !== null && typeof allBuildings !== "undefined") {
      const allBuildingsCopy = allBuildings.map(el => {return {...el}});

      allBuildingsCopy.forEach(building => {
        let devicesCopy = building.devices.map(el => {return {...el}});
        if (filterText !== '') {
          devicesCopy = devicesCopy.filter(device => {
            return device.controller.name.toLowerCase().includes(filterText.toLowerCase()) ||
              device.controller.serial_number.toLowerCase().includes(filterText.toLowerCase())
          })
        }
        building.devices = devicesCopy;
      })

      getCurrentBuilding(allBuildingsCopy);
    }
  }

  const handleDeviceChange = (id, device, isClick) => {
    const deviceObj = {
      id: id,
      type: device.type,
      title: device.title,
      serialNumber: device.serialNumber,
      selectedField: null,
    }
    setSelectedDevice(deviceObj);
    if (isClick) {
      dispatch(setBooleanWidgetValues({...widgetValues, selectedDevice: deviceObj}));
    }
  }

  const renderDOMElement = (key, devices, isOuter) => {
    return <div
      id={key}
      key={key}
      unselectable="on"
      onClick={() => handleDeviceChange(key, devices[key], true)}
      className={`device-list-item non-draggable-list-item` +
        ` ${isOuter ? 'outer-list-item' : ''} ${selectedDevice?.id === key ? 'selected-device' : ''}`}
    >
      <img
        src={AppUtils.getDeviceImage(devices[key].type)}
        className="device-list-image"
        alt="device-icon"
        style={selectedDevice?.id === key ? {filter: AppUtils.changeSVGColor('#55AEE1')} : null}
      />
      {devices[key].title}
    </div>
  }

  const mapBuildingsData = (buildings) => {
    let assetDevices = [];
    buildings.forEach(building => {
      const mappedAssetDevices = [];
      building.devices.forEach(device => {
        mapAssetDevices(building, device, mappedAssetDevices);
      })
      assetDevices = assetDevices.concat(mappedAssetDevices)
    })
    setAllDevices({
      assetDevices: assetDevices,
      buildingDevices: {}
    })
  }

  const handleDeviceSearch = (value) => {
    dispatch(filterDevices(value));
  }

  const onChange = (inputId, event, inputType) => {
    setControllerProviderData({serial_number: widgetValues.selectedDevice.serialNumber})
      .then(response => {
        dispatch(setBooleanWidgetValues({
          ...widgetValues,
          widgetValue: response.provider[event.value],
          selectedDevice: {...widgetValues.selectedDevice, selectedField: event},
          displayOnText: `${event.label}: True`,
          displayOffText: `${event.label}: False`,
        }))
      })
      .catch(() => {
        showMessage("Something went wrong while loading boolean widget data", true);
      })
  }

  return (
    <div>
      <div style={{height: 35}}/>
      <div className={'controllers-container'}>
        <NestedDevices handleDeviceSearch={handleDeviceSearch} jsonData={contentMappedDevices}/>
      </div>
      <div style={{height: 25}}/>
      <h6>Field</h6>
      <hr/>
      <div style={{width: '35%'}}>
        <GenericInput
          elementType={InputTypes.SELECT}
          value={widgetValues.selectedDevice?.selectedField ?? null}
          valid={true}
          errorMsg={''}
          onChange={(e) => onChange('selectedField', e, InputTypes.SELECT)}
          elementConfig={{
            options: widgetValues.selectedDevice ? AppUtils.getControllerBoolFieldsByType(widgetValues.selectedDevice.type) : [],
            placeholder: 'Select field',
            classNamePrefix: "select2-selection",
            menuPlacement: 'top'
          }}
        />
      </div>
    </div>
  );
});

export default Data;