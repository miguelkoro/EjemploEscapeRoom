
export function isPDFSupported(){
  var pdfReaderSupport = false;
  if((typeof navigator.mimeTypes == "object")&&("application/pdf" in navigator.mimeTypes)){
    pdfReaderSupport = true;
  }
  return pdfReaderSupport;
};
//La función isPDFSupported se encarga de verificar si el navegador soporta la lectura de archivos PDF.

export function isImage(url){
  if(typeof url === "string"){
  	//Remove options
	url = url.split('?')[0];
	let extension = (url.split('.').pop().split('&')[0]).toLowerCase();
	if(["jpg","jpeg","png","gif","bmp","svg"].indexOf(extension)!="-1"){
		return true;
	}
  }
  return false;
};
//La función isImage se encarga de verificar si una URL corresponde a una imagen.


export function deepMerge(h1,h2){
  if((typeof h1 === "object")&&(typeof h2 === "object")&&(!(h1 instanceof Array))){
    let keys = Object.keys(Object.assign({},h1,h2));
    let keysL = keys.length;
    for(let i=0; i<keysL; i++){
      h1[keys[i]] = deepMerge(h1[keys[i]],h2[keys[i]]);
    }
    return h1;
  } else {
    if(typeof h2 !== "undefined"){
      return h2;
    } else {
      return h1;
    }
  }
};

//La función deepMerge se encarga de fusionar dos objetos de forma recursiva,
// en caso de que no se encuentre el valor a reemplazar, devuelve el primer argumento.
export function replaceAll(string, find, replace){
  return string.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

//La función replaceAll se encarga de reemplazar todas las ocurrencias de una subcadena en una cadena por otra subcadena.