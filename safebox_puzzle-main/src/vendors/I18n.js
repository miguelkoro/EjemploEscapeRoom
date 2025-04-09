import * as Utils from './Utils.js';
import {LOCALES} from '../config/locales.js';

let APP_LOCALES;
let availableLocales;
let defaultLocale;
let locale;

export function init(GLOBAL_CONFIG){
  if(typeof APP_LOCALES !== "undefined"){
    //Already initialized
    return;
  }

  //Set hardcoded locales and merge with config locales
  APP_LOCALES = LOCALES;
  if(typeof GLOBAL_CONFIG.locales !== "undefined"){
    APP_LOCALES = Utils.deepMerge(APP_LOCALES, GLOBAL_CONFIG.locales);
  }

  // Set available locales
  if((typeof GLOBAL_CONFIG.availableLocales !== "undefined") && (GLOBAL_CONFIG.availableLocales instanceof Array) && (GLOBAL_CONFIG.availableLocales.length > 0)){
    availableLocales = GLOBAL_CONFIG.availableLocales;
  } else {
    availableLocales = ["en"];
  }

  // Set default locale
  if(isValidLocale(GLOBAL_CONFIG.defaultLocale)){
    defaultLocale = GLOBAL_CONFIG.defaultLocale;
  } else {
    defaultLocale = GLOBAL_CONFIG.availableLocales[0];
  }

  //Set locale (1. Force by config, 2. URL, 3. Web browser)
  if(isValidLocale(GLOBAL_CONFIG.locale)){
    locale = GLOBAL_CONFIG.locale;
  } else {
    let uL = getUserLocale();
    if(isValidLocale(uL)){
      locale = uL;
    } else {
      locale = defaultLocale;
    }
  }
};

export function getLocale(){
  return locale;
};

function getUserLocale(){
  // Locale in URL
  let urlParams = readURLparams();
  if(isValidLocale(urlParams.locale)){
    return urlParams.locale;
  }
  // Browser language
  let browserLang = (navigator.language || navigator.userLanguage);
  if((typeof browserLang === "string")&&(browserLang.indexOf("-") !== -1)){
    browserLang = browserLang.split("-")[0];
  }
  if(isValidLocale(browserLang)){
    return browserLang;
  }
  return undefined;
};

function readURLparams(){
  let params = {};
  try {
    let location = window.location;
    if(typeof location === "undefined"){
      return params;
    }
    let URLparams = location.search;
    URLparams = URLparams.substr(1, URLparams.length - 1);
    let URLparamsArray = URLparams.split("&");
    for(let i = 0; i < URLparamsArray.length; i++){
      try {
        let paramData = URLparamsArray[i].split("=");
        if(typeof paramData[1] === "string"){
          params[paramData[0]] = paramData[1];
        }
      } catch (e){}
    }
  } catch (e){}

  return params;
};

function isValidLocale(locale){
  return ((typeof locale === "string") && (availableLocales.indexOf(locale) !== -1));
};

export function getTrans(s, params){
  // First language
  if((typeof APP_LOCALES[locale] !== "undefined") && (typeof APP_LOCALES[locale][s] === "string")){
    return getTransWithParams(APP_LOCALES[locale][s], params);
  }

  // Default language
  if((locale !== defaultLocale) && (typeof APP_LOCALES[defaultLocale] !== "undefined") && (typeof APP_LOCALES[defaultLocale][s] === "string")){
    return getTransWithParams(APP_LOCALES[defaultLocale][s], params);
  }

  return undefined;
};

/*
 * Replace params (if they are provided) in the translations keys. Example:
 * // "i.dtest"	: "Download #{name}",
 * // getTrans("i.dtest", {name: "SCORM package"}) -> "Download SCORM package"
 */
function getTransWithParams(trans, params){
  if(typeof params !== "object"){
    return trans;
  }

  for(let key in params){
    let stringToReplace = "#{" + key + "}";
    if(trans.indexOf(stringToReplace) !== -1){
      trans = Utils.replaceAll(trans, stringToReplace, params[key]);
    }
  }

  return trans;
};