//import file system
const fs = require('fs');
let languageData, userSettingsData

let scanStatus = false

let selectedPage = 0
let home_page, invoice_page, analytics_page,
    stocks_page, transaction_page, settings_page

let selectedSettingsPage = 0
let account_setting_page, invoice_setting_page,
    analytics_setting_page, stocks_setting_page,
    personalization_setting_page

let stock_table_body, all_items_in_stocks = []
let invoice_his_table_body , all_items_in_invoice = []

let expand_sidebar_btn, is_sidebar_expanded = false

let last_selected_settings_btn = "account_setting_btn", last_selected_btn = "home_btn"


let model_box_container , 
add_stock_btn , add_stock_item_dialog_page , add_stock_itm_subpage , 
popUp_screen_cnfrm_addItm , add_itm_close_btn ,
yes_btn_cnfrm_addItm , no_btn_cnfrm_addItm 

let connect_android_btn_home , disconnect_android_btn_home , connect_to_android_page , close_connect_client_btn

let mini_invoice_history , stock_out_table, add_itm_subpage_main

let Enable_product_detail , remind_product_unavailability

//this event runs when html content is loaded
window.addEventListener("DOMContentLoaded", () => {

    // create server for mobile desktop communication
    createServer()

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

    // function for expanding and collapsing sidebar
    expand_sidebar_btn = document.getElementById("expand_menu_btn")
    let allSideTextLabels = document.getElementsByClassName("collapsible_side_bar_text")
    let navigation_sidebar = document.getElementById("navigation_sidebar")
    let dashboard_right_section = document.getElementById("dashboard_right_section")
    expand_sidebar_btn.addEventListener("click", () => {
        if (is_sidebar_expanded) {
            for (let i = 0; i < allSideTextLabels.length; i++) {
                allSideTextLabels[i].animate([{ opacity: 0 }, { opacity: 1 }
                ], { duration: 500, })
                allSideTextLabels[i].style.display = "flex"
            }
            navigation_sidebar.animate(
                [{ width: "80px" }, { width: "200px" }], { duration: 500, })
            navigation_sidebar.style.width = "200px"
            dashboard_right_section.animate(
                [{ width: "calc(100% - 80px)" }, { width: "calc(100% - 200px)" }], { duration: 500, })
            dashboard_right_section.style.width = "calc(100% - 200px)"
        } else {
            for (let i = 0; i < allSideTextLabels.length; i++) {
                allSideTextLabels[i].animate([{ opacity: 1 }, { opacity: 0 }
                ], { duration: 500, })
                allSideTextLabels[i].style.display = "none"
            }
            navigation_sidebar.animate(
                [{ width: "200px" }, { width: "80px" }], { duration: 500, })
            navigation_sidebar.style.width = "80px"
            dashboard_right_section.animate(
                [{ width: "calc(100% - 200px)" }, { width: "calc(100% - 80px)" }], { duration: 500, })
            dashboard_right_section.style.width = "calc(100% - 80px)"
        }
        is_sidebar_expanded = !is_sidebar_expanded
    })

    // assign the html elements to pages variables
    home_page = document.getElementById("home_page")
    invoice_page = document.getElementById("invoice_page")
    analytics_page = document.getElementById("analytics_page")
    analytics_page.style.display = "none"
    stocks_page = document.getElementById("stocks_page")
    transaction_page = document.getElementById("transactions_page")
    settings_page = document.getElementById("settings_page")

    // assign the html elements to settings pages variables
    account_setting_page = document.getElementById("settings_sub_pages_account")
    invoice_setting_page = document.getElementById("settings_sub_pages_invoice")
    analytics_setting_page = document.getElementById("settings_sub_pages_analytics")
    stocks_setting_page = document.getElementById("settings_sub_pages_stocks")
    personalization_setting_page = document.getElementById("settings_sub_pages_personalization")

    // assign the html elements to elements
    stock_table_body = document.getElementById("stock_table_body")
    invoice_his_table_body = document.getElementById("invoice_history_table_body")

    // assign the html elements to model box
    model_box_container = document.getElementById("model_box_container")
    connect_to_android_page = document.getElementById("connect_to_android_page")
    add_stock_item_dialog_page = document.getElementById("add_stock_item_dialog_page")
    add_stock_itm_subpage = document.getElementById("add_itm_subpage")
    popUp_screen_cnfrm_addItm = document.getElementById("popUp_screen_cnfrm_addItm")

    add_stock_btn = document.getElementById("AddItm_stock_btn")
    popUp_screen_cnfrm_addItm = document.getElementById("popUp_screen_cnfrm_addItm")
    add_itm_close_btn = document.getElementById("add_itm_close_btn")

    yes_btn_cnfrm_addItm = document.getElementById("yes_btn_cnfrm_addItm")
    no_btn_cnfrm_addItm = document.getElementById("no_btn_cnfrm_addItm")

    addStockButtonClick()

    // connect android client pop up
    connect_android_btn_home = document.getElementById("connect_android_btn_home")
    disconnect_android_btn_home = document.getElementById("disconnect_android_btn_home")
    connect_to_android_page = document.getElementById("connect_to_android_page")
    close_connect_client_btn = document.getElementById("close_connect_client_btn")

    addConnectButtonClick()

    mini_invoice_history = document.getElementById("mini_invoice_history")
    stock_out_table = document.getElementById("stock_out_table")

    add_itm_subpage_main = document.getElementById("add_itm_subpage_main")

    Enable_product_detail = document.getElementById("Enable_product_detail")
    Enable_product_detail.addEventListener("click", () => {
        toogleButtonFun("Enable_product_detail_svg")
    });
    remind_product_unavailability = document.getElementById("remind_product_unavailability")
    remind_product_unavailability.addEventListener("click", () => {
        toogleButtonFun("remind_product_unavailability_svg")
    });

    // a small delay for data to be added to tables
    setTimeout(() => {
        addItemsToStockTable()
        addItemsToInvoiceHistoryTable()
        writeIP_forQR()
    }, 300);

    // apply click on all the buttons [sidebar]
    applyEventListeners('home_btn', 0)
    applyEventListeners('invoice_btn', 1)
    applyEventListeners('analytics_btn', 2)
    applyEventListeners('stocks_btn', 3)
    applyEventListeners('transaction_btn', 4)
    applyEventListeners('settings_btn', 5)

    // apply click on all the buttons [settings]
    applySettingsEventListeners('account_setting_btn', 0)
    applySettingsEventListeners('invoice_setting_btn', 1)
    applySettingsEventListeners('analytics_setting_btn', 2)
    applySettingsEventListeners('stocks_setting_btn', 3)
    applySettingsEventListeners('personalization_setting_btn', 4)

    // apply click on all the buttons [sidebar]
    function applyEventListeners(id, pageNumber) {
        document.getElementById(id).addEventListener("click", () => {
            document.getElementById(id).className = "nav_items selected"
            document.getElementById(last_selected_btn).className = "nav_items"
            last_selected_btn = id
            changePage(pageNumber)
        })
    }

    // apply click on all the buttons [settings]
    function applySettingsEventListeners(id, pageNumber) {
        document.getElementById(id).addEventListener("click", () => {
            document.getElementById(id).className = "selected"
            document.getElementById(last_selected_settings_btn).className = ""
            last_selected_settings_btn = id
            changeSettingsPage(pageNumber)
        })
    }

})


