//import file system
const { settings } = require('cluster');
const fs = require('fs');
let languageData , userSettingsData
let selectedPage = 0
let home_page , invoice_page , analytics_page ,
 stocks_page , transaction_page , settings_page

let home_btn , invoice_btn , analytics_btn , stocks_btn , transaction_btn , settings_btn

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

    // read a json file using fs for user settings
    fs.readFile("./settings/usersettings.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        userSettingsData = JSON.parse(data)
        userSettingsUpdate()
    })

    // assign the html elements to pages variables
    home_page = document.getElementById("home_page")
    invoice_page = document.getElementById("invoice_page")
    analytics_page = document.getElementById("analytics_page")
    stocks_page = document.getElementById("stocks_page")
    transaction_page = document.getElementById("transactions_page")
    settings_page = document.getElementById("settings_page")
    
    // apply click on all the buttons [sidebar]
    applyEventListeners('home_btn', 0)
    applyEventListeners('invoice_btn', 1)
    applyEventListeners('analytics_btn', 2)
    applyEventListeners('stocks_btn', 3)
    applyEventListeners('transaction_btn', 4)
    applyEventListeners('settings_btn', 5)

    // apply click on all the buttons [sidebar]
    function applyEventListeners(id, pageNumber){
        document.getElementById(id).addEventListener("click", () => {
            changePage(pageNumber)
        })
    }

})

// function to change language
function changeLanguage(languageName){
        // loop all the key 
        for (let key in languageData) {
            document.getElementById(key).innerHTML = languageData[key][languageName]
        }
}

// function to change name and email on user badge [sidebar]
function userSettingsUpdate(){
    if(userSettingsData.email  != ""){
        document.getElementById("email_shop_badge").innerHTML = userSettingsData.email 
    }
    if(userSettingsData.bussiness_name  != ""){
        document.getElementById("name_shop_badge").innerHTML = userSettingsData.bussiness_name 
    }
}

function changePage(pageNumber){

    // hide the previous selected page
    switch(selectedPage){
        case 0:
            home_page.animate([ {opacity: 1}, {opacity: 0}
            ], { duration: 500,})
            home_page.style.display = "none"
            break
        case 1:
            invoice_page.animate([ {opacity: 1}, {opacity: 0}
            ], { duration: 500,})
            invoice_page.style.display = "none"
            break
        case 2:
            analytics_page.animate([ {opacity: 1}, {opacity: 0}
            ], { duration: 500,})
            analytics_page.style.display = "none"
            break
        case 3:
            stocks_page.animate([ {opacity: 1}, {opacity: 0}
            ], { duration: 500,})
            stocks_page.style.display = "none"
            break
        case 4:
            transaction_page.animate([ {opacity: 1}, {opacity: 0}
            ], { duration: 500,})
            transaction_page.style.display = "none"
            break
        case 5:
            settings_page.animate([ {opacity: 1}, {opacity: 0}
            ], { duration: 500,})
            settings_page.style.display = "none"
            break
        default:
            break
    }

    //show the requested page
    switch(pageNumber){
        case 0:
            home_page.animate([ {opacity: 0}, {opacity: 1}
            ], { duration: 500,})
            home_page.style.display = "flex"
            break
        case 1:
            invoice_page.animate([ {opacity: 0}, {opacity: 1}
            ], { duration: 500,})
            invoice_page.style.display = "flex"
            break
        case 2:
            analytics_page.animate([ {opacity: 0}, {opacity: 1}
            ], { duration: 500,})
            analytics_page.style.display = "flex"
            break
        case 3:
            stocks_page.animate([ {opacity: 0}, {opacity: 1}
            ], { duration: 500,})
            stocks_page.style.display = "flex"
            break
        case 4:
            transaction_page.animate([ {opacity: 0}, {opacity: 1}
            ], { duration: 500,})
            transaction_page.style.display = "flex"
            break
        case 5:
            settings_page.animate([ {opacity: 0}, {opacity: 1}
            ], { duration: 500,})
            settings_page.style.display = "flex"   
            break
        default:
            home_page.animate([ {opacity: 0}, {opacity: 1}
            ], { duration: 500,})
            home_page.style.display = "flex"
            break
    }
    
    selectedPage = pageNumber
}
