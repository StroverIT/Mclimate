import React, {forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState} from "react";
import GridLayout from "react-grid-layout";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import Device from "../Device/Device";
import {FPUtils} from "../../FPUtils";
import {useDispatch, useSelector} from "react-redux";
import {
  setFloorPlan,
  setFpScale,
  setTransformComponentActive,
  setUpdateFPDevice,
} from "../../../../../../store/floorPlan/actions";
import {Button, Popover, PopoverBody, PopoverHeader} from "reactstrap";
import floorMapIcon from "../../../../../../assets/images/buildings/icon-floor-map.svg";
import filterIcon from "../../../../../../assets/images/common/filter-icon.svg";
import AppUtils from "../../../../../../common/AppUtils";
import GenericInput from "../../../../../../components/GenericInput/Input/GenericInput";
import {InputTypes} from "../../../../../../components/GenericInput/InputUtils/InputUtils";
import controllersTypes from "../../../../../../common/data/controllers-types";
import {initialFloorPlanValue} from "../../FloorPlan";
import {setDroppedDeviceData} from "../../helpers/newFPDevice";
import {unstable_batchedUpdates} from "react-dom";
import {showMessage} from "../../../../../../helpers/ui_helper";
import "./floorMapLayout.scss";

const FloorMapLayout = ({attachedDevices, editMode}) => {
  const dispatch = useDispatch();
  const selectedFpDevice = useSelector((store) => store.floorPlan.device);
  const floorPlan = useSelector((store) => store.floorPlan.plan);
  const transformComponentActive = useSelector((store) => store.floorPlan.transformComponentActive);
  const isEditMode = useSelector((store) => store.floorPlan.isEditMode);
  const zoomState = useSelector((store) => store.floorPlan.fpScale);
  const [panningDisabled, setPanningDisabled] = useState(false)
  const [layout, setLayout] = useState([]);
  const [gridElements, setGridElements] = useState([]);
  const [image, setImage] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deviceTypes, setDeviceTypes] = useState({});
  const zoomRef = useRef();
  let uploadInput;

  const defaultProps = {
    className: "layout",
    rowHeight: 1,
    onLayoutChange: () => {},
    cols: 96,
    isResizable: false
  };

  useEffect(() => {
    setPanningDisabled(false);
  }, [selectedFpDevice])

  useEffect(() => {
    unstable_batchedUpdates(() => {
      setLayout(generateLayout());
    })
  }, [])

  useEffect(() => {
    if ((floorPlan.image && typeof floorPlan.image === 'string' && floorPlan.image !== '') || (floorPlan.image && typeof floorPlan.image.name === 'string')){
      setImage(setNewBackgroundImage(floorPlan.image));
    }
  }, [floorPlan.image])

  useEffect(() => {
    zoomRef.current?.centerView();
  }, [isEditMode])

  useLayoutEffect(() => {
    if (image) {
      setTimeout(() => {
        const gridContainer = document.getElementById('grid-container-image');
        const floorMapContainer = document.getElementById('floorMapContainer');
        if (gridContainer) {
          let scale = (floorMapContainer.offsetWidth / gridContainer.offsetWidth) * 0.45
          if (gridContainer.offsetWidth >= floorMapContainer.offsetWidth) {
            scale = 0.7 * (floorMapContainer.offsetWidth / gridContainer.offsetWidth);
          }

          dispatch(setFpScale({scale: scale}))

          const w = ((floorMapContainer.offsetWidth - (gridContainer.offsetWidth * scale)) / 2) % 10 ;
          const h = ((floorMapContainer.offsetHeight - (gridContainer.offsetHeight * scale)) / 2) % 10 ;
          zoomRef.current?.setTransform(w, h, scale, 0, 0);
        }
      }, 200)
    }
  }, [image])

  useEffect(() => {
    setGridElements(attachedDevices);
  }, [attachedDevices])

  useEffect(() => {
    setLayout(generateLayout());
  }, [gridElements])

  useEffect(() => {
    // check by reference
    if (floorPlan && JSON.stringify(floorPlan) === JSON.stringify(initialFloorPlanValue)) {
      setDeviceTypes(getAttachedToPlanDeviceTypes(floorPlan, true));
    } else {
      setDeviceTypes(getAttachedToPlanDeviceTypes());
    }
  }, [floorPlan])

  const setNewBackgroundImage = (newFpImage) => {
    try {
      const newImage = new Image();
      newImage.src = typeof newFpImage === "string" ? newFpImage : URL.createObjectURL(newFpImage);
      return newImage;
    } catch {
      showMessage('Something went wrong while loading floor plan image', true);
      setTimeout(() => {
        window.location.reload();
      }, 1500)
    }
  }

  const getAttachedToPlanDeviceTypes = (floorPlanObj = floorPlan, discardChanges = false) => {
    let types = {};
    floorPlanObj.devices.forEach(device => {
      if (device.type !== undefined && !types.hasOwnProperty(device.type)) {
        types = {
          ...types,
          [device.type]: {
            hidden: discardChanges ? false : deviceTypes[device.type]?.hidden ?? false,
            title: controllersTypes.find(item => item.type === device.type).title.replace('LoRaWAN', '')
          }
        }
      }
    })
    return types;
  }

  const generateDOM = () => {
    return gridElements.map(item => {
      return <div key={item.i} data-grid={{x: item.x, y: item.y, w: 4, h: 1}} id={item.i}>
        <Device device={item} key={item.i} online={FPUtils.getItemStatus(item.i)} editMode={editMode}/>
      </div>
    })
  }

  const generateLayout = () => {
    return gridElements.map(item => {
      return {
        x: item.x, // X-coordinate of element
        y: item.y, // Y-coordinate of element
        w: 4, // Fixed element width
        h: 1, // Fixed element height
        i: item.i, // Element key
        image: item.image ?? FPUtils.getItemImage(item.i)
      };
    })
  }

  const onLayoutChange = (layout) => {
    defaultProps.onLayoutChange(layout);
  }

  const onDrop = (layout, layoutItem, _event) => {
    try {
      _event.preventDefault();
      setPanningDisabled(false);
      const layoutCopy = layout.map(item => {return item});
      const index = layout.findIndex(el => el.i === '__dropping-elem__');
      let device = null;
      if (index !== -1) {
        const itemKey = parseInt(_event.dataTransfer.getData("text/plain"));
        layoutCopy[index] = {
          ...layout[index],
          i: itemKey,
        }
        device = {
          coordinates: [layoutItem.x, layoutItem.y],
          id: itemKey,
          image: FPUtils.getItemImage(itemKey)
        }
      }

      setGridElements(layoutCopy);
      const newFPDevice = setDroppedDeviceData(device);
      if (newFPDevice) {
        const newFp = {
          ...floorPlan,
          devices: [...floorPlan.devices, newFPDevice]
        };
        unstable_batchedUpdates(() => {
          setDeviceTypes(getAttachedToPlanDeviceTypes(newFp))
          dispatch(setFloorPlan(FPUtils.copyFPObject(newFp)));
          zoomRef.current?.centerView();
        })
      } else {
        dispatch(setFloorPlan({...floorPlan}));
      }
      if (transformComponentActive) {
        dispatch(setTransformComponentActive(false));
      }
    } catch {
      showMessage('Something went wrong while dropping device', true);
    }
  };

  const handleScaleChange = (zoomRef) => {
    dispatch(setFpScale({
      offsetX: zoomRef?.state?.positionX,
      offsetY: zoomRef?.state?.positionY,
      scale: zoomRef?.state?.scale
    }))
  }

  const onDragStop = (elements) => {
    if (editMode) {
      dispatch(setTransformComponentActive(false));
      setPanningDisabled(false)
      // Update devices coordinates
      const devices = elements.map(element => {
        return {
          ...FPUtils.getFPDeviceById(element.i),
          coordinates: [element.x, element.y],
          image: FPUtils.getItemImage(element.i),
        }
      });
      dispatch(setFloorPlan({...floorPlan, devices: devices}));
    }
  }

  const onDrag = () => {
      dispatch(setTransformComponentActive(true));
      setPanningDisabled(true)
  }

  const onDropDragOver = () => {
    const floorMapContainer = document.getElementById('floorMapContainer');
    let scale = (floorMapContainer.offsetWidth / image.width) * 0.55

    if (image.width >= floorMapContainer.offsetWidth) {
      scale = 0.9 * (floorMapContainer.offsetWidth / image.width);
    }

    dispatch(setFpScale({scale: scale}))

    const w = ((floorMapContainer.offsetWidth - (image.width * scale)) / 2) % 10 ;
    const h = ((floorMapContainer.offsetHeight - (image.height * scale)) / 2) % 10 ;
    zoomRef.current?.setTransform(w ,h, scale, 0, 0);
  }

  const onPanningStop = () => {
    if (editMode) {
      dispatch(setTransformComponentActive(false));
    }
  }

  const onPanning = () => {
    if (editMode) {
      dispatch(setTransformComponentActive(true));
    }
  }

  const hideDevices = (deviceType) => {
    FPUtils.floorPlanDevices = FPUtils.floorPlanDevices.map(device => {
      if (device.type === deviceType) {
        return {
          ...device,
          hidden: !deviceTypes[deviceType]?.hidden
        }
      }
      return device;
    })
    const fpCopy = FPUtils.copyFPObject({...floorPlan, devices: FPUtils.floorPlanDevices});
    dispatch(setFloorPlan(fpCopy));
    setDeviceTypes({
      ...deviceTypes,
      [deviceType]: {
        ...deviceTypes[deviceType],
        hidden: !deviceTypes[deviceType]?.hidden
      }
    })
  }

  const onFileUpload = (event) => {
    const files = AppUtils.onFileUpload(event, ['image/jpg', 'image/jpeg', 'image/png']);
    if (files.length === 1) {
      const fpCopy = FPUtils.copyFPObject(floorPlan);
      fpCopy.image = files[0];
      fpCopy.devices = [];
      unstable_batchedUpdates(() => {
        setImage(null);
        dispatch(setFloorPlan(fpCopy));
        dispatch(setUpdateFPDevice(null));
      })
    }
  }

  const uploadImageHandler = () => {
    uploadInput.click();
    setIsFilterOpen(false);
  }

  const btnZoomHandler = (zoomFunc, ref) => {
    zoomFunc();
    setTimeout(() => {
      handleScaleChange(ref);
    }, 500)
  }

  return (
    image ?
      <TransformWrapper
      ref={zoomRef}
      panning={{disabled: panningDisabled}}
      onZoom={(zoomRef) => handleScaleChange(zoomRef)}
      centerOnInit={true}
      initialScale={zoomState.scale}
      wheel={{touchPadDisabled: true, step: 0.2}}
      minScale={0.2}
      doubleClick={{disabled: true}}
      onPanningStop={onPanningStop}
      onPanning={onPanning}
      // onZoomStart={() => dispatch(setTransformComponentActive(true))}
      // onZoomStop={() => dispatch(setTransformComponentActive(false))}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <TransformComponent contentClass={''}>
            <div id={'grid-container-image'}>
              <GridLayout
                layout={layout}
                onLayoutChange={onLayoutChange}
                isBounded={true}
                isDraggable={editMode}
                width={image?.width === 0 ? 900 : image?.width}
                transformScale={zoomState.scale}
                style={{
                  width: image?.width === 0 ? 900 : image?.width,
                  height: image?.height === 0 ? 600 : image?.height,
                  background: `url('${image.src}') no-repeat`,
                }}
                compactType={null}
                isDroppable={true}
                onDragStop={onDragStop}
                onDrag={onDrag}
                onDrop={onDrop}
                onDropDragOver={onDropDragOver}
                preventCollision={true}
                {...defaultProps}
              >
                {generateDOM()}
              </GridLayout >
            </div>
          </TransformComponent>
          <div className="zoom-tools">
            <button onClick={() => btnZoomHandler(zoomIn, rest)}><i className="uil-plus"/></button>
            <button onClick={() => btnZoomHandler(zoomOut, rest)}><i className="uil-minus"/></button>
          </div>
          <div className={'plan-tools'}>
            <Button
              id="Popover1"
              color=""
              className="filter-button"
              onClick={() => {setIsFilterOpen(true)}}>
              <img src={filterIcon} alt="" style={{width: 20, height: 20, filter: AppUtils.changeSVGColor(isFilterOpen ? '#54A9DB' : '#7b7b7b')}}/>
            </Button>
            { editMode ? <Button
              color=""
              className="upload-new-plan-btn"
              onClick={uploadImageHandler}
              >
              <img src={floorMapIcon} alt="" style={{width: 16, height: 18, marginRight: 5, filter: AppUtils.changeSVGColor('#7b7b7b')}}/>
              Upload new plan
            </Button> : null}
            <input
              type='file'
              id='imgUpload'
              style={{display: 'none'}}
              ref={el => uploadInput = el}
              accept={AppUtils.file_types.JPG + AppUtils.file_types.PNG}
              onChange={(event) => onFileUpload(event)}
            />
          </div>
          <Popover
            target="Popover1"
            popperClassName={'filters-popper'}
            isOpen={isFilterOpen}
            placement={'top'}
            toggle={() => setIsFilterOpen(false)}
          >
            <PopoverHeader className={'filters-header'}>
              Filters
            </PopoverHeader>
            <PopoverBody className={'filters-body'}>
              {Object.keys(deviceTypes).map(key => {
                return <GenericInput
                  key={key}
                  elementType={InputTypes.CHECKBOX}
                  wrapperClass={'form-check'}
                  classNameProp={'form-check-input device-settings-checkbox-cursor'}
                  value={!deviceTypes[key].hidden}
                  valid={true}
                  errorMsg={''}
                  onChange={() => {hideDevices(key)}}
                  checkboxSpecificProps={{labelContent: deviceTypes[key].title}}
                />
              })}
            </PopoverBody>
          </Popover>
        </>
      )}
     </TransformWrapper> : null
  );
}

export default FloorMapLayout;