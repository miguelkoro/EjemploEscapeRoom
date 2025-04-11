import React, { useState, useEffect } from 'react';
import './../assets/scss/main.scss';

const MainScreen = (props) => {
  const [checking, setChecking] = useState(false);
  const [light, setLight] = useState("off");
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);

  //
  const [rotationAngle, setRotationAngle] = useState(0); // Estado para la rotación
  const [isMouseDown, setIsMouseDown] = useState(false); // Estado para saber si el mouse está presionado
  const [startAngle, setStartAngle] = useState(0); // Ángulo inicial del ratón
  const [initialRotation, setInitialRotation] = useState(0); // Ángulo inicial del lock

  const [isReseting, setIsReseting] = useState(false); // Estado para saber si se está reiniciando el lock
  const [tries, setTries] = useState(0); // Contador de intentos
  const [rotationDirection, setRotationDirection] = useState(""); // Dirección de rotación

  const [solutionArray, setSolutionArray] = useState([]); // Array para guardar la solución
  
  const TEST_LOCAL = true; // Cambiar a true para usar la solución local
  const SOLUTION_LOCAL = [25,-55,50, -15]; //La solucion que queremos, 25 derecha, 55 izq, 50 derecha
  const PASSWORD_API = 12345; //Contraseña de la sala del escape room 
  // //Tiene que ser de 5 digitos o cambiarlo en el archivo config


  const changeBoxLight = (success, solution) => {
    let audio;
    if (success) {
      audio = document.getElementById("audio_success");
      setLight("green");
    } else {
      audio = document.getElementById("audio_failure");
      setLight("red");
      reset();
    }
    setTimeout(() => {
      setLight("off");
      !TEST_LOCAL && afterChangeBoxLight(success, solution);
    }, 1000);
    audio.play();
  }

  useEffect(() => {
    let aspectRatio = 4 / 3;
    setBoxWidth(Math.min(props.appheight * aspectRatio, props.appwidth));
    setBoxHeight(boxWidth / aspectRatio);
    console.log("props.appwidth", props.appwidth, "props.appheight", props.appheight);
    console.log("Box size", Math.min(props.appheight * aspectRatio, props.appwidth), Math.min(props.appheight * aspectRatio, props.appwidth) / aspectRatio);
  }, [props.appwidth, props.appheight, props.show]);

  const afterChangeBoxLight = (success, solution) => {
    if (success) {
      return props.onTryBoxOpen(solution);
    }
    setChecking(false);
  };
  // ------------------
  const  reset = () =>{
    //console.log("Solution: ", solutionArray);
    setIsReseting(true);
    setRotationAngle(0);
    setSolutionArray([]);
    setRotationDirection("");
    setStartAngle(0);
    setTries(0);
    setTimeout(() => {      
      setIsReseting(false);
    }, 1000);
    setChecking(false);
  }

  const checkLocalSolution = () => {
    setChecking(true);
    if(solutionArray.every((value, index) => value === SOLUTION_LOCAL[index])){
      changeBoxLight(true, solutionArray);
    }else{
      changeBoxLight(false, solutionArray);
    }
  }

  const checkApiSolution = () => {
    setChecking(true);
    props.escapp.checkPuzzle(props.config.escapp.puzzleId, PASSWORD_API, {}, (success) => {
      changeBoxLight(success, PASSWORD_API);
    });
  }


  useEffect(() => { // Comprueba si se ha alcanzado el número máximo de intentos (En local y en API)    
    TEST_LOCAL ?  
      tries >= SOLUTION_LOCAL.length ? checkLocalSolution() : setTries((tries) => tries + 1):
      tries >= props.config.passwordLength ? checkApiSolution() : setTries((tries) => tries + 1);
  }, [solutionArray]);

  const handleMouseDown = (event) => {
    if (checking) return ;
    setIsMouseDown(true); // Indica que el mouse está presionado    
    let rounded = calculateAngle(event); // Calcula el ángulo inicial
    setStartAngle(rounded);     // Guarda el ángulo inicial y el ángulo actual del lock
    setInitialRotation(rotationAngle); // Guarda el ángulo actual del lock    
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
  
  const handleMouseUp = () => {
    if (checking) return ;
    setIsMouseDown(false); // Indica que el mouse ya no está presionado
    //reset(); // Reinicia la rotación //Poniendolo aqui, hace efecto de teelfono de dial
    //Para poder poner -55 si va contrarreloj o 30 si va a favor
    setSolutionArray((sol) => [...sol, (rotationDirection === "clockwise" ? rotationAngle/6 : -rotationAngle/6)]);
    setRotationDirection(''); //Reinicia la direccion de rotacion
  };

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

  const handleMouseMove = (event) => {
    if (!isMouseDown || checking) return ; // Solo ejecuta si el mouse está presionado    
    let audio  = document.getElementById("audio_wheel");
    let rounded = calculateAngle(event); // Calcula el ángulo 
   // Calcula la diferencia de ángulos de forma cíclica
    const angleDifference = normalizeAngleDifference(rounded - startAngle);
   // Calcula la rotación acumulada y normalízala
    const newRotation = normalizeAngle(initialRotation + angleDifference);
    const rotationDir = getRotationDirection(rotationAngle/6, newRotation/6);
    //Si se intenta girar en sentido contrario a la rotacion actual, no se hace nada
    if(rotationDirection === ''){
      setRotationDirection(rotationDir);
    }else if(rotationDirection !== rotationDir){
      return;}
    if(rotationAngle === newRotation)return; // No actualiza si el ángulo no ha cambiado
    setRotationAngle(newRotation);     // Actualiza el ángulo de rotación
    audio.play();
  };
  //  -----------------

  return (
      <div id="screen_main" className={"screen_wrapper" + (props.show ? "" : " screen_hidden") 
            }onMouseUp={handleMouseUp} 
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove} >
        {props.show ? (
          <div className='lockContainer' style={{ width: boxWidth , height: boxHeight ,  borderRadius: "50%", 
            width: Math.min(boxWidth, boxHeight) * 0.7, 
            height: Math.min(boxWidth, boxHeight) * 0.7, 
            alignItems: "center"}}
            onDragStart={(event) => event.preventDefault()
          }>
          
            <div id="lock" style={{ 
              width: Math.min(boxWidth, boxHeight) * 0.4, // Usa el menor valor para asegurar que sea cuadrado
              height: Math.min(boxWidth, boxHeight) * 0.4, // Usa el menor valor para asegurar que sea cuadrado
              marginLeft: boxWidth / 2 * 0.225,
              marginTop: boxHeight / 2 * 0.3,
              transform: `rotate(${rotationAngle}deg)`, // Rotación dinámica.
              pointerEvents: "none", // Permite que los eventos del mouse pasen a través del <p>
              transition: isReseting ? "transform 1s ease" : "none", // Transición suave solo durante el reset
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
              }}>{rotationAngle/6}</p> 
            {/*Audios*/}
            <audio id="audio_failure" src="sounds/access-denied.mp3" autostart="false" preload="auto" />
            <audio id="audio_success" src="sounds/correct.mp3" autostart="false" preload="auto" />
            <audio id="audio_wheel" src="sounds/spin.wav" autostart="false" preload="auto" />          
            {/** Luces de correcto o incorrecto*/}
            <div className="boxlight boxlight_off" style={{ display: light === "off" ? "block" : "none", left: props.appwidth / 2 + boxWidth / 2 * 0.3, top: props.appheight / 2 - boxHeight / 2 * 0.84 }} ></div> 
            <div className="boxlight boxlight_red" style={{ display: light === "red" ? "block" : "none", left: props.appwidth / 2 + boxWidth / 2 * 0.3, top: props.appheight / 2 - boxHeight / 2 * 0.84 }} ></div> 
            <div className="boxlight boxlight_green" style={{ display: light === "green" ? "block" : "none", left: props.appwidth / 2 + boxWidth / 2 * 0.3, top: props.appheight / 2 - boxHeight / 2 * 0.84 }} ></div> 
        </div>) : null}
    </div>);
};

export default MainScreen;
