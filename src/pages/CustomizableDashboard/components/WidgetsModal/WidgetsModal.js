import React from 'react';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import {openCloseWidgetModal} from "../../../../store/customizableDashboard/actions";
import WidgetCard from "../WidgetCard/WidgetCard";
import {Widgets} from "../../DashboardWidgets";

const WidgetsModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((store) => store.customizableDashboard.isWidgetsModalOpen);

  const closeModal = () => {
    dispatch(openCloseWidgetModal(false));
  }

  return (
    <Modal
      isOpen={isModalOpen}
      toggle={closeModal}
      centered
      autoFocus={false}
      scrollable={false}
      size="lg"
    >
      <ModalHeader className="widgets-modal-header">
        Widgets
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
      <ModalBody style={{display: "flex", gap: 30, padding: "2rem", flexFlow: 'wrap', height: 'auto'}}>
        {Widgets.map(widget => {
          return widget ?
            <WidgetCard key={`${widget.type}-widget`} widget={widget}/> : null
        })}
      </ModalBody>
    </Modal>
  );
};

export default WidgetsModal;