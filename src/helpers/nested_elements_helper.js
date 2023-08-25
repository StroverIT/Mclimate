import {FPUtils} from "../pages/Buildings/ManageBuilding/FloorPlan/FPUtils";
import AppUtils from "../common/AppUtils";
import React from "react";

export const contentMapping = (allDevices, renderDOMElement) => {
  const allDevicesCopy = FPUtils.allDevices.map(item => {
    return item
  })

  const mapElementContent = (element) => {
    if (element.devices && Object.keys(element.devices).length > 0) {
      element.devices = mapDataToDOMElements(Object.keys(element.devices),
        `directly-attached-to-${element.id}`, element.devices, true);
    }

    if (Array.isArray(element.content)) {
      return {
        ...element,
        content: element.content.map(contentElement => mapElementContent(contentElement))
      }
    } else {
      return {
        ...element,
        content: element.content && Object.keys(element.content).length > 0 ?
          mapDataToDOMElements(Object.keys(element.content), element.id, element.content, false) : null
      }
    }
  }

  const renderBuildingDevices = () => {
    return mapDataToDOMElements(Object.keys(allDevices.buildingDevices),
      'top-attached', allDevices.buildingDevices, true);
  }

  const mapDataToDOMElements = (keys, containerKey, devices, isOuter) => {
    return keys.length > 0 ?
      <div key={containerKey}>
        {keys.map(key => {
          allDevicesCopy.push(
            {
              i: key, // Element key,
              image: AppUtils.getDeviceImage(devices[key]?.type),
              online: devices[key]?.online
            }
          )
          return renderDOMElement(key, devices, isOuter);
        })}
      </div> : null
  }

  const assetDevicesCopy = allDevices.assetDevices.map(el => {return {...el}})
  if (allDevices) {
    const assetDevices = assetDevicesCopy.map(el => mapElementContent(el));
    const buildingDevices = renderBuildingDevices();
    FPUtils.allDevices = allDevicesCopy;
    return {
      assetDevices, buildingDevices
    }
  }
}