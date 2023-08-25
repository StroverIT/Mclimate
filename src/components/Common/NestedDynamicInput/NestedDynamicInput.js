import * as React from 'react';
import { useLayoutEffect } from "react";
import { Accordion } from "react-bootstrap";
import './nestedDynamicInput.scss'

const NestedDynamicInput = ({ jsonData, expandable = true }) => {
  useLayoutEffect(() => {
    const inner = document.getElementsByClassName('inner-accordion');
    if (inner.length > 0) {
      document.getElementById("wrapper-accordion").className = "wrapper-accordion";
    }
  })


  const renderAccordionItem = (element, index) => {
    const renderAccordionBody = () => {
      if (Array.isArray(element.content)) {
        return <Accordion alwaysOpen className={`inner-accordion`}>
          {element.content.map((contentElement) => renderAccordionItem(contentElement, contentElement.id))}
        </Accordion>
      } else {
        return element.content;
      }
    }

    const renderAccordionEl = () => {
      return <Accordion.Item key={`${element.title}-${element.id}`} eventKey={String(index)}>
        {element.floatIcon}
        <Accordion.Header>{element.icon}{element.title}</Accordion.Header>
        <Accordion.Body>
          {element.devices}
          {renderAccordionBody()}
        </Accordion.Body>
      </Accordion.Item>
    }

    if (expandable) {
      { return renderAccordionEl() }
    } else {
      if (element.content?.length > 0) {
        { return renderAccordionEl() }
      } else {
        return <div className={'accordion-item'} key={`${element.title}-${element.id}`}>
          <span className='accordion-button no-arrow'>{element.icon}{element.title} </span>
        </div>
      }
    }
  }

  const renderContent = () => {
    return <Accordion alwaysOpen className={''} id={'wrapper-accordion'}>
      {jsonData?.map((element) => renderAccordionItem(element, element.id))}
    </Accordion>
  }

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default NestedDynamicInput