// function to change language
function changeLanguage(languageName) {
    // loop all the key 
    for (let key in languageData) {
        document.getElementById(key).innerHTML = languageData[key][languageName]
    }
}

// function to change name and email on user badge [sidebar]
function userSettingsUpdate() {
    if (userSettingsData.email != "") {
        document.getElementById("email_shop_badge").innerHTML = userSettingsData.email
        document.getElementById("email_store_txt_home").innerHTML = userSettingsData.email
    }
    if (userSettingsData.bussiness_name != "") {
        document.getElementById("name_shop_badge").innerHTML = userSettingsData.bussiness_name
        document.getElementById("store_name_txt_home").innerHTML = userSettingsData.bussiness_name
    }
    if(userSettingsData.mobile != ""){
        document.getElementById("mobile_store_txt_home").innerHTML = userSettingsData.mobile
    }
    if(userSettingsData.address != ""){
        document.getElementById("address_store_txt_home").innerHTML = userSettingsData.address
    }
}

function changePage(pageNumber) {

    // hide the previous selected page
    switch (selectedPage) {
        case 0:
            home_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            home_page.style.display = "none"
            break
        case 1:
            invoice_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            invoice_page.style.display = "none"
            break
        case 2:
            analytics_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            analytics_page.style.display = "none"
            break
        case 3:
            stocks_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            stocks_page.style.display = "none"
            break
        case 4:
            transaction_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            transaction_page.style.display = "none"
            break
        case 5:
            settings_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            settings_page.style.display = "none"
            break
        default:
            break
    }

    //show the requested page
    switch (pageNumber) {
        case 0:
            home_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            home_page.style.display = "flex"
            break
        case 1:
            invoice_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            invoice_page.style.display = "block"
            break
        case 2:
            analytics_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            analytics_page.style.display = "grid"
            break
        case 3:
            stocks_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            stocks_page.style.display = "block"
            break
        case 4:
            transaction_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            transaction_page.style.display = "block"
            break
        case 5:
            settings_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            settings_page.style.display = "flex"
            break
        default:
            home_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            home_page.style.display = "flex"
            break
    }

    selectedPage = pageNumber
}

