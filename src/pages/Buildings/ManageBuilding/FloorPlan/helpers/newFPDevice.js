import {FPUtils} from "../FPUtils";
import {showMessage} from "../../../../../helpers/ui_helper";
import {mapDeviceValues} from "./mapDevicesData";

export const setDroppedDeviceData = (device) => {
  const obj = {
    tooltipBadges: {
      show: true,
      showWhen: 'hover'
    },
    infoBlock: {
      show: true,
      showWhen: 'hover'
    },
    coordinates: [],
    image: '',
    settings: {
      name: {
        value: '',
        badgeVisibility: true,
        infoBlockVisibility: true,
      }
    }
  }

  try {
    const searchedDevice = FPUtils.allBuildingDevices.find(fpDevice => fpDevice.controller_id === parseInt(device.id));
    if (searchedDevice) {
      obj.serial_number = searchedDevice.controller.serial_number;
      obj.online = searchedDevice.controller_log.online;
      obj.title = searchedDevice.controller.name;
      obj.settings.name.value = searchedDevice.controller.name;
      obj.type = searchedDevice.controller.type;
      obj.id = searchedDevice.controller.id;
      obj.coordinates = device.coordinates;
      obj.image = device.image;
      delete searchedDevice.controller_log.online;

      mapDeviceValues(obj, searchedDevice, true);
    }
    return obj;
  } catch (e) {
    console.log(e);
    showMessage('Something went wrong with adding the device to the floor plan.', true)
    return null;
  }
}