let ESCAPP_LOCALES = {
};

// AfterOpen can be "NOTHING", "SHOW_URL", "SHOW_MESSAGE" or "SHOW_MESSAGE_AND_CONTINUE"

export let GLOBAL_CONFIG = {
  availableLocales:["es", "en", "it"],
  locale:undefined,
  defaultLocale:"es",
  localStorageKey:"SAFE_20222a",
  passwordLength:5,
  message:"¡Has abierto la puerta! \n Pulsa 'Continuar' para entrar a la nueva sala.",
  url:"https://vishub.org/pictures/20203.png",
  escapp:{
    endpoint:"https://escape.dit.upm.es/api/escapeRooms/369",
    localStorageKey:"ESCAPP_SAFE_20223a",
    restoreState:"AUTO",
    imagesPath:"/images/",
    I18n:{
      availableLocales:["es", "en"],
      defaultLocale:"en",
      locales:ESCAPP_LOCALES,
    },
    appPuzzleIds:[],
    puzzleId: 2,
    notifications:false,
    rtc:true,
    forceValidation:process.env.NODE_ENV === "production",
  },
};