import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import AppUtils from "../../../../../../../../../common/AppUtils";

import {useDispatch, useSelector} from "react-redux";
import InputUtils, {InputTypes} from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import GenericInput from "../../../../../../../../../components/GenericInput/Input/GenericInput";
import {setIframeWidgetValues} from "../../../../../../../../../store/iframeWidget/actions";
import './basic.scss'

const formObj = {
  isFormValid: true,
  title: {
    value: '',
    regex: InputUtils.NON_EMPTY_STRING,
    valid: true,
    errorMsg: 'Invalid Title'
  },
  iframe: {
    value: '',
    regex: '',
    valid: true,
    errorMsg: ''
  }
}

const Basic = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(AppUtils.createObjectCopy(formObj));
  const widgetValues = useSelector((store) => store.iframeWidget.values);

  useEffect(() => {
    setForm({
      ...form,
      title: {
        ...form['title'],
        value: widgetValues.title,
        valid: true
      },
      iframe: {
        ...form['iframe'],
        value: widgetValues.iframe,
        valid: true
      }

    })
    
  }, [widgetValues.iframe, widgetValues.title])

  
  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  const onChange = (inputId, event, inputType) => {

    setForm(InputUtils.inputOnChange(inputId, event, inputType, form, true))
    dispatch(setIframeWidgetValues({...widgetValues, [inputId]: event.target.value}))



   
  }

 

  const checkFieldValidity = (inputId) => {
    setForm(InputUtils.checkFieldValidity(inputId, form));
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
      <h6>Source</h6>
      <hr/>
      <GenericInput
        value={form.iframe.value}
        label={''}
        valid={form.iframe.valid}
        errorMsg={form.iframe.errorMsg}
        wrapperClass={'title-input'}

        onChange={(e) => onChange('iframe', e, InputTypes.TEXT_INPUT)}
        elementConfig={{
          type: 'text',
          placeholder: 'URL page',
          tabIndex: 1
        }}
      />
    
    </>
  );
});

export default Basic;