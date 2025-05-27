import React from 'react';

const BoxButton = (props) => {
  return (
    <div style={{display: "flex", height: props.boxHeight * props.button.button_height,}}>
      <div className={"boxButton boxButton" + props.position} onClick={() => props.onClick(props.value)} 
        style={{ width: props.boxWidth*props.button.button_width , height: "auto", // Ajusta automáticamente la altura al contenido
        display: "inline-block", // Asegura que el tamaño se ajuste al contenido
        overflow: "hidden", 
        backgroundImage: props.button.button_image
        }}>
        <li>

          <p style={{color: props.button.color}}>{props.value}</p>
        </li>
      </div>
    </div>
  );
};

export default BoxButton;