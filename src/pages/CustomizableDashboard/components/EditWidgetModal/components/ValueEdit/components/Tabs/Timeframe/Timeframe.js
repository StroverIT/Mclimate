import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import squareZeroIcon from '../../../../../../../../../assets/images/common/squareZeroIcon.svg'
import timeframeOperationIcon from '../../../../../../../../../assets/images/common/timeframeOperationIcon.svg'
import AppUtils from "../../../../../../../../../common/AppUtils";
import {InputGroup} from "reactstrap";
import Flatpickr from "react-flatpickr";
import GenericInput from "../../../../../../../../../components/GenericInput/Input/GenericInput";
import InputUtils, {InputTypes} from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import moment from "moment";
import {setValues} from "../../../../../../../../../store/valuePreview/actions";
import {batch, useDispatch, useSelector} from "react-redux";
import {useForceUpdate} from "../../../../../../../../../Hooks/useForceUpdate";
import {showMessage} from "../../../../../../../../../helpers/ui_helper";
import {getControllerData, processData} from "../../helpers/apiHelper";
import {hideSpinner, showSpinner} from "../../../../../../../../../store/spinner/actions";
import './timeframe.scss'

export const TIMEFRAME_TYPES = {
  CURRENT_VALUE: 'Current Value',
  TIMERANGE_OPERATIONS: 'Timerange Operation',
}

export const OPERATION = {
  MINIMUM: 'minimum',
  MAXIMUM: 'maximum',
  AVERAGE: 'average',
  SUM: 'sum',
  CHANGE_ABSOLUTE: 'change-absolute',
  CHANGE_PERCENTAGE: 'change-percentage',
}

const initialForm = {
  isFormValid: true,
  operation: {
    value: null,
    options: [
      {label: "Minimum", value: OPERATION.MINIMUM},
      {label: "Maximum", value: OPERATION.MAXIMUM},
      {label: "Average", value: OPERATION.AVERAGE},
      {label: "Sum", value: OPERATION.SUM},
      {label: "Change (absolute)", value: OPERATION.CHANGE_ABSOLUTE},
      {label: "Change (percentage)", value: OPERATION.CHANGE_PERCENTAGE},
    ],
    valid: true,
    errorMsg: 'Operation field cannot be empty'
  },
  timezone: {
    value: null,
    valid: true,
    errorMsg: 'Timezone field cannot be empty',
    options: AppUtils.getDropDownTimeZoneList()
  },
  from: {
    value: null
  },
  until: {
    value: null
  }
}

