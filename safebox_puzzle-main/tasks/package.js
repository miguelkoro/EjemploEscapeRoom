console.log("Init task: Generate ZIP file");

const {resolve} = require('path');
const fs = require('fs-extra');
const zipFolder = require('zip-folder');

const build_path = resolve(__dirname, '../dist');
const zip_path = resolve(__dirname, '../dist_zip');

if(!fs.existsSync(build_path)){
  //Abort
  console.log("No build folder was found");
  return;
}

if(!fs.existsSync(zip_path)){
	fs.mkdirSync(zip_path);
}

// Generate ZIP file

zipFolder(build_path, zip_path + "/dist.zip", function(err){
  if(typeof err === "undefined"){
    //Success 
    console.log("Task finished");
  } else {
    console.log("Task finished. An error ocurred.");
  }
});