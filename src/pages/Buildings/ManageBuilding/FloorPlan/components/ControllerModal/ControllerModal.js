import React, {useEffect, useState} from 'react';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {useDispatch, useSelector, connect} from "react-redux";
import {openCloseControllerModal, setUpdateFPDevice} from "../../../../../../store/floorPlan/actions";
import MainControls from "../../../../../Devices/DeviceDetails/main-controls";
import {addNToast} from "../../../../../../store/layout/actions";
import {updateControllerProviders} from "../../../../../../store/controllers/actions"
import { withRouter } from "react-router-dom"
import {showMessage} from "../../../../../../helpers/ui_helper";
import {FPUtils} from "../../FPUtils";
import './controllerModal.scss'

const ControllerModal = (props) => {
  const dispatch = useDispatch();
  const selectedFpDevice = useSelector((store) => store.floorPlan.device);
  const isModalOpen = useSelector((store) => store.floorPlan.isControllerModalOpen);
  const controllers = useSelector((store) => store.controllers.controllers);
  const buildings = useSelector((store) => store.buildings);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    if (isModalOpen && selectedFpDevice) {
      let searchedDevice = FPUtils.allBuildingDevices.find(device => device.controller.serial_number === selectedFpDevice.serial_number) ?? undefined
      if (searchedDevice) {
        searchedDevice = {...searchedDevice, ...searchedDevice.controller, provider: searchedDevice.controller_log}
        setDevice([searchedDevice]);
      } else {
        showMessage(`Device with serial number: ${selectedFpDevice.serial_number}, not found.`, true);
        dispatch(openCloseControllerModal(false));
      }
    }
  }, [selectedFpDevice, isModalOpen])

  const closeModal = () => {
    dispatch(openCloseControllerModal(false));
    dispatch(setUpdateFPDevice(null));
    setDevice(null);
  }

  return (
    device ? <Modal
      isOpen={isModalOpen}
      toggle={closeModal}
      centered
      autoFocus={false}
      scrollable={false}
      size="xl"
    >
      <ModalHeader className="controller-modal-header">
        Manage selected devices
        <button
          type="button"
          onClick={closeModal}
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </ModalHeader>
      <ModalBody>
        <MainControls
          controller={device[0]}
          updateControllerProviders={props.updateControllerProviders}
          multiple={false}
          allControllers={controllers}
          serial_number={device[0].serial_number}
          addNToast={props.addNToast}
          device_type={device[0].type}
          selected_controllers={device}
          buildings={buildings}
        />
      </ModalBody>
    </Modal> : null
  );
};


const mapStateToProps = state => {
  return state
}

export default withRouter(
  connect(mapStateToProps, {
    updateControllerProviders,
    addNToast
  })(ControllerModal)
)