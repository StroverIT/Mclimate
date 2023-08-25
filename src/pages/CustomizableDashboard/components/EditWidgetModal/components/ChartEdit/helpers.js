import AppUtils from "../../../../../../common/AppUtils";
import moment from "moment";
import {AXIS_ORIENTATION} from "./components/Tabs/Axes/components/ChartAxis/ChartAxis";
import {CHART_TIMEFRAME_TYPES} from "./components/Tabs/Timeframe/Timeframe";
import {getControllerLogsData} from "../../../../../../helpers/backend_helper";

export let controllersData = {} // controllers and their fields
export let controllersChartData = [] // only the selected fields with the data

export function generateChartData(widgetValues, selectedDevice, field, countId, response) {
  const controllerTypes = AppUtils.getControllersFields()[selectedDevice.type];
  const timezone = widgetValues.timezone ?? AppUtils.timezone;
  const offset = moment().tz(timezone).utcOffset();
  let data = {};

  controllerTypes.forEach(type => {
    data[type.value] = response._embedded.controller_log.map(dataObj => {
      return {
        field: type.value,
        created_at: new Date(moment(dataObj.created_at).add(offset, 'minutes').format('YYYY-MM-DD HH:mm')).getTime(),
        value: parseFloat(dataObj[type.value]),
      }
    }).sort((a, b) => {
      return a.created_at - b.created_at;
    });
    controllersData[selectedDevice.serialNumber] = data;
    if (type.value === field.value) {
      controllersChartData.push({
        field: type.value,
        displayField: field.label,
        serialNumber: selectedDevice.serialNumber,
        componentId: selectedDevice.componentId,
        data: data[type.value],
        ...createAxisSettings(selectedDevice, countId),
      })
    }
  })
  return controllersChartData
}

export function updateChartData(widgetValues, selectedDevice, response, chartData = null, devicesDataObj = null) {
  const controllerTypes = AppUtils.getControllersFields()[selectedDevice.type];
  const chartDataArr = chartData ?? controllersChartData;
  const devicesData = devicesDataObj ?? controllersData;
  const timezone = widgetValues.timezone ?? AppUtils.timezone;
  const offset = moment().tz(timezone).utcOffset();
  let data = {};

  if (response._embedded) {
    controllerTypes.forEach(type => {
      data[type.value] = response._embedded.controller_log.map(dataObj => {
        return {
          field: type.value,
          created_at: new Date(moment(dataObj.created_at).add(offset, 'minutes').format('YYYY-MM-DD HH:mm')).getTime(),
          // created_at_timestamp: new Date(moment(dataObj.created_at).add(offset, 'minutes').format('YYYY-MM-DD HH:mm')),
          value: parseFloat(dataObj[type.value]),
        }
      }).sort((a, b) => {
        return a.created_at - b.created_at;
      });
      devicesData[selectedDevice.serialNumber] = data;

      if (type.value === selectedDevice.selectedField.value) {
        const dataForUpdate = chartDataArr.find(item => item.serialNumber === selectedDevice.serialNumber && item.field === selectedDevice.selectedField.value)
        if (dataForUpdate) {
          dataForUpdate.data = data[type.value];
        } else {
          chartDataArr.push({
            field: type.value,
            displayField: selectedDevice.selectedField.label,
            serialNumber: selectedDevice.serialNumber,
            componentId: selectedDevice.componentId,
            data: data[type.value],
            ...selectedDevice.deviceAxisSettings
          })
        }
      }
    });
  } else {
    if (devicesData.hasOwnProperty(selectedDevice.serialNumber)) {
      Object.keys(devicesData[selectedDevice.serialNumber]).forEach(key => {
        devicesData[selectedDevice.serialNumber][key] = [];
      })
      const dataForUpdate = chartDataArr.find(item => item.serialNumber === selectedDevice.serialNumber && item.field === selectedDevice.selectedField.value)
      if (dataForUpdate) {
        dataForUpdate.data = [];
      }
    }
  }
}

export function removeFieldFromChartData(selectedDevice, prevSelectedDevice) {
  if (prevSelectedDevice) {
    deleteDeviceFromChartData(selectedDevice);
  }
}

export function resetMixChartData() {
  controllersData = {};
  controllersChartData = [];
}

export function createAxisSettings(selectedDevice, countIdx) {
  return {
    axis: `Axis ${countIdx} (${selectedDevice.title})`,
    chartType: selectedDevice.deviceAxisSettings.chartType,
    color: selectedDevice.deviceAxisSettings.color,
    hidden: false,
    axisOrientation: AXIS_ORIENTATION.LEFT,
    unit: '',
    domainTo: {value: '', auto: true},
    domainFrom: {value: '', auto: true},
  }
}

export function generateTimeframe(widgetValues) {
  let start;
  let end;

  switch (widgetValues.timeframe) {
    case CHART_TIMEFRAME_TYPES.HOUR:
      start = moment.utc().subtract({hours: 1}).format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      end = moment.utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      break;
    case CHART_TIMEFRAME_TYPES.DAY:
      start = moment().utc().startOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      end = moment().utc().endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      break;
    case CHART_TIMEFRAME_TYPES.WEEK:
      start = moment().utc().startOf('day').subtract(({week: 1})).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      end = moment().utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      break;
    case CHART_TIMEFRAME_TYPES.TWO_WEEKS:
      start = moment().utc().startOf('day').subtract(({week: 2})).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      end = moment().utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      break;
    case CHART_TIMEFRAME_TYPES.MONTH:
      start = moment().utc().startOf('day').subtract(({month: 1})).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      end = moment().utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      break;
    default: // CHART_TIMEFRAME_TYPES.CUSTOM
      start = widgetValues.from ? moment(widgetValues.from).utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]') : moment().utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      end = widgetValues.until ? moment(widgetValues.until).utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]') : moment().utc().add({hours: 1}).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
  }

  return {
    startDate: start,
    endDate: end,
  }
}

export function getDataForSelectedDevices(widgetValues) {
  const requests = [];
  const timeframe = generateTimeframe(widgetValues)
  widgetValues.selectedDevices.forEach(device => {
    if (device.selectedField) {
      let data = {
        serial_number: device.serialNumber,
        from_date: timeframe.startDate,
        to_date: timeframe.endDate
      }
      requests.push(getControllerLogsData(data));
    }
  })
  return Promise.all(requests);
}

function deleteDeviceFromChartData(selectedDevice) {
  const deviceIndex = controllersChartData.findIndex(device => device.componentId === selectedDevice.componentId);
  if (deviceIndex !== -1) {
    controllersChartData.splice(deviceIndex, 1);
  }
}