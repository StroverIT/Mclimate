import { OPERATION, TIMEFRAME_TYPES } from "../Tabs/Timeframe/Timeframe";
import { getControllerLogsData, setControllerProviderData } from "../../../../../../../../helpers/backend_helper";
import AppUtils from "../../../../../../../../common/AppUtils";
import moment from "moment";
import _ from "lodash";

// TODO: fix all calculations for valve opening field!
export async function getControllerData(widgetValues) {
  if (widgetValues.timeframeOperationType === TIMEFRAME_TYPES.CURRENT_VALUE) {
    if (widgetValues.selectedDevice && widgetValues.field) {
      return {
        timeframeOperationType: TIMEFRAME_TYPES.CURRENT_VALUE,
        data: await setControllerProviderData({ serial_number: widgetValues.selectedDevice.serialNumber })
      }
    }
    return null;
  } else {
    if (widgetValues.selectedDevice && widgetValues.field && widgetValues.from) {
      const timezone = widgetValues.timezone ?? AppUtils.timezone;
      let offset = 0;
      if (timezone !== AppUtils.timezone) {
        offset = moment().tz(timezone).utcOffset();
      }
      let start;
      let end;

      if (timezone === AppUtils.timezone) {
        start = widgetValues.from ? moment(widgetValues.from).startOf('day') : moment().startOf('day');
        end = widgetValues.until ? moment(widgetValues.until).endOf('day') : moment().endOf('day');
      } else {
        start = widgetValues.from ? moment(widgetValues.from).tz(timezone).startOf('day') : moment().tz(timezone).startOf('day');
        end = widgetValues.until ? moment(widgetValues.until).tz(timezone).endOf('day') : moment().tz(timezone).endOf('day');
      }

      let data = {
        serial_number: widgetValues.selectedDevice.serialNumber,
        from_date: moment(start).utcOffset(offset).toISOString(),
        to_date: moment(end).utcOffset(offset).toISOString(),
      }
      return {
        timeframeOperationType: TIMEFRAME_TYPES.TIMERANGE_OPERATIONS,
        data: await getControllerLogsData(data)
      }
    }
    return null;
  }
}

export function processData(response, operation, field) {
  switch (operation) {
    case OPERATION.MINIMUM:
      return getMin(response, field);
    case OPERATION.MAXIMUM:
      return getMax(response, field);
    case OPERATION.AVERAGE:
      return getAvg(response, field);
    case OPERATION.SUM:
      return sumData(response, field);
    case OPERATION.CHANGE_ABSOLUTE:
      return getChangeAbsolute(response, field);
    case OPERATION.CHANGE_PERCENTAGE:
      return getChangePercentage(response, field);
    default:
      return 0
  }
}

function sumData(response, field) {
  if (response._embedded) {
    return _.sumBy(response._embedded.controller_log, (item) => { return parseFloat(item[field]) });
  }
  return 0;
}

function getMax(response, field) {
  if (response._embedded) {
    const maxValue = _.maxBy(response._embedded.controller_log, (item) => { return parseFloat(item[field]) });
    return maxValue[field];
  }
  return 0;
}

function getMin(response, field) {
  if (response._embedded) {
    const minValue = _.minBy(response._embedded.controller_log, (item) => { return parseFloat(item[field]) });
    return minValue[field];
  }
  return 0;
}

function getAvg(response, field) {
  if (response._embedded) {
    return _.meanBy(response._embedded.controller_log, (item) => { return parseFloat(item[field]) });
  }
  return 0;
}

function getChangeAbsolute(response, field) {
  if (response._embedded) {
    const maxValue = parseFloat(getMax(response, field));
    const minValue = parseFloat(getMin(response, field));
    const result = maxValue - minValue;
    if (maxValue < 0 && minValue < 0) {
      return result * -1;
    }
    return result
  }
  return 0;
}

function getChangePercentage(response, field) {
  if (response._embedded) {
    const maxValue = parseFloat(getMax(response, field));
    const minValue = parseFloat(getMin(response, field));
    let percent = ((maxValue - minValue) / minValue) * 100;
    return percent < 0 ? percent * -1 : percent;
  }
  return 0;
}

export function getFixedPercentage(values) {
  const motorRange = values[0];
  const motorPosition = values[1];

  if(motorRange !== 0){
    const closedPercent = (motorPosition / motorRange) * 100;
    const openPercent = 100 - closedPercent;
    return openPercent
  }else{
    return 0
  }
}