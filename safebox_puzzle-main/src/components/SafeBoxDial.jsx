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
        if(props.rotationAngle === newRotation)return; // No actualiza si el ángulo no ha cambiado
        props.setRotationAngle(newRotation);     // Actualiza el ángulo de rotación
        audio.play();
    };

    const handleMouseUp = () => {
        if (props.checking) return ;
        setIsMouseDown(false); // Indica que el mouse ya no está presionado
        //reset(); // Reinicia la rotación //Poniendolo aqui, hace efecto de teelfono de dial
        //Para poder poner -55 si va contrarreloj o 30 si va a favor
        props.setSolutionArray((sol) => [...sol, (rotationDirection === "clockwise" ? props.rotationAngle/6 : -props.rotationAngle/6)]);
        setRotationDirection(''); //Reinicia la direccion de rotacion
    };

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
        setRotationDirection("");
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
              width: Math.min(props.boxWidth, props.boxHeight) * 0.4, // Usa el menor valor para asegurar que sea cuadrado
              height: Math.min(props.boxWidth, props.boxHeight) * 0.4, // Usa el menor valor para asegurar que sea cuadrado
              marginLeft: props.boxWidth / 2 * 0.225,
              position: "relative", // Posiciona el <div> absolutamente dentro del contenedor
              top: "21%", // Centra verticalmente
              //marginTop: props.boxHeight / 2 * 0.6,
              transform: `rotate(${props.rotationAngle}deg)`, // Rotación dinámica.
              pointerEvents: "none", // Permite que los eventos del mouse pasen a través del <p>
              transition: props.isReseting ? "transform 1s ease" : "none", // Transición suave solo durante el reset
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
              }}>{props.rotationAngle/6}</p>      
              <audio id="audio_wheel" src="sounds/spin.wav" autostart="false" preload="auto" />    
        </div>
    );
}

export default SafeBoxDial;