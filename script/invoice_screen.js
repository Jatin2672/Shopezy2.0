const { ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs')

let userSettings
let printBtn, shareBtn

window.addEventListener('DOMContentLoaded', () => {

    // read a json file using fs
    fs.readFile("./settings/invoice_screen.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        languageData = JSON.parse(data)
        changeLanguage("hi")
    })

    // read user_settings.json file
    fs.readFile("./settings/usersettings.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        userSettings = JSON.parse(data)
        applyUserSettings()
    })

    printBtn = document.getElementById('print_btn')
    shareBtn = document.getElementById('share_btn')

    printBtn.addEventListener('click', () => {
        window.print()
    })

    shareBtn.addEventListener('click', () => {
        printToPDF()
    })

    ipcRenderer.on('invoice_number', (e, invoice_number) => {
        loadDataForInvoice(invoice_number)
        console.log("1:", invoice_number)
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

// connect to database
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("database/masterDatabase.db", (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("connected to database");
});


function loadDataForInvoice(invoice_number) {
    console.log(invoice_number)
    let rowData = []
    // get data for invoice number from invoice_detail table
    db.get("SELECT * FROM invoice_detail WHERE invoice_id = ?", [invoice_number], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }
        // push data to a variable
        document.getElementById('invoice_number').innerHTML = "#" + row.invoice_id
        document.getElementById('invoice_date').innerHTML = row.invoice_date
        document.getElementById('total_items').innerHTML = row.total_items
        document.getElementById('accountant_name').innerHTML = row.accountant_director
        document.getElementById('total_price').innerHTML = row.invoice_total_amount
        document.getElementById('payment_method_info').innerHTML = row.payment_mode
        loadCustomerData(row.customer_id)

    })
    loadItemData(invoice_number)
    
}

function loadItemData(invoice_id) {
    let htmlDataToInsert = ""
    console.log(invoice_id)
    let i = 1;
    db.each("SELECT * FROM invoice_items WHERE invoice_id = ?", [invoice_id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }
        htmlDataToInsert += `<tr>
        <td>${[i]}</td>
        <td>${[row.name]}</td>
        <td>₹${[row.unit_price]}</td>
        <td>${[row.quantity]}</td>
        <td>${[row.discount]}%</td>
        <td>₹${[row.total_price]}</td>
        </tr>`
        i++;
    })

    setTimeout(() => {
        console.log(htmlDataToInsert)
        document.getElementById("table_body").innerHTML = htmlDataToInsert
            + document.getElementById("table_body").innerHTML

    }, 200)
    
}
function loadCustomerData(id){
    db.get("SELECT * FROM customer_info WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }
        if(row){
        document.getElementById("customer_name").innerHTML = row.name
        document.getElementById("customer_email").innerHTML += row.email
        document.getElementById("customer_phone").innerHTML += row.phone_number
        }        
    })
}

function applyUserSettings(){
    document.getElementById('shop_name').innerHTML = userSettings.bussiness_name
    document.getElementById('thanking_customer_text2').innerHTML += userSettings.bussiness_name
    document.getElementById('shop_address').innerHTML = userSettings.address
    document.getElementById('phone_shop').innerHTML = userSettings.mobile
    document.getElementById('email_shop').innerHTML = userSettings.email

}