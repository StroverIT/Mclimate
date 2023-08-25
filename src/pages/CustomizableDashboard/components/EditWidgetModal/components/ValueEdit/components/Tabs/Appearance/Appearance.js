import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import CustomColorPicker from "../../../../../../CustomColorPicker/CustomColorPicker";
import GenericInput from "../../../../../../../../../components/GenericInput/Input/GenericInput";
import InputUtils, {InputTypes} from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import {icons} from "../../../../../../CreateDashboardModal/Icons";
import './appearance.scss'
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../../../../../../../store/valuePreview/actions";
import AppUtils from "../../../../../../../../../common/AppUtils";

const formObj = {
  isFormValid: true,
  filterIcon: {
    value: '',
    regex: '',
    valid: true,
    errorMsg: 'Invalid Dashboard Name'
  }
}

const Appearance = forwardRef(({}, ref) => {
  const [form, setForm] = useState(AppUtils.createObjectCopy(formObj));
  const [widgetIcons, setWidgetIcons] = useState(AppUtils.createObjectCopy(icons));
  const dispatch = useDispatch();
  const widgetValues = useSelector((store) => store.widgetValueComponent.values);
  const backgroundColorPickerRef = useRef();
  const colorPickerRef = useRef();

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  const onChange = (inputId, event, inputType) => {
    setForm(InputUtils.inputOnChange(inputId, event, inputType, form, true))
    if (inputId === 'filterIcon') {
      applyFilter(event.target.value)
    }
  }

  const applyFilter = (value) => {
    if (value !== '') {
      const filtered = icons.filter(icon => icon.includes(value))
      setWidgetIcons(filtered)
    } else {
      setWidgetIcons(AppUtils.createObjectCopy(icons))
    }
  }

  const checkFieldValidity = (inputId) => {
    setForm(InputUtils.checkFieldValidity(inputId, form));
  }

  const handleOnChangeSettings = (key, event) => {
    dispatch(setValues({
      ...widgetValues,
      config: {
        ...widgetValues.config,
        settings: {
          ...widgetValues.config.settings,
          [key]: typeof event === 'string' ? event : event.target.value
        }
      }
    }))
  }

  return (
    <>
      <div style={{height: 35}}/>
      <div>
        <h6>Background Color</h6>
        <hr/>
        <CustomColorPicker
          ref={backgroundColorPickerRef}
          updatedWidget={widgetValues}
          setWidgetSettings={handleOnChangeSettings}
          mainKey='background'
          widgetKey='backgroundColor'
        />
      </div>
      <div style={{height: 35}}/>
      <div>
        <h6>Text Color</h6>
        <hr/>
        <CustomColorPicker
          ref={colorPickerRef}
          updatedWidget={widgetValues}
          setWidgetSettings={handleOnChangeSettings}
          mainKey='color'
          widgetKey='color'
        />
      </div>
      <div style={{height: 25}}/>
      <h6>Icon</h6>
      <hr/>
      <GenericInput
        value={form.filterIcon.value}
        label={''}
        valid={form.filterIcon.valid}
        errorMsg={form.filterIcon.errorMsg}
        wrapperClass={'icon-input'}
        onChange={(e) => onChange('filterIcon', e, InputTypes.TEXT_INPUT)}
        onBlur={() => checkFieldValidity('filterIcon')}
        elementConfig={{
          type: 'text',
          placeholder: 'Search for an icon',
        }}
      />
      <div style={{height: 25}}/>
      <div className={'value-widget-icons icon-demo-content'}>
        {widgetIcons.length > 0 ? widgetIcons.map((iconName,idx) => {
          return <div key={`icon-${iconName}-${idx}`} className={'col-xl-1 col-lg-1 col-sm-6 icon-container'} title={iconName}>
            <i className={`${iconName} value-widget-icon ${widgetValues.config.settings.icon === iconName ? 'selected-icon' : ''}`} onClick={() => handleOnChangeSettings('icon', iconName)}/>
          </div>
        }) : <div className={'no-icons'}>
          <i className={'uil-annoyed'}/>
          <h4>No Icons Found</h4>
        </div>}
      </div>
    </>
  );
});

export default Appearance;