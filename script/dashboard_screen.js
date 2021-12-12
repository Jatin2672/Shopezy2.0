//import file system
const { ipcRenderer } = require('electron');
const fs = require('fs');
let system_settings, languageData, userSettingsData

let max_invoice_detail_id = 0
let scanStatus = false, invoice_item_container

let selectedPage = 0
let home_page, invoice_page, analytics_page,
    stocks_page, transaction_page, settings_page

let selectedSettingsPage = 0
let account_setting_page, invoice_setting_page,
    analytics_setting_page, stocks_setting_page,
    personalization_setting_page

let stock_table_body, all_items_in_stocks = []
let invoice_his_table_body, all_items_in_invoice = []

let expand_sidebar_btn, is_sidebar_expanded = false

let last_selected_settings_btn = "account_setting_btn", last_selected_btn = "home_btn"


let model_box_container,
    add_stock_btn, add_stock_item_dialog_page, add_stock_itm_subpage,
    popUp_screen_cnfrm_addItm, add_itm_close_btn,
    yes_btn_cnfrm_addItm, no_btn_cnfrm_addItm

let connect_android_btn_home, disconnect_android_btn_home, connect_to_android_page, close_connect_client_btn

let mini_invoice_history, stock_out_table, add_itm_subpage_main

let Enable_product_detail, remind_product_unavailability

let preview_btn_invoice_page

let profile_pic_url

let updateModelBox

