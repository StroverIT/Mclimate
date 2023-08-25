import * as React from "react";
import humidityIcon from "../../../../assets/images/common/humidity_icon.svg";
import batteryIcon from "../../../../assets/images/common/battery.svg";
import AppUtils from "../../../../common/AppUtils";
import valve from '../../../../assets/images/devices/vicki_lorawan_new.svg'
import openWindowSVG from '../../../../assets/images/common/open-window.svg'
import controllerTypes from "../../../../common/data/controllers-types";

export const deviceInfoTypes = {
  BADGE: 'badge',
  INFO_BLOCK: 'info_block'
}

export class FPUtils {
  static allDevices = [];
  static floorPlanDevices = [];
  static allBuildingDevices = [];

  static getItemImage = (itemKey) => {
    const device = FPUtils.allDevices.find(item => parseInt(item.i) === parseInt(itemKey));
    if (device) {
      return device.image;
    }
    return null;
  }

  static getItemTitle = (itemKey) => {
    const device = FPUtils.allDevices.find(item => parseInt(item.i) === itemKey);
    if (device) {
      return device.title;
    }
    return null;
  }

  static getItemStatus = (itemKey) => {
    const device = FPUtils.allDevices.find(item => parseInt(item.i) === parseInt(itemKey));
    if (device) {
      return device.online;
    }
    return null;
  }

  static getFPDeviceById = (id) => {
    const device = FPUtils.floorPlanDevices.find(item => parseInt(item.id) === parseInt(id));
    if (device) {
      return device;
    }
    return null;
  }

  static findBuildingDevice = (id) => {
    const device = FPUtils.allBuildingDevices.find(item => parseInt(item.id) === parseInt(id));
    if (device) {
      return device;
    }
    return null;
  }

  static copyFPObject = (floorPlan) => {
    const imageObj = floorPlan.image;
    const fpCopy = AppUtils.createObjectCopy(floorPlan);
    fpCopy.image = imageObj;
    return { ...fpCopy };
  }

  static getControllerSettings = (deviceType) => {
    const deviceProps = controllerTypes.find(controller => controller.type === deviceType);
    let devicePropsObj = {};

    if (deviceProps) {
      deviceProps.table.forEach(item => {
        devicePropsObj[item.key] = {...item}
      })
    }
    return devicePropsObj
  }

  static getInfoBlockItemValue = (key, fpDevice, suffix) => {
    switch (key) {
      case 'lastActive':
        return AppUtils.renderLocalDateTime(fpDevice.settings[key].value, true)
      case 'openWindow':
      case 'childLock':
      case 'thermistorProperlyConnected':
        return fpDevice.settings[key].value ? "Yes" : "No"
      case 'status':
        return fpDevice.type === 'open_close_sensor' ? fpDevice.settings[key].value === 0 ? "Closed" : "Open" : fpDevice.settings[key].value === 0 ? "OFF" : "ON"
      case 'pressEvent':
        return fpDevice.settings[key].value === '00' ? "Not pressed" : fpDevice.settings[key].value === '01' ? "Pressed" : fpDevice.settings[key].value === '02' ? "Pressed twice" : fpDevice.settings[key].value === '03' ? "Pressed 3 times" : "-"
      default:
        return `${fpDevice.settings[key].value} ${suffix}`
    }
  }

