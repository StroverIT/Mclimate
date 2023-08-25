import AppUtils from "../../../../../common/AppUtils";
import {FPUtils} from "../FPUtils";


/**
 * Creating device objects suitable for the floor plan
 *
 * @param floorPlanRef - reference of the floor plan object
 * @param devices - all building devices
 * @param returnFloorPlan - boolean
 * @returns if returnFloorPlan is true the method will return a new instance of the floor plan object
 */
export const mapDevicesData = (floorPlanRef, devices, returnFloorPlan = false) => {
  if (returnFloorPlan) {
    const fpCopy = AppUtils.createObjectCopy(floorPlanRef);
    mapData(fpCopy, devices);
    return fpCopy;
  }
  mapData(floorPlanRef, devices);
}

const mapData = (floorPlanRef, devices) => {
  devices.forEach(buildingDevice => {
    const searchedDevice = floorPlanRef.devices.find(fpDevice => {
      const deviceId = fpDevice.device_id ?? fpDevice.id;
       return deviceId === buildingDevice.controller_id;
    });
    if (searchedDevice) {
      searchedDevice.serial_number = searchedDevice.serial_number ?? buildingDevice.controller?.serial_number ?? buildingDevice.controller_log.serial_number;
      searchedDevice.online = buildingDevice.controller_log.online;
      searchedDevice.title = searchedDevice.title ?? buildingDevice.controller?.name ?? buildingDevice.controller_log.name;
      searchedDevice.settings.name.value = searchedDevice.title ?? buildingDevice.controller?.name ?? buildingDevice.controller_log.name;
      searchedDevice.type = searchedDevice.type ?? buildingDevice.controller?.type ?? buildingDevice.controller_log.type;
      searchedDevice.id = buildingDevice.controller_id;

      mapDeviceValues(searchedDevice, buildingDevice);
    }
  })
}

/**
 * Mapping the values from building device controller_log to the floor plan device object
 *
 * @param searchedDevice - floor plan device object
 * @param buildingDevice - the device assigned to the building
 * @param newDeviceToFP - is the device new for the floor plan
 * @returns device object with the necessary data for the floor plan (#settings)
 */
export const mapDeviceValues = (searchedDevice, buildingDevice, newDeviceToFP = false) => {
  const devicePropsObj = FPUtils.getControllerSettings(searchedDevice.type);

  Object.keys(devicePropsObj).forEach(key => {
    if (!devicePropsObj[key].dontShowAsAdditionalInfo) {
      if (buildingDevice.controller_log.hasOwnProperty(key)) {
        let value = buildingDevice.controller_log[key];
        if (key === 'motorPosition') {
          value = 100 - ((buildingDevice.controller_log[key] / buildingDevice.controller_log['motorRange']) * 100).toFixed(2);
        } else {
          value = checkValueIsNum(value);
        }
        setValueToFPDevice(searchedDevice, key, value, newDeviceToFP);
      }
    } else if (searchedDevice.settings.hasOwnProperty(key)) {
      delete searchedDevice.settings[key];
    }
  })
}

const setValueToFPDevice = (searchedDevice, key, value, newDeviceToFP) => {
  if (newDeviceToFP) {
    searchedDevice.settings[key] = {
      badgeVisibility: true,
      infoBlockVisibility: true,
      value: checkValueIsNum(value)
    }
  } else {
    searchedDevice.settings[key] = {
      badgeVisibility: searchedDevice.settings[key]?.badgeVisibility ?? false,
      infoBlockVisibility: searchedDevice.settings[key]?.infoBlockVisibility ?? false,
      value: checkValueIsNum(value)
    }
  }
}

const checkValueIsNum = (value) => {
  if (typeof value === 'number' && value % 1 !== 0) {
    return  value.toFixed(2);
  }
  return value
}