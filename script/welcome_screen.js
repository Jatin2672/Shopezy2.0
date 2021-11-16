//import file system
const fs = require('fs');
let languageData

//this event runs when html content is loaded
window.addEventListener("DOMContentLoaded", () => {

    // read a json file using fs
    fs.readFile("./settings/language.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        languageData = JSON.parse(data)
        changeLanguage("hi")
    })

    

})

function changeLanguage(languageName){
        // loop all the key 
        for (let key in languageData) {
            document.getElementById(key).innerHTML = languageData[key][languageName]
        }
    }
