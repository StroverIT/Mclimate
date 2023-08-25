import React, {forwardRef, useCallback, useEffect, useState} from 'react';
import {Button} from "reactstrap";
import {setChartData, setChartWidgetValues} from "../../../../../../../../../../../store/chartWidget/actions";
import {batch, useDispatch} from "react-redux";
import AppUtils from "../../../../../../../../../../../common/AppUtils";
import alignLeftIcon from "../../../../../../../../../../../assets/images/common/align-left.svg";
import alignRightIcon from "../../../../../../../../../../../assets/images/common/align-right.svg";
import GenericInput from "../../../../../../../../../../../components/GenericInput/Input/GenericInput";
import InputUtils, {InputTypes} from "../../../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import {controllersChartData} from "../../../../../helpers";
import _ from "lodash";
import './chartAxis.scss'

export const AXIS_ORIENTATION = {
  LEFT: 'Left',
  RIGHT: 'Right'
}

const formObj = {
  isFormValid: true,
  domainTo: {
    value: '',
    regex: '',
    valid: true,
    errorMsg: ''
  },
  domainFrom: {
    value: '',
    regex: '',
    valid: true,
    errorMsg: ''
  },
  unit: {
    value: '',
    regex: '',
    valid: true,
    errorMsg: ''
  }
}

