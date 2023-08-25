import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import AppUtils from "../../../../../../../../../common/AppUtils";
import {icons} from "../../../../../../CreateDashboardModal/Icons";
import {useDispatch, useSelector} from "react-redux";
import InputUtils, {InputTypes} from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import GenericInput from "../../../../../../../../../components/GenericInput/Input/GenericInput";
import {setBooleanWidgetValues} from "../../../../../../../../../store/booleanWidget/actions";
import './basic.scss'

const formObj = {
  isFormValid: true,
  title: {
    value: '',
    regex: InputUtils.NON_EMPTY_STRING,
    valid: true,
    errorMsg: 'Invalid Title'
  },
  filterIcon: {
    value: '',
    regex: '',
    valid: true,
    errorMsg: ''
  }
}

const Basic = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(AppUtils.createObjectCopy(formObj));
  const [widgetIcons, setWidgetIcons] = useState(AppUtils.createObjectCopy(icons));
  const widgetValues = useSelector((store) => store.booleanWidget.values);

  useEffect(() => {
    setForm({
      ...form,
      isFormValid: true,
      title: {
        ...form['title'],
        value: widgetValues.widgetTitle,
        valid: true
      }
    })
  }, [widgetValues.widgetTitle])

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  const onChange = (inputId, event, inputType) => {
    setForm(InputUtils.inputOnChange(inputId, event, inputType, form, true))
    if (inputId === 'filterIcon') {
      applyFilter(event.target.value)
    } else {
      dispatch(setBooleanWidgetValues({...widgetValues, widgetTitle: event.target.value}))
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
    dispatch(setBooleanWidgetValues({
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
        <h6>Title</h6>
        <hr/>
        <GenericInput
          value={form.title.value}
          label={''}
          valid={form.title.valid}
          errorMsg={form.title.errorMsg}
          onChange={(e) => onChange('title', e, InputTypes.TEXT_INPUT)}
          onBlur={() => checkFieldValidity('title')}
          wrapperClass={'title-input'}
          elementConfig={{
            placeholder: 'Title',
            type: 'text',
            // autoFocus: true,
            tabIndex: 1
          }}
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
        elementConfig={{
          type: 'text',
          placeholder: 'Search for an icon',
          tabIndex: 2
        }}
      />
      <div style={{height: 25}}/>
      <div className={'boolean-widget-icons icon-demo-content'}>
        {widgetIcons.length > 0 ? widgetIcons.map((iconName,idx) => {
          return <div key={`icon-${iconName}-${idx}`} className={'col-xl-1 col-lg-1 col-sm-6 icon-container'} title={iconName}>
            <i className={`${iconName} boolean-widget-icon ${widgetValues.config.settings.icon === iconName ? 'selected-icon' : ''}`} onClick={() => handleOnChangeSettings('icon', iconName)}/>
          </div>
        }) : <div className={'no-icons'}>
          <i className={'uil-annoyed'}/>
          <h4>No Icons Found</h4>
        </div>}
      </div>
    </>
  );
});

export default Basic;