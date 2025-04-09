import React from 'react';

const BoxButton = (props) => {
  return (
    <div className={"boxButton boxButton" + props.position} onClick={() => props.onClick(props.value)} style={{ width: props.boxWidth * 0.06, height: props.boxHeight * 0.1 }}>
      <li>
        <p>{props.value}</p>
      </li>
    </div>
  );
};

export default BoxButton;