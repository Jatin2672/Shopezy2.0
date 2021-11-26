//import file system
const { ipcRenderer } = require('electron');
const fs = require('fs');
let languageData , userSettingsData , inputpasscode

//this event runs when html content is loaded
window.addEventListener("DOMContentLoaded", () => {
    // read a json file using fs
    fs.readFile("./settings/passcode_lang.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        languageData = JSON.parse(data)
    })
    fs.readFile("./settings/system_settings.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        let system_settings = JSON.parse(data)
        changeLanguage(system_settings.language)
    })

    // read a json file using fs for user settings
    fs.readFile("./settings/usersettings.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        userSettingsData = JSON.parse(data)
    })

    document.getElementById("forward_btn").addEventListener("click",()=>{
        enteredPasscode = document.getElementById("passcode_input").value
        if(enteredPasscode == userSettingsData["passcode"]){
            ipcRenderer.send("passcode:authenticated")
        }else{
            document.getElementById("passcode_input").style.border = "1px solid #aa0000"
        }
    })
    document.getElementById("close_passcode_btn").addEventListener("click" , () =>{
        ipcRenderer.send("passcode:close")
    })
})

// function to change language
function changeLanguage(languageName){
    // loop all the key 
    for (let key in languageData) {
        document.getElementById(key).innerHTML = languageData[key][languageName]
    }
}