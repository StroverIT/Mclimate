import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import GenericInput from "../../../../../../../../../components/GenericInput/Input/GenericInput";
import InputUtils, {InputTypes} from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../../../../../../../store/valuePreview/actions";
import AppUtils from "../../../../../../../../../common/AppUtils";
import './basic.scss';

const formObj = {
  isFormValid: true,
  title: {
    value: '',
    regex: InputUtils.NON_EMPTY_STRING,
    valid: true,
    errorMsg: 'Invalid Title'
  },
}

const Basic = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(AppUtils.createObjectCopy(formObj));
  const widgetValues = useSelector((store) => store.widgetValueComponent.values);

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

  const onChange = (inputId, event, inputType) => {
    setForm(InputUtils.inputOnChange(inputId, event, inputType, form, true));
    dispatch(setValues({...widgetValues, widgetTitle: event.target.value}))
  }

  const checkFieldValidity = (inputId) => {
    setForm(InputUtils.checkFieldValidity(inputId, form));
  }

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  return (
    <div className={'basic-step-wrapper'}>
      <h6>Title</h6>
      <hr/>
      <div style={{height: 5}}/>
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
  );
});

export default Basic;