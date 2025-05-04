import React from 'react';

const BoxButton = (props) => {
  return (
    <div className={"boxButton boxButton"} onClick={() => props.onClick()} 
        style={{ width: props.boxWidth *0.12 , height: props.boxHeight *0.12,
        position: "absolute",
        left: props.appwidth / 2 + props.boxWidth / 2 *0.4,
        bottom: props.appheight / 2 - props.boxHeight / 2 *0.8,
        cursor: "pointer",
        }}>
      {/*<li>
        <p>{props.value}</p>
      </li>*/}
    </div>
  );
};

export default BoxButton;