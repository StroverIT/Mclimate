import {createRef, forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import DeviceFragment from "./DeviceFragment";
import AppUtils from "../../../../../../../../../../../common/AppUtils";
import {setChartWidgetValues} from "../../../../../../../../../../../store/chartWidget/actions";
import {usePrevious} from "../../../../../../../../../../../Hooks/usePrevious";

const DynamicDeviceFragment = forwardRef(({createdInputs} , ref) => {
  const dispatch = useDispatch();
  const widgetValues = useSelector((store) => store.chartWidget.values);
  const prevDevices = usePrevious(createdInputs);
  const [dynamicInputs, setDynamicInputs] = useState({
    elementsRef: [],
    inputsArray: []
  })

  useEffect(() => {
    if (createdInputs && createdInputs.length > 0 && JSON.stringify(prevDevices) !== JSON.stringify(createdInputs)) {
      const newDynamicInputs = {
        elementsRef: [],
        inputsArray: []
      }
      createdInputs.forEach(input => {
        insertInput(newDynamicInputs, input)
      })
      setDynamicInputs(newDynamicInputs);
    }
  }, [createdInputs])

  useImperativeHandle(ref, () => ({
    checkInputsValidity() {
      for (let index in dynamicInputs.elementsRef) {
        if (dynamicInputs.elementsRef[index].current?.checkForm().isFormValid === false) {
          return false
        }
      }
      return true
    },
    getData() {
      return dynamicInputs.elementsRef.map(ref => {
        return ref.current?.getData()
      }).filter(item => item !== undefined)
    }
  }));

  const makeDynamicInputsCopy = () => {
    return {
      elementsRef: dynamicInputs.elementsRef.map(item => {return item}),
      inputsArray: dynamicInputs.inputsArray.map(item => {return {...item}}),
    }
  }

  const insertInput = (dynamicInputsRef, alreadyCreatedInput = null) => {
    dynamicInputsRef.elementsRef.push(createRef());
    const elementsRefLength = dynamicInputsRef.elementsRef.length - 1;
    if (alreadyCreatedInput) {
      dynamicInputsRef.inputsArray.push(
        <DeviceFragment
          ref={dynamicInputsRef.elementsRef[elementsRefLength]}
          componentId={alreadyCreatedInput.componentId} // unique ID used to distinguish between identical instances
          key={alreadyCreatedInput.componentId}
          id={alreadyCreatedInput.id}
          fragmentId={elementsRefLength}
          removeFragment={() => removeFragment(elementsRefLength)}
          selectedDevice={alreadyCreatedInput}
        />
      );
    }
  }

  const removeFragment = (index) => {
    let selectedDevicesCopy = AppUtils.createObjectArrayCopy(createdInputs);
    const dynamicInputsCopy = makeDynamicInputsCopy();
    dynamicInputsCopy.elementsRef.splice(index, 1);
    dynamicInputsCopy.inputsArray.splice(index, 1);
    selectedDevicesCopy.splice(index, 1);

    setDynamicInputs(dynamicInputsCopy);
    dispatch(setChartWidgetValues({
      ...widgetValues,
      selectedDevices: selectedDevicesCopy,
      config: {
        ...widgetValues.config,
      }
    }))
  }

  return (
    <div>
      {dynamicInputs.inputsArray.map(item => {
        return <div key={item.key} id={item.key}>
          {item}
          <div style={{height: 15}}/>
        </div>
      })}
    </div>
  )
})
export default DynamicDeviceFragment