let savebtn_account_settings
let accountant_name_var, accountant_sign_var, accountant_id_var=0;

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
        //changeLanguage("en")
    })

    fs.readFile("./settings/system_settings.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        system_settings = JSON.parse(data)

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

    preview_btn_invoice_page = document.getElementById("preview_btn_invoice_page")

    mini_invoice_history = document.getElementById("mini_invoice_history")
    stock_out_table = document.getElementById("stock_out_table")

    invoice_item_container = document.getElementById("invoice_items_container")

    add_itm_subpage_main = document.getElementById("add_itm_subpage_main")
    updateModelBox = document.getElementById("update_itm_subpage_main")
    savebtn_account_settings = document.getElementById("savebtn_account_settings")

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
        changeLanguage(system_settings.language)
    }, 500);

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

    midBtnaction();

    preview_btn_invoice_page.addEventListener("click", () => {
        generateInvoiceFromData()
        setTimeout(() => {
            ipcRenderer.send("preview_invoice", max_invoice_detail_id)
        }, 1500)

    })

    savebtn_account_settings.addEventListener("click", () => {
        updateSettings()
        alert("Successfully Updated ! Refresh to see changes")
    })

    // ------------------------------------------------------- Setting Account image ---------------------------------------------------

    let renderImgdiv = document.getElementById("renderImg_acc_settings")
    let Image_of_user = document.getElementById("Dp_img_select_accSet")
    let file = document.getElementById("file_acc_setting")
    let Upload_btn = document.getElementById("Upload_btn_acc_setting")
    let remove_btn = document.getElementById("remove_btn_acc_setting")

    Upload_btn.addEventListener('click', () => {
        file.click()
    })

    file.addEventListener('change', function () {
        const chooseFile = this.files[0];

        if (chooseFile) {
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                Dp_img_select_accSet.setAttribute('src', reader.result);
                profile_pic_url = reader.result;
            });
            reader.readAsDataURL(chooseFile)
        }
    })

    remove_btn.addEventListener('click', () => {
        profile_pic_url = "../media/userphoto.png";
        Dp_img_select_accSet.setAttribute('src', profile_pic_url);
    })

    document.getElementById("selectmenu_personalisation_settings")
        .addEventListener("change", () => {
            system_settings.language = document.getElementById("selectmenu_personalisation_settings").value
            changeLanguage(system_settings.language)
        })

    // --------------------------------------------------- Setting Account image ----------------------------------------------

    // --------------------------------------------------- Add PassCode Madal -------------------------------------------------------

    let add_passcode_modal = document.getElementById("add_passcode_modal")
    let add_local_passcode_btn = document.getElementById("add_local_passcode_btn")
    let close_passcode_btn_addPass = document.getElementById("close_passcode_btn_addPass")
    let update_passcode_btn = document.getElementById("update_passcode_btn")
    let new_passcode_input = document.getElementById("new_passcode_input")
    let re_new_passcode_input = document.getElementById("re_new_passcode_input")

    add_local_passcode_btn.addEventListener('click', () => {
        model_box_container.style.display = "flex"
        add_passcode_modal.style.display = "block"
    })

    close_passcode_btn_addPass.addEventListener('click', () => {
        model_box_container.style.display = "none"
        add_passcode_modal.style.display = "none"
    })

    update_passcode_btn.addEventListener('click', () => {
        if (new_passcode_input.value != re_new_passcode_input.value) {
            re_new_passcode_input.style.border = "1px solid red"
            ErrorAlert("PassCode Not Matched!!!")
        }
        else if (new_passcode_input.value.length < 4) {
            new_passcode_input.style.border = "1px solid red"
            ErrorAlert("PassCode length must be greater than 4 character")
        }
        else {
            userSettingsData.passcodeApplied = "true"
            userSettingsData.passcode = re_new_passcode_input.value
            fs.writeFile("./settings/usersettings.json", JSON.stringify(userSettingsData), (err) => {
                if (err) throw err
                console.log("The file has been saved!")
            })
            ErrorAlert("Passcode Updated Successfully!!!")
            setTimeout(() => {
                close_passcode_btn_addPass.click()
            }, 2001);
        }
    })

    // --------------------------------------------------- Add PassCode Modal Ends --------------------------------------------------

    // --------------------------------------------------- Message Modal --------------------------------------------------

    let message_alert_modal = document.getElementById("message_alert_modal")
    let error_message = document.getElementById("error_message_txt")
    function ErrorAlert(message) {
        message_alert_modal.style.display = "block"
        error_message.innerHTML = message;
        setTimeout(() => {
            message_alert_modal.style.display = "none"
        }, 2000);
    }

    // --------------------------------------------------- Message Modal Ends --------------------------------------------------

    // --------------------------------------------------- Notification Modal  --------------------------------------------------

    let notification_icon_home = document.getElementById("notification_icon_home")
    let close_notify_modal = document.getElementById("close_notify_modal")
    let notification_modal = document.getElementById("notification_modal")

    notification_icon_home.addEventListener('click', () => {
        model_box_container.style.display = "block"
        notification_modal.style.display = "block"
    })

    close_notify_modal.addEventListener('click', () => {
        model_box_container.style.display = "none"
        notification_modal.style.display = "none"
    })

    // --------------------------------------------------- Notification Modal Ends --------------------------------------------------
    document.getElementById("updateStockBtn")
        .addEventListener("click", () => {
            addOrUpdateItemStock()
        });

    // ---------------------------------------------- Log out Function ----------------------------------------------------

    let log_out_btn = document.getElementById("log_out_icon_home")

    log_out_btn.addEventListener('click', () => {
        model_box_container.style.display = "block"
        ErrorAlert("Logged Out Successfully!!!")
        userSettingsData.passcodeApplied = "false"
        updateSettings()
        setTimeout(() => {
            ipcRenderer.send("dashboard_screen:logout")
        }, 2500);
    })

    // ---------------------------------------------- Log out Function Ends -----------------------------------------------

    // ---------------------------------------------- Add Accountant popUP  -----------------------------------------------
    let newaccountdirector_invoice_settings = document.getElementById("newaccountdirector_invoice_settings")
    let addAccountant_popUp_close_btn = document.getElementById("addAccountant_popUp_close_btn")
    let addAccountant_popUp = document.getElementById("addAccountant_popUp")
    let file_sign_accountant = document.getElementById("file_sign_accountant")
    let accountant_sign_upld_img = document.getElementById("accountant_sign_upld_img")
    let file_sign_accountant_btn = document.getElementById("file_sign_accountant_btn")


    newaccountdirector_invoice_settings.addEventListener('click', () => {
        model_box_container.style.display = "block"
        addAccountant_popUp.style.display = "block"
    })
    addAccountant_popUp_close_btn.addEventListener('click', () => {
        model_box_container.style.display = "none"
        addAccountant_popUp.style.display = "none"
    })

    file_sign_accountant_btn.addEventListener('click', () => {
        file_sign_accountant.click();
    })

    file_sign_accountant.addEventListener('change', function () {
        const chooseFile = this.files[0];

        if (chooseFile) {
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                accountant_sign_upld_img.setAttribute('src', reader.result);
                accountant_sign_var = reader.result;
            });
            reader.readAsDataURL(chooseFile)
        }
    })
    
    let btn_to_add_accountant=document.getElementById("btn_to_add_accountant")
    
    btn_to_add_accountant.addEventListener('click',()=>{
        accountant_name_var=accountant_popUp_name_txt.value;
        Add_accountant_div(accountant_name_var,accountant_sign_var)
        addAccountant_popUp_close_btn.click();
    })

    let director_option_invoice_settings = document.querySelectorAll(".director_option_invoice_settings")
    director_option_invoice_settings.forEach(director_option_invoice_settings => {

        director_option_invoice_settings.addEventListener('click', () => {
            let parent = director_option_invoice_settings.parentElement;
            console.log(parent);
            Accountant_detail_div_invoice.removeChild(parent)
        })

    });
    // ---------------------------------------------- Add Accountant popUP Ends -----------------------------------------------
    
})
// to add acountant
function Add_accountant_div(name,sign_img){
    let Accountant_detail_div_invoice=document.getElementById("Accountant_detail_div_invoice")
    let Accountant_html=`
    <span class="accountant_name_txt" >${name}</span>
    <div class="signature_director_invoice_settings"><img src="${sign_img}"
      ></div>
    <img src="../media/settings_page/dustbinIcon.svg" class="director_option_invoice_settings">
   `

  let x = document.createElement("div");
    // x.id=`accountant_detail_${name}`
    x.className=`info_accountant_invoice_settings`
    x.innerHTML = Accountant_html;
    Accountant_detail_div_invoice.appendChild(x)
    
}

