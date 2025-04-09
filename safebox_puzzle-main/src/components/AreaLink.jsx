import React from 'react';
import './../assets/scss/areaLink.scss';
import './../assets/scss/tooltips.scss';
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const AreaLink = ({ className, onClick, tooltip }) => {
  const content = <div className={`areaLink ${className || ""}`} onClick={onClick} />;
  const tooltipElement = tooltip ? <Tooltip id="button-tooltip">{tooltip}</Tooltip> : null;

  return (
    tooltipElement ? (
      <OverlayTrigger placement="top" overlay={tooltipElement}>
        {content}
      </OverlayTrigger>
    ) : (
      content
    )
  );
};

export default AreaLink;