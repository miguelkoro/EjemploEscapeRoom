import React, { useState, useEffect } from 'react';
import './../assets/scss/main.scss';
import Dial from './Dial';
import Ray from './Ray';

const MainScreen = (props) => {
  const [checking, setChecking] = useState(false);
  const [light, setLight] = useState("off");
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);

  //
  const [rotationAngle, setRotationAngle] = useState(0); // Estado para la rotación



  const [isReseting, setIsReseting] = useState(false); // Estado para saber si se está reiniciando el lock
  const [tries, setTries] = useState(0); // Contador de intentos

  const [frequency, setFrequency] = useState(0);
  const [wavelength, setWavelength] = useState(0);
  const [amplitude, setAmplitude] = useState(0);
 

  const mapRange = (value, min1, max1, min2, max2) => {
    return min2 + ((value - min1) * (max2 - min2)) / (max1 - min1);
  };
  // 0 a 120 son los valoreas que devuelven los diales, el resto son los rangos de valores que estoy dispuesto a poner
  const frequencyMapped = mapRange(frequency/3, 0, 120, 0.4, 1); // Frecuencia entre 0.6 y 4.2
  const wavelengthMapped = mapRange(wavelength/3, 0, 120, 10, 100); // Wavelength entre 10 y 100
  const amplitudeMapped = mapRange(amplitude/3, 0, 120, 25, 100); // Amplitud entre 25 y 250


  const [solutionArray, setSolutionArray] = useState([]); // Array para guardar la solución
  
  const TEST_LOCAL = true; // Cambiar a true para usar la solución local
  const SOLUTION_LOCAL = [25,-55,50, -15, 30]; //La solucion que queremos, 25 derecha, 55 izq, 50 derecha...
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
    setRotationAngle(0); // Reinicia el ángulo de rotación
    setSolutionArray([]);
    setTries(0);
    setTimeout(() => {      
      setIsReseting(false);
    }, 2500);
    setChecking(false);
  }

  const checkLocalSolution = () => {
    setChecking(true);
    if(solutionArray.every((value, index) => value === SOLUTION_LOCAL[index])){
      console.log("Correct solution: ", solutionArray);
      changeBoxLight(true, solutionArray);
    }else{
      changeBoxLight(false, solutionArray);
    }
  }

  const checkApiSolution = () => {
    setChecking(true);
    if(solutionArray.every((value, index) => value === SOLUTION_LOCAL[index])){ //Para saber si es igual (Esto se haria en la api)
     props.escapp.checkPuzzle(props.config.escapp.puzzleId, PASSWORD_API, {}, (success) => {
      changeBoxLight(success, PASSWORD_API);
      });
    }else{
      props.escapp.checkPuzzle(props.config.escapp.puzzleId, "", {}, (success) => {
        changeBoxLight(success, PASSWORD_API);
    });}
  } 


  useEffect(() => { // Comprueba si se ha alcanzado el número máximo de intentos (En local y en API)    
    /*TEST_LOCAL ?  
      tries >= SOLUTION_LOCAL.length ? checkLocalSolution() : setTries((tries) => tries + 1):
      tries >= props.config.passwordLength ? checkApiSolution() : setTries((tries) => tries + 1);
      console.log("Tries: ", tries, "Solution: ", solutionArray);*/
  }, [solutionArray]);


  return (
      <div id="screen_main" className={"screen_wrapper" + (props.show ? "" : " screen_hidden")}>
        {props.show ? (
          <div>
            <Dial id={"dial-frequency"} boxWidth={boxWidth} boxHeight={boxHeight} checking={checking} 
              rotationAngle={frequency} setRotationAngle={setFrequency}
              setSolutionArray={setSolutionArray} isReseting={isReseting}
              xPosition={"57%"}/>
            <Dial id={"dial-wavelength"}  boxWidth={boxWidth} boxHeight={boxHeight} checking={checking} 
              rotationAngle={wavelength} setRotationAngle={setWavelength}
              setSolutionArray={setSolutionArray} isReseting={isReseting}
              xPosition={"48%"}/>
            <Dial id={"dial-amplitude"}  boxWidth={boxWidth} boxHeight={boxHeight} checking={checking} 
              rotationAngle={amplitude} setRotationAngle={setAmplitude}
              setSolutionArray={setSolutionArray} isReseting={isReseting}
              xPosition={"39%"}/>
            <Ray  boxHeight={boxHeight} boxWidth={boxWidth} checking={checking} frequency={frequencyMapped} amplitude={amplitudeMapped} wavelength={wavelengthMapped}/>
            {/*Audios*/}
            <audio id="audio_failure" src="sounds/access-denied.mp3" autostart="false" preload="auto" />
            <audio id="audio_success" src="sounds/correct.mp3" autostart="false" preload="auto" />
                   
            {/** Luces de correcto o incorrecto*/}
            <div className="boxlight boxlight_off" style={{ display: light === "off" ? "block" : "none", left: props.appwidth / 2 + boxWidth / 2 * 0.3, top: props.appheight / 2 - boxHeight / 2 * 0.84 }} ></div> 
            <div className="boxlight boxlight_red" style={{ display: light === "red" ? "block" : "none", left: props.appwidth / 2 + boxWidth / 2 * 0.3, top: props.appheight / 2 - boxHeight / 2 * 0.84 }} ></div> 
            <div className="boxlight boxlight_green" style={{ display: light === "green" ? "block" : "none", left: props.appwidth / 2 + boxWidth / 2 * 0.3, top: props.appheight / 2 - boxHeight / 2 * 0.84 }} ></div> 
        </div>) : null}
    </div>);
};

export default MainScreen;
