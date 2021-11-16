//import file system
const fs = require('fs');
let languageData

//this event runs when html content is loaded
window.addEventListener("DOMContentLoaded", () => {

    // read a json file using fs
    fs.readFile("./settings/dashboard_screen_language.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        languageData = JSON.parse(data)
        changeLanguage("hi")
    })

    // just a time pass change title after every 5 seconds
    setInterval(() => {
        if(document.getElementsByTagName("title")[0].innerHTML == "ShopEzy"){
            document.getElementsByTagName("title")[0].innerHTML = "ShopEzy - loading"
        }else{
            document.getElementsByTagName("title")[0].innerHTML = "ShopEzy"
        }
    }, 500);
})

// function to change language
function changeLanguage(languageName){
        // loop all the key 
        for (let key in languageData) {
            document.getElementById(key).innerHTML = languageData[key][languageName]
        }
}