function changeSettingsPage(pageNumber) {
    // hide the previous selected page
    switch (selectedSettingsPage) {
        case 0:
            account_setting_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            account_setting_page.style.display = "none"
            break
        case 1:
            invoice_setting_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            invoice_setting_page.style.display = "none"
            break
        case 2:
            analytics_setting_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            analytics_setting_page.style.display = "none"
            break
        case 3:
            stocks_setting_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            stocks_setting_page.style.display = "none"
            break
        case 4:
            personalization_setting_page.animate([{ opacity: 1 }, { opacity: 0 }
            ], { duration: 500, })
            personalization_setting_page.style.display = "none"
            break
        default:
            break
    }

    //show the requested page
    switch (pageNumber) {
        case 0:
            account_setting_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            account_setting_page.style.display = "flex"
            break
        case 1:
            invoice_setting_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            invoice_setting_page.style.display = "flex"
            break
        case 2:
            analytics_setting_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            analytics_setting_page.style.display = "flex"
            break
        case 3:
            stocks_setting_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            stocks_setting_page.style.display = "flex"
            break
        case 4:
            personalization_setting_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            personalization_setting_page.style.display = "flex"
            break
        default:
            break
    }
    selectedSettingsPage = pageNumber
}

function addStockButtonClick() {
    add_stock_btn.addEventListener("click", function () {
        model_box_container.style.display = "block"
        add_stock_item_dialog_page.style.display = "block"
        add_stock_itm_subpage.style.display = "block"
        scanStatus = true
    })
    add_itm_close_btn.addEventListener("click", function () {
        add_stock_itm_subpage.style.display = "none"
        popUp_screen_cnfrm_addItm.style.display = "flex"
    })
    yes_btn_cnfrm_addItm.addEventListener("click", function () {
        model_box_container.style.display = "none"
        popUp_screen_cnfrm_addItm.style.display = "none"
        add_stock_item_dialog_page.style.display = "none"
        scanStatus = false
    })
    no_btn_cnfrm_addItm.addEventListener("click", function () {
        model_box_container.style.display = "block"
        popUp_screen_cnfrm_addItm.style.display = "block"
        add_stock_itm_subpage.style.display = "block"
        popUp_screen_cnfrm_addItm.style.display = "none"
    })
}

function addConnectButtonClick(){
    connect_android_btn_home.addEventListener("click" , () => {
        model_box_container.style.display = "block"
        connect_to_android_page.style.display = "flex"
    })
    close_connect_client_btn.addEventListener("click" , () =>{
        model_box_container.style.display = "none"
        connect_to_android_page.style.display = "none"
    })
}

// import sql
const sql = require('sqlite3').verbose()

// connect to database
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("database/masterDatabase.db", (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("connected to database");
});

// insert item to stock
function addItemToStock(barcode, product_name, cost_price, selling_price, quantity) {
    let added_date = new Date().getTime()
    db.run(`INSERT INTO stockitem (barcode , product_name , cost_price , selling_price , quantity , sold_quantity, date_added ) VALUES 
    (${barcode} , '${product_name}' , ${cost_price} , ${selling_price} , ${quantity} , 0 , '${added_date}')`, (err) => {
        if (err) {
            console.log(err.message)
        }
        console.log("item added to stock");
    });
}

//delete item from stock
function deleteItemFromStock(barcode) {
    db.run(`DELETE FROM stockitem WHERE barcode = ${barcode}`, (err) => {
        if (err) {
            console.log(err.message)
        }
        console.log("item deleted from stock");
    });
}

// function increase sold quantity
function increaseSoldQuantity(barcode) {
    db.run(`UPDATE stockitem SET sold_quantity = sold_quantity + 1 WHERE barcode = ${barcode}`, (err) => {
        if (err) {
            console.log(err.message)
        }
        console.log("item sold");
    });
}

