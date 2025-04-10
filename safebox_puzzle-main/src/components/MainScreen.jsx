import React, { useState, useEffect } from 'react';
import BoxButton from './BoxButton.jsx';
import './../assets/scss/main.scss';

const MainScreen = (props) => {
  const [password, setPassword] = useState([]);
  const [processingClick, setProcessingClick] = useState(false);
  const [checking, setChecking] = useState(false);
  const [light, setLight] = useState("off");
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);

  //
  const [rotationAngle, setRotationAngle] = useState(0); // Estado para la rotación
  const [isRotating, setIsRotating] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [previousAngle, setPreviousAngle] = useState(0);

  const [roundedAngle, setRoundedAngle] = useState(0);


  const onClickButton = (value) => {
    console.log("onClickButton", value);
    if (processingClick || checking) {
      return;
    }
    setProcessingClick(true);

    if (password.length < props.config.passwordLength) {
      setPassword((prevPassword) => [...prevPassword, value]);
    }

    //const shortBeep = document.getElementById("audio_beep");

    setTimeout(() => {
      if (password.length + 1 === props.config.passwordLength) {
        setChecking(true);
        setProcessingClick(false);

        const solution = [...password, value].join("");
        setPassword([]);
        console.log("Checking solution", solution);
        //check solution here, to see if change box light to green or red
        props.escapp.checkPuzzle(props.config.escapp.puzzleId, solution, {}, (success) => {
          changeBoxLight(success, solution);
        });
      } else {
        setProcessingClick(false);
      }
    }, 300);

    //shortBeep.pause();
    //shortBeep.currentTime = 0;
    //shortBeep.play();
  }

  const changeBoxLight = (success, solution) => {
    let audio;

    if (success) {
      audio = document.getElementById("audio_success");
      setLight("green");
    } else {
      audio = document.getElementById("audio_failure");
      setLight("red");
    }

    setTimeout(() => {
      setLight("off");
      afterChangeBoxLight(success, solution);
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
  const rotateLock = () => {
    setRotationAngle((prevAngle) => prevAngle + 90); // Incrementa 90 grados
  };

  const handleMouseDown = () => {
    setIsMouseDown(true); // Indica que el mouse está presionado
    
    
  };
  
  const handleMouseUp = () => {
    setIsMouseDown(false); // Indica que el mouse ya no está presionado
  };

  const handleMouseMove = (event) => {
    if (!isMouseDown) return ; // Solo ejecuta si el mouse está presionado

    const lockElement = document.getElementById("lock");
    const rect = lockElement.getBoundingClientRect();
    let audio  = document.getElementById("audio_wheel");
  
    // Calcula el centro del div
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
  
    // Calcula el ángulo en radianes y lo convierte a grados
    /*const radians = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    //const angle = radians * (180 / Math.PI);
    let dX = event.clientX - centerX;
    let dY = event.clientY - centerY;
    let angle = Math.atan(- dX / dY) * 180 / Math.PI;*/

    const radians = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    let angle = radians * (180 / Math.PI);
    if (angle < 0) {
      angle += 360;
    }
  
    //setRotationAngle(angle); // Actualiza el ángulo de rotación
    //console.log("Rotation angle:", angle);
    // Calcula la diferencia entre el ángulo actual y el anterior
    /*const angleDifference = Math.abs(angle - previousAngle);

    // Solo actualiza el ángulo si la diferencia es mayor o igual a 6°
    if (angleDifference >= 6) {
      setRotationAngle(angle); // Actualiza el ángulo de rotación
      setPreviousAngle(angle); // Actualiza el ángulo anterior
      console.log("Rotation angle:", angle, " number: ", angle/6);
    }*/
   // Redondea el ángulo al múltiplo de 6 más cercano
  //const roundedAngle = Math.round(angle / 6) * 6;
  let rounded = Math.round(angle / 6) * 6;
  if (rounded >= 360) {
    setRoundedAngle (0);
  }else{
    setRoundedAngle(Math.round(angle / 6) * 6)
  }
 ;
  

  // Redondea el ángulo al múltiplo de 6 más cercano
  const roundedAngle = Math.round(angle / 6) * 6;

  // Actualiza el ángulo acumulado directamente
  setRotationAngle(roundedAngle);
  // Solo actualiza el ángulo si es diferente del ángulo anterior
  //if (roundedAngle !== previousAngle) {
    /*if(roundedAngle >= 359){
      setRoundedAngle(0); // Reinicia el ángulo a 0 si es 60
    }*/
    //setRotationAngle(roundedAngle); // Actualiza el ángulo de rotación
    //setPreviousAngle(roundedAngle); // Actualiza el ángulo anterior
    console.log("Rotation angle (rounded):", roundedAngle, " numero:", roundedAngle / 6);
    audio.play();
  //}
  };
  /*const handleMouseMove = (event) => {
   
    var face = document.getElementById("bigFace");
    var faceX = face.offsetLeft+ face.offsetWidth/2;
    var faceY = face.offsetTop + face.offsetHeight/2;
    var dX = faceX - event.clientX;
    var dY = faceY - event.clientY;
    var degree = Math.atan(- dX / dY) * 180 / Math.PI;
    if (dY > 0){degree += 180}

    face.style.transform = "rotate("+degree+"deg)" 
  
};*/
  //  -----------------

  return (<div id="screen_main" className={"screen_wrapper" + (props.show ? "" : " screen_hidden") 
       }onMouseUp={handleMouseUp}>
      {props.show ? (
        <div className='lockContainer' style={{ width: boxWidth , height: boxHeight ,  borderRadius: "50%", 
          //backgroundColor: "black",
          width: Math.min(boxWidth, boxHeight) * 0.7, 
          height: Math.min(boxWidth, boxHeight) * 0.7, 
          borderRadius: "50%", 
          //backgroundColor: "black", // Color de fondo
          alignItems: "center"}}
          onMouseDown={handleMouseDown} // Inicia la rotación
          onMouseUp={handleMouseUp} // Detiene la rotación
          //onMouseLeave={handleMouseUp} // Detiene la rotación si el mouse sale del div
          //onMouseMove={handleMouseMove} // Maneja el movimiento del ratón
          onMouseMove={handleMouseMove} // Maneja el movimiento del ratón
          //onMouseEnter={isMouseDown && handleMouseMove } // Inicia la rotación si el mouse entra en el div
          >
          
        <div id="lock" style={{ width: boxWidth * 0.4, height: boxHeight * 0.4, 
           marginLeft: boxWidth / 2 * 0.125,
           marginTop: boxHeight / 2 * 0.3,
          transform: `rotate(${rotationAngle}deg)`, // Rotación dinámica
          //transition: "transform 1s ease", // Animación suave
          } }>

          </div>
          <p style={{
            position: "absolute", // Posiciona el <p> absolutamente dentro del contenedor
            top: "50%", // Centra verticalmente
            left: "50%", // Centra horizontalmente
            transform: "translate(-50%, -50%)", // Ajusta el centrado
            margin: 0, // Elimina el margen del <p>
            pointerEvents: "none", // Permite que los eventos del mouse pasen a través del <p>
            fontSize: "1rem", // Ajusta el tamaño de la fuente
            color: "black", // Cambia el color del texto
            userSelect: "none", // Evita que el texto sea seleccionable
            fontWeight: "bold", // Aplica el estilo en negrita
            fontSize : "10vmin", // Cambia el tamaño de la fuente
          }}>{roundedAngle/6}</p> 
        
        <div id="container" style={{ width: boxWidth * 0.22, height: boxHeight * 0.4, marginLeft: boxWidth / 2 * 0.09 }}>
          {/*<audio id="audio_beep" src="sounds/beep-short.mp3" autostart="false" preload="auto" />*/}
          <audio id="audio_failure" src="sounds/access-denied.mp3" autostart="false" preload="auto" />
          <audio id="audio_success" src="sounds/correct.mp3" autostart="false" preload="auto" />
          <audio id="audio_wheel" src="sounds/spin.wav" autostart="false" preload="auto" />
          
          
          {/*<div id="row1" className="row">
            <BoxButton value={"1"} position={1} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            <BoxButton value={"2"} position={2} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            <BoxButton value={"3"} position={3} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          </div>
          <div id="row2" className="row">
            <BoxButton value={"4"} position={4} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            <BoxButton value={"5"} position={5} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            <BoxButton value={"6"} position={6} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          </div>
          <div id="row3" className="row">
            <BoxButton value={"7"} position={7} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            <BoxButton value={"8"} position={8} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            <BoxButton value={"9"} position={9} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          </div>
          <div id="row4" className="row">
            <BoxButton value={"*"} position={10} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            <BoxButton value={"0"} position={11} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            <BoxButton value={"#"} position={12} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          </div>*/}
          <div className="boxlight boxlight_off" style={{ display: light === "off" ? "block" : "none", left: props.appwidth / 2 + boxWidth / 2 * 0.3, top: props.appheight / 2 - boxHeight / 2 * 0.84 }} ></div> 
          <div className="boxlight boxlight_red" style={{ display: light === "red" ? "block" : "none", left: props.appwidth / 2 + boxWidth / 2 * 0.3, top: props.appheight / 2 - boxHeight / 2 * 0.84 }} ></div> 
          <div className="boxlight boxlight_green" style={{ display: light === "green" ? "block" : "none", left: props.appwidth / 2 + boxWidth / 2 * 0.3, top: props.appheight / 2 - boxHeight / 2 * 0.84 }} ></div> 
          </div>
          </div>) : null}
    </div>);
};

export default MainScreen;
