import React from 'react';
import AppUtils from "../../../../common/AppUtils";
import {batch, useDispatch} from "react-redux";
import {
  openCloseEditWidgetModal,
  openCloseWidgetModal,
  setEditWidget
} from "../../../../store/customizableDashboard/actions";
import "./widgetCard.scss";

const WidgetCard = ({widget}) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    const newWidget = {
      x: 0, // X-coordinate of element
      y: 0, // Y-coordinate of element
      i: Math.floor((Math.random() * (100000 - 1000) + 1000) * -1), // Element key
      isResizable: true,
      component: widget.component,
      config: {
        data: widget.data,
        settings: widget.settings
      },
      type: widget.type
    };

    switch (widget.type) {
      case 'chart':
        newWidget.w = 5;
        newWidget.h = 7;
        break;
      case 'boolean':
        newWidget.w = 5;
        newWidget.h = 3;
        break;
      case 'image':
        newWidget.w = 5;
        newWidget.h = 5;
        break;
      case 'value':
        newWidget.w = 5;
        newWidget.h = 3;
        break;
      default:
        newWidget.w = 4;
        newWidget.h = 2;
    }

    batch(() => {
      dispatch(setEditWidget(newWidget));
      dispatch(openCloseWidgetModal(false));
      dispatch(openCloseEditWidgetModal(true));
    })
  }

  return (
    <div className="card widget-card" onClick={handleClick}>
      <div className={'widget-icon-container'}>
        <img className="widget-icon" src={widget?.icon} style={{filter: AppUtils.changeSVGColor("#79868A")}}/>
      </div>
      <div className="card-body widget-card-body">
        <h5>{widget?.title}</h5>
        <p className="card-text">
          {widget?.description}
        </p>
      </div>
    </div>
  )
};

export default WidgetCard;