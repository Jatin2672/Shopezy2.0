//import file system
const fs = require('fs');
let languageData , settingsData

//this event runs when html content is loaded
window.addEventListener("DOMContentLoaded", () => {

    // read a json file using fs
    fs.readFile("./settings/welcome_screen_language.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        languageData = JSON.parse(data)
        changeLanguage("hi")
    })

    fs.readFile("./settings/settings" , (err, data) => {
        if (err) throw err
        settingsData = JSON.parse(data)
    });

    

})

function changeLanguage(languageName){
        // loop all the key 
        for (let key in languageData) {
            document.getElementById(key).innerHTML = languageData[key][languageName]
        }
}

function registerUser(){

}