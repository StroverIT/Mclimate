import * as React from 'react';
import {deviceInfoTypes, FPUtils} from "../../FPUtils";
import {useDispatch, useSelector} from "react-redux";
import {
  openCloseControllerModal,
  setFloorPlan,
  setUpdateFPDevice
} from "../../../../../../store/floorPlan/actions";
import {useEffect, useLayoutEffect, useState} from "react";
import AppUtils from "../../../../../../common/AppUtils";
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import controllerTypes from "../../../../../../common/data/controllers-types";
import {usePrevious} from "../../../../../../Hooks/usePrevious";
import {Button} from "reactstrap";
import {setControllerProviderData} from "../../../../../../helpers/backend_helper";
import {mapDevicesData} from "../../helpers/mapDevicesData";
import {showMessage} from "../../../../../../helpers/ui_helper";
import refreshIcon from '../../../../../../assets/images/common/refresh-icon.svg'
import './device.scss'

export const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: "0px 0px 35px 0px rgba(53, 53, 53, 0.16)",
    fontSize: 11,
    minWidth: 225,
    zIndex: 500,
    pointerEvents: 'auto',
    padding: 0
  },
}))(Tooltip);

const DEVICE_IMAGE_SCALE = 30;
const DEVICE_SCALE = 45;
const ONLINE_SCALE = 14;

