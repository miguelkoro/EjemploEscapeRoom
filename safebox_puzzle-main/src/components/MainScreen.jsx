import React, { useState, useRef, useEffect } from 'react';
import './../assets/scss/main.scss';
import BoxButton from './BoxButton';
import VideoJS from './VideoJS'
import videojs from 'video.js';
//import videojs from 'video.js';
import "video.js/dist/video-js.css";
import "videojs-youtube";
import televisionImage from "../assets/images/Television.png";
import { use } from 'react';

const MainScreen = (props) => {
  const [checking, setChecking] = useState(false);
  const [light, setLight] = useState("off");
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);

  //
  const [isYoutube, setIsYoutube] = useState(false); // Estado para alternar entre MP4 y YouTube
  const playerRef = useRef(null); // Referencia al reproductor de Video.js (Removed duplicate declaration)



  //const [isReseting, setIsReseting] = useState(false); // Estado para saber si se está reiniciando el lock
  //const [tries, setTries] = useState(0); // Contador de intentos

  //const [solutionArray, setSolutionArray] = useState([]); // Array para guardar la solución
  const [solution, setSolution] = useState(""); // Variable para guardar la solución
  const [timer, setTimer] = useState(null); // Temporizador para los 5 segundos
  const [showCursor, setShowCursor] = useState(false); // Controla si se muestra el guion bajo
  //const [showSolution, setShowSolution] = useState(false); // Controla si se muestra el <p>
  
  const TEST_LOCAL = true; // Cambiar a true para usar la solución local
  //const SOLUTION_LOCAL = [25,-55,50, -15, 30]; //La solucion que queremos, 25 derecha, 55 izq, 50 derecha...
  const PASSWORD_API = 12345; //Contraseña de la sala del escape room 
  const MIN_LENGHT = 4; //Longitud minima de la contraseña
  // //Tiene que ser de 5 digitos o cambiarlo en el archivo config


  const changeBoxLight = (success, solution) => {
    let audio;
    if (success) {
      audio = document.getElementById("audio_success");
      setLight("green");
    } else {
      audio = document.getElementById("audio_failure");
      setLight("red");
      //reset();
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
  /*const  reset = () =>{
    //console.log("Solution: ", solutionArray);
    setIsReseting(true);

    //setTries(0);
    setTimeout(() => {      
      setIsReseting(false);
    }, 1000);
    setChecking(false);
  }*/

  const checkLocalSolution = () => {
    //setChecking(true);
    if(solution === PASSWORD_API){
      changeBoxLight(true, solution);
    }else{
      changeBoxLight(false, solution);
    }
  }

  /*const checkApiSolution = () => {
    setChecking(true);
    if(solutionArray.every((value, index) => value === SOLUTION_LOCAL[index])){ //Para saber si es igual (Esto se haria en la api)
     props.escapp.checkPuzzle(props.config.escapp.puzzleId, PASSWORD_API, {}, (success) => {
      changeBoxLight(success, PASSWORD_API);
      });
    }else{
      props.escapp.checkPuzzle(props.config.escapp.puzzleId, "", {}, (success) => {
        changeBoxLight(success, PASSWORD_API);
    });}
  } */


  /*useEffect(() => { // Comprueba si se ha alcanzado el número máximo de intentos (En local y en API)    
    TEST_LOCAL ?  
      tries >= PASSWORD_API.length ? checkLocalSolution() : setTries((tries) => tries + 1):
      tries >= props.config.passwordLength ? checkApiSolution() : setTries((tries) => tries + 1);
  }, [solutionArray]);*/


  //  -----------------
  // Actualiza la fuente del reproductor cuando cambia `isYoutube`
  useEffect(() => {
  // Actualiza las opciones del reproductor según el estado `isYoutube`
  const newOptions = isYoutube ? youtubeVideoOptions : mp4VideoOptions;
  setPlayerOptions(newOptions); // Guarda las opciones en el estado `playerOptions`

  if (playerRef.current) {
    try{
    playerRef.current.pause(); // Pausa el video actual
    playerRef.current.src(newOptions.sources); // Cambia la fuente del reproductor
    playerRef.current.load(); // Carga el nuevo video
    playerRef.current.play(); // Reproduce el nuevo video
    }catch(e){
      console.error("Error al cambiar la fuente del reproductor:", e);
    }
  }
  }, [isYoutube]);

 
  const onClickButton = (value) => {
    //console.log("Button clicked: ", value);
    if(checking) return; // Si ya se está comprobando, no hace nada
    setSolution(prev => prev + value); // Agrega el valor del botón a la solución
    const shortBeep = document.getElementById("audio_beep");
    shortBeep.pause();
    shortBeep.currentTime = 0;
    shortBeep.play();   

    // Activa el cursor y reinicia el temporizador de 5 segundos
    setShowCursor(true);
    //setShowSolution(true); // Muestra el <p> con la solución
    if (timer) {
      clearTimeout(timer); // Limpia el temporizador anterior
    }
    const newTimer = setTimeout(() => {
      //checkSolution(); // Comprueba la solución después de 5 segundos      
      handleTimerExpire(); // Maneja la expiración del temporizador
      //console.log("checking solution...", solution);
    }, 5000);
    setTimer(newTimer);
  
  }

  // Función para manejar la expiración del temporizador
  const handleTimerExpire = () => {
    setChecking(true); // Activa el estado de checking
    setShowCursor(false); // Desactiva el cursor
    //console.log("Checking solution...", solution);
    setTimeout(() => {
      //setShowSolution(false); // Oculta el <p> después de 3 segundos
      setSolution(""); // Reinicia la solución
      setChecking(false); // Reinicia el estado de checking //CAMBIARLO A CUANDO HAGA EL CHEQUEO CON LA API
      setLight("off");
      
    }, 3000); // Espera 3 segundos antes de ocultar el <p>
    
  };

  useEffect(() => {
    if (solution.length >= MIN_LENGHT) {
      console.log("Checking solution...", solution);
      Number(solution)===PASSWORD_API ? rightChannel() : wrongChannel(); 
    }else if(solution.length != 0 && solution.length < MIN_LENGHT){
      console.log("Solution too short", solution);
      wrongChannel();
    }
    
  }, [checking]); // Se ejecuta cada vez que cambia la solución*/


  const wrongChannel = () => {
    setPlayerOptions(mp4VideoOptions); // Guarda las opciones en el estado `playerOptions`  
    setLight("red");
    if (playerRef.current) {
      try{
      playerRef.current.pause(); // Pausa el video actual
      playerRef.current.src(mp4VideoOptions.sources); // Cambia la fuente del reproductor
      playerRef.current.load(); // Carga el nuevo video
      playerRef.current.play(); // Reproduce el nuevo video
      }catch(e){
        console.error("Error al cambiar la fuente del reproductor:", e);
      }
    }
  }

  const rightChannel = () => {
    setPlayerOptions(youtubeVideoOptions); // Guarda las opciones en el estado `playerOptions`
    setLight("green");
    if (playerRef.current) {
      try{
      playerRef.current.pause(); // Pausa el video actual
      playerRef.current.src(youtubeVideoOptions.sources); // Cambia la fuente del reproductor
      playerRef.current.load(); // Carga el nuevo video
      playerRef.current.play(); // Reproduce el nuevo video
      }catch(e){
        console.error("Error al cambiar la fuente del reproductor:", e);
      }
    }
  }

  // Opciones para el video MP4
  const mp4VideoOptions = {
    autoplay: true,
    controls: false,
    responsive: true,
    fluid: true,
    muted: false,
    loop: true,
    techOrder: ["html5", "youtube"],
    sources: [
      {
        src: "videos/OutputLoop.mov", // Reemplaza con la ruta de tu archivo MP4
        type: "video/mp4",
      },
    ],
    userActions: {
      click: false
    }
  };

  // Opciones para el video de YouTube
  const youtubeVideoOptions = {
    //autoplay: true,
    //controls: false,
    //responsive: true,
    //loop: true,
    //fluid: true,
    //techOrder: ["youtube"],
    sources: [
      {
        src: "https://youtu.be/dQw4w9WgXcQ?si=ReWN7oDLo1kUD1zR&t=42",//"https://www.youtube.com/watch?v=iYYRH4apXDo",
        type: "video/youtube",
      },
    ]    
  };

  const [playerOptions, setPlayerOptions] = useState(mp4VideoOptions); // Estado para las opciones del reproductor

  const handlePlayerReady = (player) => {
    playerRef.current = player;
  };

  // Función para reproducir el video
  /*const playVideo = () => {
    setIsYoutube((prev) => !prev);
  };*/

  // Función para subir el volumen
  const increaseVolume = () => {
    if (playerRef.current) {
      const currentVolume = playerRef.current.volume();
      if (currentVolume < 1) {
        playerRef.current.volume(Math.min(currentVolume + 0.1, 1)); // Incrementa el volumen en 0.1
      }
    }
  };

  // Función para bajar el volumen
  const decreaseVolume = () => {
    if (playerRef.current) {
      const currentVolume = playerRef.current.volume();
      if (currentVolume > 0) {
        playerRef.current.volume(Math.max(currentVolume - 0.1, 0)); // Reduce el volumen en 0.1
      }
    }
  };

  return (
      <div id="screen_main" className={"screen_wrapper" + (props.show ? "" : " screen_hidden") }>
        {props.show ? (         
         
          <div style={{width: boxWidth , height: boxHeight, position: "relative" }}>
           
            {/** Reproductor de video */}
            <div style={{width: boxWidth *0.77, position:"absolute",  marginLeft: "0.5%", marginTop: "18.6%"}}>
              <VideoJS  options={playerOptions}
                onReady={handlePlayerReady}/>
                
            </div>
            <img id="television" src={televisionImage} alt="Television" style={{width: boxWidth, height: boxHeight, position: "absolute", left: 0, top: 0}}/>
             {/** Luces de correcto o incorrecto*/}
            <div className="boxlight boxlight_off" style={{position: "absolute", display: light === "off" ? "block" : "none", marginLeft: "90%", marginTop: "17%" }} ></div> 
            <div className="boxlight boxlight_red" style={{position: "absolute", display: light === "red" ? "block" : "none", marginLeft: "90%", marginTop: "17%"  }} ></div> 
            <div className="boxlight boxlight_green" style={{position: "absolute", display: light === "green" ? "block" : "none", marginLeft: "90%", marginTop: "17%" }} ></div> 
            {/** CANAL */}
            {solution && (<p className={`channel ${showCursor ? "show-cursor" : ""}`}>{solution}</p>)}
            {/*<button  onClick={playVideo} style={{position: "absolute", top: "10px",left: "10px", zIndex: 10,padding: "10px 20px",
              backgroundColor: "#007BFF", color: "#fff", border: "none",borderRadius: "5px", cursor: "pointer", }}>
            {isYoutube ? "Reproducir MP4" : "Reproducir YouTube"}
          </button>*/}
            {/* Fila de botones */}
            <div id="row1" className="row" style={{ top: "42%"}}>
              <BoxButton value={"1"} position={1} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
              <BoxButton value={"2"} position={2} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
              <BoxButton value={"3"} position={3} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            </div>
            <div id="row2" className="row" style={{ top: "47%"}} >
              <BoxButton value={"4"} position={4} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
              <BoxButton value={"5"} position={5} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
              <BoxButton value={"6"} position={6} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            </div>
            <div id="row3" className="row" style={{ top: "52%" }}>
              <BoxButton value={"7"} position={7} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
              <BoxButton value={"8"} position={8} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
              <BoxButton value={"9"} position={9} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            </div>
            <div id="row4" className="row" style={{top: "57%"}}>
              <BoxButton value={"0"} position={11} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
            </div>
            <div id="row4" className="row" style={{top: "63%"}}>
              <BoxButton value={"-"} position={11} onClick={decreaseVolume} boxHeight={boxHeight} boxWidth={boxWidth} />
              <svg width="20%" height="20%" viewBox="0 -1 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"> <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g> <g id="SVGRepo_iconCarrier"> <title>multimedia / 4 - multimedia, audio, music, sound, max, speaker, volume icon</title> <g id="Free-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" > <g transform="translate(-968.000000, -304.000000)" id="Group" stroke="#000000" strokeWidth="2"> <g transform="translate(967.000000, 302.000000)" id="Shape"> <path d="M18.22291,4.24772391 C20.3461043,5.89188107 21.7500001,8.74918751 21.7500001,12 C21.7500001,15.2055503 20.384926,18.0284761 18.3111758,19.6828962"></path> <path d="M16.25,16.5 C17.434,15.6838509 18.25,13.984472 18.25,12.0055901 C18.25,10.0267081 17.434,8.32732919 16.25,7.5"></path> <path d="M4.254916,9 L6.24999966,9 L11.2499997,3 L13.2499997,3 L13.2499997,20.9958147 L11.2499997,20.9958147 L6.24999966,15 L4.254916,15 C3.1503465,15 2.254916,14.1045695 2.254916,13 L2.254916,11 C2.254916,9.8954305 3.1503465,9 4.254916,9 Z"></path></g> </g> </g></g></svg>
              <BoxButton value={"+"} position={11} onClick={increaseVolume} boxHeight={boxHeight} boxWidth={boxWidth} />
            </div>
            {/*Audios*/}
            <audio id="audio_failure" src="sounds/access-denied.mp3" autostart="false" preload="auto" />
            <audio id="audio_success" src="sounds/correct.mp3" autostart="false" preload="auto" />
            <audio id="audio_beep" src="sounds/beep-short.mp3" autostart="false" preload="auto" />       

            </div>
        ) : null
        }
    </div>);
};

export default MainScreen;
