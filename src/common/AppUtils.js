import { hexToCSSFilter } from "hex-to-css-filter";
import vicki from "../assets/images/devices/vicki_lorawan_new.svg";
import ht from "../assets/images/devices/ht.svg";
import aqi_sensor from "../assets/images/devices/ht.svg";
import co2_sensor from "../assets/images/devices/ht.svg";
import t_flood from "../assets/images/devices/flood-sensor.svg";
import t_valve from "../assets/images/devices/t-valve.svg";
import thermostat from "../assets/images/devices/thermostat.svg";
import dsk_device from "../assets/images/devices/dsk_device.svg";
import mc_button from "../assets/images/devices/mc_button.svg";
import default_icon from "../assets/images/devices/no-device-icon.svg";
import open_close_sensor from "../assets/images/devices/open-close.svg";
import wireless_thermostat from "../assets/images/devices/wireless_thermostat.svg";

import { showMessage } from "../helpers/ui_helper";
import moment from "moment";
import { controllerTypes } from "./data";

const moment_timezone = require("moment-timezone/builds/moment-timezone-with-data-1970-2030");

export default class AppUtils {
  static defaultDateTimeValue = '1970-01-01T00:00:00'
  static moment_timezone = moment_timezone;
  static timezone = AppUtils.getCookie("Time-Zone") || AppUtils.setCookie("Time-Zone", AppUtils.moment_timezone.tz.guess(), 1000);
  static file_types = {
    JPG: 'image/jpeg,image/x-citrix-jpeg,image/pjpeg,',
    PNG: 'image/png,image/x-citrix-png,image/x-png,',
    BMP: 'image/bmp,',
    ICO: 'image/x-icon',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,',
    PDF: 'application/pdf'
  }

  static getDropDownTimeZoneList = () => {
    return AppUtils.moment_timezone.tz.names().map(tz => {
      return {
        label: `${tz} (GMT${AppUtils.moment_timezone.tz(tz).format('Z')})`,
        value: tz
      }
    })
  }

  static getDropDownTimeZoneOption = (timezones, timeZone) => {
    if (timezones.length > 0) {
      const found = timezones.find(zone => zone.value === timeZone);
      if (found) {
        return found;
      }
    }
    return null;
  }

  static setCookie(cName, cValue, exDays) {
    const d = new Date();
    d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
    return cValue
  }

