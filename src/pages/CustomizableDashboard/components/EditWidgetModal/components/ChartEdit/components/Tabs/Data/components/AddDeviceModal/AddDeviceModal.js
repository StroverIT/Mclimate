import React, {useEffect, useState} from 'react';
import {Button, Modal, ModalBody} from "reactstrap";
import {
  filterDevices,
  setChartData,
  setChartDevicesModal, setControllersFields
} from "../../../../../../../../../../../store/chartWidget/actions";
import {batch, useDispatch, useSelector} from "react-redux";
import NestedDevices from "../../../../../../../helpers/NestedDevices/NestedDevices";
import {contentMapping} from "../../../../../../../../../../../helpers/nested_elements_helper";
import {mapAssetDevices} from "../../../../../../ValueEdit/components/helpers/mapAssetDevices";
import AppUtils from "../../../../../../../../../../../common/AppUtils";
import {unstable_batchedUpdates} from "react-dom";
import {setChartWidgetValues} from "../../../../../../../../../../../store/chartWidget/actions";
import { v4 as uuidv4 } from 'uuid';
import {CHART_TYPES} from "../DeviceFragment/DeviceFragment";
import {controllersChartData} from "../../../../../helpers";
import {useParams} from "react-router-dom";
import {showMessage} from "../../../../../../../../../../../helpers/ui_helper";
import "./addDeviceModal.scss";

const AddDeviceModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(state => state.chartWidget.isChartDevicesModalOpen)
  const allBuildings = useSelector((store) => store.buildings.buildings);
  const filterText = useSelector((store) => store.chartWidget.filterDeviceText);
  const widgetValues = useSelector((store) => store.chartWidget.values);
  const controllersFields = useSelector(store => store.chartWidget.controllersFields);

  const [allDevices, setAllDevices] = useState({assetDevices: null, buildingDevices: null});
  const [contentMappedDevices, setContentMappedDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const {buildingId} = useParams();

  useEffect(() => {
    getCurrentBuilding();
  }, [allBuildings, isModalOpen])

  useEffect(() => {
    if (allDevices.assetDevices && allDevices.buildingDevices) {
      const mappedDevices = contentMapping(allDevices, renderDOMElement);
      setContentMappedDevices(mappedDevices.assetDevices);
    }
  }, [allDevices])

  useEffect(() => {
    callMapBuildingsData();
  }, [filterText, selectedDevice])

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
      componentId: uuidv4(), // unique ID used to distinguish between identical instances
      selectedField: null,
      deviceAxisSettings: {
        chartType: CHART_TYPES.LINE_CHART,
        color: `#${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}`
      }
    }
    setSelectedDevice(deviceObj);
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

  const closeModal = () => {
    unstable_batchedUpdates(() => {
      setSelectedDevice(null);
      dispatch(setChartDevicesModal({isOpen: false, selectedDeviceIndex: -1}));
    })
  }

  const handleDeviceSearch = (value) => {
    dispatch(filterDevices(value));
  }

  const handleSave = () => {
    const widgetValuesCopy = AppUtils.createObjectCopy(widgetValues);

    if (isModalOpen.selectedDeviceIndex === -1) {
      widgetValuesCopy.selectedDevices = AppUtils.createObjectArrayCopy(widgetValues.selectedDevices).concat([{...selectedDevice}]);
      const controllersFieldsCopy = AppUtils.createObjectCopy(controllersFields);

      if (!selectedDevice) {
        showMessage('Please select a device first.', true);
        return;
      }

      if (!controllersFieldsCopy.hasOwnProperty(selectedDevice.serialNumber)) {
        const fields = AppUtils.getControllerFieldsByType(selectedDevice.type);
        if (fields.length > 0) {
          controllersFieldsCopy[selectedDevice.serialNumber] = fields;
        }
      }

      batch(() => {
        dispatch(setControllersFields(controllersFieldsCopy));
        dispatch(setChartWidgetValues(widgetValuesCopy))
      })
    } else {
      const prevDevice = {...widgetValuesCopy.selectedDevices[isModalOpen.selectedDeviceIndex]};
      const controllersFieldsCopy = AppUtils.createObjectCopy(controllersFields);

      if (prevDevice.selectedField) {
        const deviceIndex = controllersChartData.findIndex(device => device.componentId === prevDevice.componentId);
        if (deviceIndex !== -1) {
          controllersChartData.splice(deviceIndex, 1); // remove data for the selected field(this will affect the chart)
          controllersFieldsCopy[prevDevice.serialNumber].push(prevDevice.selectedField);
        }
      }

      if (!controllersFieldsCopy.hasOwnProperty(selectedDevice.serialNumber)) {
        controllersFieldsCopy[selectedDevice.serialNumber] = AppUtils.getControllerFieldsByType(selectedDevice.type);
      }

      widgetValuesCopy.selectedDevices[isModalOpen.selectedDeviceIndex] = selectedDevice;
      batch(() => {
        dispatch(setControllersFields(controllersFieldsCopy));
        dispatch(setChartData([...controllersChartData]));
        dispatch(setChartWidgetValues(widgetValuesCopy));
      })
    }
    closeModal();
  }

  return (
    <Modal
      id={'addDevicesModal'}
      isOpen={isModalOpen.isOpen}
      toggle={closeModal}
      centered
      autoFocus={false}
      scrollable={false}
      size="xl"
    >
      <ModalBody className='add-devices-modal-body'>
        <NestedDevices handleDeviceSearch={handleDeviceSearch} jsonData={contentMappedDevices}/>
      </ModalBody>
      <footer className={'modal-widget-footer'}>
        <Button
          color="primary"
          className="btn btn-primary waves-effect waves-light float-md-end widget-modal-save-btn"
          onClick={handleSave}
        >
          <i className="uil-save"/>&nbsp; Save
        </Button>
      </footer>
    </Modal>
  );
};

export default AddDeviceModal;