import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CustomColorPicker from "../../../../../../CustomColorPicker/CustomColorPicker";
import { useDispatch, useSelector } from "react-redux";
import { setIframeWidgetValues } from "../../../../../../../../../store/iframeWidget/actions";
import InputUtils, { InputTypes } from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import AppUtils from "../../../../../../../../../common/AppUtils";
import { useMediaQuery } from "@material-ui/core";
import "./appearance.scss";

const formObj = {
  isFormValid: true,
  isHiddenBg: {
    value: false,
    regex: "",
    valid: true,
    errorMsg: ""
  },
  isFullScreenHeight: {
    value: false,
    regex: "",
    valid: true,
    errorMsg: ""
  },
 
};

const Appearance = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(AppUtils.createObjectCopy(formObj));

  const widgetValues = useSelector((store) => store.iframeWidget.values);
  const backgroundColorRef = useRef();
  // const matchesSmallModal = useMediaQuery('(max-width:1200px)');

  useEffect(() => {
    console.log();
    setForm({
      ...form,
      isHiddenBg: {
        ...form['isHiddenBg'],
        value: widgetValues.isHiddenBg,
        valid: true
      },
      isFullScreenHeight: {
        ...form['isFullScreenHeight'],
        value: widgetValues.isFullScreenHeight,
        valid: true
      }
    });
  }, [widgetValues.isHiddenBg, widgetValues.isFullScreenHeight]);

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues;
    },
  }));

 
  const setWidgetData = (key, event) => {

    setForm(InputUtils.inputOnChange(key, event, InputTypes.CHECKBOX, form, true))
    dispatch(setIframeWidgetValues({...widgetValues, [key]: event.target.checked}))


  };

  const handleOnChangeSettings = (key, event) => {
    dispatch(
      setIframeWidgetValues({
        ...widgetValues,
        config: {
          ...widgetValues.config,
          settings: {
            ...widgetValues.config.settings,
            [key]: typeof event === "string" ? event : event.target.value,
          },
        },
      })
    );
  };

 

  return (
    <div>
      <div style={{ height: 25 }} />
      <div>
        <h6>Background Color</h6>
        <hr />
        <CustomColorPicker
          ref={backgroundColorRef}
          updatedWidget={widgetValues}
          setWidgetSettings={handleOnChangeSettings}
          mainKey="backgroundColor"
          widgetKey="backgroundColor"
        />
      </div>

      <div style={{ height: 20 }} />
      <div>
       
        <div className="form-check form-switch no-margin-switch">
          <input
            type="checkbox"
            className="form-check-input checkbox device-settings-checkbox"
            id={`hideBg`}
            checked={form.isHiddenBg.value}
            onChange={(event) =>
              setWidgetData("isHiddenBg", event)
            }
          />
        <label htmlFor="hideBg">Hide background</label>

        </div>
      </div>
      <div style={{ height: 10 }} />
      <div>
        <div className="form-check form-switch no-margin-switch">
          <input
            type="checkbox"
            className="form-check-input checkbox device-settings-checkbox"
            id={`fullScreen`}
            checked={form.isFullScreenHeight.value}
            onChange={(event) =>
              setWidgetData("isFullScreenHeight", event)
            }
          />
        <label htmlFor="fullScreen">Use full screen height</label>

        </div>
      </div>
     
    </div>
    
  );
});

export default Appearance;
