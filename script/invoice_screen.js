const { ipcRenderer } = require('electron')
const path = require('path')

let printBtn , shareBtn
window.addEventListener('DOMContentLoaded' , () => {


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