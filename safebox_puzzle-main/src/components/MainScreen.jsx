import React, { useState, useEffect } from 'react';
import './../assets/scss/main.scss';
import SafeBoxDial from './SafeBoxDial';

const MainScreen = (props) => {
  const [checking, setChecking] = useState(false);
  const [light, setLight] = useState("off");
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);

  //
  const [rotationAngle, setRotationAngle] = useState(0); // Estado para la rotación

  const [password, setPassword] = useState(""); // Contraseña introducida por el usuario



  
  const TEST_LOCAL = true; // Cambiar a true para usar la solución local
  //const SOLUTION_LOCAL = [25, -55, 50, -15, 30]; //La solucion que queremos, 25 derecha, 55 izq, 50 derecha...
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
      TEST_LOCAL && setChecking(false);
    }, 3000);
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
    setPassword("");
  }

  const checkLocalSolution = () => {
    setChecking(true);
    if(Number(password) === PASSWORD_API){
      console.log("Correct solution: ", password);
      changeBoxLight(true, password);
    }else{
      changeBoxLight(false, password);
    }
  }

  const checkApiSolution = () => {
    /*setChecking(true);
    if(solutionArray.every((value, index) => value === SOLUTION_LOCAL[index])){ //Para saber si es igual (Esto se haria en la api)
     props.escapp.checkPuzzle(props.config.escapp.puzzleId, PASSWORD_API, {}, (success) => {
      changeBoxLight(success, PASSWORD_API);
      });
    }else{
      props.escapp.checkPuzzle(props.config.escapp.puzzleId, "", {}, (success) => {
        changeBoxLight(success, PASSWORD_API);
    });}*/
  } 


  /*useEffect(() => { // Comprueba si se ha alcanzado el número máximo de intentos (En local y en API)    
    TEST_LOCAL ?  
      tries >= SOLUTION_LOCAL.length ? checkLocalSolution() : setTries((tries) => tries + 1):
      tries >= props.config.passwordLength ? checkApiSolution() : setTries((tries) => tries + 1);
      console.log("Tries: ", tries, "Solution: ", solutionArray);
  }, [solutionArray]);*/

  useEffect(() => {
    console.log("Password: ", password);
    TEST_LOCAL ?
      password.length >= String(PASSWORD_API).length && checkLocalSolution() :
      password.length >= props.config.passwordLength && checkApiSolution();
  }, [password]);


  return (
      <div id="screen_main" className={"screen_wrapper" + (props.show ? "" : " screen_hidden")}>
        {props.show ? (
          <div>
            <SafeBoxDial
              boxWidth={boxWidth} boxHeight={boxHeight} checking={checking} 
              rotationAngle={rotationAngle} setRotationAngle={setRotationAngle}
              setPassword={setPassword}/>
            {/*Audios*/}
            <audio id="audio_failure" src="sounds/fail_call.wav" autostart="false" preload="auto" />
            <audio id="audio_success" src="sounds/correct.mp3" autostart="false" preload="auto" />
                   
            {/** Luces de correcto o incorrecto*/}
            <div className="boxlight boxlight_off" style={{ display: light === "off" ? "block" : "none", position:"absolute", top:"25%",  left:"41%"}} ></div> 
            <div className="boxlight boxlight_red" style={{ display: light === "red" ? "block" : "none", position:"absolute", top:"25%",  left:"41%"}} ></div> 
            <div className="boxlight boxlight_green" style={{ display: light === "green" ? "block" : "none", position:"absolute", top:"25%", left:"41%"}} ></div> 
        </div>) : null}
    </div>);
};

export default MainScreen;
