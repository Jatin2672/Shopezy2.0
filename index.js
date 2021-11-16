//imported the required library, ipc main for communication, app for desktop software and browser window for v8 engine support 
const { ipcMain, app, BrowserWindow } = require("electron")
const path = require("path")
const fs = require("fs")

let welcomeWindow
var registeredState  

function createWelcomeWindow() {
    // Create the browser window.
    welcomeWindow = new BrowserWindow({
      width: 800,
      height: 600,
      //frame: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, "script/welcome_screen.js"),
      },
    });
    welcomeWindow.loadFile("pages/welcome_screen.html");
    welcomeWindow.maximize();
}


function checkRegisteredState() {
    // Check if the user is already registered
  fs.readFile("settings/usersettings.json" , (err, data) => {
        if(err) throw err
        registeredState = (JSON.parse(data)["registered"])
        if(registeredState == "false"){
            createWelcomeWindow()
        }else{
            console.log("will open other window")
        }
  })
}

//when app is ready check if user is already registered
  app.whenReady().then(() => {
    checkRegisteredState()
  })
 
