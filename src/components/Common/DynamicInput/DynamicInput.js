import * as React from 'react';
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {DynamicInputForm} from "./DynamicInputForm";
import InputUtils, {InputTypes} from "../../GenericInput/InputUtils/InputUtils";
import GenericInput from "../../GenericInput/Input/GenericInput";
import AppUtils from "../../../common/AppUtils";
import './dynamicInput.scss'

const DynamicInput = forwardRef(({defaultValue, placeholder, id}, ref) => {
  const [form, setForm] = useState(AppUtils.createObjectCopy(DynamicInputForm));

  useEffect(() => {
    if (defaultValue && form.inputValue.value === '') {
      setForm({
        ...form,
        id: id ?? -1,
        inputValue: {
          ...form.inputValue,
          value: defaultValue
        }
      })
    }
  }, [defaultValue])

  const onChange = (inputId, event, inputType) => {
    setForm(InputUtils.inputOnChange(inputId, event, inputType, form, true))
  }

  const checkFieldValidity = (inputId) => {
    setForm(InputUtils.checkFieldValidity(inputId, form));
  }

  useImperativeHandle(ref, () => ({
    checkForm() {
      return InputUtils.checkFormValidity(form);
    },
    getForm() {
      return form
    }
  }));

  return (
      <GenericInput value={form.inputValue.value}
                    valid={form.inputValue.valid}
                    errorMsg={form.inputValue.errorMsg}
                    wrapperClass={'dynamic-input-field'}
                    onChange={(e) => onChange('inputValue', e, InputTypes.TEXT_INPUT)}
                    onBlur={() => checkFieldValidity('inputValue')}
                    elementConfig={{
                      type: 'text',
                      placeholder: placeholder ?? '...',
                    }}
      />
  );
});

export default DynamicInput