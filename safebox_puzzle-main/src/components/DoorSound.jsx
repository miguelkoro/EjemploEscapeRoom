import { useEffect } from "react";
import * as LocalStorage from '../vendors/Storage.js';


function DoorSound({ play }) {
    useEffect(() => {
      if (!LocalStorage.getSetting("played_door")) {
        const audio = document.getElementById("audio_door");
        if (audio) {
          try {
            audio.play();
          } catch (e) {
            console.error(e);
          }
          LocalStorage.saveSetting("played_door", true);
        }
      }
    }, []);
  
    return <audio id="audio_door" src="sounds/door.mp3" autostart="false" preload="auto" />;
  }
  
  export default DoorSound;
  