  static getCookie(cName) {
    const name = cName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  static renderLocalDateTime = (value, withHours = false) => {
    if (value && typeof value !== undefined) {
      if (value === AppUtils.defaultDateTimeValue) {
        return 'n/a';
      }
      if (withHours) {
        return AppUtils.utcToLocalDateTime(value, withHours)
      }
      return AppUtils.utcToLocalDateTime(value, withHours)
    }
    return 'n/a';
  }

  static utcToLocalDateTime = (dateString, withHours) => {
    // get instance dates missing 'Z' at the end
    if (dateString.charAt(dateString.length - 1) !== 'Z') {
      dateString = dateString + 'Z';
    }
    if (withHours) {
      return AppUtils.formatDateTime(AppUtils.moment_timezone.tz(dateString, AppUtils.timezone));
    }
    return AppUtils.formatDate(AppUtils.moment_timezone.tz(dateString, AppUtils.timezone));
  };

  static formatDateTime = (date) => {
    return date.format("L HH:mm");
  };

  static formatDate = (date) => {
    return date.format("L");
  };

  static changeSVGColor = (color) => {
    return hexToCSSFilter(color).filter.replace(';', '');
  }

  static getDeviceImage = (deviceType) => {
    switch (deviceType) {
      case 'vicki_lorawan':
        return vicki;
      case 'ht_sensor':
        return ht;
      case 'aqi_sensor':
        return aqi_sensor;
      case 't_flood':
        return t_flood
      case 't_valve':
        return t_valve
      case 'co2_sensor':
        return co2_sensor;
      case 'thermostat':
        return thermostat
      case 'mc_button':
        return mc_button
      case 'dsk_device':
        return dsk_device
      case 'open_close_sensor':
        return open_close_sensor
      case 'wireless_thermostat':
        return wireless_thermostat
      default:
        return default_icon;
    }
  }

  /**
   * Retrieve uploaded file/files
   *
   * @param event
   * @param supportedFileTypes - array, ex: ['image/jpg', 'image/jpeg', 'image/png']
   * @returns Array of files which meet the conditions
   */
  static onFileUpload = (event, supportedFileTypes) => {
    const maxFileSize = 6291456; // 6mb
    const keys = Object.keys(event.target.files);
    let unsupportedFiles = false;
    const files = [];
    keys.forEach(fileKey => {
      if (supportedFileTypes.includes(event.target.files[fileKey].type) && event.target.files[fileKey].size <= maxFileSize) {
        files.push(event.target.files[fileKey]);
      } else {
        unsupportedFiles = true;
      }
    })
    if (unsupportedFiles) {
      showMessage('Please upload only images. Unsupported files and images larger than 6mb will be skipped.', true)
    }
    return files
  }

  static createObjectCopy = (object) => {
    return JSON.parse(JSON.stringify(object));
  }

  static createObjectArrayCopy = (array) => {
    return array.map(item => { return { ...item } })
  }

  static hexToRGB(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  /**
   * Retrieve array of unique objects
   *
   * @param arrOfObjects
   * @param prop - filter property
   * @returns Array of unique objects
   */
  static removeDuplicateObjects = (arrOfObjects, prop) => {
    return arrOfObjects.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  static getAllMomentJsDateTimeFormats = () => {
    return [
      'LT',
      'HH:mm',
      'LL',
      'll',
      'LLL',
      'lll',
      'LLLL',
      'llll',
      'MMMM Do, YYYY',
      'MMMM Do, YYYY HH:mm',
      'MMMM Do, YYYY h:mm a',
      'YYYY-MM-DD',
      'DD-MM-YYYY',
      'YYYY-MM-DD HH:mm',
      'YYYY-MM-DD h:mm a',
      'DD-MM-YYYY HH:mm',
      'DD-MM-YYYY h:mm a',
      'DD-MMM-YYYY',
      'DD-MMM-YYYY h:mm a',
      'DD-MMM-YYYY HH:mm',
      'YYYY/MM/DD',
      'DD/MM/YYYY',
      'YYYY/MM/DD HH:mm',
      'YYYY/MM/DD h:mm a',
      'DD/MM/YYYY HH:mm',
      'DD/MM/YYYY h:mm a',
      'DD/MMM/YYYY',
      'DD/MMM/YYYY h:mm a',
      'DD/MMM/YYYY HH:mm',
    ]
  }

  static generateDropDownDateFormatsOptions = () => {
    const formats = AppUtils.getAllMomentJsDateTimeFormats();
    return formats.map(format => {
      return { label: moment().format(format), value: format }
    })
  }

  static getControllersFields = () => {
    let deviceFields = {};
    controllerTypes.forEach(controller => {
      deviceFields[controller.type] = controller.table.filter(el =>
        typeof el.dontShowInGraphs === "undefined" && el.isNumber === true).map(el => {
          return {
            label: el.name,
            value: el.key,
          }
        })
    })
    return deviceFields;
  }

  static getControllerFieldsByType = (type) => {
    const fondedFields = controllerTypes.find(device => device.type === type);
    if (fondedFields) {
      return fondedFields.table.filter(el =>
        typeof el.dontShowInGraphs === "undefined" && el.isNumber === true).map(el => {
          return {
            label: el.name,
            value: el.key,
          }
        })
    }
    return [];
  }

  static getControllerBoolFieldsByType = (type) => {
    const fondedFields = controllerTypes.find(device => device.type === type);
    if (fondedFields) {
      return fondedFields.table.filter(el => el.isBool === true).map(el => {
        return {
          label: el.name,
          value: el.key,
        }
      })
    }
    return [];
  }

}