let ls_supported = false;
let storageKey;

//La función init se encarga de inicializar el módulo de almacenamiento local.
// Recibe como parámetro la clave de almacenamiento local (lsStorageKey) y verifica si el almacenamiento local es compatible.
export function init(lsStorageKey){
  if(typeof storageKey !== "undefined"){
    return; //prevent multiple inits
  }
  storageKey = lsStorageKey;
  ls_supported = isSupported();
  return ls_supported;
}


//Verifica si el navegador soporta localStorage
// y si el localStorage está disponible
export function isSupported(){
  return (!!window.localStorage
    && typeof localStorage.getItem === 'function'
    && typeof localStorage.setItem === 'function'
    && typeof localStorage.removeItem === 'function');
}

/*La función getData se encarga de recuperar y deserializar los datos almacenados en localStorage bajo la clave definida por storageKey. 
Si no es posible acceder a los datos (por ejemplo, si localStorage no es compatible o los datos no existen), devuelve un objeto vacío.*/
function getData(){
  if(ls_supported === false){
    return {};
  }
  let storedData = localStorage.getItem(storageKey);
  if((typeof storedData === "undefined")||(storedData === null)){
    return {};
  }
  try {
    return JSON.parse(storedData);
  } catch (e){
    return {};
  }
}

function saveData(data){
  if(ls_supported === false){
    return undefined;
  }
  try {
    data = JSON.stringify(data);
    localStorage.setItem(storageKey,data);
  } catch (e){
    return undefined;
  }
  return data;
}

//La función getSetting se encarga de recuperar un valor específico del objeto de datos almacenado en localStorage.
export function getSetting(settingName){
  if(ls_supported === false){
    return undefined;
  }
  let data = getData();
  if(typeof data === "object"){
    return data[settingName];
  }
  return undefined;
}

//La función saveSetting se encarga de almacenar un valor específico en el objeto de datos almacenado en localStorage.
export function saveSetting(settingName,value){
  if(ls_supported === false){
    return undefined;
  }
  let data = getData();
  if(typeof data === "object"){
    data[settingName] = value;
    return saveData(data);
  }
  return undefined;
}

//La función removeSetting se encarga de eliminar un valor específico del objeto de datos almacenado en localStorage.
export function removeSetting(settingName){
  if(ls_supported === false){
    return undefined;
  }
  let data = getData();
  if(typeof data === "object"){
    delete data[settingName];
    return saveData(data);
  }
  return undefined;
}

//La función clear se encarga de eliminar todos los datos almacenados en localStorage bajo la clave definida por storageKey.
export function clear(){
  if(ls_supported === false){
    return undefined;
  }
  localStorage.removeItem(storageKey);
  return undefined;
}