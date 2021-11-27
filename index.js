//imported the required library, ipc main for communication, app for desktop software and browser window for v8 engine support 
const { ipcMain, app, BrowserWindow, nativeTheme } = require("electron")
const path = require("path")
const fs = require("fs")

let welcomeWindow, dashboardWindow, passcodeWindow, invoicePreviewWindow
var registeredState, hasPasscode


function createWelcomeWindow() {
  // Create the browser window.
  welcomeWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "script/welcome_screen.js"),
    },
  });
  welcomeWindow.loadFile("pages/welcome_screen.html");
  welcomeWindow.maximize();
}

function createDashboardWindow() {
  // Create the browser window.
  dashboardWindow = new BrowserWindow({
    width: 1350,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "script/dashboard_screen.js"),
    },
  });
  //dashboardWindow.removeMenu()
  dashboardWindow.loadFile("pages/dashboard_screen.html");
  dashboardWindow.maximize();
}

function createPasscodeWindow() {
  // Create the browser window.
  passcodeWindow = new BrowserWindow({
    width: 700,
    height: 480,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "script/passcode.js"),
    },
  });
  //dashboardWindow.removeMenu()
  passcodeWindow.loadFile("pages/passcode.html");
}

function createInvoicePreviewWindow() {
  // Create the browser window.
  invoicePreviewWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "script/invoice_screen.js"),
    },
  });
  //invoicePreviewWindow.removeMenu()
  invoicePreviewWindow.loadFile("pages/invoice_screen.html");
}

//when app is ready check if user is already registered
app.whenReady().then(() => {
  checkRegisteredState()
})


// Check if the user is already registered
function checkRegisteredState() {
  fs.readFile("settings/usersettings.json", (err, data) => {
    if (err) throw err
    registeredState = (JSON.parse(data)["registered"])
    hasPasscode = (JSON.parse(data)["passcodeApplied"])
    if (registeredState == "false") {
      createWelcomeWindow()
    } else {
      if (hasPasscode == "false") {
        createDashboardWindow()
      }
      else {
        createPasscodeWindow()
      }

    }
  })
}

ipcMain.on("preview_invoice", (e, invoice_number) => {
  createInvoicePreviewWindow()
  invoicePreviewWindow.webContents.send("invoice_number", invoice_number)
})

ipcMain.on("passcode:authenticated", () => {
  createDashboardWindow()
  passcodeWindow.close()
})
ipcMain.on("passcode:close", () => {
  passcodeWindow.close()
})

ipcMain.on("welcome:register", () => {
  createDashboardWindow()
  welcomeWindow.close()
})

ipcMain.on("welcome_screen:close" , ()=> {
  welcomeWindow.close()
})

ipcMain.on("welcome_screen:minimize" , ()=> {
  welcomeWindow.minimize()
})

ipcMain.on("dashboard_screen:logout",()=>{
  dashboardWindow.close()
  createWelcomeWindow()
})

ipcMain.on("invoice:print", () => {

  let options = {
    marginsType: 0,
    pageSize: 'A4',
    printBackground: true,
    printSelectionOnly: false,
    landscape: false
  }

  invoicePreviewWindow.webContents.printToPDF(options).then(data => {
    fs.writeFile(path.join(__dirname + "/temp/1.pdf"), data, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('PDF Generated Successfully');
      }
    });
  }).catch(error => {
    console.log(error)
  });

})