  // For generating badges and info block(#settings)
  static getDevicePropValueByKey = (devicePropsObj, fpDevice, key, infoType) => {
    if (infoType === deviceInfoTypes.BADGE) {
      switch (key) {
        case 'name':
        case 'accuracy_aqi':
        case 'pressure':
        case 'VOC':
        case 'flood':
        case 'CO2':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={`device-badge ${key === 'name' ? 'fp-device-name' : ''}`} title={devicePropsObj[key]?.name}>
              <div className={key === 'name' ? 'name-wrapper' : ''}>
                {fpDevice.settings[key].value} {devicePropsObj[key]?.suffix ?? ''}
              </div>
            </div>
          }
          return null
        case 'displayDigits':
        case 'temperature':
        case 'sensorTemperature':
        case 'ambientTemp':
        case 'target_temperature':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge target-temperature'} title={devicePropsObj[key]?.name}>
              <div><i className="uil-solid uil-temperature-half" />{fpDevice.settings[key].value}{devicePropsObj[key]?.suffix ?? '℃'}</div>
            </div>
          }
          return null
        case 'motorPosition':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div><img src={valve} style={{ height: 15 }} /> {fpDevice.settings[key].value}{devicePropsObj[key]?.suffix ?? ''}</div>
            </div>
          }
          return null
        case 'openWindow':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div><img src={openWindowSVG} style={{ height: 15 }} />
                &nbsp;{fpDevice.settings[key].value ? "Yes" : "No"}
              </div>
            </div>
          }
          return null
        case 'childLock':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div><i className="uil-solid uil-lock-alt" />
                &nbsp;{fpDevice.settings[key].value ? "Yes" : "No"}
              </div>
            </div>
          }
          return null
        case 'humidity':
        case 'relativeHumidity':
        case 'relative_humidity':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge humidity-container'} title={devicePropsObj[key]?.name}>
              <img
                src={humidityIcon}
                className={'humidity-icon'}
                style={{ filter: AppUtils.changeSVGColor('#54A9DB') }}
              />
              <div>&nbsp;{fpDevice.settings[key].value}{devicePropsObj[key]?.suffix ?? '%'}</div>
            </div>
          }
          return null
        case 'batteryVoltage':
        case 'voltage':
        case 'battery_status':
        case 'powerSupplyVoltage':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div className={'fp-battery'}>
                <img
                  src={batteryIcon}
                  className={'fp-battery'}
                  style={{ filter: AppUtils.changeSVGColor('#61DC00') }}
                />
              </div>
              <div style={{ color: '#61DC00' }}>{fpDevice.settings[key].value}{devicePropsObj[key]?.suffix ?? 'V'}</div>
            </div>
          }
          return null
        case 'rssi':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div>{devicePropsObj[key]?.suffix ?? 'RSSI'}: {fpDevice.settings[key].value}</div>
            </div>
          }
          return null
        case 'spf':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div>{devicePropsObj[key]?.suffix ?? 'SF'}: {fpDevice.settings[key].value}</div>
            </div>
          }
          return null
        case 'frameCount':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div>{devicePropsObj[key]?.suffix ?? 'FC'}: {fpDevice.settings[key].value}</div>
            </div>
          }
          return null
        case 'lastActive':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div>{AppUtils.renderLocalDateTime(fpDevice.settings[key].value, true)}</div>
            </div>
          }
          return null
        case 'thermistorProperlyConnected':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div>Thermistor: {fpDevice.settings[key].value ? 'Yes' : 'No'}</div>
            </div>
          }
          return null
        case 'pressEvent':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div>Press event: {fpDevice.settings[key].value === '00' ? "Not pressed" : fpDevice.settings[key].value === '01' ? "Pressed" : fpDevice.settings[key].value === '02' ? "Pressed twice" : fpDevice.settings[key].value === '03' ? "Pressed 3 times" : "-"}</div>
            </div>
          }
          return null
        case 'status':
          if (fpDevice.settings[key].badgeVisibility) {
            return <div key={key} className={'device-badge'} title={devicePropsObj[key]?.name}>
              <div>Status: {fpDevice.type === 'open_close_sensor' ? fpDevice.settings[key].value === 0 ? "Closed" : "Open" : fpDevice.settings[key].value === 0 ? "OFF" : "ON" }</div>
            </div>
          }
          return null
      }
    }
    else {
      if (fpDevice.settings[key].infoBlockVisibility) {
        let suffix = `${devicePropsObj[key]?.suffix ?? ''}`;
        let isNameKey = key === 'name';

        if (!suffix || suffix.toLowerCase() === devicePropsObj[key]?.name.toLowerCase()) {
          suffix = '';
        }
        if (isNameKey) {
          return <div id={`info-block-${key}`} key={`info-block-${key}`} style={{ fontSize: 16, paddingBottom: 10, color: '#525456' }}>
            <div>{fpDevice.settings[key].value}</div>
          </div>
        }

        return <div id={`info-block-${key}`} key={`info-block-${key}`}>
          <div style={{ fontSize: 12, color: 'gray' }}>{devicePropsObj[key]?.name} : {FPUtils.getInfoBlockItemValue(key, fpDevice, suffix)}</div>
        </div>
      }
    }
  }
}