const Timeframe = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const widgetValues = useSelector((store) => store.widgetValueComponent.values);
  let [form, setForm] = useState(AppUtils.createObjectCopy(initialForm));
  // using forceUpdate because of the flatpickr(it looses the original form reference)
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    Object.keys(form).filter(key => key !== 'isFormValid').forEach(key => {
      switch (key) {
        case 'operation':
          form[key].value = initialForm.operation.options.find(option => option.value === widgetValues[key]) ?? null
          break;
        case 'timezone':
          form[key].value = initialForm.timezone.options.find(option => option.value === widgetValues[key]) ??  AppUtils.getDropDownTimeZoneOption(initialForm.timezone.options, AppUtils.timezone)
          break;
        default:
          form[key].value = widgetValues[key]
      }
      forceUpdate();
    })

    return () => {
      if (widgetValues.timeframeOperationType === TIMEFRAME_TYPES.TIMERANGE_OPERATIONS && form.from.value === null) {
        widgetValues.timeframeOperationType = TIMEFRAME_TYPES.CURRENT_VALUE;
        dispatch(setValues(widgetValues));
      }
    }
  }, [])

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  const updateControllerData = (widgetValues) => {
    dispatch(showSpinner());
    getControllerData(widgetValues)
      .then(response => {
        if (response && response.timeframeOperationType === TIMEFRAME_TYPES.TIMERANGE_OPERATIONS) {
          widgetValues.value = processData(response.data, widgetValues.operation, widgetValues.field);
        } else if (response && response.timeframeOperationType === TIMEFRAME_TYPES.CURRENT_VALUE) {
          widgetValues.value = response.data.provider[widgetValues.field]
        }
      })
      .catch(() => {
        showMessage("Something went wrong while loading value widget data", true);
      })
      .finally(() => {
        batch(() => {
          dispatch(hideSpinner())
          dispatch(setValues(widgetValues));
        })
        forceUpdate();
      })
  }

  const handleTimeframeTypeChange = (type) => {
    widgetValues.timeframeOperationType = type;
    updateControllerData(widgetValues);
  }

  const onChange = (inputId, event, inputType) => {
    widgetValues[inputId] = inputType !== InputTypes.SELECT ? event.target.value : event.value;
    form = InputUtils.inputOnChange(inputId, event, inputType, form, false);
    forceUpdate();

    if (widgetValues.operation && widgetValues.field) {
      updateControllerData(widgetValues);
    } else {
      dispatch(setValues(widgetValues));
      forceUpdate();
    }
  }

  const onChangeTime = (e, inputId) => {
    const date = checkDates(e, inputId);
    if (date) {
      widgetValues[inputId] = date;
      form[inputId].value = date;
      updateControllerData(widgetValues);
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
    return moment(e[0]).format('YYYY-MM-DD');
  }

  return (
    <>
      <div style={{height: 35}}/>
      <h6>Type</h6>
      <hr/>
      <div className={'types-wrapper'}>
        <div className={`${widgetValues.timeframeOperationType === TIMEFRAME_TYPES.CURRENT_VALUE ? 'type-active' : 'type'}`}
             onClick={() => handleTimeframeTypeChange(TIMEFRAME_TYPES.CURRENT_VALUE)}>
          <div className={'type-heading'}>
            <img src={squareZeroIcon}
                 alt=""
                 style={{filter: widgetValues.timeframeOperationType === TIMEFRAME_TYPES.CURRENT_VALUE  ? AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#8b8a8a')}}/>
            <p>Current Value</p>
          </div>
          <div className={'type-description'}>
            <span>Shows the latest value</span>
          </div>
        </div>
        <div className={`${widgetValues.timeframeOperationType === TIMEFRAME_TYPES.TIMERANGE_OPERATIONS ? 'type-active' : 'type'}`}
             onClick={() => handleTimeframeTypeChange(TIMEFRAME_TYPES.TIMERANGE_OPERATIONS)}>
          <div className={'type-heading'}>
            <img src={timeframeOperationIcon}
                 alt=""
                 style={{filter: widgetValues.timeframeOperationType === TIMEFRAME_TYPES.TIMERANGE_OPERATIONS  ? AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#8b8a8a')}}/>
            <p>Timerange Operation</p>
          </div>
          <div className={'type-description'}>
            <span>Display min, max, average or change over a timeframe</span>
          </div>
        </div>
     </div>

      {widgetValues.timeframeOperationType === TIMEFRAME_TYPES.TIMERANGE_OPERATIONS ?
        <>
          <div style={{height: 25}}/>

          <h6>Operation</h6>
          <hr/>
          <div className={'timeframe-operation'}>
            <GenericInput
              elementType={InputTypes.SELECT}
              id='operation'
              name='operation'
              value={form.operation.value}
              valid={form.operation.valid}
              errorMsg={form.operation.errorMsg}
              onChange={(e) => onChange('operation', e, InputTypes.SELECT)}
              // onBlur={() => checkFieldValidity('operation')}
              elementConfig={{
                options: form.operation.options,
                placeholder: 'Select operation',
                classNamePrefix: 'select2-selection',
              }}
            />
          </div>

          <div style={{height: 25}}/>

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
            <InputGroup className="widget-datepicker">
              <Flatpickr
                key={'flatpickr-from'}
                className="form-control text-center br-4 mg-5-r "
                placeholder="From"
                options={{
                  enableTime: false,
                  noCalendar: false,
                  dateFormat: "Y-m-d",
                  time_24hr: true
                }}
                value={form.from.value}
                onChange={(e) => onChangeTime(e, 'from')}
              />
              <i className={'uil-calender'} style={{position: 'absolute', right: 17, fontSize: 17, color: '#74788E'}}/>
            </InputGroup>
            <InputGroup className="widget-datepicker">
              <Flatpickr
                key={'flatpickr-until'}
                className="form-control text-center br-4 mg-5-r "
                placeholder="Until"
                options={{
                  enableTime: false,
                  noCalendar: false,
                  dateFormat: "Y-m-d",
                  time_24hr: true
                }}
                value={form.until.value}
                onChange={(e) => onChangeTime(e, 'until')}
              />
              <i className={'uil-calender'} style={{position: 'absolute', right: 17, fontSize: 17, color: '#74788E'}}/>
            </InputGroup>
          </div>

          <div style={{height: 25}}/>

          <h6>Timezone</h6>
          <hr/>
          <div className={'time-zones'}>
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
        </> : null}
    </>
  );
});

export default Timeframe;