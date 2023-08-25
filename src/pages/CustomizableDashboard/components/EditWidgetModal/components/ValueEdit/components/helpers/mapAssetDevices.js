import buildingImage from "../../../../../../../../assets/images/buildings/building-menu-icon.svg";
import * as React from "react";

export const mapAssetDevices = (currentTopLevelAsset, device, mappedAssetDevices) => {
  // In the current case, device is expected to have building_id, because Building is the top level asset
  if (device.building_id !== null) {
    const foundTopLevelAssetInstance = mappedAssetDevices.find(el => el.id === device.building_id);
    if (foundTopLevelAssetInstance) {
      updateExistingAsset(device, 1, foundTopLevelAssetInstance, currentTopLevelAsset);
    } else {
      // We still don't have top level asset with such id in the collection, so we create => newTopLevelAssetInstance
      const newTopLevelAssetInstance = {
        id: device.building_id,
        type: 'building',
        title: currentTopLevelAsset.name,
        icon: <img className={'building-image'} src={buildingImage} alt="building-icon"/>
      }
      updateNewAsset(device, 1, newTopLevelAssetInstance, currentTopLevelAsset);
      mappedAssetDevices.push(newTopLevelAssetInstance);
    }
  }
}

/**
 * It's important to keep level indexes in logically correct order
 * Top level asset must have level = 0, most nested asset has the highest level
 * @type {[{level: number, asset: string}]}
 */
export const levels = [
  {
    level: 0,
    asset: 'building'
  },
  {
    level: 1,
    asset: 'floor'
  },
  {
    level: 2,
    asset: 'space'
  },
  {
    level: 3,
    asset: 'room'
  }
]

const updateExistingAsset = (device, level, parentInstance, building) => {
  const levelObj = levels.find(item => item.level === level);
  if (device[`${levelObj.asset}_id`] !== null) {
    const foundAsset = parentInstance.content?.find(asset => asset.id === device[`${levelObj.asset}_id`]);
    if (foundAsset) {
      if (level < levels.length - 1) {
        updateExistingAsset(device, level + 1, foundAsset, building);
      } else {
        // Last level reached => pushing device content object
        if (foundAsset.content) {
          foundAsset.content[device.controller_id] = createDeviceContentObject(device);
        } else {
          foundAsset.content = {
            [device.controller_id]: createDeviceContentObject(device)
          }
        }
      }
    } else {
      // Asset is missing from the collection, so we add it
      addMissingAsset(device, levelObj, parentInstance, building);
    }
  } else {
    // Device has no asset id => Device should be attached directly to parent asset (parentInstance)
    if (parentInstance.devices) {
      parentInstance.devices[device.controller_id] = createDeviceContentObject(device);
    } else {
      parentInstance.devices = {
        [device.controller_id]: createDeviceContentObject(device)
      }
    }
  }
}

const updateNewAsset = (device, level, parentInstance, building) => {
  const levelObj = levels.find(item => item.level === level);
  if (device[`${levelObj.asset}_id`] !== null) {
    // Asset is missing from the collection (we are currently building the collection), so we add it
    addMissingAsset(device, levelObj, parentInstance, building);
  } else {
    parentInstance['devices'] = {
      [device.controller_id] : createDeviceContentObject(device)
    };
  }
}

const addMissingAsset = (device, levelObj, parentInstance, building) => {
  const newAsset = {
    id: device[`${levelObj.asset}_id`],
    type: levelObj.asset,
    title: building[`${levelObj.asset}s`].find(asset => asset.id === device[`${levelObj.asset}_id`])?.name,
  }
  if (levelObj.level < levels.length - 1) {
    updateNewAsset(device, levelObj.level + 1, newAsset, building);
  } else {
    // Last level reached => pushing device content object
    newAsset.content = {
      [device.controller_id]: createDeviceContentObject(device)
    }
  }
  parentInstance['content'] ? parentInstance['content'].push(newAsset) : parentInstance['content'] = [newAsset];
}

const createDeviceContentObject = (device) => {
  return {
    title: device.controller.name,
    serialNumber: device.controller.serial_number,
    type: device.controller.type,
    online: device.controller_log?.online
  }
}