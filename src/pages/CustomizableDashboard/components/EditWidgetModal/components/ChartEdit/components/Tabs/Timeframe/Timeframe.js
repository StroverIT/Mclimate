import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Button, InputGroup} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import {setChartData, setChartWidgetValues} from "../../../../../../../../../store/chartWidget/actions";
import AppUtils from "../../../../../../../../../common/AppUtils";
import Flatpickr from "react-flatpickr";
import {unstable_batchedUpdates} from "react-dom";
import moment from "moment";
import GenericInput from "../../../../../../../../../components/GenericInput/Input/GenericInput";
import InputUtils, {InputTypes} from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import {controllersChartData, getDataForSelectedDevices, updateChartData} from "../../../helpers";
import {showMessage} from "../../../../../../../../../helpers/ui_helper";
import './timeframe.scss'
import {hideSpinner, showSpinner} from "../../../../../../../../../store/spinner/actions";

export const CHART_TIMEFRAME_TYPES = {
  HOUR: 'Hour',
  DAY: 'Day',
  WEEK: 'Week',
  TWO_WEEKS: '2 Weeks',
  MONTH: 'Month',
  CUSTOM: 'Custom'
}

const initialForm = {
  isFormValid: true,
  from: {
    value: null
  },
  until: {
    value: null
  },
  timezone: {
    value: null,
    valid: true,
    errorMsg: 'Timezone field cannot be empty',
    options: AppUtils.getDropDownTimeZoneList()
  },
}