// function to change language
function changeLanguage(languageName) {
    // loop all the key 
    try{
    for (let key in languageData) {
        try {
            document.getElementById(key).innerHTML = languageData[key][languageName]
        } catch (error) {
            console.log(key)
        }
    }
    }catch(error){
        console.log(error)
    }

    document.getElementById("selectmenu_personalisation_settings").value = languageName

    fs.writeFile("./settings/system_settings.json", JSON.stringify(system_settings), (err) => {
        if (err) console.log(err)
    })

}

// function to change name and email on user badge [sidebar]
function userSettingsUpdate() {

    if (userSettingsData.email != "") {
        document.getElementById("email_shop_badge").innerHTML = userSettingsData.email
        document.getElementById("email_store_txt_home").innerHTML = userSettingsData.email
        document.getElementById("account_setting_shop_email").value = userSettingsData.email
    }
    if (userSettingsData.bussiness_name != "") {
        document.getElementById("name_shop_badge").innerHTML = userSettingsData.bussiness_name
        document.getElementById("store_name_txt_home").innerHTML = userSettingsData.bussiness_name
        document.getElementById("account_setting_shop_name").value = userSettingsData.bussiness_name
    }
    if (userSettingsData.mobile != "") {
        document.getElementById("mobile_store_txt_home").innerHTML = userSettingsData.mobile
        document.getElementById("account_setting_shop_mobile").value = userSettingsData.mobile
    }
    if (userSettingsData.address != "") {
        document.getElementById("address_store_txt_home").innerHTML = userSettingsData.address
        document.getElementById("addressinput_account_settings").value = userSettingsData.address
    }
    if (userSettingsData.profile_pic_url != "") {
        document.getElementById("user_profile_home").src = userSettingsData.profile_pic_url
        document.getElementById("photo_shop_badge").src = userSettingsData.profile_pic_url
        document.getElementById("Dp_img_select_accSet").src = userSettingsData.profile_pic_url
    }
    if (userSettingsData.bussiness_owner_name != "") {
        document.getElementById("shop_bussiness_name_acc").value = userSettingsData.bussiness_owner_name
    }
    if (userSettingsData.bussiness_category != "") {
        document.getElementById("bussiness_category_acc").value = userSettingsData.bussiness_category
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
            scanStatus = false
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
            scanStatus = true
            break
        case 2:
            analytics_page.animate([{ opacity: 0 }, { opacity: 1 }
            ], { duration: 500, })
            analytics_page.style.display = "flex"
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

// ------------------------------- MID Btn function --------------------------------------------

function midBtnaction() {
    let invo_mid_btn = document.getElementById("invo_mid_btn")
    let stock_mid_btn = document.getElementById("stock_mid_btn")
    let search_mid_btn = document.getElementById("search_mid_btn")
    let analytics_mid_btn = document.getElementById("analytics_mid_btn")
    let edit_account_icon_home = document.getElementById("edit_account_icon_home")

    let invoice_btn = document.getElementById("invoice_btn")
    let analytics_btn = document.getElementById("analytics_btn")
    let stocks_btn = document.getElementById("stocks_btn")
    let transaction_btn = document.getElementById("transaction_btn")
    let settings_btn = document.getElementById("settings_btn")
    let account_setting_btn = document.getElementById("account_setting_btn")
    let invoice_setting_btn = document.getElementById("invoice_setting_btn")
    let invoicepage_Setting_btn = document.getElementById("Setting_btn")
    let setting_stock_btn = document.getElementById("setting_stock_btn")
    let stocks_setting_btn = document.getElementById("stocks_setting_btn")


    invo_mid_btn.addEventListener('click', () => {
        invoice_btn.click();
    })
    stock_mid_btn.addEventListener('click', () => {
        stocks_btn.click();
    })
    search_mid_btn.addEventListener('click', () => {
        transaction_btn.click();
    })
    analytics_mid_btn.addEventListener('click', () => {
        analytics_btn.click();
    })
    edit_account_icon_home.addEventListener('click', () => {
        settings_btn.click();
        setTimeout(() => {
            account_setting_btn.click();
        }, 200);
    })
    // -------------------------- btn clicks of subpages ---------------------------------

    invoicepage_Setting_btn.addEventListener('click', () => {
        settings_btn.click();
        setTimeout(() => {
            invoice_setting_btn.click();
        }, 200);
    })

    setting_stock_btn.addEventListener('click', () => {
        settings_btn.click();
        setTimeout(() => {
            stocks_setting_btn.click();
        }, 200);
    })

    // -------------------------- btn clicks of subpages ends ---------------------------------

}

// ------------------------------- MID Btn --------------------------------------------
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

function addConnectButtonClick() {
    connect_android_btn_home.addEventListener("click", () => {
        model_box_container.style.display = "block"
        connect_to_android_page.style.display = "flex"
    })
    close_connect_client_btn.addEventListener("click", () => {
        model_box_container.style.display = "none"
        connect_to_android_page.style.display = "none"
    })
}

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
        html_to_add += `<tr id="${[all_items_in_stocks[i].barcode]}item">
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

    for (let i = 0; i < all_items_in_stocks.length; i++) {
        document.getElementById(`${[all_items_in_stocks[i].barcode]}item`)
            .addEventListener("click", () => {
                openItemUpdateDialog(all_items_in_stocks[i].barcode, all_items_in_stocks[i].product_name, all_items_in_stocks[i].cost_price, all_items_in_stocks[i].selling_price, all_items_in_stocks[i].quantity - all_items_in_stocks[i].sold_quantity)
            })
    }

    let html_to_add2 = ""
    let no_of_row_added = 0
    stock_out_table.innerHTML = ""
    for (let i = 0; i < all_items_in_stocks.length; i++) {
        if (all_items_in_stocks[i].quantity - all_items_in_stocks[i].sold_quantity < 10 && no_of_row_added < 9) {
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


function openItemUpdateDialog(barcode, name, price, sellPrice, quantity) {
    model_box_container.style.display = "block"
    updateModelBox.style.display = "flex"
    document.getElementById("upd_item_barcode").innerHTML = barcode
    document.getElementById("upd_itm_prod_name").value = name
    document.getElementById("upd_cost_price").value = price
    document.getElementById("upd_sell_price").value = sellPrice
    document.getElementById("quantity_in_stock").value = quantity

    recreateNode(document.getElementById("discard_and_close"))
    document.getElementById("discard_and_close")
        .addEventListener("click", () => {
            model_box_container.style.display = "none"
            updateModelBox.style.display = "none"
        })
    recreateNode(document.getElementById("update_stock_item"))
    document.getElementById("update_stock_item")
        .addEventListener("click", () => {
            updateDataFromModelBox()
            model_box_container.style.display = "none"
            updateModelBox.style.display = "none"
        })

    document.getElementById("upd_itm_delete")
        .addEventListener("click", () => {
            deleteItemFromStock(barcode)
            model_box_container.style.display = "none"
            updateModelBox.style.display = "none"
            
        })

}

function updateDataFromModelBox() {
    let barcode = document.getElementById("upd_item_barcode").innerHTML
    let prod_name = document.getElementById("upd_itm_prod_name").value
    let cp = document.getElementById("upd_cost_price").value
    let sp = document.getElementById("upd_sell_price").value
    let qty = document.getElementById("quantity_in_stock").value
    let soldQty = 0
    let dates = (new Date()).getTime()
    updateStockData(barcode, prod_name, cp, sp, qty, soldQty, dates)
    getAllItemFromStock()
    setTimeout(() => {
        console.log(all_items_in_stocks)
        addItemsToStockTable()
    }, 300);

}

function updateStockData(barcode, prod_name, cp, sp, qty, soldQty, date) {

    // update data in stockitem table
    db.run(`UPDATE stockitem SET product_name = "${[prod_name]}",
     cost_price = ${[cp]}, selling_price = ${[sp]},
     quantity = ${[qty]}, sold_quantity = ${[soldQty]},
     date_added = ${[date]}
     WHERE barcode = ${[barcode]}`)

}

// function get all item from stock in ascending order of date added
function getAllItemFromStock() {
    all_items_in_stocks = []
    db.each(`SELECT * FROM stockitem ORDER BY date_added ASC`, (err, row) => {
        if (err) {
            console.log(err.message)
        }
        all_items_in_stocks.push(row)
    });
}

getAllItemFromStock()


// function to add new row to invoice_detail table of masterdatabase
function addNewInvoiceData(customer_id, invoice_total_amount, payment_mode, accountant_director, total_items) {
    //get maximum id of invoice_detail table

    db.each(`SELECT MAX(invoice_id) AS max_id FROM invoice_detail`, (err, row) => {
        if (err) {
            console.log(err.message)
        }
        max_invoice_detail_id = row.max_id + 1
    });
    let added_date = new Date().getTime()
    db.run(`INSERT INTO invoice_detail (customer_id ,invoice_date , invoice_total_amount , payment_mode , accountant_director , total_items  ) VALUES 
    ( '${customer_id}','${added_date}' , ${invoice_total_amount} , '${payment_mode}' , '${accountant_director}' , ${total_items} )`, (err) => {
        if (err) {
            console.log(err.message)
        }
    });

}

// function to add new row to invoice_items table of masterdatabase
function addNewInvoiceItemsData(prod_name, invoice_id, barcode, quantity, unit_price, discount, total_price) {
    db.run(`INSERT INTO invoice_items (name , invoice_id , barcode , quantity , unit_price , discount , total_price ) VALUES 
    ( "${prod_name}",${invoice_id} , ${barcode} , ${quantity} , ${unit_price} , ${discount} , ${total_price} )`, (err) => {
        if (err) {
            console.log(err.message)
        }
    });
}

// add item to html template table
function addItemsToInvoiceHistoryTable() {
    let html_to_add = ""
    invoice_his_table_body.innerHTML = ""
    for (let i = 0; i < all_items_in_invoice.length; i++) {
        html_to_add += `<tr class="invoice_history_row" 
        id="${[all_items_in_invoice[i].invoice_id]}invoice_row">
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

    for (let i = 0; i < all_items_in_invoice.length; i++) {
        document.getElementById(`${[all_items_in_invoice[i].invoice_id]}invoice_row`)
            .addEventListener("click", () => {
                ipcRenderer.send("preview_invoice", all_items_in_invoice[i].invoice_id)
            })
    }

    let html_to_add2 = ""
    mini_invoice_history.innerHTML = ""
    for (let i = 0; i < Math.min(all_items_in_invoice.length, 10); i++) {
        html_to_add2 += `<tr>
        <td>${[all_items_in_invoice[i].invoice_id]}</td>
        <td>${[all_items_in_invoice[i].invoice_total_amount]}</td>
        </tr>`
    }
    mini_invoice_history.innerHTML = html_to_add2

}

// function get all item from invoice in ascending order of date added
function getAllItemFromInvoiceHistory() {
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
    [].concat(...Object.values(networkInterfaces())).find((details) => details.family === "IPv4" && !details.internal).address;

function writeIP_forQR() {
    document.getElementById("hiddenIP").innerHTML = getLocalExternalIP() + ":" + port.toString()
}


// -----------------------------------creation of a http server ---------------------------------------

const http = require("http");
var os = require('os');
const { setTimeout } = require('timers');
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
                } else {
                    res.end("SAMEITEM");
                }
                break;
            case "/availabilityItem":
                res.writeHead(200);
                res.end("10 items available");
                break;
            case "/scanStatus":
                res.writeHead(200)
                if (scanStatus) {
                    res.end("STARTSCAN")
                } else {
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

function deviceConnectedSuccess(deviceName) {
    model_box_container.style.display = "none"
    connect_android_btn_home.style.display = "none"
    connect_android_btn_home.style.display = "none"
    document.getElementById("client_connected_success_txt").innerHTML += deviceName
    document.getElementById("client_connected_success_txt").style.display = "flex"
    document.getElementById("no_android_client_txt").style.display = "none"
    disconnect_android_btn_home.style.display = "flex"
}
let allItemToAppendToStock = []
let allItemForInvoice = []

function addAllItemToStockPage(barcode_item_received) {
    if (selectedPage == "1") {
        allItemForInvoice.push(barcode_item_received)
        toAppendItemToInvoice(barcode_item_received)
    } else {
        allItemToAppendToStock.push(barcode_item_received)
        toAppendItemToAddStockItemCard(barcode_item_received)
        console.log(allItemToAppendToStock)
    }

}

function toAppendItemToInvoice(barcode_item_received) {

    let html_to_append = ` <div class="item_cards_rows"><span class="item_no">${[barcode_item_received]}</span>
      <img id="${[barcode_item_received]}deleteIn" src="../media/invoicePage/dustbinIcon.svg" alt="" class="threeDot_option_card">
    </div>
    <div id="${[barcode_item_received]}prod_nameIn" class="item_cards_rows item_name_card_invo"></div>
    <div class="item_cards_rows">
      <div class="itmPrice_card_invo">
        <p id="${[barcode_item_received]}sellingPriceIn"></p>
        <p id="${[barcode_item_received]}MRPIn"class="maxPrc_card_invo"></p>
      </div>
      <p id="${[barcode_item_received]}offPriceIn"class="discount_card_invo"></p>
    </div>
    <div class="item_cards_rows">
      <h3>Total Price</h3>
      <h2 id="${[barcode_item_received]}totalPriceIn"></h2>
    </div>
    <div class="item_cards_rows">
      <p class="itmQn">Quantity</p>
      <input id="${[barcode_item_received]}quantityIn" type="number" name="no_of_items" class="quantity" min="1" max="20" value="1" required>
    </div>`

    let x = document.createElement("div");
    x.id = `${[barcode_item_received]}invoiceCard`
    x.innerHTML = html_to_append;
    x.className = "item_card"
    invoice_item_container.appendChild(x)

    setTimeout(() => {
        document.getElementById(`${[barcode_item_received]}deleteIn`)
            .addEventListener("click", () => {
                document.getElementById(`${[barcode_item_received]}invoiceCard`).remove()
                // remove barcode_item_received from allItemForInvoice
                allItemForInvoice = allItemForInvoice.filter(item => item != barcode_item_received)
                itemListReceived = itemListReceived.filter(item => item != barcode_item_received)
            })

        document.getElementById(`${[barcode_item_received]}quantityIn`)
            .addEventListener("change", () => {
                let quantity = document.getElementById(`${[barcode_item_received]}quantityIn`).value
                let totalPrice = document.getElementById(`${[barcode_item_received]}totalPriceIn`)
                let selling_price = document.getElementById(`${[barcode_item_received]}sellingPriceIn`).innerHTML
                selling_price = selling_price.replace("₹", "")
                selling_price = parseInt(selling_price)
                let lastPrice = totalPrice.innerHTML
                lastPrice = lastPrice.replace("₹", "")
                lastPrice = parseInt(lastPrice)
                totalPrice.innerHTML = "₹" + (selling_price * quantity).toString()
                let last_grandTotal = document.getElementById("grandTotalInv")
                let last_grandTotalValue = last_grandTotal.innerHTML
                last_grandTotalValue = last_grandTotalValue.replace("₹", "")
                last_grandTotalValue = parseInt(last_grandTotalValue)
                last_grandTotal.innerHTML = "₹" + (last_grandTotalValue - lastPrice + (selling_price * quantity)).toString()
            })

        db.get(`SELECT * FROM stockitem WHERE barcode=${[barcode_item_received]}`, (err, row) => {
            if (err) console.log(err)
            document.getElementById(`${[barcode_item_received]}prod_nameIn`).innerHTML = row.product_name
            document.getElementById(`${[barcode_item_received]}sellingPriceIn`).innerHTML = "₹" + row.selling_price
            document.getElementById(`${[barcode_item_received]}MRPIn`).innerHTML = "₹" + (row.selling_price + 0.1 * row.selling_price).toString()
            document.getElementById(`${[barcode_item_received]}offPriceIn`).innerHTML = "10% off"
            document.getElementById(`${[barcode_item_received]}totalPriceIn`).innerHTML = "₹" + row.selling_price

            let last_grandTotal = document.getElementById("grandTotalInv")
            let last_grandTotalValue = last_grandTotal.innerHTML
            last_grandTotalValue = last_grandTotalValue.replace("₹", "")
            last_grandTotalValue = parseInt(last_grandTotalValue)
            last_grandTotal.innerHTML = "₹" + (last_grandTotalValue + row.selling_price)
        })

    }, 20)


}

function toAppendItemToAddStockItemCard(barcode_item_received) {
    let html_to_append = `<div class="add_item_card_top">
      <p>${[barcode_item_received]}</p>
      <img id="${[barcode_item_received]}delete_btn" src="../media/add_itm/dustbinIcon.svg" alt="" class="remove_itm_Btn">
    </div>
    <div class="add_item_card_txt">
      <p>Product Name</p>
      <input id="${[barcode_item_received]}product_name" type="text" name="product_name">
    </div>
    <div>
      <div class="Pricediv">
        <p>Cost Price</p>
        <input id="${[barcode_item_received]}cost_price" type="number" name="no_of_items" class="quantity" min="1" max="20" required>
      </div>
      <div class="Pricediv">
        <p>Sell Price</p>
        <input id="${[barcode_item_received]}sell_price" type="number" name="no_of_items" class="quantity" min="1" max="20" required>
      </div>
      <div class="Pricediv">
        <p>Stock quantity</p>
        <input id="${[barcode_item_received]}qty" type="number" name="no_of_items" class="quantity" min="1" max="20" required>
      </div>
    </div>`
    let x = document.createElement("div")
    x.id = `${[barcode_item_received]}card`
    x.innerHTML = html_to_append
    x.className = "add_item_card"
    add_itm_subpage_main.appendChild(x)

    setTimeout(() => {
        document.getElementById(`${[barcode_item_received]}delete_btn`)
            .addEventListener("click", () => {
                document.getElementById(`${[barcode_item_received]}card`).remove()
                // remove barcode_item_received from allItemToAppendToStock
                allItemToAppendToStock = allItemToAppendToStock.filter(item => item != barcode_item_received)
                itemListReceived = itemListReceived.filter(item => item != barcode_item_received)
            })
    }, 100);

}

function generateInvoiceFromData() {
    let name = document.getElementById("Name_invoice_new").value
    let email = document.getElementById("Email_invoice_new").value
    let phone = document.getElementById("Phone_invoice_new").value
    let payment_method = document.getElementById("Payment_method_invoice_new").value
    let accountant_director = document.getElementById("Accountant_director_invoice_new").value
    let grandTotal = document.getElementById("grandTotalInv").innerHTML
    grandTotal = grandTotal.replace("₹", "")
    grandTotal = parseInt(grandTotal)
    let customer_id = -1

    db.get(`SELECT id FROM customer_info WHERE name ='${[name]}'
     AND email='${[email]}' AND phone_number='${[phone]}'`, (err, row) => {
        if (err) console.log(err)
        if (row) {
            customer_id = row.id
        } else {
            //get max value of id
            db.get(`SELECT MAX(id) AS max_id FROM customer_info`, (err, row) => {
                if (err) console.log(err)
                customer_id = row.max_id + 1
                db.run(`INSERT INTO customer_info VALUES(${[customer_id]}, '${[name]}', '${[email]}', '${[phone]}')`)
            })
        }
    })

    setTimeout(() => {
        addNewInvoiceData(customer_id, grandTotal, payment_method, accountant_director, itemListReceived.length + 1)
    }, 200);

    setTimeout(() => {
        console.log("1", max_invoice_detail_id)
        for (let i = 0; i < itemListReceived.length; i++) {
            let barcode = itemListReceived[i]
            let quantity = document.getElementById(`${barcode}quantityIn`).value
            let total_price = document.getElementById(`${barcode}totalPriceIn`).innerHTML
            total_price = total_price.replace("₹", "")
            total_price = parseInt(total_price)
            let discount = 0.1 * total_price
            let prod_name = document.getElementById(`${barcode}prod_nameIn`).innerHTML
            let unit_price = total_price / quantity

            addNewInvoiceItemsData(prod_name, max_invoice_detail_id, barcode, quantity, unit_price, discount, total_price)
        }
    }, 500);
    setTimeout(() => {
        return max_invoice_detail_id
    }, 700);

}
function toogleButtonFun(svgId) {
    let toggleButton = document.getElementById(svgId)
    if (toggleButton.classList.contains("toggle_btn_off")) {
        toggleButton.classList.remove("toggle_btn_off")
        toggleButton.classList.add("toggle_btn_on")
        toggleButton.getElementsByTagName("circle")[0].style.fill = "#4087F3"
        toggleButton.getElementsByTagName("circle")[0].setAttribute("cx", "46")

    } else {
        toggleButton.classList.remove("toggle_btn_on")
        toggleButton.classList.add("toggle_btn_off")
        toggleButton.getElementsByTagName("circle")[0].style.fill = "#6B6B6B"
        toggleButton.getElementsByTagName("circle")[0].setAttribute("cx", "14")
    }
}

function updateSettings() {
    userSettingsData.profile_pic_url = profile_pic_url
    userSettingsData.bussiness_name = document.getElementById("account_setting_shop_name").value
    userSettingsData.bussiness_category = document.getElementById("bussiness_category_acc").value
    userSettingsData.address = document.getElementById("addressinput_account_settings").value
    userSettingsData.mobile = document.getElementById("account_setting_shop_mobile").value
    userSettingsData.email = document.getElementById("account_setting_shop_email").value

    fs.writeFile("./settings/usersettings.json", JSON.stringify(userSettingsData), (err) => {
        if (err) throw err
        console.log("The file has been saved!")
    })
}


// some special function
function recreateNode(el, withChildren) {
    if (withChildren) {
        el.parentNode.replaceChild(el.cloneNode(true), el);
    }
    else {
        var newEl = el.cloneNode(false);
        while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
        el.parentNode.replaceChild(newEl, el);
    }
}

function addOrUpdateItemStock() {
    for (let i = 0; i < allItemToAppendToStock.length; i++) {
        let item_barcode = allItemToAppendToStock[i]
        let item_name = document.getElementById(`${item_barcode}product_name`).value
        let item_cost_price = document.getElementById(`${item_barcode}cost_price`).value
        let item_sell_price = document.getElementById(`${item_barcode}sell_price`).value
        let item_qty = document.getElementById(`${item_barcode}qty`).value

        // check if it is already in stock_item database
        db.get(`SELECT barcode from stockitem where barcode = ${[item_barcode]}`, (err, row) => {
            if (err) console.log(err)
            if (row) {
                let date = new Date().getTime()
                updateStockData(item_barcode, item_name, item_cost_price, item_sell_price, item_qty, 0, date)
            } else {
                addItemToStock(item_barcode, item_name, item_cost_price, item_sell_price, item_qty)
            }
        })
    }
    getAllItemFromStock()
    setTimeout(() => {
        console.log(all_items_in_stocks)
        addItemsToStockTable()
        add_itm_close_btn.click()
    }, 300);

}
