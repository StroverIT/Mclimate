import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import InputUtils, {InputTypes} from "../../../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import GenericInput from "../../../../../../../../../../../components/GenericInput/Input/GenericInput";
import CustomColorPicker from "../../../../../../../../CustomColorPicker/CustomColorPicker";
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../../../../../../../../../store/valuePreview/actions";
import AppUtils from "../../../../../../../../../../../common/AppUtils";
import {unstable_batchedUpdates} from "react-dom";
import './valueControls.scss'

const formObj = {
  isFormValid: true,
  value: {
    value: 0,
    regex: "",
    valid: true,
    errorMsg: ''
  },
}

const initialWidgetSettings = {
  config: {
    settings: {
      color: "#DDDDDD",
    }
  }
}

const ValueControls = forwardRef(({id, value, color}, ref) => {
  const colorPickerRef = useRef();
  const dispatch = useDispatch();
  const [form, setForm] = useState(AppUtils.createObjectCopy(formObj));
  const [data, setData] = useState(AppUtils.createObjectCopy(initialWidgetSettings));
  const widgetValues = useSelector((store) => store.widgetValueComponent.values);

  useEffect(() => {
    unstable_batchedUpdates(() => {
      setForm({
        ...form,
        value: {
          ...form.value,
          value: value
        }
      })
      setData({
        config: {
          settings: {
            color: color
          }
        }
      })
    })
  }, [])

  useImperativeHandle(ref, () => ({
    checkForm() {
      return InputUtils.checkFormValidity(form);
    },
    getData() {
      return {
        form: form,
        settings: data
      }
    },
    getId() {
      return id;
    }
  }));

  const onChange = (inputId, event, inputType) => {
    setForm(InputUtils.inputOnChange(inputId, event, inputType, form, true))
    saveToRedux(inputId, event.target.value);
  }

  const handleOnChangeSettings = (key, event) => {
    const value = typeof event === 'string' ? event : event.target.value
    saveToRedux(key, value);
    setData({
      config: {
        settings: {
          ...data.config.settings,
          [key]: value
        }
      }
    })
  }

  const saveToRedux = (key, value) => {
    const reduxCopy = AppUtils.createObjectCopy(widgetValues);
    const foundWidgetControl = reduxCopy.config.chartSettings.find(controlProp => controlProp.id === id);
    if (foundWidgetControl) {
      foundWidgetControl[key] = value;
      // For correct setting of min and max values
      reduxCopy.config.chartSettings.sort((a, b) => {
        return parseInt(a.value) - parseInt(b.value);
      });
      dispatch(setValues(reduxCopy));
    }
  }

  return (
    <div className={'value-controls-wrapper'}>
      <div>
        <GenericInput
          valid={form.value.valid}
          value={form.value.value}
          errorMsg={form.value.errorMsg}
          onChange={(e) => onChange('value', e, InputTypes.TEXT_INPUT)}
          wrapperClass={'value-input'}
          elementConfig={{
            placeholder: '',
            type: "number",
          }}
        />
      </div>
      <div>
        <CustomColorPicker
          ref={colorPickerRef}
          updatedWidget={data}
          setWidgetSettings={handleOnChangeSettings}
          mainKey='color'
          widgetKey='color'
        />
      </div>
      <div></div>
    </div>
  );
});

export default ValueControls;