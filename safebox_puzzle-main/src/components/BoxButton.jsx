import React from 'react';

const BoxButton = (props) => {
  return (
    <div className={"boxButton boxButton" + props.position} onClick={() => props.onClick(props.value)} style={{ width: props.boxWidth * 0.04, height: "auto", // Ajusta automáticamente la altura al contenido
      display: "inline-block", // Asegura que el tamaño se ajuste al contenido
      overflow: "hidden", }}>
      <li>

        <p>{props.value}</p>
      </li>
    </div>
  );
};

export default BoxButton;