// add item to html template table
function addItemsToStockTable() {
    let html_to_add = ""
    stock_table_body.innerHTML = ""
    for (let i = 0; i < all_items_in_stocks.length; i++) {
        html_to_add += `<tr>
        <td>${[all_items_in_stocks[i].barcode]}</td>
        <td>${[all_items_in_stocks[i].product_name]}</td>
        <td>${[all_items_in_stocks[i].cost_price]}</td>
        <td>${[all_items_in_stocks[i].selling_price]}</td>
        <td>${[all_items_in_stocks[i].selling_price - all_items_in_stocks[i].cost_price]}</td>
        <td>${[all_items_in_stocks[i].quantity]}</td>
        <td>0</td>
        <td>${[all_items_in_stocks[i].sold_quantity]}</td>
        <td>${[all_items_in_stocks[i].date_added]}</td>
        </tr>`
    }
    stock_table_body.innerHTML = html_to_add
    let html_to_add2 = ""
    let no_of_row_added = 0
    stock_out_table.innerHTML = ""
    for(let i = 0; i < all_items_in_stocks.length; i++){
        if(all_items_in_stocks[i].quantity - all_items_in_stocks[i].sold_quantity < 10 && no_of_row_added<9){
        html_to_add2 += `<tr>
        <td>${[all_items_in_stocks[i].product_name]}</td>
        <td>${[all_items_in_stocks[i].barcode]}</td>
        <td>${[all_items_in_stocks[i].quantity - all_items_in_stocks[i].sold_quantity]}</td>
        </tr>`
        no_of_row_added++
        }
    }
    stock_out_table.innerHTML = html_to_add2
}

// function get all item from stock in ascending order of date added
function getAllItemFromStock() {
    db.each(`SELECT * FROM stockitem ORDER BY date_added ASC`, (err, row) => {
        if (err) {
            console.log(err.message)
        }
        all_items_in_stocks.push(row)
    });
}

getAllItemFromStock()


// function to add new row to invoice_detail table of masterdatabase
function addNewInvoiceData(customer_id , invoice_total_amount, payment_mode, accountant_director, total_items) {
    let added_date = new Date().getTime()
    db.run(`INSERT INTO invoice_detail (customer_id ,invoice_date , invoice_total_amount , payment_mode , accountant_director , total_items  ) VALUES 
    ( '${customer_id}','${added_date}' , ${invoice_total_amount} , '${payment_mode}' , '${accountant_director}' , ${total_items} )`, (err) => {
        if (err) {
            console.log(err.message)
        }
        console.log("invoice data added to master database");
    });
    db.close()
}

// add item to html template table
function addItemsToInvoiceHistoryTable(){
    let html_to_add = ""
    invoice_his_table_body.innerHTML = ""
    for (let i = 0; i < all_items_in_invoice.length; i++) {
        html_to_add += `<tr>
        <td>${[all_items_in_invoice[i].invoice_date]}</td>
        <td>${[all_items_in_invoice[i].invoice_id]}</td>
        <td>${[all_items_in_invoice[i].customer_id]}</td>
        <td>${[all_items_in_invoice[i].invoice_total_amount]}</td>
        <td>${[all_items_in_invoice[i].payment_mode]}</td>
        <td>${[all_items_in_invoice[i].accountant_director]}</td>
        </tr>`
    }
    console.log(html_to_add)
    invoice_his_table_body.innerHTML = html_to_add

    let html_to_add2 = ""
    mini_invoice_history.innerHTML = ""
    for (let i = 0; i < Math.min(all_items_in_invoice.length ,10 ); i++) {
        html_to_add2 += `<tr>
        <td>${[all_items_in_invoice[i].invoice_id]}</td>
        <td>${[all_items_in_invoice[i].invoice_total_amount]}</td>
        </tr>`
    }
    mini_invoice_history.innerHTML = html_to_add2

}
// function get all item from invoice in ascending order of date added
function getAllItemFromInvoiceHistory(){
    db.each(`SELECT * FROM invoice_detail ORDER BY invoice_date ASC`, (err, row) => {
        if (err) {
            console.log(err.message)
        }
        all_items_in_invoice.push(row)
    });
}

getAllItemFromInvoiceHistory()
const port = 8080;
//--------------------------get ip of the pc----------------------------
const { networkInterfaces } = require("os");
let getLocalExternalIP = () =>
    []
        .concat(...Object.values(networkInterfaces()))
        .find((details) => details.family === "IPv4" && !details.internal)
        .address;