const Timeframe = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const widgetValues = useSelector((store) => AppUtils.createObjectCopy(store.chartWidget.values));
  const [form, setForm] = useState(AppUtils.createObjectCopy(initialForm));

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  useEffect(() => {
    const formCopy = AppUtils.createObjectCopy(form);
    Object.keys(formCopy).filter(key => key !== 'isFormValid').forEach(key => {
      switch (key) {
        case 'timezone':
          formCopy[key].value = initialForm.timezone.options.find(option => option.value === widgetValues[key]) ?? AppUtils.getDropDownTimeZoneOption(initialForm.timezone.options, AppUtils.timezone)
          break;
        default:
          formCopy[key].value = widgetValues[key]
      }
    })
    setForm(formCopy);
  }, [])


  const getDeviceData = (widgetValuesCopy) => {
    getDataForSelectedDevices(widgetValuesCopy)
      .then((responses) => {
        widgetValuesCopy.selectedDevices.forEach(device => {
          if (device.selectedField) {
            const deviceResponse = responses.find(data => data._links.self.href.includes(device.serialNumber));
            if (deviceResponse) {
              updateChartData(widgetValuesCopy, device, deviceResponse);
            }
          }
        })
        dispatch(setChartData([...controllersChartData]));
      })
      .catch((e) => {
        console.log(e);
        showMessage("Something went wrong while updating chart data", true);
      })
      .finally(() => {
        dispatch(hideSpinner());
      })
  }

  const handleTimeframeChange = (type) => {
    const widgetValuesCopy = AppUtils.createObjectCopy(widgetValues);
    widgetValuesCopy.timeframe = type;
    widgetValuesCopy.from = null;
    widgetValuesCopy.until = null;
    dispatch(setChartWidgetValues(widgetValuesCopy));
    if (type !== CHART_TIMEFRAME_TYPES.CUSTOM) {
      dispatch(showSpinner());
      getDeviceData(widgetValuesCopy);
    }
  }

  const onChange = (inputId, event, inputType) => {
    widgetValues[inputId] = inputType !== InputTypes.SELECT ? event.target.value : event.value;
    unstable_batchedUpdates(() => {
      dispatch(setChartWidgetValues(widgetValues));
      setForm(InputUtils.inputOnChange(inputId, event, inputType, form, true))
    })
    dispatch(showSpinner());
    getDeviceData(widgetValues);
  }

  const onChangeTime = (e, inputId) => {
    const date = checkDates(e, inputId)
    if (date) {
      widgetValues[inputId] = date;
      unstable_batchedUpdates(() => {
        dispatch(setChartWidgetValues(widgetValues));
        setForm(prevState => {
          return {
            ...prevState,
            [inputId]: {
              value: date
            }
          }
        })
      })
      dispatch(showSpinner());
      getDeviceData(widgetValues);
    }
  }

  const checkDates = (e, inputId) => {
    if (inputId === 'from' && moment(e[0]).isAfter(moment())) {
      showMessage("From date can't be in the future", true);
      return null;
    }
    if (inputId === 'from' && widgetValues.until && moment(e[0]).isAfter(moment(widgetValues.until))) {
      showMessage("From date can't be after until date", true);
      return null;
    }
    if (inputId === 'until' && widgetValues.from && moment(e[0]).isBefore(moment(widgetValues.from))) {
      showMessage("Until date can't be before from date", true);
      return null;
    }
    return moment(e[0]).format('YYYY-MM-DD HH:mm');
  }

  return (
    <div className={'chart-widget-timeframe-step'}>
      {/*Frame*/}
      <div style={{height: 35}}/>
      <h6>Frame</h6>
      <hr/>
      <div className={'frame-btns-container'}>
        <Button
          className={`wide-button ${widgetValues.timeframe === CHART_TIMEFRAME_TYPES.HOUR ? 'primary-white-btn-active' : 'primary-white-button'}`}
          onClick={() => handleTimeframeChange(CHART_TIMEFRAME_TYPES.HOUR)}
        >
          {CHART_TIMEFRAME_TYPES.HOUR}
        </Button>
        <Button
          className={`wide-button ${widgetValues.timeframe === CHART_TIMEFRAME_TYPES.DAY ? 'primary-white-btn-active' : 'primary-white-button'}`}
          onClick={() => handleTimeframeChange(CHART_TIMEFRAME_TYPES.DAY)}
        >
          {CHART_TIMEFRAME_TYPES.DAY}
        </Button>
        <Button
          className={`wide-button ${widgetValues.timeframe === CHART_TIMEFRAME_TYPES.WEEK ? 'primary-white-btn-active' : 'primary-white-button'}`}
          onClick={() => handleTimeframeChange(CHART_TIMEFRAME_TYPES.WEEK)}
        >
          {CHART_TIMEFRAME_TYPES.WEEK}
        </Button>
        <Button
          className={`wide-button ${widgetValues.timeframe === CHART_TIMEFRAME_TYPES.TWO_WEEKS ? 'primary-white-btn-active' : 'primary-white-button'}`}
          onClick={() => handleTimeframeChange(CHART_TIMEFRAME_TYPES.TWO_WEEKS)}
        >
          {CHART_TIMEFRAME_TYPES.TWO_WEEKS}
        </Button>
        <Button
          className={`wide-button ${widgetValues.timeframe === CHART_TIMEFRAME_TYPES.MONTH ? 'primary-white-btn-active' : 'primary-white-button'}`}
          onClick={() => handleTimeframeChange(CHART_TIMEFRAME_TYPES.MONTH)}
        >
          {CHART_TIMEFRAME_TYPES.MONTH}
        </Button>
        <Button
          className={`wide-button ${widgetValues.timeframe === CHART_TIMEFRAME_TYPES.CUSTOM ? 'primary-white-btn-active' : 'primary-white-button'}`}
          onClick={() => handleTimeframeChange(CHART_TIMEFRAME_TYPES.CUSTOM)}
        >
          {CHART_TIMEFRAME_TYPES.CUSTOM}
        </Button>
      </div>
      <div style={{height: 25}}/>
      {/*End of Frame section*/}

      {widgetValues.timeframe === CHART_TIMEFRAME_TYPES.CUSTOM ? <>
        <div className={'operation-period'}>
          <div style={{width: '48%'}}>
            <h6>From</h6>
          </div>
          <div style={{width: '48%'}}>
            <h6>Until</h6>
          </div>
        </div>
        <hr/>
        <div className="flatpickr-container">
          <InputGroup className="chart-widget-datepicker">
            <Flatpickr
              key={'flatpickr-from'}
              className="form-control text-center br-4 mg-5-r "
              placeholder="From"
              options={{
                enableTime: true,
                noCalendar: false,
                dateFormat: "Y-m-d H:i",
                time_24hr: true
              }}
              value={form.from.value}
              onChange={(e) => onChangeTime(e, 'from')}
            />
            <i className={'uil-calender'} style={{position: 'absolute', right: 17, fontSize: 17, color: '#74788E'}}/>
          </InputGroup>
          <InputGroup className="chart-widget-datepicker">
            <Flatpickr
              key={'flatpickr-until'}
              className="form-control text-center br-4 mg-5-r "
              placeholder="Until"
              options={{
                enableTime: true,
                noCalendar: false,
                dateFormat: "Y-m-d H:i",
                time_24hr: true
              }}
              value={form.until.value}
              onChange={(e) => onChangeTime(e, 'until')}
            />
            <i className={'uil-calender'} style={{position: 'absolute', right: 17, fontSize: 17, color: '#74788E'}}/>
          </InputGroup>
        </div>

        <div style={{height: 25}}/>
      </> : null}

      <h6>Timezone</h6>
      <hr/>
      <div style={{width: '47.5%'}}>
        <GenericInput
          elementType={InputTypes.SELECT}
          id='timezone'
          name='timezone'
          value={form.timezone.value}
          valid={form.timezone.valid}
          errorMsg={form.timezone.errorMsg}
          onChange={(e) => onChange('timezone', e, InputTypes.SELECT)}
          // onBlur={() => checkFieldValidity('timezone')}
          elementConfig={{
            options: form.timezone.options,
            placeholder: 'Select timezone',
            classNamePrefix: "select2-selection",
            menuPlacement: 'top'
          }}
        />
      </div>
    </div>
  );
});

export default Timeframe;