const Device = ({device, online, editMode}) => {
  const dispatch = useDispatch();
  const selectedFpDevice = useSelector((store) => store.floorPlan.device);
  const floorPlan = useSelector((store) => store.floorPlan.plan);
  const transformComponentActive = useSelector((store) => store.floorPlan.transformComponentActive);
  const scale = useSelector((store) => store.floorPlan.fpScale);
  const [infoBlock, _setInfoBlock] = useState(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [deviceSize, setDeviceSize] = useState({width: 40, height: 40});
  const [deviceImageSize, setDeviceImageSize] = useState({width: 30, height: 30});
  const [selectedDeviceImage, setSelectedDeviceImage] = useState('');
  const [badges, _setBadges] = useState(null);
  const [showBadges, setShowBadges] = useState(false);
  const [updatingDevice, setUpdatingDevice] = useState(false);
  const prevBadges = usePrevious(badges);
  const prevInfoBlock = usePrevious(infoBlock);
  const fpDevice = FPUtils.getFPDeviceById(device.i);

  useEffect(() => {
    calculateDeviceSize();
    calculateDeviceImageSize();
  }, [scale, selectedFpDevice])

  useEffect(() => {
    if (device) {
      setSelectedDeviceImage(device.image ?? FPUtils.getItemImage(device.i))
      setDeviceInfoComponent();
    }
      hideDeviceInfoComponents();
      getDeviceImage();
      setDeviceInfoComponent();
  }, [device, selectedFpDevice])

  useLayoutEffect(() => {
    if (transformComponentActive) {
      setIsTooltipOpen(false);
      setShowBadges(false);
    } else {
      setTimeout(() => {
        if (infoBlock) {
          if (editMode && !fpDevice.infoBlock.show) {
            setIsTooltipOpen(false);
          } else if (fpDevice.infoBlock.show && fpDevice.infoBlock.showWhen === 'hover') {
            setIsTooltipOpen(false);
          } else {
            setIsTooltipOpen(true);
          }
        }
        if (badges) {
          if (editMode && !fpDevice.tooltipBadges.show) {
            setShowBadges(false);
          } else if (fpDevice.tooltipBadges.show && fpDevice.tooltipBadges.showWhen === 'hover') {
            setShowBadges(false);
          } else {
            setShowBadges(true);
          }
        }
      }, 50)
    }
  }, [transformComponentActive])

  const setDeviceInfoComponent = (onHover = false) => {
    const currentDevice = (selectedFpDevice && parseInt(selectedFpDevice?.id) !== parseInt(fpDevice?.id)) ?? false;
    if (currentDevice && !onHover) {
      return;
    }

    if (transformComponentActive) {
      setShowBadges(false);
      setIsTooltipOpen(false);
      return;
    }

    let device = onHover ? fpDevice : selectedFpDevice ?? fpDevice;

    if (device && device?.settings && device.type) {
      const deviceProps = controllerTypes.find(controller => controller.type === device.type);
      let devicePropsObj = {};

      if (deviceProps) {
        deviceProps.table.forEach(item => {
          devicePropsObj[item.key] = {...item}
        })
      }

      if (onHover) {
        if (device.tooltipBadges.show && device.tooltipBadges.showWhen === 'hover') {
          setBadges(getDeviceInformation(devicePropsObj, device, deviceInfoTypes.BADGE));
          setShowBadges(true);
        }
        if (device.infoBlock.show && device.infoBlock.showWhen === 'hover') {
          setInfoBlock(getDeviceInformation(devicePropsObj, device, deviceInfoTypes.INFO_BLOCK));
          setIsTooltipOpen(true);
        }
      } else {
        if (!device.tooltipBadges.show) {
          setShowBadges(false);
        } else if (device.tooltipBadges.show && device.tooltipBadges.showWhen === 'active') {
          setBadges(getDeviceInformation(devicePropsObj, device, deviceInfoTypes.BADGE));
          setShowBadges(true);
        }

        if (editMode && !device.infoBlock.show) {
          setIsTooltipOpen(false);
        } else if (device.infoBlock.show && device.infoBlock.showWhen === 'active') {
          setInfoBlock(getDeviceInformation(devicePropsObj, device, deviceInfoTypes.INFO_BLOCK));
          setIsTooltipOpen(true);
        }
      }
    }
  }

  const setBadges = (newBadges) => {
    if (JSON.stringify(newBadges) !== JSON.stringify(prevBadges)) {
      _setBadges(newBadges);
    }
  }

  const setInfoBlock = (newInfoBlock) => {
    if (JSON.stringify(newInfoBlock) !== JSON.stringify(prevInfoBlock)) {
      _setInfoBlock(newInfoBlock);
    }
  }

  /**
   * Retrieve device information as a component(BADGES or InfoBLock)
   *
   * @param devicePropsObj - device properties
   * @param device - device instance
   * @param informationComponent - BADGE or InfoBlock
   * @returns div elements with the device information
   */
  const getDeviceInformation = (devicePropsObj, device, informationComponent) => {
    const keys = Object.keys(device.settings);
    return keys.map(key => {
      return FPUtils.getDevicePropValueByKey(devicePropsObj, device, key, informationComponent);
    })
  }

  const hideDeviceInfoComponents = () => {
    const fpDevice = FPUtils.getFPDeviceById(device.i);
    if (fpDevice?.tooltipBadges?.showWhen === 'hover') {
      setShowBadges(false);
    }
    if (!editMode && (selectedFpDevice && parseInt(selectedFpDevice?.id) === parseInt(fpDevice?.id))) {
      setIsTooltipOpen(true);
    } else if (fpDevice?.infoBlock?.show === false) {
      setIsTooltipOpen(false);
    } else if (fpDevice?.infoBlock?.showWhen === 'hover') {
      setIsTooltipOpen(false);
    }
}

  const onClickHandler = (floorPlanDevice,) => {
    dispatch(setUpdateFPDevice(FPUtils.getFPDeviceById(floorPlanDevice.i)));
  }

  const getDeviceImage = () => {
    if (selectedFpDevice && selectedFpDevice.id === parseInt(device.i)) {
      setSelectedDeviceImage(AppUtils.getDeviceImage(selectedFpDevice.type));
    } else {
      setSelectedDeviceImage(device.image ?? FPUtils.getItemImage(device.i))
    }
  }

  const renderControlsBtn = () => {
    if (!editMode && selectedFpDevice && selectedFpDevice.id === parseInt(device.i)) {
      return <div className={'control-device-btn-container'}>
        <Button
          color="primary"
          className=""
          onClick={openSettings}
        >
          Control Device
        </Button>
      </div>
    }
  }

  const renderUnselectBtn = () => {
    if (!editMode && selectedFpDevice && selectedFpDevice.id === parseInt(device.i)) {
      return <button
        type="button"
        onClick={() => {dispatch(setUpdateFPDevice(null))}}
        className="unselect-device"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    }
    return null
  }

  const refreshButton = () => {
    return <div className={'refresh-device-btn'}>
      <Button
        color={`${updatingDevice ? 'primary' : ''}`}
        className={`${updatingDevice ? 'active-refresh-btn' : 'refresh-btn'}`}
        onClick={refreshDeviceData}
      >
        <img src={refreshIcon}
             className={`${updatingDevice ? 'fa-spin' : ''}`}
             alt="refresh"
             style={{
               height: 20,
               filter: `${updatingDevice ? 'invert(1)' : AppUtils.changeSVGColor('#44a2dd')}`,
               marginRight: updatingDevice ? 5 : 0
             }}
        />
        {updatingDevice ? 'Updating...' : ''}
      </Button>
    </div>
  }

  const openSettings = (e) => {
    e.stopPropagation();
    dispatch(openCloseControllerModal(true));
  }

  const refreshDeviceData = (е) => {
    е.stopPropagation();
    const floorPlanDevice = FPUtils.getFPDeviceById(device.i);
    if (floorPlanDevice) {
      setUpdatingDevice(true);
      setControllerProviderData(floorPlanDevice)
        .then((response) => {
          response['controller_log'] = response.provider;
          response['controller_id'] = floorPlanDevice.id;
          delete response.provider;
          const updatedFP = mapDevicesData(floorPlan, [response], true);
          dispatch(setFloorPlan(FPUtils.copyFPObject(updatedFP)));
        })
        .catch(() => {
          showMessage('Something went wrong while updating device data', true)
        })
        .finally(() => {
          setUpdatingDevice(false);
        })
    }
  }

  const calculateDeviceSize = () => {
    const size = {
      width: DEVICE_SCALE,
      height: DEVICE_SCALE,
      '--online-width': `${ONLINE_SCALE}px`,
      '--online-height': `${ONLINE_SCALE}px`,
      '--online-left': '64%',
      '--online-top': '-3px'
    }
    if (scale.scale > 0.8 && scale.scale < 1) {
      size.width = DEVICE_SCALE + 10;
      size.height = DEVICE_SCALE + 10;
      size['--online-width'] = `${ONLINE_SCALE + 3}px`;
      size['--online-height'] = `${ONLINE_SCALE + 3}px`;
    }
    if (scale.scale > 0.6 && scale.scale <= 0.8) {
      size.width = DEVICE_SCALE + 20;
      size.height = DEVICE_SCALE + 20;
      size['--online-width'] = `${ONLINE_SCALE + 5}px`;
      size['--online-height'] = `${ONLINE_SCALE + 5}px`;
      size['--online-left'] = '66%';
      size['--online-top'] = '-4px';
    }
    if (scale.scale > 0.4 && scale.scale <= 0.6) {
      size.width = DEVICE_SCALE + 30;
      size.height = DEVICE_SCALE + 30;
      size['--online-width'] = `${ONLINE_SCALE + 7}px`;
      size['--online-height'] = `${ONLINE_SCALE + 7}px`;
      size['--online-left'] = '65%';
      size['--online-top'] = '-5px';
    }
    if (scale.scale <= 0.4) {
      size.width = DEVICE_SCALE + 60;
      size.height = DEVICE_SCALE + 60;
      size['--online-width'] = `${ONLINE_SCALE + 15}px`;
      size['--online-height'] = `${ONLINE_SCALE + 15}px`;
      size['--online-left'] = '65%';
      size['--online-top'] = '-6px';
    }
    if (selectedFpDevice?.id === parseInt(device.i)) {
      size.width += 20;
      size.height += 20;
    }
    setDeviceSize(size);
  }

  const calculateDeviceImageSize = () => {
    const size = {
      width: DEVICE_IMAGE_SCALE,
      height: DEVICE_IMAGE_SCALE,
    }
    if (scale.scale > 0.8 && scale.scale < 1) {
      size.width = DEVICE_IMAGE_SCALE + 10;
      size.height = DEVICE_IMAGE_SCALE + 10;
    }
    if (scale.scale > 0.6 && scale.scale <= 0.8) {
      size.width = DEVICE_IMAGE_SCALE + 20;
      size.height = DEVICE_IMAGE_SCALE + 20;
    }
    if (scale.scale > 0.4 && scale.scale <= 0.6) {
      size.width = DEVICE_IMAGE_SCALE + 30;
      size.height = DEVICE_IMAGE_SCALE + 30;
    }
    if (scale.scale <= 0.4) {
      size.width = DEVICE_IMAGE_SCALE + 50;
      size.height = DEVICE_IMAGE_SCALE + 50;
    }
    if (selectedFpDevice?.id === parseInt(device.i)) {
      size.width += 12;
      size.height += 12;
    }
    setDeviceImageSize(size);
  }

  const isDeviceSelected = selectedFpDevice?.id === parseInt(device.i);

  return (
    fpDevice?.hidden ? null :
      <div onMouseLeave={hideDeviceInfoComponents} className={`${badges ? 'fp-device-wrapper-badges' : ''}`}>
        <LightTooltip
          title={
            <div className={`device-info-block-wrapper ${!editMode && selectedFpDevice && selectedFpDevice.id === parseInt(device.i) ? 'info-block-selected' : ''}`}>
              {renderUnselectBtn()}{infoBlock}{renderControlsBtn()}
            </div>
          }
          placement="left"
          open={isTooltipOpen}
          PopperProps={{
            disablePortal: true
          }}
        >
          <div
            onMouseOver={() => setDeviceInfoComponent(true)}
            className={`${online ? 'device-image-online' : 'device-image'} ${isDeviceSelected ?
              'device-image-selected' : ''}`}
            onDoubleClick={(e) => onClickHandler(device, e)}
            style={{cursor: editMode ? 'grab' : 'default', ...deviceSize}}
            // onClick={(e) => onClickHandler(device, e)}
          >
            <div title={'Double click on device for select'}>
              <img
                src={selectedDeviceImage}
                alt="device"
                style={{filter: online ? AppUtils.changeSVGColor('#0098F0') : AppUtils.changeSVGColor('#474747'), ...deviceImageSize}}
                className={'device-svg'}/>
            </div>
          </div>
        </LightTooltip>
        {showBadges ? <div className={`device-badges ${selectedFpDevice && selectedFpDevice.id === parseInt(device.i) ? 'badges-selected' : ''}`}>
          {badges}{refreshButton()}
        </div> : null}
      </div>
  );
};

export default Device