const ChartAxis = forwardRef(({axisSettings, widgetValues, axisSettingsIndex, color}, ref) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(AppUtils.createObjectCopy(formObj));

  useEffect(() => {
    const formCopy = AppUtils.createObjectCopy(form);
    Object.keys(formCopy).filter(key => key !== 'isFormValid').forEach(key => {
      switch (key) {
        case 'domainFrom':
          formCopy[key].value = axisSettings[key].value;
          break;
        case 'domainTo':
          formCopy[key].value = axisSettings[key].value;
          break;
        default:
          formCopy[key].value = axisSettings[key]
      }
    })
    setForm(formCopy);
  }, [])

  const onChange = (inputId, event, inputType) => {
    const widgetValuesCopy = AppUtils.createObjectCopy(widgetValues);
    const inputValue = inputType === InputTypes.TEXT_INPUT ? event.target.value : inputType === InputTypes.CHECKBOX ? event.target.checked : event;
    const chartDevice = controllersChartData.find(device => device.componentId === widgetValuesCopy.selectedDevices[axisSettingsIndex].componentId);
    if (inputId === 'domainTo' || inputId === 'domainFrom') {
      const updatedObj = {
        ...widgetValuesCopy.selectedDevices[axisSettingsIndex].deviceAxisSettings[inputId],
        auto: inputValue
      }
      chartDevice[inputId] = updatedObj;
      widgetValuesCopy.selectedDevices[axisSettingsIndex].deviceAxisSettings = {...widgetValuesCopy.selectedDevices[axisSettingsIndex].deviceAxisSettings, [inputId]: updatedObj};
    } else {
      chartDevice[inputId] = inputValue;
      widgetValuesCopy.selectedDevices[axisSettingsIndex].deviceAxisSettings = {...widgetValuesCopy.selectedDevices[axisSettingsIndex].deviceAxisSettings, [inputId]: inputValue};
    }
    batch(() => {
      dispatch(setChartData([...controllersChartData]));
      dispatch(setChartWidgetValues(widgetValuesCopy));
    })
  }

  const handleInputsChange = (inputId, event) => {
    const value = event.target.value;
    const widgetValuesCopy = AppUtils.createObjectCopy(widgetValues);
    const formCopy = InputUtils.inputOnChange(inputId, event, InputTypes.TEXT_INPUT, form, true);
    const chartDevice = controllersChartData.find(device => device.componentId === widgetValuesCopy.selectedDevices[axisSettingsIndex].componentId);
    if (inputId === 'domainTo' || inputId === 'domainFrom') {
      const updatedObj = {
        ...widgetValuesCopy.selectedDevices[axisSettingsIndex].deviceAxisSettings[inputId],
        value: value
      }
      chartDevice[inputId] = updatedObj;
      widgetValuesCopy.selectedDevices[axisSettingsIndex].deviceAxisSettings = {...widgetValuesCopy.selectedDevices[axisSettingsIndex].deviceAxisSettings, [inputId]: updatedObj};
    } else {
      chartDevice[inputId] = value;
      widgetValuesCopy.selectedDevices[axisSettingsIndex].deviceAxisSettings = {...widgetValuesCopy.selectedDevices[axisSettingsIndex].deviceAxisSettings, [inputId]: value};
    }
    handleSetValues(formCopy, widgetValuesCopy)
  }

  const saveValuesToRedux = _.debounce((widgetValuesCopy) => {
    batch(() => {
      dispatch(setChartData([...controllersChartData]));
      dispatch(setChartWidgetValues(widgetValuesCopy));
    })
  }, 500);

  const handleSetValues = useCallback((form, widgetValuesCopy) => {
    setForm(form)
    saveValuesToRedux(widgetValuesCopy);
  }, [setForm]);

  return (
    <div className={'chart-axis-settings-container'}>
      <header className={'axis-header'}>
        <div className={'axis-h6-container'}>
          <div className={`axis-status`} style={{backgroundColor: color}}/>
          <h6 className={`axis-h6`} style={{color: color}}>{axisSettings.axis}</h6>
        </div>
        <div>
          <div className="chart-widget-switch-with-label">
            <p style={{marginBottom: 0}}>Hide Axis</p>
            <div className="form-check form-switch no-margin-switch">
              <input
                type="checkbox"
                className="form-check-input checkbox show-x-grid-checkbox"
                id={`x_grid_checkbox`}
                checked={axisSettings.hidden}
                onChange={(e) => onChange('hidden', e, InputTypes.CHECKBOX)}
              />
            </div>
          </div>
        </div>
      </header>
      <hr style={{marginTop: 0}}/>

      {/*Orientation*/}
      <div style={{height: 15}}/>
      <div style={{display: 'flex', width: '100%', gap: '1%'}}>
        <div style={{width: '22%'}}>
          <h6>Orientation</h6>
        </div>
        <div style={{width: '74%', display: 'flex', gap: 5}}>
          <h6>Unit</h6>
          <h6 style={{fontWeight: 400, opacity: 0.7}}>Optional</h6>
        </div>
      </div>
      <hr/>
      <div style={{display: 'flex', gap: '8%', alignItems: 'center'}}>
        <div className={'orientation-btns-container'}>
          <Button
            className={`${axisSettings.axisOrientation === AXIS_ORIENTATION.LEFT ? 'primary-white-btn-active' : 'primary-white-button'}`}
            onClick={() => onChange('axisOrientation', AXIS_ORIENTATION.LEFT, InputTypes.BUTTON)}
          >
            <img
              src={alignLeftIcon}
              alt='align-left-icon'
              style={{
                width: 20, height: 20,
                filter: axisSettings.axisOrientation === AXIS_ORIENTATION.LEFT ?
                  AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#75788B')
              }}
            />&nbsp;
            {AXIS_ORIENTATION.LEFT}
          </Button>
          <Button
            className={`${axisSettings.axisOrientation === AXIS_ORIENTATION.RIGHT ? 'primary-white-btn-active' : 'primary-white-button'}`}
            onClick={() => onChange('axisOrientation', AXIS_ORIENTATION.RIGHT, InputTypes.BUTTON)}
          >
            <img
              src={alignRightIcon}
              alt='align-right-icon'
              style={{
                width: 20, height: 20,
                filter: axisSettings.axisOrientation === AXIS_ORIENTATION.RIGHT ?
                  AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#75788B')
              }}
            />&nbsp;
            {AXIS_ORIENTATION.RIGHT}
          </Button>
        </div>
        <div style={{width: '40%'}}>
          <GenericInput
            value={form.unit.value}
            label={''}
            valid={form.unit.valid}
            errorMsg={form.unit.errorMsg}
            onChange={(e) => handleInputsChange('unit', e)}
            elementConfig={{
              placeholder: '',
              type: 'text',
            }}
          />
        </div>
      </div>
      {/*End of Orientation*/}

      {/*Domain from/to*/}
      <div style={{height: 25}}/>
      <div style={{display: 'flex', width: '100%', gap: '4%'}}>
        <div style={{width: '48%'}}>
          <h6>Domain From</h6>
        </div>
        <div style={{width: '48%'}}>
          <h6>Domain To</h6>
        </div>
      </div>
      <hr/>

      <div style={{display: 'flex', width: '100%', gap: '4%'}}>
        <div className={'domain-controls'}>
          <GenericInput
            id={'domainFrom'}
            label={''}
            value={form.domainFrom.value}
            valid={form.domainFrom.valid}
            errorMsg={form.domainFrom.errorMsg}
            onChange={(e) => handleInputsChange('domainFrom', e)}
            elementConfig={{
              placeholder: '',
              type: 'text',
              readOnly: axisSettings?.domainFrom?.auto,
            }}
          />
          <div className="chart-widget-switch-with-label">
            <div className="form-check form-switch no-margin-switch">
              <input
                type="checkbox"
                className="form-check-input checkbox show-x-grid-checkbox"
                id={`x_grid_checkbox`}
                checked={axisSettings?.domainFrom?.auto}
                onChange={(e) => onChange('domainFrom', e, InputTypes.CHECKBOX)}
              />
            </div>
            <p style={{marginBottom: 0}}>Auto</p>
          </div>
        </div>
        <div className={'domain-controls'}>
          <GenericInput
            id={'domainTo'}
            label={''}
            value={form.domainTo.value}
            valid={form.domainTo.valid}
            errorMsg={form.domainTo.errorMsg}
            onChange={(e) => handleInputsChange('domainTo', e)}
            elementConfig={{
              placeholder: '',
              type: 'text',
              readOnly: axisSettings?.domainTo?.auto,
            }}
          />
          <div className="chart-widget-switch-with-label">
            <div className="form-check form-switch no-margin-switch">
              <input
                type="checkbox"
                className="form-check-input checkbox show-x-grid-checkbox"
                id={`x_grid_checkbox`}
                checked={axisSettings?.domainTo?.auto}
                onChange={(e) => onChange('domainTo', e, InputTypes.CHECKBOX)}
              />
            </div>
            <p style={{marginBottom: 0}}>Auto</p>
          </div>
        </div>
      </div>
      {/*End of Domain from/to*/}
    </div>
  );
});

export default ChartAxis;