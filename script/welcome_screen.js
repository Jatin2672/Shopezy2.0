//import file system
const { ipcRenderer } = require('electron');
const fs = require('fs');
let languageData , settingsData


// ----------------------------------------------------------------------------------------
let bussiness_category_inpt, email_inpt, bussiness_name_inpt, address_inpt,
continue_btn_regPage
// ----------------------------------------------------------------------------------------


//this event runs when html content is loaded
window.addEventListener("DOMContentLoaded", () => {

    // read a json file using fs
    // fs.readFile("./settings/welcome_screen_language.json", (err, data) => {
    //     // if error occurs
    //     if (err) throw err
    //     // parse the data
    //     languageData = JSON.parse(data)
    //     changeLanguage("en")
    // })

    // fs.readFile("./settings/usersettings" , (err, data) => {
    //     if (err) throw err
    //     settingsData = JSON.parse(data)
    //     console.log(settingsData)
    // });

    // --------------------Validate fn ----------------------------
    bussiness_category_inpt=document.getElementById("bussiness_type_regPage")
    email_inpt=document.getElementById("email_regPage")
    bussiness_name_inpt=document.getElementById("bussiness_name_regPage")
    address_inpt=document.getElementById("address_userinput")
    
    continue_btn_regPage=document.getElementById("continue_btn")
    
    continue_btn_regPage.addEventListener('click',()=>{
        if(validate(bussiness_name_inpt,bussiness_category_inpt,email_inpt,address_inpt)){
            alert("Validated");
            // write function to register user
            // bussiness_name=bussiness_name_inpt.value
            // bussiness_category=bussiness_category_inpt.value
            // email=email_inpt.value
            // address=address_inpt.value
            // registerUser(bussiness_name,bussiness_category,email,address);

            ipcRenderer.send('welcome:register');
        }
        else
            console.log("Not Validated");
        
    })
    // ------------------Validate fn ----------------------------
})

// --------------------- Validate fn ----------------------------
function validate(bussiness_name,bussiness_category,email,address) {
    flag = true;
    if(!checkAddress(address.value)){
        address_inpt.style.border="1px solid #aa0000"
        flag=false;
    }
    if(!checkBussinessName(bussiness_name.value)){
        bussiness_name_inpt.style.border="1px solid #aa0000"
        flag=false;
    }
    if(!checkEmail(email.value)){
        email_inpt.style.border="1px solid #aa0000"
        flag=false;
    }
    if(!checkBussinessOwnerName(bussiness_category.value)){
        bussiness_category_inpt.style.border="1px solid #aa0000"
        flag=false;
    }
    return flag;
}

// --------------------- Validate fn ----------------------------

function changeLanguage(languageName){
        // loop all the key 
        for (let key in languageData) {
            document.getElementById(key).innerHTML = languageData[key][languageName]
        }
}

// function to register user
function registerUser(bussiness_name , bussiness_category , email , mobile , address , bussiness_owner_name , profile_pic_url){
    settingsData.bussiness_name = bussiness_name
    settingsData.bussiness_category = bussiness_category
    settingsData.email = email
    settingsData.mobile = mobile
    settingsData.address = address
    settingsData.bussiness_owner_name = bussiness_owner_name
    settingsData.profile_pic_url = profile_pic_url
    
    // write the usersettings to json file
    fs.writeFile("./settings/usersettings.json", JSON.stringify(settingsData), (err) => {
        if (err) throw err
        console.log("The file has been saved!")
    })
}

// function to check sanity of the user email
function checkEmail(email){
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(email)
}

//function check sanity of the mobile number
function checkMobile(mobile){
    let mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(mobile)
}

//function check sanity of the bussiness name
function checkBussinessName(bussiness_name){
    let bussinessNameRegex = /^[a-zA-Z0-9]+$/
    return bussinessNameRegex.test(bussiness_name)
}

// function check sanity of the bussiness owner name
function checkBussinessOwnerName(bussiness_owner_name){
    let bussinessOwnerNameRegex = /^[a-zA-Z]+$/
    return bussinessOwnerNameRegex.test(bussiness_owner_name)
}

// function check sanity of the address
function checkAddress(address){
    let addressRegex = /^[a-zA-Z0-9]+$/
    return addressRegex.test(address)
}