import './../assets/scss/main.scss';
import React, { useState, useEffect } from 'react';

const  SafeBoxDial = ( props ) => {
  const [initialRotation, setInitialRotation] = useState(0); // Ángulo inicial del lock
  const [isMouseDown, setIsMouseDown] = useState(false); // Estado para saber si el mouse está presionado
  const [startAngle, setStartAngle] = useState(0); // Ángulo inicial del ratón
  const [rotationDirection, setRotationDirection] = useState(""); // Dirección de rotación


  const handleMouseMove = (event) => {
      if (!isMouseDown || props.checking) return ; // Solo ejecuta si el mouse está presionado    
      let audio  = document.getElementById("audio_wheel");
      let rounded = calculateAngle(event); // Calcula el ángulo 
     // Calcula la diferencia de ángulos de forma cíclica
      const angleDifference = normalizeAngleDifference(rounded - startAngle);
     // Calcula la rotación acumulada y normalízala
      const newRotation = normalizeAngle(initialRotation + angleDifference);
      const rotationDir = getRotationDirection(props.rotationAngle/6, newRotation/6);
      //Si se intenta girar en sentido contrario a la rotacion actual, no se hace nada
      if(rotationDirection === ''){
        setRotationDirection(rotationDir);
      }else if(rotationDirection !== rotationDir){
        return;}
      if(rotationDirection === 'counter-clockwise'){return;}
      if(newRotation >353) return;
      console.log("rotation angle: " ,props.rotationAngle, ", new rotation ", newRotation, " abs: ",(props.rotationAngle-newRotation)/6);
      if(props.rotationAngle!==354 && Math.abs((props.rotationAngle-newRotation)/6) > 6) return; // No actualiza si el ángulo no ha cambiado
      if(props.rotationAngle === newRotation)return; // No actualiza si el ángulo no ha cambiado
      props.setRotationAngle(newRotation);     // Actualiza el ángulo de rotación
      audio.play();
  };

  const handleMouseUp = () => {
      if (props.checking) return ;
      setIsMouseDown(false); // Indica que el mouse ya no está presionado
      //reset(); // Reinicia la rotación //Poniendolo aqui, hace efecto de teelfono de dial
      //Para poder poner -55 si va contrarreloj o 30 si va a favor
      //props.setSolutionArray((sol) => [...sol, (rotationDirection === "clockwise" ? props.rotationAngle/6 : -props.rotationAngle/6)]);
      //setRotationDirection(''); //Reinicia la direccion de rotacion
      if(props.rotationAngle>0){
        props.setIsReseting(true);
        let audio  = document.getElementById("audio_return");
        audio.play();
        getNumber(props.rotationAngle)
      }
  };

  const getNumber = (angle) => {
    if(angle >0 && angle <= 60)console.log("nada");
    else if(angle > 60 && angle <= 96)console.log("1");
    else if(angle > 96 && angle <= 120)console.log("2");
    else if(angle > 120 && angle <= 156)console.log("3");
    else if(angle > 156 && angle <= 180)console.log("4");
    else if(angle > 180 && angle <= 210)console.log("5");
    else if(angle > 210 && angle <= 240)console.log("6");
    else if(angle > 240 && angle <= 270)console.log("7");
    else if(angle > 270 && angle <= 294)console.log("8");
    else if(angle > 294 && angle <= 326)console.log("9");
    else if(angle > 326)console.log("0");
    
  }

  const handleMouseDown = (event) => {
      if (props.checking) return ;
      setIsMouseDown(true); // Indica que el mouse está presionado    
      let rounded = calculateAngle(event); // Calcula el ángulo inicial
      setStartAngle(rounded);     // Guarda el ángulo inicial y el ángulo actual del lock
      setInitialRotation(props.rotationAngle); // Guarda el ángulo actual del lock    
    };

  const calculateAngle = (event) => {
      const lockElement = document.getElementById("lock");
      const rect = lockElement.getBoundingClientRect();  
      // Calcula el centro del div
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;  
      // Calcula el ángulo inicial en radianes y lo convierte a grados
      const radians = Math.atan2(event.clientY - centerY, event.clientX - centerX);
      let angle = radians * (180 / Math.PI);  
      // Normaliza el ángulo para que esté entre 0° y 360°
      if (angle < 0) {
        angle += 360;}
      return Math.round(angle / 6) * 6; 
    }

  function getRotationDirection(prev, curr) {
      const diff = (curr - prev + 60) % 60;
      if (diff === 0) return '';
      return diff < 30 ? 'clockwise' : 'counter-clockwise';
  }

  const normalizeAngleDifference = (angle) => {
      return ((angle + 180) % 360) - 180;
  };    
  const normalizeAngle = (angle) => {
      return ((angle % 360) + 360) % 360; // Asegura que el ángulo esté entre 0 y 360
  };

  const reset = () => {
      setStartAngle(0);
      props.setRotationAngle(0); // Reinicia el ángulo de rotación
      //setRotationDirection("");
      setTimeout(() => {      
        props.setIsReseting(false);
      }, 1300);
  }

  useEffect(() => {    
      if (props.isReseting) { 
          reset(); // Reinicia el lock
      }}, [props.isReseting]); // Se ejecuta cuando isReseting cambia

    return(
        <div className='lockContainer' style={{ width: props.boxWidth , height: props.boxHeight ,  
            width: Math.min(props.boxWidth, props.boxHeight) * 0.7, 
            height: Math.min(props.boxWidth, props.boxHeight) * 0.7, 
            alignItems: "center",
            position: "relative",}}
            onDragStart={(event) => event.preventDefault()
          } onMouseUp={handleMouseUp} 
          onMouseDown={handleMouseDown} 
          onMouseMove={handleMouseMove}>
          
            <div id="lock" style={{ 
              width: Math.min(props.boxWidth, props.boxHeight) * 0.5, // Usa el menor valor para asegurar que sea cuadrado
              height: Math.min(props.boxWidth, props.boxHeight) * 0.5, // Usa el menor valor para asegurar que sea cuadrado
              //marginLeft: props.boxWidth / 2 * 0.225,
              //marginBottom: props.boxHeight / 2 * 0.4,
              position: "absolute", // Posiciona el <div> absolutamente dentro del contenedor
              top: "12%", // Centra verticalmente
              left: "21%", // Centra horizontalmente
              //marginTop: props.boxHeight / 2 * 0.6,
              transform: `rotate(${props.rotationAngle}deg)`, // Rotación dinámica.
              pointerEvents: "none", // Permite que los eventos del mouse pasen a través del <p>
              transition: props.isReseting ? "transform 1.3s ease" : "none", // Transición suave solo durante el reset
            }}></div>
            <p id="rotationNum" className='rotationNum' onDragStart={(event) => event.preventDefault()} 
              style={{position: "absolute", // Posiciona el <p> absolutamente dentro del contenedor
                top: "50%", // Centra verticalmente
                left: "50%", // Centra horizontalmente
                transform: "translate(-50%, -50%)", // Ajusta el centrado
                margin: 0, // Elimina el margen del <p>
                pointerEvents: "none", // Permite que los eventos del mouse pasen a través del <p>
                color: "black", // Cambia el color del texto
                userSelect: "none", // Evita que el texto sea seleccionable
                fontStyle: "bold", // Aplica el estilo en negrita
                fontSize : "13vmin", // Cambia el tamaño de la fuente
              }}>{props.rotationAngle/2}</p>
               <div className="pivote" style={{
                width: Math.min(props.boxWidth, props.boxHeight) * 0.5, // Usa el menor valor para asegurar que sea cuadrado
                height: Math.min(props.boxWidth, props.boxHeight) * 0.5,
               }}></div>     
              <audio id="audio_wheel" src="sounds/Giro.wav" autostart="false" preload="auto" />
              <audio id="audio_return" src="sounds/retroceso.wav" autostart="false" preload="auto" />     
        </div>
    );
}

export default SafeBoxDial;