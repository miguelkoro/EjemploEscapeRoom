import './../assets/scss/main.scss';
import React, { useState, useEffect } from 'react';

const  Dial = ( props ) => {
    const [initialRotation, setInitialRotation] = useState(0); // Ángulo inicial del lock
    const [isMouseDown, setIsMouseDown] = useState(false); // Estado para saber si el mouse está presionado
    const [startAngle, setStartAngle] = useState(0); // Ángulo inicial del ratón
    const [rotationDirection, setRotationDirection] = useState(false); // Dirección de rotación (horario o antihorario)

    const handleMouseMove = (event) => {
        if (!isMouseDown || props.checking || props.isReseting) return ; // Solo ejecuta si el mouse está presionado    
        let audio  = document.getElementById("audio_wheel");
        let rounded = calculateAngle(event); // Calcula el ángulo 
       // Calcula la diferencia de ángulos de forma cíclica
        const angleDifference = normalizeAngleDifference(rounded - startAngle);
       // Calcula la rotación acumulada y normalízala
        const newRotation = normalizeAngle(initialRotation + angleDifference);
        const rotationDir = getRotationDirection(props.rotationAngle/6, newRotation/6);
        //Si se intenta girar en sentido contrario a la rotacion actual, no se hace nada
        /*if(rotationDirection === ''){
        setRotationDirection(rotationDir);
        }else if(rotationDirection !== rotationDir){
          return;}*/
        //if(props.rotationAngle === newRotation)return; // No actualiza si el ángulo no ha cambiado

       //console.log(getRotationDirection(props.rotationAngle/6, newRotation/6));

        if(props.rotationAngle === newRotation) return; // No actualiza si el ángulo no ha cambiado
        if(props.rotationAngle/3===119 && rotationDir) return; // Si el nuevo ángulo es menor a -55 y la dirección es antihoraria, no hace nada
        console.log(newRotation/3, rotationDir);
        if(props.rotationAngle/3===0 && !rotationDir) return;

        props.setRotationAngle(newRotation);     // Actualiza el ángulo de rotación
        audio.play();
    };

    const handleMouseUp = () => {
        if (props.checking || props.isReseting) return ;
        setIsMouseDown(false); // Indica que el mouse ya no está presionado
        //reset(); // Reinicia la rotación //Poniendolo aqui, hace efecto de teelfono de dial
        //Para poder poner -55 si va contrarreloj o 30 si va a favor
       // props.setSolutionArray((sol) => [...sol,props.rotationAngle/3]);
        //setRotationDirection(''); //Reinicia la direccion de rotacion
    };

    const handleMouseDown = (event) => {
        if (props.checking || props.isReseting) return ;
        setIsMouseDown(true); // Indica que el mouse está presionado    
        let rounded = calculateAngle(event); // Calcula el ángulo inicial
        setStartAngle(rounded);     // Guarda el ángulo inicial y el ángulo actual del lock
        setInitialRotation(props.rotationAngle); // Guarda el ángulo actual del lock    
        //console.log(props.xPosition);
      };

    const calculateAngle = (event) => {
        const lockElement = document.getElementById(props.id); // Obtiene el elemento del lock
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
        return Math.round(angle / 3) * 3; 
      }

    function getRotationDirection(prev, curr) {
        const diff = (curr - prev + 60) % 60;
        if (diff === 0) return '';
        return diff < 30 ;
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
        <div className='lockContainer' style={{  
            width: Math.min(props.boxWidth, props.boxHeight) * 0.24, 
            height: Math.min(props.boxWidth, props.boxHeight) * 0.24,
            //right: props.boxWidth / 2 * 0.2,
            //transform: "translate(-50%, -50%)",
            //top: props.boxHeight * 0.33,
            //left: props.appwidth / 2 + props.boxWidth / 2 * 0.1,
            right: props.xPosition,
            top: "71%",
            
            cursor: "pointer",
            position: "absolute",}}
            onDragStart={(event) => event.preventDefault()} 
            onMouseUp={handleMouseUp} 
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsMouseDown(false)} >
          
            <div className="dial" id={props.id} style={{ 
              width: "100%", // Usa el menor valor para asegurar que sea cuadrado
              height: "100%", // Usa el menor valor para asegurar que sea cuadrado
              //marginLeft: props.boxWidth / 2 * 0.225,
              
              transform: `rotate(${props.rotationAngle}deg)`, // Rotación dinámica.
              transition: props.isReseting ? "transform 2.5s ease" : "none", // Transición suave solo durante el reset
            }}>
              <p id="rotationNum" className='rotationNum' onDragStart={(event) => event.preventDefault()} 
              >{props.name}</p>
            </div>
            {/*<p id="rotationNum" className='rotationNum' onDragStart={(event) => event.preventDefault()} 
              >{Math.round(props.rotationAngle/3)}</p>      */}
              <audio id="audio_wheel" src="sounds/spin.wav" autostart="false" preload="auto" />    
        </div>
    );
}

export default Dial;