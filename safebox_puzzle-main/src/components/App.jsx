import React from 'react';
import {useState, useEffect, useRef} from 'react';
import './../assets/scss/app.scss';
import './../assets/scss/modal.scss';

import {GLOBAL_CONFIG} from '../config/config.js';
import * as I18n from '../vendors/I18n.js';
import * as LocalStorage from '../vendors/Storage.js';

import MainScreen from './MainScreen.jsx';
import PaintingScreen from './PaintingScreen.jsx';
import SafeClosedScreen from './SafeClosedScreen.jsx';
import SafeOpenScreen from './SafeOpenScreen.jsx';
let escapp;

import { PAINTING_SCREEN, SAFE_CLOSED_SCREEN, KEYPAD_SCREEN, SAFE_OPEN_SCREEN } from '../constants/constants.jsx';


export default function App() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState(PAINTING_SCREEN);
  const [prevScreen, setPrevScreen] = useState(PAINTING_SCREEN);
  const [solution, setSolution] = useState("");
  const divparent = useRef(null);
  const [appwidth, setAppwidth] = useState(0)
  const [appheight, setAppheight] = useState(0)
  

  useEffect(() => {
    console.log("useEffect, lets load everything");
    //localStorage.clear();  //For development, clear local storage (comentar y descomentar para desarrollo)
    I18n.init(GLOBAL_CONFIG);
    LocalStorage.init(GLOBAL_CONFIG.localStorageKey);
    GLOBAL_CONFIG.escapp.onNewErStateCallback = (er_state) => {
      console.log("New ER state received from ESCAPP", er_state);
      restoreState(er_state);
    }
    GLOBAL_CONFIG.escapp.onErRestartCallback = (er_state) => {
      // reset(); //For development
      console.log("Escape Room Restart received from ESCAPP", er_state);
      LocalStorage.removeSetting("app_state");
      LocalStorage.removeSetting("played_door");
    };
    escapp = new ESCAPP(GLOBAL_CONFIG.escapp);
    escapp.validate((success, er_state) => {
      console.log("ESCAPP validation", success, er_state);
      try { 
        if(success){
          //ha ido bien, restauramos el estado recibido
          restoreState(er_state);
        }
      } catch(e){
        console.error(e);
      }
    });
    window.addEventListener('resize', handleResize);
    handleResize();
    setLoading(false);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);  


  useEffect(() => {
    console.log("useEffect, screen changed");
    if (prevScreen === KEYPAD_SCREEN && screen === SAFE_CLOSED_SCREEN) {
      setTimeout(() => onOpenScreen(SAFE_OPEN_SCREEN), 2000);
    }
    if (prevScreen !== screen) {
      handleResize();
    }
  }, [screen]);


  function solvePuzzle(){
    //XXX DUDA: a este método solo se le llama cuando sale el boton continue, que es cuando se han resuelto todos los puzzles
    console.log("Solving puzzle", solution);

    //XXX DUDA: en el de MalditaER se guarda en localstorage con la clave "safebox_password", quizá sirva por si se vuelve a recargar o se vuelve a la app, que el estado se pierde.
    //lo mejor seria guardar en localstorage todo el estado de la app cuando algo cambia y asi al volver a cargar la app se restaura el estado en el useEffect

    escapp.submitPuzzle(GLOBAL_CONFIG.escapp.puzzleId, solution, {}, (success) => {
      if(!success){
        onOpenScreen(KEYPAD_SCREEN);
      }
    });
  }

  function reset(){
    escapp.reset();
    localStorage.clear();
  }

  function restoreState(er_state){
    console.log("Restoring state", er_state);
    if((typeof er_state !== "undefined") && (er_state.puzzlesSolved.length > 0)){
      let lastPuzzleSolved = Math.max.apply(null, er_state.puzzlesSolved);      
      if (lastPuzzleSolved >= GLOBAL_CONFIG.escapp.puzzleId) {
        //puzzle superado, abrimos la caja fuerte        
        setScreen(SAFE_OPEN_SCREEN);
        setPrevScreen(PAINTING_SCREEN);        
      } else {
        //puzzle no superado, miramos en localStorage en qué pantalla estábamos
        let localstateToRestore = LocalStorage.getSetting("app_state");
        console.log("Restoring screen from local state", localstateToRestore);
        if(localstateToRestore){      
          setScreen(localstateToRestore.screen);
          setPrevScreen(localstateToRestore.prevScreen);
        }
      }
      setLoading(false);
    } else {
      restoreLocalState();
    }
  }

  function saveState(){
    console.log("Saving state to local storage");
    let currentState = {screen: screen, prevScreen: prevScreen};
    LocalStorage.saveSetting("app_state", currentState);
  }

  function restoreLocalState(){
    let stateToRestore = LocalStorage.getSetting("app_state");
    console.log("Restoring local state", stateToRestore);
    if(stateToRestore){      
      setScreen(stateToRestore.screen);
      setPrevScreen(stateToRestore.prevScreen);
      setLoading(false);
    }
  }

  function onTryBoxOpen(sol){
    console.log("onTryBoxopen with solution:", sol);
    if(typeof solution !== "string"){
      return;
    }
    setSolution(sol);
    //escapp.checkPuzzle(GLOBAL_CONFIG.escapp.puzzleId, sol, {}, (success, er_state) => {
    //  if(success){
        onOpenScreen(SAFE_OPEN_SCREEN);    
    //  }
     //return success;
    //});
    return true;
    //Somentar escapp.checkPuzzle y el if para abrir la caja?
  }


  function onOpenScreen(newscreen_name){
    console.log("Opening screen", newscreen_name);
    setPrevScreen(screen);
    setScreen(newscreen_name);
    saveState();
  }

  function handleResize(){
    let divparentwidth = divparent.current ? divparent.current.offsetWidth:0;
    let divparentheight = divparent.current ? divparent.current.offsetHeight:0;
    console.log("Div parent size", divparentwidth, divparentheight);

    setAppwidth(divparentwidth);
    setAppheight(divparentheight);
  }

  
  if(loading){
      return "Loading...";
  }
  /*
  //COMENTADO PORQUE NO SE USA EN EL EJEMPLO, serviría para saber si se han superado todos los puzzles 
  // y entonces se muestra un mensaje u otro en la pantalla final
  //
  let puzzlesSolved = [];
  let solvedAllPuzzles = false;
  if(!escapp){
    //si no esta definido escapp, es que estamos loading
    setLoading(true);
  } else {
    let newestState = escapp.getNewestState();
    puzzlesSolved = (newestState && newestState.puzzlesSolved) ? newestState.puzzlesSolved : [];
    //en este ejemplo se han superado todos los puzzles si se han superado 3 que es el total de la ER
    solvedAllPuzzles = newestState.puzzlesSolved.length >= 3;
  }
  */
  let solvedAllPuzzles = true;
  return (<div id="firstnode" ref={divparent}>
    <PaintingScreen show={screen === PAINTING_SCREEN } I18n={I18n} onOpenScreen={onOpenScreen} />
    <SafeClosedScreen show={screen === SAFE_CLOSED_SCREEN } I18n={I18n} onOpenScreen={onOpenScreen} />
    <MainScreen show={screen === KEYPAD_SCREEN} escapp={escapp} config={GLOBAL_CONFIG} I18n={I18n} onTryBoxOpen={onTryBoxOpen} appheight={appheight} appwidth={appwidth} />
    <SafeOpenScreen show={screen === SAFE_OPEN_SCREEN} I18n={I18n} solvedAllPuzzles={solvedAllPuzzles} solvePuzzle={solvePuzzle}/>
  </div>);
}