function writeIP_forQR(){
    document.getElementById("hiddenIP").innerHTML = getLocalExternalIP() + ":" + port.toString()
}


// -----------------------------------creation of a http server ---------------------------------------

const http = require("http");
var os = require('os')
const host = getLocalExternalIP();
let itemListReceived = []

function createServer() {
    const requestListener = function (req, res) {
        const urls = req.url;
        let urls_splitted, params = "";

        // check if url contains ?
        if (urls.includes("?")) {
            // split url and get the first part
            urls_splitted = urls.split("?")[0];
            // parameter part
            params = urls.split("?")[1];
        } else {
            urls_splitted = urls;
        }
        switch (urls_splitted) {
            case "/connect":
                res.writeHead(200);
                res.end("CONNECTED:" + os.hostname());
                if (params.includes("name")) deviceName = params.split("=")[1]
                console.log(deviceName);
                close_connect_client_btn.click()
                deviceConnectedSuccess(deviceName);
                break;
            case "/additem":
                res.writeHead(200);
                // check if item list has already this item
                if (!itemListReceived.includes(params)) {
                    itemListReceived.push(params)
                    res.end("ADDEDITEM");
                    console.log("add item :" + params);
                    addAllItemToStockPage(params)
                }else{
                    res.end("SAMEITEM");
                }
                break;
            case "/availabilityItem":
                res.writeHead(200);
                res.end("10 items available");
                break;
            case "/scanStatus":
                res.writeHead(200)
                if(scanStatus){
                    res.end("STARTSCAN")
                }else{
                    res.end("STOPSCAN")
                }
                break

            default:
                res.writeHead(404);
                res.end("Not Found!");
                break;
        }
    };

    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}

function deviceConnectedSuccess(deviceName){
    model_box_container.style.display = "none"
    connect_android_btn_home.style.display = "none"
    connect_android_btn_home.style.display = "none"
    document.getElementById("client_connected_success_txt").innerHTML += deviceName
    document.getElementById("client_connected_success_txt").style.display = "flex"
    document.getElementById("no_android_client_txt").style.display = "none"
    disconnect_android_btn_home.style.display = "flex"
}
let allItemToAppendToStock = {}

function addAllItemToStockPage(barcode_item_received){
    let barcode_item_data = {
        "item_name": " ",
        "item_cost_price": 100,
        "item_selling_price": 120,
        "item_quantity": 20
    }
    allItemToAppendToStock[barcode_item_received] = barcode_item_data
    toAppendItemToAddStockItemCard(barcode_item_received)
    console.log(allItemToAppendToStock)
}

function toAppendItemToAddStockItemCard(barcode_item_received){
    let html_to_append = `<div class="add_item_card">
    <div class="add_item_card_top">
      <p>${[barcode_item_received]}</p>
      <img src="../media/add_itm/dustbinIcon.svg" alt="" class="remove_itm_Btn">
    </div>
    <div class="add_item_card_txt">
      <p>Product Name</p>
      <input type="text" name="product_name" id="add_item_card_input_txt">
    </div>
    <div>
      <div class="Pricediv">
        <p>Cost Price</p>
        <input type="number" name="no_of_items" class="quantity" min="1" max="20" required>
      </div>
      <div class="Pricediv">
        <p>Sell Price</p>
        <input type="number" name="no_of_items" class="quantity" min="1" max="20" required>
      </div>
      <div class="Pricediv">
        <p>Stock quantity</p>
        <input type="number" name="no_of_items" class="quantity" min="1" max="20" required>
      </div>
    </div>
  </div>`
  add_itm_subpage_main.innerHTML += html_to_append
}

function toogleButtonFun(svgId){
    let toggleButton = document.getElementById(svgId)
    if(toggleButton.classList.contains("toggle_btn_off")){
        toggleButton.classList.remove("toggle_btn_off")
        toggleButton.classList.add("toggle_btn_on")
        toggleButton.getElementsByTagName("circle")[0].style.fill = "#4087F3"
        toggleButton.getElementsByTagName("circle")[0].setAttribute("cx", "46")
        
    }else{
        toggleButton.classList.remove("toggle_btn_on")
        toggleButton.classList.add("toggle_btn_off")
        toggleButton.getElementsByTagName("circle")[0].style.fill = "#6B6B6B"
        toggleButton.getElementsByTagName("circle")[0].setAttribute("cx", "14")
    }
}