const { ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs')

let printBtn , shareBtn
window.addEventListener('DOMContentLoaded' , () => {

    // read a json file using fs
    fs.readFile("./settings/invoice_screen.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        languageData = JSON.parse(data)
        changeLanguage("hi")
    })

    printBtn = document.getElementById('print_btn')
    shareBtn = document.getElementById('share_btn')

    printBtn.addEventListener('click' , () => {
        window.print()
    })

    shareBtn.addEventListener('click' , () => {
        printToPDF()
    })

})



// convert the print area to pdf
function printToPDF() {
    ipcRenderer.send('invoice:print')
    setTimeout(() => {
        // share file using bluetooth
        
    }, 100)    
}

// function to change language
function changeLanguage(languageName) {
    // loop all the key 
    for (let key in languageData) {
        document.getElementById(key).innerHTML = languageData[key][languageName]
    }
}